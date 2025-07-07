#!/usr/bin/env node
import { GoogleGenAI } from '@google/genai';
import { createInterface } from 'readline';
import { MCPRequest, MCPResponse } from './types.js';

// Available Gemini models as of July 2025
const GEMINI_MODELS = {
  // Thinking models (2.5 series) - latest and most capable
  'gemini-2.5-pro': {
    description: 'Most capable thinking model, best for complex reasoning and coding',
    features: ['thinking', 'function_calling', 'json_mode', 'grounding', 'system_instructions'],
    contextWindow: 2000000, // 2M tokens
    thinking: true
  },
  'gemini-2.5-flash': {
    description: 'Fast thinking model with best price/performance ratio',
    features: ['thinking', 'function_calling', 'json_mode', 'grounding', 'system_instructions'],
    contextWindow: 1000000, // 1M tokens
    thinking: true
  },
  'gemini-2.5-flash-lite': {
    description: 'Ultra-fast, cost-efficient thinking model for high-throughput tasks',
    features: ['thinking', 'function_calling', 'json_mode', 'system_instructions'],
    contextWindow: 1000000,
    thinking: true
  },
  
  // 2.0 series
  'gemini-2.0-flash': {
    description: 'Fast, efficient model with 1M context window',
    features: ['function_calling', 'json_mode', 'grounding', 'system_instructions'],
    contextWindow: 1000000
  },
  'gemini-2.0-flash-lite': {
    description: 'Most cost-efficient model for simple tasks',
    features: ['function_calling', 'json_mode', 'system_instructions'],
    contextWindow: 1000000
  },
  'gemini-2.0-pro-experimental': {
    description: 'Experimental model with 2M context, excellent for coding',
    features: ['function_calling', 'json_mode', 'grounding', 'system_instructions'],
    contextWindow: 2000000
  },
  
  // Legacy models (for compatibility)
  'gemini-1.5-pro': {
    description: 'Previous generation pro model',
    features: ['function_calling', 'json_mode', 'system_instructions'],
    contextWindow: 2000000
  },
  'gemini-1.5-flash': {
    description: 'Previous generation fast model',
    features: ['function_calling', 'json_mode', 'system_instructions'],
    contextWindow: 1000000
  }
};

class EnhancedStdioMCPServer {
  private genAI: GoogleGenAI;
  private conversations: Map<string, any[]> = new Map();
  
  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({ apiKey });
    this.setupStdioInterface();
  }

  private setupStdioInterface() {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', (line) => {
      if (line.trim()) {
        try {
          const request: MCPRequest = JSON.parse(line);
          this.handleRequest(request);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      }
    });

    process.stdin.on('error', (err) => {
      console.error('stdin error:', err);
    });
  }

  private async handleRequest(request: MCPRequest) {
    console.error('Handling request:', request.method);
    try {
      let response: MCPResponse;

      switch (request.method) {
        case 'initialize':
          response = {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              protocolVersion: '2024-11-05',
              serverInfo: {
                name: 'mcp-server-gemini-enhanced',
                version: '4.0.0'
              },
              capabilities: {
                tools: {},
                resources: {},
                prompts: {}
              }
            }
          };
          break;

        case 'tools/list':
          response = {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              tools: this.getAvailableTools()
            }
          };
          break;

        case 'tools/call':
          response = await this.handleToolCall(request);
          break;

        case 'resources/list':
          response = {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              resources: this.getAvailableResources()
            }
          };
          break;

        case 'prompts/list':
          response = {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              prompts: this.getAvailablePrompts()
            }
          };
          break;

        default:
          if (!('id' in request)) {
            console.error(`Notification received: ${(request as any).method}`);
            return;
          }
          
          response = {
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32601,
              message: 'Method not found'
            }
          };
      }

      this.sendResponse(response);
    } catch (error) {
      const errorResponse: MCPResponse = {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error'
        }
      };
      this.sendResponse(errorResponse);
    }
  }

  private getAvailableTools() {
    return [
      {
        name: 'generate_text',
        description: 'Generate text using Google Gemini with advanced features',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'The prompt to send to Gemini'
            },
            model: {
              type: 'string',
              description: 'Specific Gemini model to use',
              enum: Object.keys(GEMINI_MODELS),
              default: 'gemini-2.5-flash'
            },
            systemInstruction: {
              type: 'string',
              description: 'System instruction to guide model behavior'
            },
            temperature: {
              type: 'number',
              description: 'Temperature for generation (0-2)',
              default: 0.7,
              minimum: 0,
              maximum: 2
            },
            maxTokens: {
              type: 'number',
              description: 'Maximum tokens to generate',
              default: 2048
            },
            topK: {
              type: 'number',
              description: 'Top-k sampling parameter',
              default: 40
            },
            topP: {
              type: 'number',
              description: 'Top-p (nucleus) sampling parameter',
              default: 0.95
            },
            jsonMode: {
              type: 'boolean',
              description: 'Enable JSON mode for structured output',
              default: false
            },
            jsonSchema: {
              type: 'object',
              description: 'JSON schema for structured output (when jsonMode is true)'
            },
            grounding: {
              type: 'boolean',
              description: 'Enable Google Search grounding for up-to-date information',
              default: false
            },
            safetySettings: {
              type: 'array',
              description: 'Safety settings for content filtering',
              items: {
                type: 'object',
                properties: {
                  category: {
                    type: 'string',
                    enum: ['HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT']
                  },
                  threshold: {
                    type: 'string',
                    enum: ['BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_LOW_AND_ABOVE']
                  }
                }
              }
            },
            conversationId: {
              type: 'string',
              description: 'ID for maintaining conversation context'
            }
          },
          required: ['prompt']
        }
      },
      {
        name: 'analyze_image',
        description: 'Analyze images using Gemini vision capabilities',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Question or instruction about the image'
            },
            imageUrl: {
              type: 'string',
              description: 'URL of the image to analyze'
            },
            imageBase64: {
              type: 'string',
              description: 'Base64-encoded image data (alternative to URL)'
            },
            model: {
              type: 'string',
              description: 'Vision-capable Gemini model',
              enum: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'],
              default: 'gemini-2.5-flash'
            }
          },
          required: ['prompt'],
          oneOf: [
            { required: ['imageUrl'] },
            { required: ['imageBase64'] }
          ]
        }
      },
      {
        name: 'count_tokens',
        description: 'Count tokens for a given text with a specific model',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Text to count tokens for'
            },
            model: {
              type: 'string',
              description: 'Model to use for token counting',
              enum: Object.keys(GEMINI_MODELS),
              default: 'gemini-2.5-flash'
            }
          },
          required: ['text']
        }
      },
      {
        name: 'list_models',
        description: 'List all available Gemini models and their capabilities',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'string',
              description: 'Filter models by capability',
              enum: ['all', 'thinking', 'vision', 'grounding', 'json_mode']
            }
          }
        }
      },
      {
        name: 'embed_text',
        description: 'Generate embeddings for text using Gemini embedding models',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Text to generate embeddings for'
            },
            model: {
              type: 'string',
              description: 'Embedding model to use',
              enum: ['text-embedding-004', 'text-multilingual-embedding-002'],
              default: 'text-embedding-004'
            }
          },
          required: ['text']
        }
      }
    ];
  }

  private getAvailableResources() {
    return [
      {
        uri: 'gemini://models',
        name: 'Available Gemini Models',
        description: 'List of all available Gemini models and their capabilities',
        mimeType: 'application/json'
      },
      {
        uri: 'gemini://capabilities',
        name: 'API Capabilities',
        description: 'Detailed information about Gemini API capabilities',
        mimeType: 'text/markdown'
      }
    ];
  }

  private getAvailablePrompts() {
    return [
      {
        name: 'code_review',
        description: 'Comprehensive code review with Gemini 2.5 Pro',
        arguments: [
          {
            name: 'code',
            description: 'Code to review',
            required: true
          },
          {
            name: 'language',
            description: 'Programming language',
            required: false
          }
        ]
      },
      {
        name: 'explain_with_thinking',
        description: 'Deep explanation using Gemini 2.5 thinking capabilities',
        arguments: [
          {
            name: 'topic',
            description: 'Topic to explain',
            required: true
          },
          {
            name: 'level',
            description: 'Explanation level (beginner/intermediate/expert)',
            required: false
          }
        ]
      },
      {
        name: 'creative_writing',
        description: 'Creative writing with style control',
        arguments: [
          {
            name: 'prompt',
            description: 'Writing prompt',
            required: true
          },
          {
            name: 'style',
            description: 'Writing style',
            required: false
          },
          {
            name: 'length',
            description: 'Desired length',
            required: false
          }
        ]
      }
    ];
  }

  private async handleToolCall(request: MCPRequest): Promise<MCPResponse> {
    const { name, arguments: args } = request.params || {};

    switch (name) {
      case 'generate_text':
        return await this.generateText(request.id, args);
      
      case 'analyze_image':
        return await this.analyzeImage(request.id, args);
      
      case 'count_tokens':
        return await this.countTokens(request.id, args);
      
      case 'list_models':
        return this.listModels(request.id, args);
      
      case 'embed_text':
        return await this.embedText(request.id, args);
      
      default:
        return {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32601,
            message: `Unknown tool: ${name}`
          }
        };
    }
  }

  private async generateText(id: any, args: any): Promise<MCPResponse> {
    try {
      const model = args.model || 'gemini-2.5-flash';
      const modelInfo = GEMINI_MODELS[model as keyof typeof GEMINI_MODELS];
      
      if (!modelInfo) {
        throw new Error(`Unknown model: ${model}`);
      }

      // Build generation config
      const generationConfig: any = {
        temperature: args.temperature || 0.7,
        maxOutputTokens: args.maxTokens || 2048,
        topK: args.topK || 40,
        topP: args.topP || 0.95
      };

      // Add JSON mode if requested
      if (args.jsonMode) {
        generationConfig.responseMimeType = 'application/json';
        if (args.jsonSchema) {
          generationConfig.responseSchema = args.jsonSchema;
        }
      }

      // Build the request
      const requestBody: any = {
        model,
        contents: [{
          parts: [{
            text: args.prompt
          }]
        }],
        generationConfig
      };

      // Add system instruction if provided
      if (args.systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{
            text: args.systemInstruction
          }]
        };
      }

      // Add safety settings if provided
      if (args.safetySettings) {
        requestBody.safetySettings = args.safetySettings;
      }

      // Add grounding if requested and supported
      if (args.grounding && modelInfo.features.includes('grounding')) {
        requestBody.tools = [{
          googleSearch: {}
        }];
      }

      // Handle conversation context
      if (args.conversationId) {
        const history = this.conversations.get(args.conversationId) || [];
        if (history.length > 0) {
          requestBody.contents = [...history, ...requestBody.contents];
        }
      }

      // Call the API using the new SDK format
      const result = await this.genAI.models.generateContent({
        model,
        ...requestBody
      });
      const text = result.text || '';

      // Update conversation history if needed
      if (args.conversationId) {
        const history = this.conversations.get(args.conversationId) || [];
        history.push(...requestBody.contents);
        history.push({
          parts: [{
            text: text
          }],
          role: 'model'
        });
        this.conversations.set(args.conversationId, history);
      }

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{
            type: 'text',
            text: text
          }],
          metadata: {
            model,
            tokensUsed: result.usageMetadata?.totalTokenCount,
            candidatesCount: result.candidates?.length || 1,
            finishReason: result.candidates?.[0]?.finishReason
          }
        }
      };
    } catch (error) {
      console.error('Error in generateText:', error);
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error'
        }
      };
    }
  }

  private async analyzeImage(id: any, args: any): Promise<MCPResponse> {
    try {
      const model = args.model || 'gemini-2.5-flash';

      // Prepare image part
      let imagePart: any;
      if (args.imageUrl) {
        // For URL, we'd need to fetch and convert to base64
        // For now, we'll just pass the URL as instruction
        imagePart = {
          text: `[Image URL: ${args.imageUrl}]`
        };
      } else if (args.imageBase64) {
        // Extract MIME type and data
        const matches = args.imageBase64.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          imagePart = {
            inlineData: {
              mimeType: matches[1],
              data: matches[2]
            }
          };
        } else {
          imagePart = {
            inlineData: {
              mimeType: 'image/jpeg',
              data: args.imageBase64
            }
          };
        }
      }

      const result = await this.genAI.models.generateContent({
        model,
        contents: [{
          parts: [
            { text: args.prompt },
            imagePart
          ]
        }]
      });

      const text = result.text || '';

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{
            type: 'text',
            text: text
          }]
        }
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error'
        }
      };
    }
  }

  private async countTokens(id: any, args: any): Promise<MCPResponse> {
    try {
      const model = args.model || 'gemini-2.5-flash';
      
      const result = await this.genAI.models.countTokens({
        model,
        contents: [{
          parts: [{
            text: args.text
          }]
        }]
      });

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{
            type: 'text',
            text: `Token count: ${result.totalTokens}`
          }],
          metadata: {
            tokenCount: result.totalTokens,
            model
          }
        }
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error'
        }
      };
    }
  }

  private listModels(id: any, args: any): MCPResponse {
    const filter = args?.filter || 'all';
    let models = Object.entries(GEMINI_MODELS);

    if (filter !== 'all') {
      models = models.filter(([_, info]) => {
        switch (filter) {
          case 'thinking':
            return 'thinking' in info && info.thinking === true;
          case 'vision':
            return info.features.includes('function_calling'); // All current models support vision
          case 'grounding':
            return info.features.includes('grounding');
          case 'json_mode':
            return info.features.includes('json_mode');
          default:
            return true;
        }
      });
    }

    const modelList = models.map(([name, info]) => ({
      name,
      ...info
    }));

    return {
      jsonrpc: '2.0',
      id,
      result: {
        content: [{
          type: 'text',
          text: JSON.stringify(modelList, null, 2)
        }],
        metadata: {
          count: modelList.length,
          filter
        }
      }
    };
  }

  private async embedText(id: any, args: any): Promise<MCPResponse> {
    try {
      const model = args.model || 'text-embedding-004';
      
      const result = await this.genAI.models.embedContent({
        model,
        contents: args.text
      });

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{
            type: 'text',
            text: JSON.stringify({
              embedding: result.embeddings?.[0]?.values || [],
              model
            })
          }],
          metadata: {
            model,
            dimensions: result.embeddings?.[0]?.values?.length || 0
          }
        }
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error'
        }
      };
    }
  }

  private sendResponse(response: MCPResponse) {
    const responseStr = JSON.stringify(response);
    process.stdout.write(responseStr + '\n');
  }
}

// Start the server
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

new EnhancedStdioMCPServer(apiKey);
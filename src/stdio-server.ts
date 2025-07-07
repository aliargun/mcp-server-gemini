#!/usr/bin/env node
import { GoogleGenAI } from '@google/genai';
import { createInterface } from 'readline';
import { MCPRequest, MCPResponse } from './types.js';

class StdioMCPServer {
  private genAI: GoogleGenAI;
  private currentModel: string = 'gemini-2.0-flash-002';
  private buffer = '';

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({ apiKey });
    this.setupStdioInterface();
  }

  private setupStdioInterface() {
    // Handle input line by line
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', (line) => {
      this.buffer += line + '\n';
      this.tryParseMessage();
    });

    process.stdin.on('error', (err) => {
      console.error('stdin error:', err);
    });
  }

  private tryParseMessage() {
    // Look for Content-Length header
    const headerMatch = this.buffer.match(/Content-Length: (\d+)\r?\n\r?\n/);
    if (!headerMatch) return;

    const contentLength = parseInt(headerMatch[1], 10);
    const headerLength = headerMatch[0].length;
    const totalLength = headerMatch.index! + headerLength + contentLength;

    if (this.buffer.length < totalLength) return;

    // Extract the JSON message
    const messageStart = headerMatch.index! + headerLength;
    const messageEnd = messageStart + contentLength;
    const message = this.buffer.slice(messageStart, messageEnd);
    
    // Remove processed message from buffer
    this.buffer = this.buffer.slice(totalLength);

    try {
      const request: MCPRequest = JSON.parse(message);
      this.handleRequest(request);
    } catch (error) {
      console.error('Failed to parse message:', error);
    }

    // Check if there are more messages in the buffer
    if (this.buffer.length > 0) {
      this.tryParseMessage();
    }
  }

  private async handleRequest(request: MCPRequest) {
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
                name: 'mcp-server-gemini',
                version: '3.0.0'
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
              tools: [{
                name: 'generate_text',
                description: 'Generate text using Google Gemini',
                inputSchema: {
                  type: 'object',
                  properties: {
                    prompt: {
                      type: 'string',
                      description: 'The prompt to send to Gemini'
                    },
                    temperature: {
                      type: 'number',
                      description: 'Temperature for generation (0-1)',
                      default: 0.7
                    },
                    maxTokens: {
                      type: 'number',
                      description: 'Maximum tokens to generate',
                      default: 1000
                    }
                  },
                  required: ['prompt']
                }
              }]
            }
          };
          break;

        case 'tools/call':
          if (request.params?.name === 'generate_text') {
            const result = await this.genAI.models.generateContent({
              model: this.currentModel,
              contents: request.params.arguments.prompt,
              config: {
                temperature: request.params.arguments.temperature || 0.7,
                maxOutputTokens: request.params.arguments.maxTokens || 1000
              }
            });

            response = {
              jsonrpc: '2.0',
              id: request.id,
              result: {
                content: [{
                  type: 'text',
                  text: result.text || ''
                }]
              }
            };
          } else {
            response = {
              jsonrpc: '2.0',
              id: request.id,
              error: {
                code: -32601,
                message: 'Method not found'
              }
            };
          }
          break;

        default:
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

  private sendResponse(response: MCPResponse) {
    const responseStr = JSON.stringify(response);
    const responseBytes = Buffer.from(responseStr, 'utf-8');
    
    // Send with Content-Length header
    process.stdout.write(`Content-Length: ${responseBytes.length}\r\n\r\n`);
    process.stdout.write(responseBytes);
  }
}

// Start the server
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

new StdioMCPServer(apiKey);
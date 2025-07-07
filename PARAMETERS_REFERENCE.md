# Gemini MCP Server - Complete Parameters Reference

This guide provides detailed information on all available parameters for each tool.

## 1. generate_text Tool

### Required Parameters
- **prompt** (string): The text prompt to send to Gemini

### Optional Parameters

| Parameter | Type | Default | Description | Example Values |
|-----------|------|---------|-------------|----------------|
| **model** | string | gemini-2.5-flash | Gemini model to use | gemini-2.5-pro, gemini-2.5-flash, gemini-2.0-flash |
| **systemInstruction** | string | none | System prompt to guide behavior | "You are a helpful Python tutor" |
| **temperature** | number | 0.7 | Creativity level (0-2) | 0.1 (precise), 0.7 (balanced), 1.5 (creative) |
| **maxTokens** | number | 2048 | Maximum output tokens | 100, 500, 1000, 4096 |
| **topK** | number | 40 | Top-k sampling | 1 (greedy), 40 (default), 100 (diverse) |
| **topP** | number | 0.95 | Nucleus sampling | 0.1 (focused), 0.95 (default), 1.0 (all) |
| **jsonMode** | boolean | false | Enable JSON output | true, false |
| **jsonSchema** | object | none | JSON schema validation | See examples below |
| **grounding** | boolean | false | Enable Google Search | true, false |
| **conversationId** | string | none | Maintain conversation | "chat-001", "session-123" |
| **safetySettings** | array | default | Content filtering | See safety section |

### Examples with Parameters

#### Basic Text Generation
```
"Use Gemini to explain machine learning"
```

#### With Specific Model and Temperature
```
"Use Gemini 2.5 Pro with temperature 0.2 to write technical documentation for this API"
```

#### With System Instruction
```
"Use Gemini with system instruction 'You are an expert Python developer' to review this code"
```

#### JSON Mode with Schema
```
"Use Gemini in JSON mode to analyze this text and return:
{
  type: object,
  properties: {
    sentiment: { type: string, enum: ['positive', 'negative', 'neutral'] },
    confidence: { type: number, minimum: 0, maximum: 1 },
    keywords: { type: array, items: { type: string } }
  }
}"
```

#### With Grounding
```
"Use Gemini with grounding enabled to tell me about the latest AI developments"
```

#### With Conversation Memory
```
"Start a conversation with ID 'python-help' and ask Gemini about decorators"
"Continue conversation 'python-help' and ask about generators"
```

#### With Safety Settings
```
"Use Gemini with safety settings [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
] to analyze this medical text"
```

## 2. analyze_image Tool

### Required Parameters (one of these)
- **imageUrl** (string): URL of the image to analyze
- **imageBase64** (string): Base64-encoded image data

### Required Parameters
- **prompt** (string): Question or instruction about the image

### Optional Parameters
| Parameter | Type | Default | Description | Example Values |
|-----------|------|---------|-------------|----------------|
| **model** | string | gemini-2.5-flash | Vision-capable model | gemini-2.5-pro, gemini-2.5-flash, gemini-2.0-flash |

### Examples

#### With Image URL
```
"Analyze this image and describe what you see: https://example.com/image.jpg"
```

#### With Base64 Image
```
"What's in this screenshot? [paste image directly]"
```

#### With Specific Model
```
"Use Gemini 2.5 Pro to analyze this architecture diagram and explain the components"
```

## 3. count_tokens Tool

### Required Parameters
- **text** (string): Text to count tokens for

### Optional Parameters
| Parameter | Type | Default | Description | Example Values |
|-----------|------|---------|-------------|----------------|
| **model** | string | gemini-2.5-flash | Model for token counting | Any Gemini model |

### Examples
```
"Count tokens for this text: [your long text]"
"How many tokens would this use with gemini-2.5-pro: [text]"
```

## 4. list_models Tool

### Optional Parameters
| Parameter | Type | Default | Description | Example Values |
|-----------|------|---------|-------------|----------------|
| **filter** | string | all | Filter by capability | all, thinking, vision, grounding, json_mode |

### Examples
```
"List all Gemini models"
"Show me models with thinking capability"
"Which models support grounding?"
"List models that have JSON mode"
```

## 5. embed_text Tool

### Required Parameters
- **text** (string): Text to generate embeddings for

### Optional Parameters
| Parameter | Type | Default | Description | Example Values |
|-----------|------|---------|-------------|----------------|
| **model** | string | text-embedding-004 | Embedding model | text-embedding-004, text-multilingual-embedding-002 |

### Examples
```
"Generate embeddings for: Machine learning is fascinating"
"Create multilingual embeddings for this text using text-multilingual-embedding-002"
```

## Advanced Parameter Combinations

### Complex Analysis with All Features
```
"Use Gemini 2.5 Pro to analyze this code with:
- System instruction: 'You are a security expert'
- Temperature: 0.3
- Max tokens: 4096
- JSON mode enabled
- Schema: { security_score: number, vulnerabilities: array, recommendations: array }
- Grounding enabled for latest security practices"
```

### Creative Writing with Parameters
```
"Use Gemini 2.5 Flash to write a story with:
- Temperature: 1.5
- Max tokens: 2000
- Top-k: 100
- Top-p: 0.98
- System instruction: 'You are a creative sci-fi writer'"
```

### Conversation with Context
```
"Start conversation 'code-review-001' with Gemini 2.5 Pro using:
- System instruction: 'You are a thorough code reviewer'
- Temperature: 0.5
- Review this Python function"

"Continue conversation 'code-review-001' and ask about performance optimizations"
```

## Safety Settings Reference

### Categories
- HARM_CATEGORY_HARASSMENT
- HARM_CATEGORY_HATE_SPEECH
- HARM_CATEGORY_SEXUALLY_EXPLICIT
- HARM_CATEGORY_DANGEROUS_CONTENT

### Thresholds
- BLOCK_NONE - No blocking
- BLOCK_ONLY_HIGH - Block only high probability
- BLOCK_MEDIUM_AND_ABOVE - Block medium and high
- BLOCK_LOW_AND_ABOVE - Block all but negligible

### Example
```
"Use Gemini with safety settings:
[
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
]
to analyze this medical research paper"
```

## Model-Specific Features

### Thinking Models (2.5 series)
- gemini-2.5-pro
- gemini-2.5-flash
- gemini-2.5-flash-lite

These models have enhanced reasoning capabilities. Use them for:
- Complex problem solving
- Code analysis and generation
- Deep explanations
- Multi-step reasoning

### Models with Grounding
- gemini-2.5-pro
- gemini-2.5-flash
- gemini-2.0-flash
- gemini-2.0-pro-experimental

These can access Google Search for current information.

### All Models Support
- JSON mode
- System instructions
- Function calling
- Safety settings
- Temperature control

## Tips for Parameter Usage

1. **Start Simple**: Begin with just the prompt, add parameters as needed
2. **Model Selection**: Use 2.5-flash for most tasks, 2.5-pro for complex reasoning
3. **Temperature**: Lower for factual tasks, higher for creative tasks
4. **Token Limits**: Count tokens first for long inputs
5. **JSON Mode**: Always provide a schema for consistent output
6. **Grounding**: Enable only when you need current information
7. **Conversations**: Use IDs to maintain context across multiple queries

## Common Parameter Patterns

### For Code Review
```
model: "gemini-2.5-pro"
temperature: 0.3
systemInstruction: "You are an expert code reviewer"
jsonMode: true
maxTokens: 4096
```

### For Creative Writing
```
model: "gemini-2.5-flash"
temperature: 1.2
topK: 100
topP: 0.98
maxTokens: 2000
```

### For Factual Analysis
```
model: "gemini-2.5-flash"
temperature: 0.1
grounding: true
jsonMode: true
```

### For Learning/Tutoring
```
model: "gemini-2.5-flash"
systemInstruction: "You are a patient teacher"
temperature: 0.7
conversationId: "learning-session-001"
```
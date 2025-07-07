# Enhanced Gemini MCP Server Features (v4.0.0)

This enhanced version of the Gemini MCP server includes all the latest features from Google's Gemini API as of July 2025.

## Available Models

### Gemini 2.5 Series (Latest - With Thinking Capabilities)
- **gemini-2.5-pro** - Most capable thinking model with 2M token context
- **gemini-2.5-flash** - Fast thinking model with best price/performance (1M tokens)
- **gemini-2.5-flash-lite** - Ultra-fast, cost-efficient thinking model

### Gemini 2.0 Series
- **gemini-2.0-flash** - Fast, efficient model with 1M context window
- **gemini-2.0-flash-lite** - Most cost-efficient model
- **gemini-2.0-pro-experimental** - Experimental model with 2M context, excellent for coding

### Legacy Models
- **gemini-1.5-pro** - Previous generation pro model (2M tokens)
- **gemini-1.5-flash** - Previous generation fast model (1M tokens)

## Available Tools

### 1. `generate_text` - Advanced Text Generation
Generate text with all the latest Gemini features:
- **Model Selection**: Choose any available Gemini model
- **System Instructions**: Guide model behavior with system prompts
- **Temperature Control**: Fine-tune creativity (0-2)
- **Advanced Sampling**: Control with topK and topP parameters
- **JSON Mode**: Get structured JSON output with optional schema validation
- **Google Search Grounding**: Get up-to-date information from the web
- **Safety Settings**: Configure content filtering per category
- **Conversation Memory**: Maintain context across multiple turns

### 2. `analyze_image` - Vision Analysis
Analyze images using Gemini's vision capabilities:
- Support for image URLs or base64-encoded images
- Compatible with all vision-capable models
- Natural language understanding of visual content

### 3. `count_tokens` - Token Counting
Count tokens for any text with a specific model:
- Accurate token counting for cost estimation
- Model-specific tokenization

### 4. `list_models` - Model Discovery
List all available models with filtering:
- Filter by capabilities (thinking, vision, grounding, json_mode)
- View model descriptions and context windows
- Check feature availability

### 5. `embed_text` - Text Embeddings
Generate embeddings for semantic search and similarity:
- Latest embedding models (text-embedding-004)
- Multilingual support
- High-dimensional vectors for accuracy

## Available Resources

- **gemini://models** - Detailed list of all available models
- **gemini://capabilities** - Comprehensive API capabilities documentation

## Available Prompts

### 1. `code_review` - Comprehensive Code Review
Use Gemini 2.5 Pro's thinking capabilities for in-depth code analysis

### 2. `explain_with_thinking` - Deep Explanations
Leverage thinking models for thorough explanations of complex topics

### 3. `creative_writing` - Creative Content Generation
Generate creative content with style and length control

## Advanced Features

### Thinking Models
The Gemini 2.5 series includes "thinking" capabilities that allow models to reason through problems step-by-step before responding, resulting in more accurate and thoughtful outputs.

### JSON Mode with Schema Validation
When `jsonMode` is enabled, you can provide a JSON schema to ensure the output matches your exact requirements.

### Google Search Grounding
Enable real-time web search to ground responses in current information, perfect for:
- Current events
- Technical documentation
- Fact-checking
- Up-to-date information

### Multi-turn Conversations
Maintain conversation context using `conversationId` to build more coherent, contextual interactions.

### Safety Configuration
Fine-tune safety settings per request with granular control over:
- Harassment
- Hate speech
- Sexually explicit content
- Dangerous content

## Example Usage

### Advanced Text Generation with All Features
```json
{
  "tool": "generate_text",
  "arguments": {
    "prompt": "Explain quantum computing",
    "model": "gemini-2.5-pro",
    "systemInstruction": "You are a physics professor explaining to undergraduate students",
    "temperature": 0.8,
    "maxTokens": 2048,
    "jsonMode": true,
    "jsonSchema": {
      "type": "object",
      "properties": {
        "explanation": { "type": "string" },
        "key_concepts": { "type": "array", "items": { "type": "string" } },
        "difficulty_level": { "type": "number", "minimum": 1, "maximum": 10 }
      }
    },
    "grounding": true,
    "conversationId": "quantum-discussion-001"
  }
}
```

### Image Analysis
```json
{
  "tool": "analyze_image",
  "arguments": {
    "prompt": "What's happening in this image? Describe any text, objects, and activities.",
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "model": "gemini-2.5-flash"
  }
}
```

## Best Practices

1. **Model Selection**:
   - Use `gemini-2.5-flash` for most tasks (best balance)
   - Use `gemini-2.5-pro` for complex reasoning and coding
   - Use `gemini-2.5-flash-lite` for high-volume, simple tasks

2. **Thinking Models**:
   - Enable for tasks requiring deep reasoning
   - Expect slightly longer response times but better quality

3. **Context Management**:
   - Use conversation IDs for multi-turn interactions
   - Monitor token usage with the count_tokens tool

4. **Safety and Grounding**:
   - Enable grounding for current information needs
   - Adjust safety settings based on your use case
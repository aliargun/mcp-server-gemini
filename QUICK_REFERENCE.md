# Gemini MCP Server - Quick Reference

## 🚀 Quick Commands

### Text Generation
```
"Use Gemini to [your prompt]"
"Ask Gemini 2.5 Pro to [complex task]"
"Use Gemini with temperature 1.5 for [creative task]"
```

### Image Analysis
```
"Analyze this image with Gemini: [image]"
"What's in this screenshot?"
"Describe this diagram using Gemini"
```

### Token Counting
```
"Count tokens for: [text]"
"How many tokens in this prompt?"
```

### Model Info
```
"List all Gemini models"
"Show thinking models"
"Which models support grounding?"
```

### Embeddings
```
"Generate embeddings for: [text]"
"Create semantic vectors for search"
```

## 🎯 Model Selection

| Task | Recommended Model | Why |
|------|------------------|-----|
| Complex reasoning | gemini-2.5-pro | Thinking capability |
| General use | gemini-2.5-flash | Best balance |
| Fast responses | gemini-2.5-flash-lite | Ultra-fast |
| Cost-sensitive | gemini-2.0-flash-lite | Most economical |
| Coding | gemini-2.0-pro-experimental | Code-optimized |

## ⚡ Advanced Features

### JSON Output
```
"Use Gemini in JSON mode to analyze sentiment and return {sentiment, confidence, keywords}"
```

### Google Search Grounding
```
"Use Gemini with grounding to research [current topic]"
```

### System Instructions
```
"Use Gemini as a Python tutor to explain [concept]"
```

### Conversation Memory
```
"Start conversation 'chat-001' with Gemini about [topic]"
"Continue chat-001 and ask about [related topic]"
```

## 🎨 Temperature Guide

- **0.1-0.3**: Precise, factual (documentation, analysis)
- **0.5-0.8**: Balanced (default: 0.7)
- **1.0-1.5**: Creative (stories, brainstorming)
- **1.5-2.0**: Very creative (poetry, fiction)

## 💡 Pro Tips

1. **Specify models** for better control
2. **Use grounding** for current information
3. **Enable JSON mode** for structured data
4. **Set temperature** based on task type
5. **Use conversation IDs** for context
6. **Count tokens** before long operations

## 🔧 Troubleshooting

- **Tools not showing?** Restart Claude Desktop
- **Errors?** Check logs at `~/Library/Logs/Claude/`
- **API issues?** Verify your API key
- **Need help?** See [Usage Guide](USAGE_GUIDE.md)
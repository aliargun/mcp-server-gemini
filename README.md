# Gemini MCP Server

[![smithery badge](https://smithery.ai/badge/mcp-server-gemini)](https://smithery.ai/server/mcp-server-gemini)
[![npm version](https://img.shields.io/npm/v/mcp-server-gemini)](https://www.npmjs.com/package/mcp-server-gemini)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![MCP Version](https://img.shields.io/badge/MCP-2024--11--05-green)](https://modelcontextprotocol.io/)

A powerful MCP (Model Context Protocol) server that brings Google's latest Gemini AI models to your favorite development environment. Access Gemini 2.5's thinking capabilities, vision analysis, embeddings, and more through a seamless integration.

🚀 **Works with**: Claude Desktop, Cursor, Windsurf, and any MCP-compatible client  
🎯 **Why use this**: Get Gemini's cutting-edge AI features directly in your IDE with full parameter control  
📚 **Self-documenting**: Built-in help system means you never need to leave your editor

## Features

- **6 Powerful Tools**: Text generation, image analysis, token counting, model listing, embeddings, and self-documenting help
- **Latest Gemini Models**: Support for Gemini 2.5 series with thinking capabilities
- **Advanced Features**: JSON mode, Google Search grounding, system instructions, conversation memory
- **Full MCP Protocol**: Standard stdio communication for seamless integration with any MCP client
- **Self-Documenting**: Built-in help system - no external docs needed
- **TypeScript & ESM**: Modern, type-safe implementation

### Supported Models

| Model | Context | Features | Best For |
|-------|---------|----------|----------|
| gemini-2.5-pro | 2M tokens | Thinking, JSON, Grounding | Complex reasoning |
| gemini-2.5-flash ⭐ | 1M tokens | Thinking, JSON, Grounding | General use |
| gemini-2.5-flash-lite | 1M tokens | Thinking, JSON | Fast responses |
| gemini-2.0-flash | 1M tokens | JSON, Grounding | Standard tasks |
| gemini-1.5-pro | 2M tokens | JSON | Legacy support |

## Quick Start

1. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Configure Your MCP Client**

   <details>
   <summary><b>Claude Desktop</b></summary>
   
   Config location:
   - Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "gemini": {
         "type": "stdio",
         "command": "npx",
         "args": ["-y", "github:aliargun/mcp-server-gemini"],
         "env": {
           "GEMINI_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```
   </details>

   <details>
   <summary><b>Cursor</b></summary>
   
   Add to Cursor's MCP settings:
   ```json
   {
     "gemini": {
       "type": "stdio",
       "command": "npx",
       "args": ["-y", "github:aliargun/mcp-server-gemini"],
       "env": {
         "GEMINI_API_KEY": "your_api_key_here"
       }
     }
   }
   ```
   </details>

   <details>
   <summary><b>Windsurf</b></summary>
   
   Configure in Windsurf's MCP settings following their documentation.
   </details>

   <details>
   <summary><b>Other MCP Clients</b></summary>
   
   Use the standard MCP stdio configuration:
   ```json
   {
     "type": "stdio",
     "command": "npx",
     "args": ["-y", "github:aliargun/mcp-server-gemini"],
     "env": {
       "GEMINI_API_KEY": "your_api_key_here"
     }
   }
   ```
   </details>

3. **Restart Your MCP Client**

## How to Use

Once configured, you can use natural language in your MCP client to access Gemini's capabilities:

### Basic Commands
```
"Use Gemini to explain quantum computing"
"Analyze this image with Gemini" 
"List all Gemini models"
"Get help on using Gemini"
```

### Advanced Examples
```
"Use Gemini 2.5 Pro with temperature 0.3 to review this code"
"Use Gemini in JSON mode to extract key points with schema {title, summary, tags}"
"Use Gemini with grounding to research the latest in quantum computing"
```

📖 **[See the complete Usage Guide](USAGE_GUIDE.md)** for detailed examples and advanced features.

## Why Gemini MCP Server?

- **Access Latest Models**: Use Gemini 2.5 with thinking capabilities - Google's most advanced models
- **Full Feature Set**: All Gemini API features including JSON mode, grounding, and system instructions  
- **Easy Setup**: One-line npx installation, no complex configuration needed
- **Production Ready**: Comprehensive error handling, TypeScript types, and extensive documentation
- **Active Development**: Regular updates with new Gemini features as they're released

## Documentation

- **[Usage Guide](USAGE_GUIDE.md)** - Complete guide on using all tools and features
- **[Parameters Reference](PARAMETERS_REFERENCE.md)** - Detailed documentation of all parameters
- **[Quick Reference](QUICK_REFERENCE.md)** - Quick commands cheat sheet
- **[Enhanced Features](ENHANCED_FEATURES.md)** - Detailed list of v4.0.0 capabilities
- [Claude Desktop Setup Guide](docs/claude-desktop-setup.md) - Detailed setup instructions
- [Examples and Usage](docs/examples.md) - Usage examples and advanced configuration
- [Implementation Notes](docs/implementation-notes.md) - Technical implementation details
- [Development Guide](docs/development-guide.md) - Guide for developers
- [Troubleshooting Guide](docs/troubleshooting.md) - Common issues and solutions

## Local Development

```bash
# Clone repository
git clone https://github.com/aliargun/mcp-server-gemini.git
cd mcp-server-gemini

# Install dependencies
npm install

# Start development server
npm run dev
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md).

## Common Issues

1. **Connection Issues**
   - Ensure your MCP client is properly restarted
   - Check the client's logs (e.g., `~/Library/Logs/Claude/mcp-server-gemini.log` for Claude Desktop on Mac)
   - Verify internet connection
   - See [Troubleshooting Guide](docs/troubleshooting.md)

2. **API Key Problems**
   - Verify API key is correct
   - Check API key has proper permissions
   - Ensure the key is set in the environment variable
   - See [Setup Guide](docs/claude-desktop-setup.md)

## Security

- API keys are handled via environment variables only
- No sensitive data is logged or stored
- Regular security updates

## License

MIT

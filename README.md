# Gemini MCP Server

[![smithery badge](https://smithery.ai/badge/mcp-server-gemini)](https://smithery.ai/server/mcp-server-gemini)

Model Context Protocol (MCP) server implementation that enables Claude Desktop to interact with Google's Gemini AI models.

## Features

- **5 Powerful Tools**: Text generation, image analysis, token counting, model listing, and embeddings
- **Latest Gemini Models**: Support for Gemini 2.5 series with thinking capabilities
- **Advanced Features**: JSON mode, Google Search grounding, system instructions, conversation memory
- **Full MCP Protocol**: Stdio communication for seamless Claude Desktop integration
- **TypeScript & ESM**: Modern, type-safe implementation

## Quick Start

1. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Configure Claude Desktop**
   - Locate your config file:
     ```
     Mac: ~/Library/Application Support/Claude/claude_desktop_config.json
     Windows: %APPDATA%\Claude\claude_desktop_config.json
     Linux: ~/.config/Claude/claude_desktop_config.json
     ```
   - Add Gemini configuration:
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

3. **Restart Claude Desktop**

## How to Use

Once configured, you can use natural language in Claude Desktop to access Gemini's capabilities:

- **"Use Gemini to explain quantum computing"** - Basic text generation
- **"Analyze this image with Gemini"** - Vision analysis
- **"List all Gemini models"** - See available models
- **"Count tokens for this text"** - Token estimation
- **"Generate embeddings for semantic search"** - Text embeddings

📖 **[See the complete Usage Guide](USAGE_GUIDE.md)** for detailed examples and advanced features.

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
   - Ensure Claude Desktop is properly restarted
   - Check the logs at `~/Library/Logs/Claude/mcp-server-gemini.log` (Mac)
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

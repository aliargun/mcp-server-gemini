# Contributing to Gemini MCP Server

Thank you for your interest in contributing to the Gemini MCP Server! This document provides guidelines for contributing to the project.

## Code of Conduct

This project follows a standard code of conduct. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Issues

1. Check if the issue already exists in the [issue tracker](https://github.com/aliargun/mcp-server-gemini/issues)
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Your environment (OS, MCP client, Node.js version)
   - Relevant logs or error messages

### Suggesting Enhancements

1. Check if the enhancement has already been suggested
2. Create a new issue with the `enhancement` label
3. Describe the feature and why it would be useful
4. Provide examples of how it would work

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write or update tests if applicable
5. Update documentation if needed
6. Commit your changes with clear commit messages
7. Push to your fork
8. Create a pull request

#### Pull Request Guidelines

- Keep PRs focused - one feature or fix per PR
- Follow the existing code style
- Update the README.md if you're adding new features
- Add tests for new functionality
- Make sure all tests pass: `npm test`
- Update type definitions if changing APIs

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mcp-server-gemini.git
cd mcp-server-gemini

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build the project
npm run build

# Lint the code
npm run lint
```

## Code Style

- TypeScript with strict mode
- ESM modules
- Use async/await over callbacks
- Add JSDoc comments for public APIs
- Follow the existing patterns in the codebase

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test with multiple MCP clients if possible
- Test error cases and edge conditions

## Documentation

- Update README.md for new features
- Add JSDoc comments for new functions
- Update USAGE_GUIDE.md if adding new tools
- Update PARAMETERS_REFERENCE.md for new parameters

## Release Process

Maintainers will:
1. Review and merge PRs
2. Update version in package.json
3. Update CHANGELOG.md
4. Create a new release on GitHub
5. Publish to npm if applicable

## Questions?

Feel free to open an issue for any questions about contributing!
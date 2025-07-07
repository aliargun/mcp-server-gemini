#!/usr/bin/env node
import { MCPServer } from './server.js';

// Start server
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

const port = parseInt(process.env.PORT || '3005', 10);
new MCPServer(apiKey, port);
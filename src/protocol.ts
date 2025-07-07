import { ServerCapabilities, ServerInfo, InitializeResult, ProgressParams } from './types.js';

export const PROTOCOL_VERSION = '2024-11-05';

// Standard JSON-RPC error codes
export const ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  SERVER_NOT_INITIALIZED: -32002,
  UNKNOWN_ERROR: -32001,
  
  // Custom error codes for Gemini
  GEMINI_API_ERROR: -32100,
  GEMINI_RATE_LIMIT: -32101,
  GEMINI_INVALID_TOKEN: -32102,
  GEMINI_CONTENT_FILTER: -32103
} as const;

export const SERVER_INFO: ServerInfo = {
  name: 'gemini-mcp',
  version: '1.0.0'
};

export const SERVER_CAPABILITIES: ServerCapabilities = {
  experimental: {},
  prompts: { listChanged: true },
  resources: { subscribe: true, listChanged: true },
  tools: { listChanged: true },
  logging: {}
};

export function createInitializeResult(): InitializeResult {
  return {
    protocolVersion: PROTOCOL_VERSION,
    serverInfo: SERVER_INFO,
    capabilities: SERVER_CAPABILITIES
  };
}

export function validateRequest(request: any, requiredParams: string[]): boolean {
  if (!request.params) {
    return false;
  }
  for (const param of requiredParams) {
    if (!(param in request.params)) {
      return false;
    }
  }
  return true;
}

export class ProtocolManager {
  private initialized = false;
  private shutdownRequested = false;

  constructor() {}

  isInitialized(): boolean {
    return this.initialized;
  }

  markAsInitialized(): void {
    this.initialized = true;
  }

  requestShutdown(): void {
    this.shutdownRequested = true;
  }

  isShutdownRequested(): boolean {
    return this.shutdownRequested;
  }

  createInitializeResult(): InitializeResult {
    return {
      protocolVersion: PROTOCOL_VERSION,
      serverInfo: SERVER_INFO,
      capabilities: SERVER_CAPABILITIES
    };
  }

  createProgressNotification(token: string | number, progress: number, total?: number): ProgressParams {
    return {
      progressToken: token,
      progress,
      total
    };
  }

  validateState(method: string): void {
    if (method !== 'initialize' && !this.initialized) {
      throw new Error('Server not initialized');
    }
    if (this.shutdownRequested && method !== 'exit') {
      throw new Error('Server is shutting down');
    }
  }
}

// Base MCP Protocol Types
export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

// Connection Management
export interface ConnectionState {
  connectedAt: Date;
  lastMessageAt: Date;
  initialized: boolean;
  activeRequests: Set<string | number>;
  ip: string;
}

// Notification Types
export interface NotificationMessage {
  jsonrpc: '2.0';
  method: string;
  params?: any;
}

export interface ErrorNotification extends NotificationMessage {
  method: 'notifications/error';
  params: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface ProgressParams {
  progressToken: string | number;
  progress: number;
  total?: number;
}

export interface ProgressNotification extends NotificationMessage {
  method: 'notifications/progress';
  params: ProgressParams;
}

// Request Types
export interface GenerateRequest extends MCPRequest {
  method: 'generate';
  params: {
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
  };
}

export interface GenerateResponse extends MCPResponse {
  result: {
    type: 'completion';
    content: string;
    metadata: {
      model: string;
      provider: string;
      temperature?: number;
      maxTokens?: number;
      stopSequences?: string[];
    };
  };
}

export interface StreamRequest extends MCPRequest {
  method: 'stream';
  params: {
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
  };
}

export interface StreamResponse extends MCPResponse {
  result: {
    type: 'stream';
    content: string;
    done: boolean;
  };
}

export interface CancelRequest extends MCPRequest {
  method: 'cancel';
  params: {
    requestId: string | number;
  };
}

export interface ConfigureRequest extends MCPRequest {
  method: 'configure';
  params: {
    configuration: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stopSequences?: string[];
      timeout?: number;
    };
  };
}

// Server Configuration
export interface ServerInfo {
  name: string;
  version: string;
}

export interface ServerCapabilities {
  experimental?: Record<string, any>;
  prompts?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  tools?: {
    listChanged?: boolean;
  };
  logging?: Record<string, any>;
}

export interface InitializeResult {
  protocolVersion: string;
  serverInfo: ServerInfo;
  capabilities: ServerCapabilities;
}

// Lifecycle Types
export interface ShutdownRequest extends MCPRequest {
  method: 'shutdown';
}

export interface ExitNotification extends NotificationMessage {
  method: 'exit';
}

// Resource and Prompt References (for interfaces)
export interface ResourceReference {
  type: 'resource';
  uri: string;
}

export interface PromptReference {
  type: 'prompt';
  name: string;
}

export interface CompletionArgument {
  name: string;
  value: string;
}

export interface Completion {
  values: Array<{
    value: string;
    description?: string;
  }>;
  total?: number;
  hasMore?: boolean;
}
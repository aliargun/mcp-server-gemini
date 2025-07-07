import WebSocket, { WebSocketServer } from 'ws';
import { GoogleGenAI } from '@google/genai';
import { MCPHandlers } from './handlers.js';
import { ProtocolManager } from './protocol.js';
import { ERROR_CODES } from './protocol.js';
import { MCPRequest, NotificationMessage, ConnectionState } from './types.js';
import http from 'http';

export class MCPServer {
  private wss: WebSocketServer;
  private protocol: ProtocolManager;
  private handlers: MCPHandlers;
  private clients: Map<WebSocket, ConnectionState>;
  private httpServer: http.Server;
  private startTime: Date;

  constructor(apiKey: string, port: number = 3005) {
    const genAI = new GoogleGenAI({ apiKey });

    this.protocol = new ProtocolManager();
    this.handlers = new MCPHandlers(genAI, this.protocol);
    this.clients = new Map();
    this.startTime = new Date();

    // Create HTTP server for health check endpoint
    this.httpServer = http.createServer(this.handleHttpRequest.bind(this));
    
    // Create WebSocket server attached to HTTP server
    this.wss = new WebSocketServer({ server: this.httpServer });
    
    this.setupWebSocketServer();
    
    // Start the server
    this.httpServer.listen(port, () => {
      console.log(`MCP Server started on port ${port}`);
    });
  }

  private handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (req.url === '/health') {
      const uptime = (new Date().getTime() - this.startTime.getTime()) / 1000; // in seconds
      const status = {
        status: 'healthy',
        uptime: uptime,
        activeConnections: this.clients.size,
        version: '2.0.0'
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(status));
    } else {
      res.writeHead(404);
      res.end();
    }
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', this.handleConnection.bind(this));
    this.wss.on('error', this.handleServerError.bind(this));

    // Connection monitoring
    setInterval(this.monitorConnections.bind(this), 30000); // Every 30 seconds

    // Cleanup on process exit
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }

  private handleConnection(ws: WebSocket, req: http.IncomingMessage): void {
    // Initialize connection state
    const state: ConnectionState = {
      connectedAt: new Date(),
      lastMessageAt: new Date(),
      initialized: false,
      activeRequests: new Set(),
      ip: req.socket.remoteAddress || 'unknown'
    };
    
    this.clients.set(ws, state);

    ws.on('message', async (data: WebSocket.RawData) => {
      try {
        const message = data.toString();
        const request: MCPRequest = JSON.parse(message);

        // Update last message timestamp
        state.lastMessageAt = new Date();
        
        // Add request to active requests
        state.activeRequests.add(request.id);

        // Validate protocol state
        try {
          this.protocol.validateState(request.method);
          
          // Mark as initialized if this is an initialize request
          if (request.method === 'initialize') {
            state.initialized = true;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.sendError(ws, request.id, ERROR_CODES.SERVER_NOT_INITIALIZED, errorMessage);
          return;
        }

        const response = await this.handlers.handleRequest(request);
        ws.send(JSON.stringify(response));

        // Remove request from active requests
        state.activeRequests.delete(request.id);

      } catch (error) {
        this.handleError(ws, error);
      }
    });

    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
      this.logError('connection', error, state);
    });

    ws.on('close', () => {
      // Cleanup connection state
      this.clients.delete(ws);
      
      // Cancel any pending requests
      if (state.activeRequests.size > 0) {
        state.activeRequests.forEach(requestId => {
          this.handlers.cancelRequest(requestId);
        });
      }
    });

    // Send initial connection success message
    ws.send(JSON.stringify({
      jsonrpc: '2.0',
      method: 'connection/established',
      params: {
        serverVersion: '2.0.0',
        protocolVersion: '2024-11-05'
      }
    }));
  }

  private handleError(ws: WebSocket, error: any): void {
    const state = this.clients.get(ws);
    this.logError('request', error, state);

    if (error instanceof SyntaxError) {
      this.sendError(ws, null, ERROR_CODES.PARSE_ERROR, 'Invalid JSON');
    } else if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'number') {
      const errorMessage = 'message' in error && typeof error.message === 'string' ? error.message : 'Unknown error';
      this.sendError(ws, null, error.code, errorMessage);
    } else {
      this.sendError(ws, null, ERROR_CODES.INTERNAL_ERROR, 'Internal server error');
    }
  }

  private handleServerError(error: Error): void {
    console.error('WebSocket server error:', error);
    this.logError('server', error);
  }

  private sendError(ws: WebSocket, id: string | number | null, code: number, message: string): void {
    ws.send(JSON.stringify({
      jsonrpc: '2.0',
      id,
      error: { code, message }
    }));
  }

  private monitorConnections(): void {
    const now = new Date();
    this.clients.forEach((state, ws) => {
      // Check for stale connections (no message in 5 minutes)
      const timeSinceLastMessage = (now.getTime() - state.lastMessageAt.getTime()) / 1000;
      if (timeSinceLastMessage > 300) { // 5 minutes
        console.warn(`Closing stale connection from ${state.ip}`);
        ws.close(1000, 'Connection timeout');
      }
    });
  }

  private logError(type: string, error: Error, state?: ConnectionState): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      type,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      connectionState: state ? {
        ip: state.ip,
        connectedAt: state.connectedAt,
        lastMessageAt: state.lastMessageAt,
        initialized: state.initialized,
        activeRequests: Array.from(state.activeRequests)
      } : undefined
    };
    
    console.error('Error Log:', JSON.stringify(errorLog, null, 2));
  }

  broadcast(notification: NotificationMessage): void {
    const message = JSON.stringify(notification);
    this.clients.forEach((state, client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  async shutdown(): Promise<void> {
    this.protocol.requestShutdown();

    // Notify all clients
    this.broadcast({
      jsonrpc: '2.0',
      method: 'notifications/error',
      params: {
        code: ERROR_CODES.SERVER_NOT_INITIALIZED,
        message: 'Server shutting down'
      }
    });

    // Close all connections
    this.clients.forEach((state, client) => {
      // Cancel any pending requests
      state.activeRequests.forEach(requestId => {
        this.handlers.cancelRequest(requestId);
      });
      client.close();
    });
    
    // Close servers
    await Promise.all([
      new Promise<void>((resolve) => this.wss.close(() => resolve())),
      new Promise<void>((resolve) => this.httpServer.close(() => resolve()))
    ]);
    
    process.exit(0);
  }
}
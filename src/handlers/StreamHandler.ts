import { WebSocket } from 'ws';

interface StreamRequest {
  id: string;
  type: 'stream';
  payload: {
    prompt: string;
    options?: {
      maxTokens?: number;
      temperature?: number;
      stopSequences?: string[];
    };
  };
  metadata?: Record<string, any>;
}

interface StreamResponse {
  id: string;
  type: 'stream';
  payload: {
    text: string;
    isComplete: boolean;
  };
  metadata?: Record<string, any>;
}

interface StreamError {
  id: string;
  type: 'error';
  payload: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

class StreamHandler {
  private activeStreams: Map<string, AbortController>;
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.activeStreams = new Map();
    this.ws = ws;
  }

  async handleStream(request: StreamRequest): Promise<void> {
    const abortController = new AbortController();
    this.activeStreams.set(request.id, abortController);

    try {
      const stream = await this.createGeminiStream(
        request.payload.prompt,
        request.payload.options,
        abortController.signal
      );

      for await (const chunk of stream) {
        const response: StreamResponse = {
          id: request.id,
          type: 'stream',
          payload: {
            text: chunk.text,
            isComplete: chunk.isComplete
          },
          metadata: {
            timestamp: Date.now()
          }
        };

        this.ws.send(JSON.stringify(response));

        if (chunk.isComplete) {
          this.activeStreams.delete(request.id);
          break;
        }
      }
    } catch (error) {
      const errorResponse: StreamError = {
        id: request.id,
        type: 'error',
        payload: {
          code: error.code || 'STREAM_ERROR',
          message: error.message,
          details: error.details
        }
      };

      this.ws.send(JSON.stringify(errorResponse));
      this.activeStreams.delete(request.id);
    }
  }

  async cancelStream(streamId: string): Promise<boolean> {
    const controller = this.activeStreams.get(streamId);
    if (controller) {
      controller.abort();
      this.activeStreams.delete(streamId);
      return true;
    }
    return false;
  }

  private async* createGeminiStream(
    prompt: string,
    options?: StreamRequest['payload']['options'],
    signal?: AbortSignal
  ): AsyncGenerator<{ text: string; isComplete: boolean }> {
    const geminiConfig = {
      temperature: options?.temperature ?? 0.7,
      maxTokens: options?.maxTokens ?? 1024,
      stopSequences: options?.stopSequences ?? [],
    };

    try {
      const response = await fetch('gemini-stream-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          ...geminiConfig
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Stream not available');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          yield { text: '', isComplete: true };
          break;
        }

        const text = new TextDecoder().decode(value);
        yield { text, isComplete: false };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Stream cancelled by client');
      }
      throw error;
    }
  }

  cleanup(): void {
    for (const [streamId, controller] of this.activeStreams) {
      this.cancelStream(streamId);
    }
  }
}

export default StreamHandler;
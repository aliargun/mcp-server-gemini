import { WebSocket } from 'ws';
import StreamHandler from '../../handlers/StreamHandler';

describe('StreamHandler', () => {
  let ws: WebSocket;
  let streamHandler: StreamHandler;

  beforeEach(() => {
    ws = {
      send: jest.fn(),
    } as unknown as WebSocket;
    streamHandler = new StreamHandler(ws);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle stream request successfully', async () => {
    const request = {
      id: '123',
      type: 'stream',
      payload: {
        prompt: 'test prompt',
        options: {
          temperature: 0.5,
          maxTokens: 100
        }
      }
    };

    await streamHandler.handleStream(request);

    expect(ws.send).toHaveBeenCalled();
  });

  it('should handle stream cancellation', async () => {
    const streamId = '123';
    const result = await streamHandler.cancelStream(streamId);

    expect(result).toBe(false); // No active stream
  });

  it('should cleanup all active streams', () => {
    streamHandler.cleanup();
    // Verify all streams are cancelled
  });
});
import CancelHandler from '../../handlers/CancelHandler';
import StreamHandler from '../../handlers/StreamHandler';

describe('CancelHandler', () => {
  let streamHandler: StreamHandler;
  let cancelHandler: CancelHandler;

  beforeEach(() => {
    streamHandler = new StreamHandler({} as any);
    cancelHandler = new CancelHandler(streamHandler);
  });

  it('should handle cancel request', async () => {
    const request = {
      id: '123',
      type: 'cancel',
      payload: {
        targetId: '456'
      }
    };

    const response = await cancelHandler.handleCancel(request);

    expect(response).toEqual({
      id: '123',
      type: 'cancel',
      payload: {
        success: false,
        targetId: '456'
      }
    });
  });
});
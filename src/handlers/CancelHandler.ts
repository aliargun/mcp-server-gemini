interface CancelRequest {
  id: string;
  type: 'cancel';
  payload: {
    targetId: string;
  };
}

interface CancelResponse {
  id: string;
  type: 'cancel';
  payload: {
    success: boolean;
    targetId: string;
  };
}

class CancelHandler {
  private streamHandler: StreamHandler;

  constructor(streamHandler: StreamHandler) {
    this.streamHandler = streamHandler;
  }

  async handleCancel(request: CancelRequest): Promise<CancelResponse> {
    const success = await this.streamHandler.cancelStream(request.payload.targetId);

    return {
      id: request.id,
      type: 'cancel',
      payload: {
        success,
        targetId: request.payload.targetId
      }
    };
  }
}

export default CancelHandler;
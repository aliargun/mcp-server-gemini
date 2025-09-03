import { jest } from '@jest/globals';
import { MCPRequest } from '../../src/types';

const mockGenerateContent = jest.fn();
const mockCountTokens = jest.fn().mockResolvedValue({ totalTokens: 99 });
const mockEmbedContent = jest
  .fn()
  .mockResolvedValue({ embeddings: [{ values: [0.4, 0.5] }] });

await jest.unstable_mockModule('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
      countTokens: mockCountTokens,
      embedContent: mockEmbedContent,
    },
  })),
}));

await jest.unstable_mockModule('readline', () => ({
  createInterface: jest.fn().mockReturnValue({ on: jest.fn() }),
}));

const { EnhancedStdioMCPServer } = await import(
  '../../src/enhanced-stdio-server'
);

describe('Tool handlers', () => {
  let server: InstanceType<typeof EnhancedStdioMCPServer>;

  beforeEach(() => {
    jest.clearAllMocks();
    server = new EnhancedStdioMCPServer('test-key');
  });

  const handleRequest = async (request: MCPRequest) => {
    const writeSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true as any);
    await (server as any)['handleRequest'](request);
    const payload = JSON.parse(writeSpy.mock.calls[0][0] as string);
    writeSpy.mockRestore();
    return payload;
  };

  it('returns error for unknown tool', async () => {
    const res = await handleRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'does_not_exist', arguments: {} },
    });
    expect(res.error.code).toBe(-32601);
  });

  it('count_tokens happy path', async () => {
    const res = await handleRequest({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'count_tokens', arguments: { text: 'hello' } },
    });
    expect(mockCountTokens).toHaveBeenCalled();
    expect(res.result.metadata.tokenCount).toBe(99);
  });

  it('list_models with filter all', async () => {
    const res = await handleRequest({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'list_models', arguments: { filter: 'all' } },
    });
    expect(res.result.metadata.count).toBeGreaterThan(0);
  });

  it('embed_text happy path', async () => {
    const res = await handleRequest({
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: { name: 'embed_text', arguments: { text: 'hello' } },
    });
    expect(mockEmbedContent).toHaveBeenCalled();
    const body = JSON.parse(res.result.content[0].text);
    expect(body.embedding.length).toBe(2);
  });

  it('get_help returns content', async () => {
    const res = await handleRequest({
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: { name: 'get_help', arguments: { topic: 'overview' } },
    });
    expect(typeof res.result.content[0].text).toBe('string');
  });
});

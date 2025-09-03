import { jest } from '@jest/globals';
import { MCPRequest } from '../../src/types';

// Use ESM-safe mocking via unstable_mockModule and dynamic import of SUT
const mockGenerateContent = jest.fn();
const mockCountTokens = jest.fn().mockResolvedValue({ totalTokens: 42 });
const mockEmbedContent = jest
  .fn()
  .mockResolvedValue({ embeddings: [{ values: [0.1, 0.2, 0.3] }] });

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

describe('EnhancedStdioMCPServer Unit Tests', () => {
  let server: EnhancedStdioMCPServer;
  const mockApiKey = 'test-api-key';
  let writeSpy: jest.SpiedFunction<typeof process.stdout.write>;
  let errorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    jest.clearAllMocks();
    server = new EnhancedStdioMCPServer(mockApiKey);
    writeSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true as any);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    writeSpy.mockRestore();
    errorSpy.mockRestore();
  });

  async function handleRequest(request: MCPRequest): Promise<any> {
    await (server as any)['handleRequest'](request);
    const writtenData = writeSpy.mock.calls[0][0] as string;
    return JSON.parse(writtenData);
  }

  it('should respond correctly to an initialize request', async () => {
    const request: MCPRequest = { jsonrpc: '2.0', id: 1, method: 'initialize' };
    const response = await handleRequest(request);
    expect(response.id).toBe(1);
    expect(response.result.protocolVersion).toBe('2024-11-05');
    expect(response.result.serverInfo.name).toBe('mcp-server-gemini-enhanced');
  });

  it('should list available tools for a tools/list request', async () => {
    const request: MCPRequest = { jsonrpc: '2.0', id: 2, method: 'tools/list' };
    const response = await handleRequest(request);
    expect(response.result.tools).toBeInstanceOf(Array);
    expect(response.result.tools.length).toBe(6);
  });

  it('should handle a successful tools/call for generate_text', async () => {
    mockGenerateContent.mockResolvedValue({
      text: 'Mocked AI response',
    });
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'generate_text', arguments: { prompt: 'hello' } },
    };
    const response = await handleRequest(request);
    expect(mockGenerateContent).toHaveBeenCalled();
    expect(response.id).toBe(3);
    expect(response.result.content[0].text).toBe('Mocked AI response');
  });

  it('should return an error for an unknown tool in tools/call', async () => {
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: { name: 'non_existent_tool', arguments: {} },
    };
    const response = await handleRequest(request);
    expect(response.id).toBe(4);
    expect(response.error.code).toBe(-32601);
    expect(response.error.message).toContain('Unknown tool');
  });

  it('should handle API errors gracefully during tools/call', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API limit reached'));
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: { name: 'generate_text', arguments: { prompt: 'fail me' } },
    };
    const response = await handleRequest(request);
    expect(response.id).toBe(5);
    expect(response.error.code).toBe(-32603);
    expect(response.error.message).toBe('API limit reached');
  });
});

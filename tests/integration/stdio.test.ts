import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

describe('STDIO Integration Test', () => {
  let serverProcess: ChildProcessWithoutNullStreams;

  beforeAll((done) => {
    const serverPath = path.resolve('./dist/enhanced-stdio-server.js');
    serverProcess = spawn('node', [serverPath], {
      env: { ...process.env, GEMINI_API_KEY: 'fake-key-for-test' },
    });
    // Wait for stderr to show the server is handling requests, indicating it's ready.
    serverProcess.stderr.once('data', () => {
      done();
    });
  });

  afterAll(() => {
    serverProcess.kill();
  });

  const sendRequest = (request: object): Promise<any> => {
    return new Promise((resolve) => {
      serverProcess.stdout.once('data', (data) => {
        resolve(JSON.parse(data.toString()));
      });
      serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  };

  it('should start and respond to an initialize request', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
    };
    const response = await sendRequest(request);
    expect(response.id).toBe(1);
    expect(response.result.serverInfo.name).toBe('mcp-server-gemini-enhanced');
  });

  it('should respond to a tools/list request', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 'abc-123',
      method: 'tools/list',
    };
    const response = await sendRequest(request);
    expect(response.id).toBe('abc-123');
    expect(response.result.tools).toBeInstanceOf(Array);
  });
});

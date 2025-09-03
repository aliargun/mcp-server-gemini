// Jest global setup for tests (ESM)
import { jest } from '@jest/globals';

// Silence noisy logs in unit tests to keep output readable
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

// Optional: silence stdout writes triggered by sendResponse in unit tests
// You can selectively re-enable in specific tests if needed
jest.spyOn(process.stdout, 'write').mockImplementation(() => true as any);

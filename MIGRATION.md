# Migration Guide - v1.x to v2.0

This guide helps you migrate from mcp-server-gemini v1.x to v2.0, which includes breaking changes required to support the latest Google Gemini SDK and modern TypeScript/ESM standards.

## Breaking Changes

### 1. Google SDK Update
The project now uses the new `@google/genai` SDK instead of the deprecated `@google/generative-ai`.

**Before:**
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
```

**After:**
```javascript
import { GoogleGenAI } from '@google/genai';
const genAI = new GoogleGenAI({ apiKey });
// Use genAI.models.generateContent() directly
```

### 2. ESM Module System
The project now uses full ESM with `.js` extensions in imports.

**Before:**
```typescript
import { MCPHandlers } from './handlers';
```

**After:**
```typescript
import { MCPHandlers } from './handlers.js';
```

### 3. Type System Changes
All types are now consolidated in `src/types.ts`. The duplicate type files have been removed.

**Before:**
- Types scattered across `src/types.ts`, `src/types/index.ts`, `src/types/protocols.ts`

**After:**
- All types in `src/types.ts`

### 4. API Method Changes

#### Generate Content
**Before:**
```javascript
const result = await model.generateContent(prompt, {
  temperature: 0.7,
  maxOutputTokens: 1000
});
```

**After:**
```javascript
const result = await genAI.models.generateContent({
  model: 'gemini-2.0-flash-002',
  contents: prompt,
  config: {
    temperature: 0.7,
    maxOutputTokens: 1000
  }
});
```

#### Streaming
**Before:**
```javascript
const stream = await model.generateContentStream(prompt, options);
```

**After:**
```javascript
const stream = await genAI.models.generateContentStream({
  model: 'gemini-2.0-flash-002',
  contents: prompt,
  config: options
});
```

### 5. Model Names
The default model has changed from `gemini-pro` to `gemini-2.0-flash-002`.

## Configuration Changes

### TypeScript Configuration
The `tsconfig.json` now targets ES2022 and includes source maps:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "sourceMap": true
    // ... other options
  }
}
```

### Package.json
Ensure your `package.json` includes:
```json
{
  "type": "module",
  "dependencies": {
    "@google/genai": "^1.8.0",
    "ws": "^8.16.0"
  }
}
```

## Migration Steps

1. **Update Dependencies**
   ```bash
   npm uninstall @google/generative-ai
   npm install @google/genai@^1.8.0
   ```

2. **Update Imports**
   - Add `.js` extensions to all relative imports
   - Update Google SDK imports to use `GoogleGenAI`

3. **Update API Calls**
   - Change `generateContent` calls to use the new object-based API
   - Update streaming calls to use `generateContentStream` with new syntax

4. **Update Model References**
   - Change `gemini-pro` to `gemini-2.0-flash-002` or another supported model

5. **Rebuild and Test**
   ```bash
   npm run build
   npm test
   ```

## Backward Compatibility

To maintain some backward compatibility:

1. The MCP protocol interface remains unchanged
2. WebSocket connection handling is the same
3. Request/response formats are preserved

## Need Help?

If you encounter issues during migration:

1. Check the [GitHub Issues](https://github.com/aliargun/mcp-server-gemini/issues)
2. Review the updated examples in the README
3. Ensure all dependencies are properly installed

## Future Deprecations

- The old `@google/generative-ai` SDK support ends September 30, 2025
- Consider updating to newer Gemini models as they become available
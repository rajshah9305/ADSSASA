import { NextRequest } from ‘next/server’;
import Cerebras from ‘@cerebras/cerebras_cloud_sdk’;

const systemPrompt = `You are a React + Tailwind CSS expert.
Return ONLY a single valid React functional component (TypeScript).

CRITICAL RULES:

- NO explanations, NO markdown code fences (no ```), NO extra text
- Start IMMEDIATELY with the import statements
- Use ONLY Tailwind utility classes for styling (no custom CSS)
- The component MUST be self-contained and work in Sandpack
- End with “export default App;” on a new line
- Include proper TypeScript types
- Make components interactive and beautiful

EXAMPLE OUTPUT FORMAT:
import React, { useState } from ‘react’;

export default function App() {
const [count, setCount] = useState(0);

return (
<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
<button
onClick={() => setCount(count + 1)}
className=“px-6 py-3 bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow”
>
Count: {count}
</button>
</div>
);
}`;

export async function POST(req: NextRequest) {
const startTime = Date.now();

try {
console.log(’[API] Generation request received’);

```
// Validate API key
if (!process.env.CEREBRAS_API_KEY) {
  console.error('[API] CEREBRAS_API_KEY not configured');
  return new Response(
    JSON.stringify({ error: 'API key not configured. Please add CEREBRAS_API_KEY to your environment variables.' }), 
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}

// Parse and validate request body
const body = await req.json();
const { prompt } = body;

if (!prompt || typeof prompt !== 'string') {
  console.error('[API] Invalid prompt received');
  return new Response(
    JSON.stringify({ error: 'Valid prompt is required' }), 
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}

if (prompt.length > 2000) {
  console.error('[API] Prompt too long:', prompt.length);
  return new Response(
    JSON.stringify({ error: 'Prompt too long (max 2000 characters)' }), 
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}

console.log('[API] Prompt length:', prompt.length);
console.log('[API] Initializing Cerebras client');

// Initialize Cerebras client
const client = new Cerebras({ 
  apiKey: process.env.CEREBRAS_API_KEY 
});

// Create text encoder for streaming
const encoder = new TextEncoder();

// Create streaming response
const stream = new ReadableStream({
  async start(controller) {
    let fullCode = '';
    let chunkCount = 0;
    
    try {
      console.log('[API] Starting Cerebras completion stream');
      
      // Create streaming completion
      const completion = await client.chat.completions.create({
        model: 'llama3.1-8b', // Fast and efficient 8B model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: true,
        max_completion_tokens: 16000, // Reasonable limit for components
        temperature: 0.7,
        top_p: 0.9,
      });

      console.log('[API] Stream created, processing chunks');

      // Process stream chunks
      for await (const chunk of completion) {
        const delta = chunk.choices?.[0]?.delta;
        const content = delta?.content || '';
        
        if (content) {
          fullCode += content;
          chunkCount++;
          
          // Log progress periodically
          if (chunkCount % 10 === 0) {
            console.log(`[API] Processed ${chunkCount} chunks, ${fullCode.length} chars`);
          }
          
          // Send chunk to client
          const data = JSON.stringify({ 
            stage: 'code', 
            content 
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      }

      console.log('[API] Stream complete. Total chunks:', chunkCount);
      console.log('[API] Total characters:', fullCode.length);

      // Clean up the generated code
      fullCode = cleanupCode(fullCode);

      // Ensure export default exists
      if (!fullCode.includes('export default')) {
        console.log('[API] Adding missing export default');
        const componentName = extractComponentName(fullCode);
        fullCode += `\n\nexport default ${componentName};`;
      }

      // Send completion signal
      const completeData = JSON.stringify({ stage: 'complete' });
      controller.enqueue(encoder.encode(`data: ${completeData}\n\n`));
      
      const duration = Date.now() - startTime;
      console.log(`[API] Generation completed in ${duration}ms`);
      
      controller.close();
    } catch (error: any) {
      console.error('[API] Stream error:', error);
      
      const errorData = JSON.stringify({ 
        stage: 'error', 
        error: error.message || 'Failed to generate component. Please try again.' 
      });
      controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
      controller.close();
    }
  },
});

// Return streaming response
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable nginx buffering
  },
});
```

} catch (error: any) {
console.error(’[API] Request error:’, error);
const duration = Date.now() - startTime;
console.log(`[API] Failed after ${duration}ms`);

```
return new Response(
  JSON.stringify({ 
    error: error.message || 'Internal server error. Please try again.' 
  }), 
  { 
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  }
);
```

}
}

// Helper function to clean up generated code
function cleanupCode(code: string): string {
// Remove markdown code fences
let cleaned = code
.replace(/^`(?:tsx?|javascript|jsx?)?\s*\n/gm, '') .replace(/\n`\s*$/gm, ‘’)
.trim();

// Remove any leading/trailing whitespace
cleaned = cleaned.trim();

return cleaned;
}

// Helper function to extract component name
function extractComponentName(code: string): string {
// Try to find function component name
const functionMatch = code.match(/function\s+([A-Z]\w*)/);
if (functionMatch) return functionMatch[1];

// Try to find const component name
const constMatch = code.match(/const\s+([A-Z]\w*)\s*=/);
if (constMatch) return constMatch[1];

// Default to App
return ‘App’;
}

// Force dynamic rendering (disable static optimization)
export const dynamic = ‘force-dynamic’;
export const runtime = ‘nodejs’;

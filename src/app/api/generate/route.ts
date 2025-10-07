// src/app/api/generate/route.ts
import { NextRequest } from 'next/server';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY!,
});

const systemPrompt = `You are an expert React developer. Generate ONLY the React component code based on the user's description.

CRITICAL RULES:
1. Return ONLY valid React/TypeScript code - no explanations, no markdown, no comments outside the code
2. Use functional components with TypeScript
3. Include proper TypeScript types and interfaces
4. Use Tailwind CSS for styling (utility classes only)
5. Make components interactive and production-ready
6. Include proper imports (React, useState, useEffect, etc.)
7. Export the component as default
8. Start directly with imports - no preamble

Example format:
import React, { useState } from 'react';

interface ComponentProps {
  // props here
}

export default function ComponentName({ }: ComponentProps) {
  // component code
  return (
    <div className="...">
      {/* JSX here */}
    </div>
  );
}`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt)
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        let finalCode = '';

        try {
          // --- AI Model Change Applied Here ---
          const completion = await client.chat.completions.create({
            model: 'llama-3.1-8b', // Using Llama 3.1 8B model
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Create a React component: ${prompt}` },
            ],
            stream: true,
            max_completion_tokens: 65_536,
            temperature: 0.7,
            top_p: 0.9,
            reasoning_effort: 'medium',
          });
          // ------------------------------------

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (!content) continue;

            fullResponse += content;

            // Stream every content chunk to the client
            const data = JSON.stringify({ content, done: false });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // --- Post-processing: Clean up markdown fences and preamble ---
          let cleaned = fullResponse
            .replace(/```(typescript|tsx|jsx|javascript)?\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

          // Remove any text before the first 'import' statement
          const firstImport = cleaned.indexOf('import');
          if (firstImport > 0) cleaned = cleaned.substring(firstImport);

          if (!cleaned.length)
            throw new Error('No valid React component code was generated');
          
          finalCode = cleaned;

          // Send the final cleaned code and done signal
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                content: '',
                done: true,
                fullCode: finalCode, // The final, cleaned, complete code
              })}\n\n`
            )
          );
          controller.close();
        } catch (err: any) {
          console.error('Streaming error:', err);
          const errorData = JSON.stringify({ error: err.message || 'Generation failed' });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

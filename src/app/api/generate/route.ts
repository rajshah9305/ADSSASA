import { NextRequest } from 'next/server';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const systemPrompt = `You are an expert React developer. Generate ONLY valid React/TypeScript code based on the user description.
Rules:
1. Return ONLY code – no explanations, no markdown fences.
2. Use functional components with TypeScript.
3. Style with Tailwind CSS utility classes only.
4. Export the component as default.
5. Start directly with imports.`;

export async function POST(req: NextRequest) {
  try {
    console.log('[GEN] Request received');
    if (!process.env.CEREBRAS_API_KEY)
      return new Response(JSON.stringify({ error: 'CEREBRAS_API_KEY missing' }), { status: 500 });

    const { prompt } = await req.json();
    if (!prompt) return new Response(JSON.stringify({ error: 'Prompt required' }), { status: 400 });

    const client = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let full = '';
        try {
          const completion = await client.chat.completions.create({
            model: 'gpt-oss-120b',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Create a React component: ${prompt}` },
            ],
            stream: true,
            max_completion_tokens: 65_536,
            temperature: 0.7,
            top_p: 0.9,
          });

          for await (const chunk of completion) {
            const content = (chunk as any).choices?.[0]?.delta?.content || '';
            if (content) {
              full += content;
              console.log('[GEN]', content.slice(0, 50));
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ stage: 'code', content })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ stage: 'complete' })}\n\n`));
          controller.close();
        } catch (e: any) {
          console.error('[GEN] Stream error:', e);

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ stage: 'error', error: e.message })}\n\n`));
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
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 10; // Vercel Hobby plan max (seconds)

const SYSTEM_PROMPT = `You are Forge, a direct and practical wellness coach. Analyze someone's daily check-in and give them one clear, actionable plan for the day. Be empathetic but brief. Never use filler language. Always return valid JSON.`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured. Add it to your Vercel environment variables.' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const body = await req.json();

    const userPrompt = `Here is today's check-in data:
- What feels most off: ${body.q1 || 'Not specified'}
- Sleep quality: ${body.q2 || 'Not specified'}
- Energy level: ${body.q3 || 'Not specified'}
- What's been hardest lately: ${body.q4 || 'Not specified'}
- Main drag: ${body.q5 || 'Not specified'}
- What would make today a win: ${body.q6 || 'Not specified'}
- Sleep duration: ${body.sleepDuration ? body.sleepDuration + ' hours' : 'Not provided'}
- Night wakeups: ${body.wakeups || 'Not provided'}
- Caffeine cutoff: ${body.caffeineTime || 'Not provided'}
- Mood rating: ${body.moodRating ? body.moodRating + '/10' : 'Not provided'}
- Resting HR: ${body.restingHR ? body.restingHR + ' bpm' : 'Not provided'}
- HRV: ${body.hrv || 'Not provided'}
- Soreness: ${body.soreness || 'Not provided'}

Return ONLY a raw JSON object — no markdown, no code fences, no explanation:
{
  "mirror": "1-2 sentences reflecting back what they are experiencing right now, empathetically",
  "pattern": "1 sentence identifying a clear pattern or insight in their data",
  "framing": "1 sentence reframe that shifts their perspective constructively",
  "planType": "2-4 word name for today's plan (e.g. Recovery Day, Light Focus Day, Reset Day)",
  "steps": ["specific action step 1", "specific action step 2", "specific action step 3"]
}`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const plan = JSON.parse(cleaned);

    return NextResponse.json(plan);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[generate-plan] error:', msg);
    return NextResponse.json({ error: 'Failed to generate plan', detail: msg }, { status: 500 });
  }
}

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Forge, a direct and practical wellness coach. Someone is checking in on how yesterday's plan went. Generate an adjusted plan based on their feedback. Be empathetic but brief. Always return valid JSON.`;

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
    const { response, previousPlan } = body;

    const feedbackMap: Record<string, string> = {
      better: 'Things felt better than yesterday',
      same: 'Things felt about the same as yesterday',
      worse: 'Things felt worse than yesterday',
    };

    const feedback = feedbackMap[response] || response;
    const planContext =
      previousPlan && Object.keys(previousPlan).length > 0
        ? `Yesterday's plan was: ${JSON.stringify(previousPlan)}`
        : 'No previous plan data available.';

    const userPrompt = `${planContext}

User feedback on how yesterday went: ${feedback}

Generate an adjusted plan for today. Return ONLY a raw JSON object — no markdown, no code fences, no explanation:
{
  "mirror": "1-2 sentences acknowledging how yesterday went and what that means",
  "pattern": "1 sentence identifying what this pattern suggests",
  "framing": "1 sentence reframe to set them up for today",
  "planType": "2-4 word name for today's plan",
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
    console.error('[follow-up] error:', error);
    return NextResponse.json({ error: 'Failed to generate follow-up plan' }, { status: 500 });
  }
}

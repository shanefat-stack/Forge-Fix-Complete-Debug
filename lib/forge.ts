export interface ForgePlan {
  mirror: string;
  pattern: string;
  framing: string;
  planType: string;
  steps: string[];
}

// Single attempt — throws on any failure so the retry wrapper can catch it
async function attemptPost(url: string, body: object): Promise<ForgePlan> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s per attempt

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json() as Partial<ForgePlan>;

  if (
    typeof data.mirror !== 'string' ||
    typeof data.pattern !== 'string' ||
    typeof data.framing !== 'string' ||
    typeof data.planType !== 'string' ||
    !Array.isArray(data.steps)
  ) {
    console.error('[forge] shape mismatch — got:', JSON.stringify(data));
    throw new Error('shape mismatch');
  }

  return data as ForgePlan;
}

// Retries up to 3 times with a short pause between attempts.
// Covers cold-start timeouts common on cellular: first call warms the
// function, second call usually succeeds in 2-3 s.
async function postToApi(url: string, body: object): Promise<ForgePlan> {
  const MAX_ATTEMPTS = 3;
  const RETRY_DELAY_MS = 1500;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await attemptPost(url, body);
    } catch (err) {
      const isLast = attempt === MAX_ATTEMPTS;
      if (isLast) {
        // Surface a friendly message after all retries are exhausted
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error("Taking too long on your connection — try switching to WiFi, then tap Try Again.");
        }
        throw new Error("Couldn't reach the server after several tries. Check your connection and tap Try Again.");
      }
      // Wait before the next attempt
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  // TypeScript needs this even though the loop always returns or throws
  throw new Error("Unexpected error");
}

export function generatePlan(inputs: object): Promise<ForgePlan> {
  return postToApi('/api/generate-plan', inputs);
}

export function submitFollowUp(
  response: 'better' | 'same' | 'worse',
  previousPlan: object
): Promise<ForgePlan> {
  return postToApi('/api/follow-up', { response, previousPlan });
}

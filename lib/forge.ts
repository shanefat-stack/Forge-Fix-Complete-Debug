export interface ForgePlan {
  mirror: string;
  pattern: string;
  framing: string;
  planType: string;
  steps: string[];
}

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL!;
}

function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
}

async function postToEdgeFunction(path: string, body: object): Promise<ForgePlan> {
  const url = `${getSupabaseUrl()}/functions/v1/${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getSupabaseAnonKey()}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }

  if (!res.ok) {
    throw new Error("Something went wrong on our end. Give it a moment and try again.");
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Got an unexpected response. Try again in a moment.");
  }

  const plan = data as Partial<ForgePlan>;
  if (
    typeof plan.mirror !== 'string' ||
    typeof plan.pattern !== 'string' ||
    typeof plan.framing !== 'string' ||
    typeof plan.planType !== 'string' ||
    !Array.isArray(plan.steps)
  ) {
    throw new Error("The response wasn't in the right shape. Try again.");
  }

  return plan as ForgePlan;
}

export function generatePlan(inputs: object): Promise<ForgePlan> {
  return postToEdgeFunction('generate-plan', inputs);
}

export function submitFollowUp(
  response: 'better' | 'same' | 'worse',
  previousPlan: object
): Promise<ForgePlan> {
  return postToEdgeFunction('follow-up', { response, previousPlan });
}

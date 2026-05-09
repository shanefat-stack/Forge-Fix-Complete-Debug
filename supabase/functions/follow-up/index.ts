import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ForgePlan {
  mirror: string;
  pattern: string;
  framing: string;
  planType: string;
  steps: string[];
}

interface FollowUpRequest {
  response: "better" | "same" | "worse";
  previousPlan?: ForgePlan;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFollowUp(response: "better" | "same" | "worse", previousPlan?: ForgePlan): ForgePlan {
  const prevType = previousPlan?.planType || "Recovery Reset";

  const mirrors: Record<string, string[]> = {
    better: [
      "You're trending up. That's real progress — don't underestimate it.",
      "Something from yesterday's plan clicked. Let's build on that momentum.",
      "Better is the right direction. Your body is responding.",
    ],
    same: [
      "No change yet is normal. These things take a few days to shift.",
      "Same isn't failure — it's a plateau. The right next step can break it.",
      "Your baseline held steady. That's more stable than you might think.",
    ],
    worse: [
      "Going backwards is frustrating, but it's information. Something in the plan needs adjusting.",
      "Worse today means we try a different angle. Same effort, new approach.",
      "A step back isn't the whole story. Let's pivot the plan.",
    ],
  };

  const patterns: Record<string, string[]> = {
    better: [
      "Positive momentum is fragile — it needs reinforcement today or it fades.",
      "When things improve, the temptation is to push harder. Instead, consolidate the gain.",
      "Your system is starting to recover. Protect that progress with consistency.",
    ],
    same: [
      "Plateaus usually mean one input hasn't changed. Let's find which one.",
      "Holding steady after a rough patch is actually stabilization. The next push matters.",
      "Same often means the plan was right but the dose was too small. Let's increase it slightly.",
    ],
    worse: [
      "Getting worse often means the plan was too aggressive or missed the real bottleneck.",
      "Regression can signal you need more recovery, not more effort.",
      "When things go backwards, simplify. One thing done well beats five done poorly.",
    ],
  };

  const framings: Record<string, string[]> = {
    better: [
      "Today is about locking in yesterday's win. Consistency over intensity.",
      "You found something that works. Today, repeat it and add one small upgrade.",
    ],
    same: [
      "Today we adjust one variable. Small change, clear direction.",
      "Let's try a slightly different approach while keeping what was working.",
    ],
    worse: [
      "Today we simplify. Fewer steps, more rest, one clear focus.",
      "A reset day. Strip it down to the essentials and rebuild from there.",
    ],
  };

  const planTypes: Record<string, string[]> = {
    better: ["Momentum Builder", "Consistency Protocol", "Progress Lock-In"],
    same: ["Adjustment Protocol", "Plateau Breaker", "Tweak & Extend"],
    worse: ["Reset Day", "Simplified Recovery", "Pivot Plan"],
  };

  const stepsMap: Record<string, string[][]> = {
    better: [
      [
        "Repeat whatever you did yesterday that worked. Same time, same action.",
        "Add one small upgrade: an extra glass of water, 5 more minutes of movement, or an earlier bedtime.",
        "Check in with yourself midday — are you maintaining the gain or coasting?",
        "Protect your sleep tonight. That's where tomorrow's energy comes from.",
        "Write down what worked. You'll need this reference next time you're off.",
      ],
      [
        "Don't increase intensity today. Let the improvement settle before pushing.",
        "Do the same morning routine as yesterday — your body responds to consistency.",
        "Midday: take a 10-minute break. Don't wait until you're running on empty.",
        "Tonight: same wind-down, same bedtime. Rhythm is the secret.",
        "Tomorrow morning: check in. If still better, you can add one more thing.",
      ],
    ],
    same: [
      [
        "Pick one thing from yesterday's plan that felt doable and do it again.",
        "Change one variable: earlier bedtime, different movement, or a new wind-down activity.",
        "If caffeine was part of yesterday, cut it off by noon today.",
        "Add a 5-minute midday pause — close eyes, breathe, reset.",
        "Tonight: aim for 15 minutes earlier in bed than last night.",
      ],
      [
        "Yesterday's plan was close. Today, increase the dose slightly — longer walk, earlier wind-down.",
        "Try a different stress release: journaling, cold shower, or 10 minutes of stretching.",
        "Midday: eat something with protein and healthy fat. Blood sugar stability affects everything.",
        "Skip any alcohol tonight — it's the fastest way to stay stuck at the same level.",
        "Write down one thing that felt slightly better yesterday, even if small.",
      ],
    ],
    worse: [
      [
        "Today is a full reset. No pushing, no guilt. Just recovery.",
        "Strip your to-do list to the absolute minimum. Protect your energy.",
        "Walk for 15 minutes. That's it for movement today — nothing intense.",
        "Nap if you can. Even 20 minutes with eyes closed helps.",
        "Tonight: screens off 1 hour before bed. Early bedtime. No exceptions.",
      ],
      [
        "Drop yesterday's plan entirely. Start fresh with just two things: water and sleep.",
        "Drink water first thing. Then more water. Dehydration makes everything worse.",
        "No high-intensity anything today. Your body is asking for rest, listen to it.",
        "Eat simple, real food. Nothing heavy or processed if you can avoid it.",
        "Get to bed as early as reasonably possible. Sleep is the #1 recovery tool.",
      ],
    ],
  };

  return {
    mirror: pick(mirrors[response]),
    pattern: pick(patterns[response]),
    framing: pick(framings[response]),
    planType: pick(planTypes[response]),
    steps: pick(stepsMap[response]),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: FollowUpRequest = await req.json();
    const { response, previousPlan } = body;

    if (!response || !["better", "same", "worse"].includes(response)) {
      return new Response(JSON.stringify({ error: "Invalid response value" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const plan = generateFollowUp(response, previousPlan);

    return new Response(JSON.stringify(plan), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

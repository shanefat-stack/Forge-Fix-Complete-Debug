import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Inputs {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  sleepDuration?: string;
  wakeups?: string;
  caffeineTime?: string;
  moodRating?: string;
  restingHR?: string;
  hrv?: string;
  soreness?: string;
}

interface ForgePlan {
  mirror: string;
  pattern: string;
  framing: string;
  planType: string;
  steps: string[];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generate(inputs: Inputs): ForgePlan {
  const energy = inputs.q3 || "moderate";
  const sleep = inputs.q2 || "okay";
  const mainIssue = inputs.q5 || "stress";
  const winGoal = inputs.q6 || "more energy";
  const whatsOff = inputs.q1 || "";
  const hardest = inputs.q4 || "";

  const mirrors: string[] = [
    `You said your energy is ${energy.toLowerCase()} and sleep was ${sleep.toLowerCase()}. ${whatsOff ? `What feels off: ${whatsOff}.` : ""} ${hardest ? `What's been hardest: ${hardest}.` : ""}`,
    `Right now you're running on ${energy.toLowerCase()} energy after ${sleep.toLowerCase()} sleep. ${whatsOff ? `The main thing: ${whatsOff}.` : ""}`,
    `Your inputs paint a picture: ${energy.toLowerCase()} energy, ${sleep.toLowerCase()} sleep, and ${mainIssue.toLowerCase()} as the big weight. ${hardest ? `${hardest} is what's making it tough.` : ""}`,
  ];

  const patterns: Record<string, string[]> = {
    Stress: [
      "Your stress is likely spiking cortisol, which fragments sleep and drains morning energy.",
      "Chronic stress creates a feedback loop — poor recovery feeds more stress the next day.",
      "When stress dominates, your body stays in fight-or-flight, making rest and focus harder.",
    ],
    "Poor sleep": [
      "Poor sleep is the root — it's dragging down everything from energy to mood to decision-making.",
      "Sleep debt compounds. Each bad night makes the next harder unless you break the cycle.",
      "Your sleep quality is the bottleneck. Everything else improves when this gets fixed.",
    ],
    "Low motivation": [
      "Low motivation often follows depleted energy reserves — your body is conserving, not lazy.",
      "When motivation drops, it's usually because recovery hasn't caught up with demand.",
      "Low motivation is a signal, not a character flaw. Your system is under-recovered.",
    ],
    "Poor recovery": [
      "Your body isn't recovering enough between demands. That gap is where fatigue and fog live.",
      "Poor recovery means your baseline keeps dropping. You need a reset day, not a push day.",
      "Recovery debt works like sleep debt — it accumulates until you deliberately pay it down.",
    ],
    "Mental fog": [
      "Mental fog is your brain running on reserves. Sleep and hydration are the fastest fixes.",
      "Fog usually means your nervous system is under-fueled. Clear inputs first, then clear thinking.",
      "When focus scatters, it's often because your body pulled resources to handle something else.",
    ],
  };

  const framings: Record<string, string[]> = {
    "Better sleep": [
      "Tonight is the lever. Small changes to your wind-down can shift tomorrow's baseline.",
      "Sleep is the foundation. Fix tonight and you'll feel it by mid-morning tomorrow.",
    ],
    "More energy": [
      "Energy isn't just about rest — it's about timing. When you do things matters as much as what you do.",
      "Your energy can rebound faster than you think with the right sequence today.",
    ],
    "Clearer mind": [
      "Mental clarity comes from reducing cognitive load, not adding more inputs.",
      "A clear mind starts with a clear body — movement, water, and a break from screens.",
    ],
    "Calmer day": [
      "Calm is built in small moments, not grand gestures. Stack a few and the day shifts.",
      "A calmer day starts with a slower morning. Give yourself space before the world fills it.",
    ],
  };

  const planTypes: Record<string, string[]> = {
    Stress: ["Recovery Reset", "Calm Protocol", "Stress Decompression"],
    "Poor sleep": ["Sleep Recovery Plan", "Wind-Down Protocol", "Sleep Architecture Reset"],
    "Low motivation": ["Momentum Builder", "Energy Priming Plan", "Small Wins Protocol"],
    "Poor recovery": ["Active Recovery Day", "Recovery Reset", "System Recharge"],
    "Mental fog": ["Clarity Protocol", "Focus Reset", "Mental Clear-Out"],
  };

  const stepsMap: Record<string, string[][]> = {
    Stress: [
      [
        "Take a 10-minute walk without your phone within the next hour.",
        "Write down the 3 things causing the most stress right now. Just name them — don't solve them.",
        "Set a hard stop for work or screens tonight. Pick a time and protect it.",
        "Do 5 minutes of box breathing (4s in, 4s hold, 4s out, 4s hold) before bed.",
        "Tomorrow morning: 10 minutes of sunlight before any screens.",
      ],
      [
        "Close your eyes for 2 minutes right now. Just breathe.",
        "Pick one commitment today and drop it. You don't need to do everything.",
        "Drink a full glass of water — dehydration amplifies stress response.",
        "Tonight: no screens 30 minutes before bed. Read or stretch instead.",
        "Write down one thing that went well today before you sleep.",
      ],
    ],
    "Poor sleep": [
      [
        "Set a caffeine cutoff: no caffeine after 2 PM today.",
        "Start a wind-down routine 45 minutes before your target bedtime.",
        "Keep your room cool (65-68°F) and as dark as possible.",
        "No screens in bed — charge your phone across the room.",
        "If you wake up, don't check the time. Try slow breathing instead.",
      ],
      [
        "Tonight: aim for the same bedtime as yesterday, but start winding down 30 min earlier.",
        "Skip alcohol tonight — it fragments sleep even if it helps you fall asleep.",
        "Take a warm shower 60-90 minutes before bed — the cooldown triggers drowsiness.",
        "Write tomorrow's to-do list tonight so your brain can let go.",
        "Morning: get sunlight in your eyes within 15 minutes of waking.",
      ],
    ],
    "Low motivation": [
      [
        "Do one tiny task right now — make your bed, reply to one message, anything.",
        "Move your body for 5 minutes. Walk, stretch, do pushups. Action creates motivation.",
        "Set a timer for 15 minutes and work on one thing. Permission to stop after.",
        "Remove one distraction from your environment (close tabs, put phone in another room).",
        "Tonight: write down 3 things you accomplished today, no matter how small.",
      ],
      [
        "Start with the easiest thing on your list. Momentum beats planning.",
        "Change your environment — work from a different room or go to a cafe.",
        "Set one goal for today, not ten. Make it small and specific.",
        "Take a 20-minute walk with no podcast or music. Let your mind wander.",
        "Reward yourself after completing today's one thing. Small positive reinforcement works.",
      ],
    ],
    "Poor recovery": [
      [
        "Today is a recovery day. No intense training — walk or stretch only.",
        "Prioritize protein and hydration at every meal today.",
        "Take a 20-minute nap or lie down with eyes closed if possible.",
        "Skip alcohol tonight — it directly impairs tissue repair and sleep quality.",
        "Get to bed 30 minutes earlier than usual tonight.",
      ],
      [
        "Swap any high-intensity plans for low-intensity movement today.",
        "Eat a carb-protein combo within an hour of any activity.",
        "Spend 10 minutes on mobility or gentle stretching this evening.",
        "Use a hot shower or bath before bed to relax muscles and improve sleep.",
        "Tomorrow: ease back in. Don't jump straight to 100% intensity.",
      ],
    ],
    "Mental fog": [
      [
        "Drink 16oz of water right now. Dehydration is the most common fog trigger.",
        "Step outside for 5 minutes. Natural light and fresh air reset focus.",
        "Close every app and tab you're not actively using right now.",
        "Do one task for 10 minutes with no interruptions. Single-tasking clears fog.",
        "Tonight: protect your sleep like it's a meeting you can't cancel.",
      ],
      [
        "Take a 15-minute walk without your phone. Let your default mode network reset.",
        "Eat something with healthy fats — nuts, avocado, eggs. Brain fuel matters.",
        "Write down what you're trying to accomplish right now. One sentence.",
        "Set a 25-minute focus block. One thing, no context switches.",
        "If fog persists after 2 days, check your sleep and hydration first.",
      ],
    ],
  };

  const issue = mainIssue || "Stress";
  const goal = winGoal || "More energy";

  const patternList = patterns[issue] || patterns["Stress"];
  const framingList = framings[goal] || framings["More energy"];
  const planTypeList = planTypes[issue] || planTypes["Stress"];
  const stepsList = stepsMap[issue] || stepsMap["Stress"];

  return {
    mirror: pick(mirrors),
    pattern: pick(patternList),
    framing: pick(framingList),
    planType: pick(planTypeList),
    steps: pick(stepsList),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const inputs: Inputs = await req.json();
    const plan = generate(inputs);

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

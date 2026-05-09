'use client';

import { useState, useCallback } from 'react';
import { submitFollowUp, ForgePlan } from '@/lib/forge';
import ActionPlanScreen from '@/components/forge/ActionPlanScreen';

type CheckinScreen = 'checkin' | 'loading' | 'pattern' | 'plan' | 'done';
type FollowUpResponse = 'better' | 'same' | 'worse';

const ACK: Record<FollowUpResponse, string> = {
  better: "Good. Keep that going.",
  same: "Fair. It takes a few days to move the needle.",
  worse: "Okay. Let's try something different.",
};

export default function CheckinPage() {
  const [screen, setScreen] = useState<CheckinScreen>('checkin');
  const [response, setResponse] = useState<FollowUpResponse | null>(null);
  const [plan, setPlan] = useState<ForgePlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = useCallback(async (r: FollowUpResponse) => {
    setResponse(r);
    setError(null);
    setScreen('loading');

    // Retrieve yesterday's plan from localStorage so the AI has context
    let previousPlan: object = {};
    try {
      const stored = localStorage.getItem('forge_last_plan');
      if (stored) {
        previousPlan = JSON.parse(stored);
      }
    } catch {
      // If localStorage isn't available, proceed without it
    }

    try {
      const result = await submitFollowUp(r, previousPlan);
      setPlan(result);
      setScreen('pattern');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setError(msg);
      setScreen('checkin');
    }
  }, []);

  if (screen === 'checkin') {
    return (
      <Layout>
        <div className="forge-fade-in flex flex-col min-h-screen px-6 py-16">
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-[#c17f3e] text-sm font-medium tracking-widest uppercase">
                Forge
              </span>
            </div>
            <h1 className="text-[#f0ede8] text-2xl font-semibold leading-snug mb-12">
              How did yesterday go?
            </h1>

            {error && (
              <p className="text-red-400 text-sm mb-6 leading-relaxed">{error}</p>
            )}

            <div className="flex flex-col gap-4">
              {(['better', 'same', 'worse'] as FollowUpResponse[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleSelect(r)}
                  className="w-full py-5 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-[#f0ede8] text-lg font-medium capitalize hover:border-[#c17f3e] hover:bg-[#c17f3e]/5 transition-all active:scale-[0.98]"
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (screen === 'loading') {
    return (
      <Layout>
        <div className="forge-fade-in flex flex-col items-center justify-center min-h-screen px-6">
          <p className="loading-pulse text-[#f0ede8] text-xl font-medium text-center">
            Reading yesterday&hellip;
          </p>
        </div>
      </Layout>
    );
  }

  if (screen === 'pattern' && plan && response) {
    return (
      <Layout>
        <div className="forge-fade-in flex flex-col min-h-screen px-6 py-16">
          <p className="text-[#c17f3e] text-base leading-relaxed font-medium mb-10">
            {ACK[response]}
          </p>
          <div className="flex-1 flex flex-col gap-6">
            <p className="text-[#f0ede8] text-xl leading-relaxed font-medium">{plan.mirror}</p>
            <p className="text-[#c17f3e] text-base leading-relaxed">{plan.pattern}</p>
            <p className="text-[#888] text-base leading-relaxed">{plan.framing}</p>
          </div>
          <div className="mt-12">
            <button
              onClick={() => setScreen('plan')}
              className="w-full bg-[#c17f3e] text-[#0f0f0f] font-semibold text-base py-4 rounded-xl hover:opacity-90 active:opacity-80 transition-opacity"
            >
              See my plan
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (screen === 'plan' && plan) {
    return (
      <Layout>
        <ActionPlanScreen plan={plan} onDone={() => setScreen('done')} showDoneOnly />
      </Layout>
    );
  }

  if (screen === 'done') {
    return (
      <Layout>
        <div className="forge-fade-in flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <p className="text-[#f0ede8] text-xl font-medium mb-3">You&apos;re set for today.</p>
          <p className="text-[#555] text-sm">Come back tomorrow.</p>
        </div>
      </Layout>
    );
  }

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="mx-auto w-full max-w-[480px] min-h-screen">
        {children}
      </div>
    </div>
  );
}

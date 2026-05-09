'use client';

import { ForgePlan } from '@/lib/forge';

interface ActionPlanScreenProps {
  plan: ForgePlan;
  onDone: () => void;
  showDoneOnly?: boolean;
}

export default function ActionPlanScreen({ plan, onDone, showDoneOnly }: ActionPlanScreenProps) {
  return (
    <div className="forge-fade-in flex flex-col min-h-screen px-6 py-8">
      <div className="mb-8">
        <span className="text-[#c17f3e] text-xs font-medium tracking-widest uppercase">
          Your plan
        </span>
        <h2 className="text-[#f0ede8] text-2xl font-semibold leading-snug mt-2">
          {plan.planType}
        </h2>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {plan.steps.map((step, i) => (
          <div
            key={i}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-5 py-5"
          >
            <p className="text-[#f0ede8] text-base leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      <p className="text-[#555] text-sm text-center mt-8 mb-6 leading-relaxed">
        Come back tomorrow. Tell Forge what happened.
      </p>

      <div className="flex flex-col gap-3">
        {!showDoneOnly && (
          <button
            className="w-full bg-[#2a2a2a] text-[#888] font-medium text-base py-4 rounded-xl cursor-default"
            disabled
          >
            Set a reminder for tomorrow
          </button>
        )}
        <button
          onClick={onDone}
          className="w-full text-[#888] text-sm py-3 hover:text-[#f0ede8] transition-colors"
        >
          Done for now
        </button>
      </div>
    </div>
  );
}

'use client';

import { ForgePlan } from '@/lib/forge';

interface PatternScreenProps {
  plan: ForgePlan;
  onNext: () => void;
}

export default function PatternScreen({ plan, onNext }: PatternScreenProps) {
  return (
    <div className="forge-fade-in flex flex-col min-h-screen px-6 py-16">
      <div className="flex-1 flex flex-col justify-center gap-6">
        <p className="text-[#f0ede8] text-xl leading-relaxed font-medium">
          {plan.mirror}
        </p>
        <p className="text-[#c17f3e] text-base leading-relaxed">
          {plan.pattern}
        </p>
        <p className="text-[#888] text-base leading-relaxed">
          {plan.framing}
        </p>
      </div>

      <div className="mt-12">
        <button
          onClick={onNext}
          className="w-full bg-[#c17f3e] text-[#0f0f0f] font-semibold text-base py-4 rounded-xl hover:opacity-90 active:opacity-80 transition-opacity"
        >
          See my plan
        </button>
      </div>
    </div>
  );
}

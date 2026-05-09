'use client';

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="forge-fade-in flex flex-col justify-between min-h-screen px-6 py-16">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-3">
          <span className="text-[#c17f3e] text-sm font-medium tracking-widest uppercase">
            Forge
          </span>
        </div>
        <h1 className="text-[#f0ede8] text-3xl font-semibold leading-tight mb-4">
          Tell Forge what&apos;s going on. Get one clear next step for today.
        </h1>
        <p className="text-[#888] text-base leading-relaxed">
          A few questions. No device required.
        </p>
      </div>

      <div className="mt-16">
        <button
          onClick={onStart}
          className="w-full bg-[#c17f3e] text-[#0f0f0f] font-semibold text-base py-4 rounded-xl transition-opacity hover:opacity-90 active:opacity-80"
        >
          Start
        </button>
      </div>
    </div>
  );
}

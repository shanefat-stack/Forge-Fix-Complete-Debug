'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = (current / total) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#555] text-xs tracking-wide">{current} / {total}</span>
      </div>
      <div className="h-[2px] bg-[#2a2a2a] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#c17f3e] rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

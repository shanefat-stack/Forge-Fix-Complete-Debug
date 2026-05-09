'use client';

export interface ManualInputs {
  sleepDuration: string;
  wakeups: string;
  caffeineTime: string;
  moodRating: string;
  restingHR: string;
  hrv: string;
  soreness: string;
}

interface ManualInputsScreenProps {
  inputs: ManualInputs;
  onChange: (key: keyof ManualInputs, val: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function ManualInputsScreen({
  inputs,
  onChange,
  onSubmit,
  onBack,
}: ManualInputsScreenProps) {
  return (
    <div className="forge-fade-in flex flex-col min-h-screen px-6 py-8">
      <div className="mb-8">
        <h2 className="text-[#f0ede8] text-2xl font-semibold leading-snug mb-2">
          Got any numbers?
        </h2>
        <p className="text-[#888] text-sm leading-relaxed">
          Add what you have. Skip what you don&apos;t.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        <InputRow
          label="Sleep duration (hours)"
          type="number"
          placeholder="e.g. 7"
          value={inputs.sleepDuration}
          onChange={(v) => onChange('sleepDuration', v)}
        />
        <InputRow
          label="Number of wakeups"
          type="number"
          placeholder="e.g. 2"
          value={inputs.wakeups}
          onChange={(v) => onChange('wakeups', v)}
        />
        <InputRow
          label="Caffeine cut-off time"
          type="time"
          value={inputs.caffeineTime}
          onChange={(v) => onChange('caffeineTime', v)}
        />
        <InputRow
          label="Mood rating (1–10)"
          type="number"
          placeholder="e.g. 6"
          value={inputs.moodRating}
          onChange={(v) => onChange('moodRating', v)}
        />
        <InputRow
          label="Resting heart rate (bpm)"
          type="number"
          placeholder="e.g. 58"
          value={inputs.restingHR}
          onChange={(v) => onChange('restingHR', v)}
        />
        <InputRow
          label="HRV (from another app)"
          type="number"
          placeholder="e.g. 52"
          value={inputs.hrv}
          onChange={(v) => onChange('hrv', v)}
        />

        <div>
          <label className="block text-[#888] text-sm mb-3">Training soreness today</label>
          <div className="flex gap-3">
            {['None', 'Mild', 'High'].map((opt) => (
              <button
                key={opt}
                onClick={() => onChange('soreness', opt)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                  inputs.soreness === opt
                    ? 'border-[#c17f3e] bg-[#c17f3e]/10 text-[#c17f3e]'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-[#f0ede8] hover:border-[#3a3a3a]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-xl border border-[#2a2a2a] text-[#888] text-base font-medium hover:border-[#3a3a3a] hover:text-[#f0ede8] transition-all"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 py-4 rounded-xl bg-[#c17f3e] text-[#0f0f0f] text-base font-semibold hover:opacity-90 active:opacity-80 transition-opacity"
        >
          Build my plan
        </button>
      </div>
    </div>
  );
}

function InputRow({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[#888] text-sm mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={type === 'number' ? '0' : undefined}
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f0ede8] text-base placeholder-[#444] focus:outline-none focus:border-[#c17f3e] transition-colors"
      />
    </div>
  );
}

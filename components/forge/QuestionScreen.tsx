'use client';

import ProgressBar from './ProgressBar';

interface QuestionScreenProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  type: 'text' | 'scale' | 'chips';
  options?: string[];
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function QuestionScreen({
  questionNumber,
  totalQuestions,
  question,
  type,
  options,
  value,
  onChange,
  onNext,
  onBack,
}: QuestionScreenProps) {
  const canProceed = value.trim().length > 0;

  return (
    <div className="forge-fade-in flex flex-col min-h-screen px-6 py-8">
      <div className="mb-8">
        <ProgressBar current={questionNumber} total={totalQuestions} />
      </div>

      <div className="flex-1 flex flex-col">
        <h2 className="text-[#f0ede8] text-2xl font-semibold leading-snug mb-8">
          {question}
        </h2>

        {type === 'text' && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type here\u2026"
            rows={4}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f0ede8] text-base placeholder-[#444] focus:outline-none focus:border-[#c17f3e] resize-none leading-relaxed transition-colors"
          />
        )}

        {type === 'scale' && options && (
          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={`w-full text-left px-4 py-4 rounded-xl border text-base font-medium transition-all ${
                  value === opt
                    ? 'border-[#c17f3e] bg-[#c17f3e]/10 text-[#c17f3e]'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-[#f0ede8] hover:border-[#3a3a3a]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {type === 'chips' && options && (
          <div className="flex flex-wrap gap-3">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={`px-5 py-3 rounded-full border text-sm font-medium transition-all ${
                  value === opt
                    ? 'border-[#c17f3e] bg-[#c17f3e]/10 text-[#c17f3e]'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-[#f0ede8] hover:border-[#3a3a3a]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-xl border border-[#2a2a2a] text-[#888] text-base font-medium hover:border-[#3a3a3a] hover:text-[#f0ede8] transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex-1 py-4 rounded-xl text-base font-semibold transition-all ${
            canProceed
              ? 'bg-[#c17f3e] text-[#0f0f0f] hover:opacity-90 active:opacity-80'
              : 'bg-[#2a2a2a] text-[#555] cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

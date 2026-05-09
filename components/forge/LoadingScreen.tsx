'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onDone: () => Promise<void>;
  onRetry: () => void;
}

const MESSAGES = [
  'Reading your inputs\u2026',
  'Finding your pattern\u2026',
];

export default function LoadingScreen({ onDone, onRetry }: LoadingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMsgIndex(1), 1000);

    onDone().catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setError(msg);
    });

    return () => clearTimeout(t);
  }, [onDone]);

  if (error) {
    return (
      <div className="forge-fade-in flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="text-[#f0ede8] text-base leading-relaxed mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-8 py-3 rounded-xl bg-[#c17f3e] text-[#0f0f0f] font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="forge-fade-in flex flex-col items-center justify-center min-h-screen px-6">
      <p className="loading-pulse text-[#f0ede8] text-xl font-medium text-center">
        {MESSAGES[msgIndex]}
      </p>
    </div>
  );
}

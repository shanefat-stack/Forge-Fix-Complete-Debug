'use client';

import { useState, useCallback } from 'react';
import LandingScreen from '@/components/forge/LandingScreen';
import QuestionScreen from '@/components/forge/QuestionScreen';
import ManualInputsScreen, { ManualInputs } from '@/components/forge/ManualInputsScreen';
import LoadingScreen from '@/components/forge/LoadingScreen';
import PatternScreen from '@/components/forge/PatternScreen';
import ActionPlanScreen from '@/components/forge/ActionPlanScreen';
import { generatePlan, ForgePlan } from '@/lib/forge';

type Screen =
  | 'landing'
  | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6'
  | 'manual'
  | 'loading'
  | 'pattern'
  | 'plan';

interface Answers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
}

const QUESTION_SCREENS: Screen[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

const QUESTIONS = [
  {
    key: 'q1' as const,
    question: "What feels most off today?",
    type: 'text' as const,
  },
  {
    key: 'q2' as const,
    question: "How did you sleep last night?",
    type: 'scale' as const,
    options: ['Terrible', 'Poor', 'Okay', 'Good', 'Great'],
  },
  {
    key: 'q3' as const,
    question: "How is your energy right now?",
    type: 'scale' as const,
    options: ['Depleted', 'Low', 'Moderate', 'Good', 'High'],
  },
  {
    key: 'q4' as const,
    question: "What's been hardest lately?",
    type: 'text' as const,
  },
  {
    key: 'q5' as const,
    question: "What's the main thing dragging on you?",
    type: 'chips' as const,
    options: ['Stress', 'Poor sleep', 'Low motivation', 'Poor recovery', 'Mental fog'],
  },
  {
    key: 'q6' as const,
    question: "What would make today feel like a win?",
    type: 'chips' as const,
    options: ['Better sleep', 'More energy', 'Clearer mind', 'Calmer day'],
  },
];

const EMPTY_INPUTS: ManualInputs = {
  sleepDuration: '',
  wakeups: '',
  caffeineTime: '',
  moodRating: '',
  restingHR: '',
  hrv: '',
  soreness: '',
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [answers, setAnswers] = useState<Answers>({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '' });
  const [manualInputs, setManualInputs] = useState<ManualInputs>(EMPTY_INPUTS);
  const [plan, setPlan] = useState<ForgePlan | null>(null);

  const setAnswer = (key: keyof Answers, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const setManualInput = (key: keyof ManualInputs, val: string) => {
    setManualInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleLoadingDone = useCallback(async () => {
    const result = await generatePlan({ ...answers, ...manualInputs });
    setPlan(result);
    // Save the plan to localStorage so the check-in page can reference it tomorrow
    try {
      localStorage.setItem('forge_last_plan', JSON.stringify(result));
    } catch {
      // localStorage may not be available in all environments — safe to ignore
    }
    setScreen('pattern');
  }, [answers, manualInputs]);

  const goToScreen = (s: Screen) => setScreen(s);

  if (screen === 'landing') {
    return (
      <Layout>
        <LandingScreen onStart={() => goToScreen('q1')} />
      </Layout>
    );
  }

  const qIndex = QUESTION_SCREENS.indexOf(screen);
  if (qIndex !== -1) {
    const q = QUESTIONS[qIndex];
    return (
      <Layout>
        <QuestionScreen
          key={screen}
          questionNumber={qIndex + 1}
          totalQuestions={6}
          question={q.question}
          type={q.type}
          options={'options' in q ? q.options : undefined}
          value={answers[q.key]}
          onChange={(val) => setAnswer(q.key, val)}
          onNext={() => {
            const next = qIndex < 5 ? QUESTION_SCREENS[qIndex + 1] : 'manual';
            goToScreen(next);
          }}
          onBack={() => {
            const prev = qIndex > 0 ? QUESTION_SCREENS[qIndex - 1] : 'landing';
            goToScreen(prev);
          }}
        />
      </Layout>
    );
  }

  if (screen === 'manual') {
    return (
      <Layout>
        <ManualInputsScreen
          inputs={manualInputs}
          onChange={setManualInput}
          onSubmit={() => goToScreen('loading')}
          onBack={() => goToScreen('q6')}
        />
      </Layout>
    );
  }

  if (screen === 'loading') {
    return (
      <Layout>
        <LoadingScreen onDone={handleLoadingDone} onRetry={() => goToScreen('manual')} />
      </Layout>
    );
  }

  if (screen === 'pattern' && plan) {
    return (
      <Layout>
        <PatternScreen plan={plan} onNext={() => goToScreen('plan')} />
      </Layout>
    );
  }

  if (screen === 'plan' && plan) {
    return (
      <Layout>
        <ActionPlanScreen plan={plan} onDone={() => goToScreen('landing')} />
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

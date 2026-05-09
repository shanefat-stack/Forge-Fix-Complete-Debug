'use client';

import { useState } from 'react';
import { ForgePlan } from '@/lib/forge';

interface ActionPlanScreenProps {
  plan: ForgePlan;
  onDone: () => void;
  showDoneOnly?: boolean;
}

type ReminderState = 'idle' | 'set' | 'denied';

export default function ActionPlanScreen({ plan, onDone, showDoneOnly }: ActionPlanScreenProps) {
  const [reminderState, setReminderState] = useState<ReminderState>('idle');

  async function handleSetReminder() {
    if (!('Notification' in window)) {
      // Browser doesn't support notifications — fall back gracefully
      alert('Your browser doesn\'t support reminders. Try on Chrome or Safari.');
      return;
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'denied') {
      setReminderState('denied');
      return;
    }

    // Schedule for 8 AM tomorrow
    const now = new Date();
    const tomorrow8am = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      8, 0, 0, 0
    );
    const msUntilTomorrow = tomorrow8am.getTime() - now.getTime();

    setTimeout(() => {
      new Notification('Forge Check-In', {
        body: 'Time to check in with Forge. How did yesterday\'s plan go?',
        icon: '/icon.png',
      });
    }, msUntilTomorrow);

    setReminderState('set');
  }

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
          <>
            {reminderState === 'idle' && (
              <button
                onClick={handleSetReminder}
                className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-[#c17f3e] font-medium text-base py-4 rounded-xl hover:bg-[#252525] transition-colors"
              >
                Set a reminder for tomorrow
              </button>
            )}
            {reminderState === 'set' && (
              <div className="w-full bg-[#1a2a1a] border border-[#2a4a2a] text-[#6abf6a] font-medium text-base py-4 rounded-xl text-center">
                Reminder set for 8 AM ✓
              </div>
            )}
            {reminderState === 'denied' && (
              <div className="w-full bg-[#2a1a1a] border border-[#4a2a2a] text-[#888] text-sm py-4 rounded-xl text-center px-4">
                Notifications blocked. Enable them in your browser settings to set a reminder.
              </div>
            )}
          </>
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

import { useEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { DailyState } from '../types';
import { resetToday } from '../services/dailyState';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function useDailyState() {
  const [dailyState, setDailyState] = useState<DailyState | null>(null);
  const [loading, setLoading] = useState(true);
  const resetFired = useRef(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'app', 'dailyState'), (snap) => {
      if (!snap.exists()) {
        if (!resetFired.current) {
          resetFired.current = true;
          resetToday().catch(console.error);
        }
        setLoading(false);
        return;
      }
      const data = snap.data() as DailyState;
      if (data.date !== todayKey() && !resetFired.current) {
        resetFired.current = true;
        resetToday().catch(console.error);
      }
      setDailyState(data);
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  return { dailyState, loading };
}

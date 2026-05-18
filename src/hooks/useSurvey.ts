import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { SurveyVote } from '../types';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function useSurvey() {
  const [votes, setVotes] = useState<SurveyVote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onSnapshot(doc(db, 'survey', todayKey()), (snap) => {
      if (!snap.exists()) {
        setVotes([]);
      } else {
        setVotes((snap.data().votes as SurveyVote[]) ?? []);
      }
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  return { votes, loading };
}

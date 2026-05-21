import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { StoreVoteEntry } from '../types';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function useStoreVote() {
  const [votes, setVotes] = useState<StoreVoteEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onSnapshot(
      doc(db, 'storeVotes', todayKey()),
      (snap) => {
        if (!snap.exists()) {
          setVotes([]);
        } else {
          const raw = snap.data().votes as Record<string, StoreVoteEntry> | undefined;
          setVotes(Object.values(raw ?? {}));
        }
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, []);

  return { votes, loading };
}

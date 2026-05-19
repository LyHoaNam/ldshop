import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { Runner } from '../types';

export function useRunners() {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'runners'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snap) => {
      setRunners(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Runner)));
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  return { runners, loading };
}

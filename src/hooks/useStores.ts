import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { Store } from '../types';

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'stores'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snap) => {
      setStores(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Store)));
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  return { stores, loading };
}

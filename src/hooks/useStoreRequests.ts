import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { StoreRequest } from '../types';

export function useStoreRequests() {
  const [requests, setRequests] = useState<StoreRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'storeRequests'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() } as StoreRequest)));
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  return { requests, loading };
}

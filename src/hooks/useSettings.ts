import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../config/constants';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onSnapshot(doc(db, 'app', 'settings'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<AppSettings>;
        setSettings({
          race: { ...DEFAULT_SETTINGS.race, ...data.race },
          confetti: { ...DEFAULT_SETTINGS.confetti, ...data.confetti },
        });
      }
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  return { settings, loading };
}

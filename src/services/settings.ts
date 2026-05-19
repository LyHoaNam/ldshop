import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../config/constants';

const settingsRef = () => doc(db, 'app', 'settings');

export async function saveSettings(settings: AppSettings): Promise<void> {
  await setDoc(settingsRef(), settings);
}

export async function resetSettings(): Promise<void> {
  await setDoc(settingsRef(), DEFAULT_SETTINGS);
}

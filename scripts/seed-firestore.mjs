/**
 * One-time migration: seeds Firestore with data from runner.json and quan-an.json.
 *
 * Usage:
 *   1. Install firebase-admin: npm install --save-dev firebase-admin
 *   2. Download your Firebase service account key from the Firebase console
 *      (Project Settings → Service Accounts → Generate New Private Key)
 *   3. Run: GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node scripts/seed-firestore.mjs
 */

import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const app = initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS) });
const db = getFirestore(app);

async function seedRunners() {
  const { racers } = JSON.parse(readFileSync('./runner.json', 'utf8'));
  console.log(`Seeding ${racers.length} runners...`);
  for (const r of racers) {
    await db.collection('runners').add({
      name: r.name,
      avatarUrl: `/avatars/${r.name.toLowerCase()}.png`,
      wins: r.wins ?? 0,
      createdAt: Timestamp.now(),
    });
    console.log(`  ✓ ${r.name}`);
  }
}

async function seedStores() {
  const { stores } = JSON.parse(readFileSync('./quan-an.json', 'utf8'));
  console.log(`Seeding ${stores.length} stores...`);
  for (const s of stores) {
    await db.collection('stores').add({
      name: s.name,
      emoji: s.emoji ?? '🍚',
      tags: s.tags ?? [],
      wins: s.wins ?? 0,
      createdAt: Timestamp.now(),
    });
    console.log(`  ✓ ${s.name}`);
  }
}

async function seedAppDocs() {
  const today = new Date().toISOString().split('T')[0];
  await db.collection('app').doc('dailyState').set({
    date: today,
    orderLink: '',
    pickupPerson: null,
    lastResetAt: Timestamp.now(),
  });
  await db.collection('app').doc('settings').set({
    race: { baseSpeed: 2, speedVariation: 3, animationSpeed: 50 },
    confetti: { count: 100, duration: 3000 },
  });
  console.log('✓ app/dailyState and app/settings created');
}

try {
  await seedRunners();
  await seedStores();
  await seedAppDocs();
  console.log('\nSeed complete!');
} catch (e) {
  console.error('Seed failed:', e);
  process.exit(1);
}

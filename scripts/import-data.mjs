import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (Node.js doesn't read it automatically like Vite)
const envPath = join(__dirname, '../.env.local');
if (!existsSync(envPath)) {
  console.error('Error: .env.local file not found. Please create it with your Firebase config.');
  process.exit(1);
}
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

// Use your web config (from environment variables)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const racerData = JSON.parse(readFileSync(join(__dirname, '../runner.json'), 'utf8'));
const storeData = JSON.parse(readFileSync(join(__dirname, '../quan-an.json'), 'utf8'));

console.log(`Starting import of ${racerData.racers.length} runners and ${storeData.stores.length} stores...`);

// Import runners
console.log('\nImporting runners...');
for (const racer of racerData.racers) {
  await addDoc(collection(db, 'runners'), {
    name: racer.name,
    avatar: racer.avatar,
    wins: racer.wins,
    createdAt: Timestamp.fromDate(new Date(racer.createdAt)),
  });
  console.log(`  ✓ Added ${racer.name}`);
}

// Import stores
console.log('\nImporting stores...');
for (const store of storeData.stores) {
  await addDoc(collection(db, 'stores'), {
    name: store.name,
    emoji: store.emoji,
    tags: store.tags,
    wins: store.wins,
    createdAt: Timestamp.fromDate(new Date(store.createdAt)),
  });
  console.log(`  ✓ Added ${store.name}`);
}

console.log('\n✓ Import complete!');
process.exit(0);

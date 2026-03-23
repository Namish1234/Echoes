import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore, memoryLocalCache, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Log config to verify env vars are loaded (remove in production)
if (typeof window !== 'undefined') {
  console.log('[Firebase] Project ID:', firebaseConfig.projectId);
  console.log('[Firebase] Auth Domain:', firebaseConfig.authDomain);
}

// Initialize Firebase only once (prevents duplicate app errors in dev/hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics only in the browser (not during SSR)
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}

// Initialize Firestore with aggressive connection fix:
// - experimentalForceLongPolling: bypasses WebSocket/gRPC (fixes firewall/ISP blocks)
// - memoryLocalCache: disables IndexedDB persistence (prevents stale offline state)
let db: Firestore;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    localCache: memoryLocalCache(),
  });
  if (typeof window !== 'undefined') {
    console.log('[Firebase] Firestore initialized with long-polling + memory cache');
  }
} catch (e) {
  // If already initialized (hot reload), just get the existing instance
  db = getFirestore(app);
  if (typeof window !== 'undefined') {
    console.log('[Firebase] Firestore: reusing existing instance');
  }
}

export { db };
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;

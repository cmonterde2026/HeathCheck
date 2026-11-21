import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() || '',
};

const ENV_KEY_MAP: Record<keyof typeof firebaseConfig, string> = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
};

const REQUIRED_AUTH_KEYS: Array<keyof typeof firebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
];

const ALL_CONFIG_KEYS: Array<keyof typeof firebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

function isValidEnvValue(value: string): boolean {
  return Boolean(value) && !value.startsWith('MY_') && !value.includes('YOUR_');
}

export const isFirebaseConfigured: boolean = REQUIRED_AUTH_KEYS.every((key) =>
  isValidEnvValue(firebaseConfig[key])
);

export const missingFirebaseKeys: string[] = ALL_CONFIG_KEYS.filter(
  (key) => !isValidEnvValue(firebaseConfig[key])
).map((key) => ENV_KEY_MAP[key]);

export const missingRequiredAuthKeys: string[] = REQUIRED_AUTH_KEYS.filter(
  (key) => !isValidEnvValue(firebaseConfig[key])
).map((key) => ENV_KEY_MAP[key]);

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let googleAuthProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);

  // Persist user authentication state in browser storage across page refreshes
  setPersistence(firebaseAuth, browserLocalPersistence).catch((err) => {
    console.error('Failed to configure Firebase auth persistence:', err);
  });

  googleAuthProvider = new GoogleAuthProvider();
  googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
}

export { firebaseApp, firebaseAuth, googleAuthProvider };

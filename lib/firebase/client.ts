'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { browserLocalPersistence, GoogleAuthProvider, getAuth, setPersistence, type Auth } from 'firebase/auth';

type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId?: string;
  storageBucket?: string;
};

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

function getFirebaseClientConfig(): FirebaseClientConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim();
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim();
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    appId,
    messagingSenderId,
    storageBucket,
  };
}

export function hasFirebaseClientConfig() {
  return Boolean(getFirebaseClientConfig());
}

export function getFirebaseClientApp() {
  if (firebaseApp) {
    return firebaseApp;
  }

  const config = getFirebaseClientConfig();
  if (!config) {
    return null;
  }

  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(config);
  return firebaseApp;
}

export function getFirebaseClientAuth() {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  const app = getFirebaseClientApp();
  if (!app) {
    return null;
  }

  firebaseAuth = getAuth(app);
  void setPersistence(firebaseAuth, browserLocalPersistence).catch(() => {
    // Persistence is best-effort in the browser.
  });
  return firebaseAuth;
}

export function getFirebaseGoogleProvider() {
  if (googleProvider) {
    return googleProvider;
  }

  if (!getFirebaseClientApp()) {
    return null;
  }

  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  return googleProvider;
}
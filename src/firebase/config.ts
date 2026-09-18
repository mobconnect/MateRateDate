import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Safe environment accessor supporting both Next.js process.env and Vite import.meta.env
const getEnv = (key: string, fallback = ""): string => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  // Vite env compatibility
  if (typeof import.meta !== "undefined" && (import.meta as any).env) {
    const viteVal = (import.meta as any).env[key] || (import.meta as any).env[`VITE_${key}`];
    if (viteVal) return viteVal;
  }
  return fallback;
};

const required = {
  apiKey: getEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "demo-mate-rate-date-api-key"),
  authDomain: getEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "mate-rate-date.firebaseapp.com"),
  projectId: getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "mate-rate-date-hub"),
  storageBucket: getEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "mate-rate-date.appspot.com"),
  messagingSenderId: getEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "9876543210"),
  appId: getEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "1:9876543210:web:abcdef123456"),
};

for (const [key, value] of Object.entries(required)) {
  if (!value) {
    throw new Error(`Missing Firebase configuration: ${key}`);
  }
}

export const firebaseApp =
  getApps()[0] ??
  initializeApp({
    apiKey: required.apiKey,
    authDomain: required.authDomain,
    projectId: required.projectId,
    storageBucket: required.storageBucket,
    messagingSenderId: required.messagingSenderId,
    appId: required.appId,
  });

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

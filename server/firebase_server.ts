import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
};

// Ensure `.env` is loaded even if the process is started from `server-dist/`.
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * Server-safe Firebase initialization.
 *
 * Uses the Firebase Web SDK so you can access Firestore from Node
 * with the same project configuration as the client.
 */


export const firebaseConfig: FirebaseWebConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY ?? "NOT_SET",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN ?? "NOT_SET",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID ?? "NOT_SET",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET ?? "NOT_SET",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "NOT_SET",
  appId: process.env.VITE_FIREBASE_APP_ID ?? "NOT_SET",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);

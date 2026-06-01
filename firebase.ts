import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

const STORAGE_KEY = 'mosquestrack_firebase_config';

// 1. Try to get config from LocalStorage first (for student/teacher custom deployments), else fall back to the central firebase-applet-config.json
const getActiveConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse stored firebase config", e);
  }
  return firebaseConfig;
};

const configToUse = getActiveConfig();

// 2. Check if valid
const isConfigured = configToUse && configToUse.apiKey && configToUse.apiKey !== "YOUR_API_KEY";

let app;
let dbInstance: Firestore | null = null;

if (isConfigured) {
  try {
    app = initializeApp(configToUse);
    dbInstance = getFirestore(app, configToUse.firestoreDatabaseId);
    console.log("Firebase initialized successfully with project:", configToUse.projectId);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase not configured with valid keys. Using mock in-memory database.");
}

export const db = dbInstance;
export const isLive = !!dbInstance;

// Helpers for the Settings UI
export const saveFirebaseConfig = (config: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.location.reload();
};

export const clearFirebaseConfig = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};

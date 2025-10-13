// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD1ujEcRAn35dYGkbwno_ABGlVkK4g0mHw",
  authDomain: "smart-ed-b7023.firebaseapp.com",
  databaseURL: "https://smart-ed-b7023-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-ed-b7023",
  storageBucket: "smart-ed-b7023.firebasestorage.app",
  messagingSenderId: "54852021153",
  appId: "1:54852021153:web:b6f4386df82ae42875b9e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance
export default app;

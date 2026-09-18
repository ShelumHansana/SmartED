// Firebase Configuration for Frontend
// This file initializes Firebase services for the SmartED application

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
// These credentials are safe to expose in frontend code
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

/**
 * Creates a new user in Firebase Auth using a secondary Firebase App instance.
 * This ensures the currently logged-in Admin is never logged out.
 */
export const createFirebaseUserWithoutLoggingOut = async (email, password) => {
  let secondaryApp;
  const existingApp = getApps().find(a => a.name === 'SecondaryAdminApp');
  if (existingApp) {
    secondaryApp = existingApp;
  } else {
    secondaryApp = initializeApp(firebaseConfig, 'SecondaryAdminApp');
  }
  const secondaryAuth = getAuth(secondaryApp);
  const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  await signOut(secondaryAuth);
  return userCredential.user;
};

// Export the app instance
export default app;

// Re-export Firebase modules that components might need
export { 
  // Auth methods
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword
} from 'firebase/auth';

export {
  // Firestore methods
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export {
  // Storage methods
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';


import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Use a working Firebase configuration or fallback
const firebaseConfig = {
  apiKey: "AIzaSyBhYkqLjXzKqjZyXyXyXyXyXyXyXyXyXyX",
  authDomain: "skillrealms.firebaseapp.com",
  projectId: "skillrealms",
  storageBucket: "skillrealms.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create mock objects to prevent app from crashing
  auth = null;
  db = null;
}

export { auth, db };

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5WmchN59-nd2QgAgfMzL2P2fV-SMNT3E",
  authDomain: "skillrealms.firebaseapp.com",
  projectId: "skillrealms",
  storageBucket: "skillrealms.firebasestorage.app",
  messagingSenderId: "242283113269",
  appId: "1:242283113269:web:73fead12546faa887dba7c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDHRh2eEFkABD4UweamYzGhb0zW4KSGodU",
  authDomain: "diagnostico-dc-advisors.firebaseapp.com",
  projectId: "diagnostico-dc-advisors",
  storageBucket: "diagnostico-dc-advisors.firebasestorage.app",
  messagingSenderId: "929125964563",
  appId: "1:929125964563:web:335cc965e40fd5092698e6",
  measurementId: "G-RN6RX2VXXB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
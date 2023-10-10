import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3j5uQ3Wi7rETgmrshC4raJKX_6CQmx3Q",
  authDomain: "si-attendance-face-recognition.firebaseapp.com",
  projectId: "si-attendance-face-recognition",
  storageBucket: "si-attendance-face-recognition.appspot.com",
  messagingSenderId: "248160161116",
  appId: "1:248160161116:web:e50af776b47e61335e4599",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

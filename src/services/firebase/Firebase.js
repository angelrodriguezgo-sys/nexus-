// services/firebase/Firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  addDoc,           // ✅ AÑADIR addDoc
  increment,        // ✅ AÑADIR increment
  orderBy,          // ✅ AÑADIR orderBy (opcional)
  limit             // ✅ AÑADIR limit (opcional)
} from 'firebase/firestore';

// Tu configuración de Firebase
// services/firebase/Firebase.js (para Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ EXPORTAR TODAS LAS FUNCIONES NECESARIAS
export { 
  auth, 
  db,
  // Auth functions
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  // Firestore functions
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  addDoc,      // ✅ Exportar addDoc
  increment,   // ✅ Exportar increment
  orderBy,     // ✅ Exportar orderBy
  limit        // ✅ Exportar limit
};
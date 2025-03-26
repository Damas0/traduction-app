import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0TAm_yBDcNrIkp4Fy8k0LCsYycmKXPNc",
  authDomain: "traduction-c5b58.firebaseapp.com",
  projectId: "traduction-c5b58",
  storageBucket: "traduction-c5b58.firebasestorage.app",
  messagingSenderId: "20508378783",
  appId: "1:20508378783:web:7d7c1ce8f759e40ec0c4aa",
  measurementId: "G-QSSF7NL7KX"
};

  // Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Fonction pour la connexion avec Google
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Erreur de connexion avec Google:", error.message);
    return null;
  }
};

const db = getFirestore(app); // 🔥 Initialisation Firestore
const storage = getStorage(app);

export { db,storage };
// Exporter l'auth et la fonction signInWithGoogle
export { auth, signInWithGoogle, createUserWithEmailAndPassword, signInWithEmailAndPassword };
export const googleProvider = new GoogleAuthProvider();
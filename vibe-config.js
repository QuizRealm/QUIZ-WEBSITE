// 1. Imports (v11.6.1 to match Vibe Lab)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// 2. Your Config
const firebaseConfig = {
  apiKey: "AIzaSyDqRiQs_ezSxSpaYo0BO8WAcJF9LKvyOwo",
  authDomain: "thequizrealm-ef52c.firebaseapp.com",
  projectId: "thequizrealm-ef52c",
  storageBucket: "thequizrealm-ef52c.firebasestorage.app",
  messagingSenderId: "56820951002",
  appId: "1:56820951002:web:3f7d419d62f6d7ee2102e3",
  measurementId: "G-4JL3CD1WQT"
};

// 3. Initialize
const app = initializeApp(firebaseConfig);

// 4. ATTACH TO WINDOW
// This isolates these tools to this specific config file
window.db = getFirestore(app);
window.auth = getAuth(app);

// Firestore helpers
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
window.updateDoc = updateDoc;
window.collection = collection;
window.addDoc = addDoc;

// Auth helpers
window.signInAnonymously = signInAnonymously;
window.GoogleAuthProvider = GoogleAuthProvider;
window.signInWithPopup = signInWithPopup;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;

// 5. SMART LOGIN
onAuthStateChanged(window.auth, (user) => {
    if (user) {
        console.log("Vibe Lab: User found:", user.uid);
    } else {
        console.log("Vibe Lab: Creating Guest Session...");
        signInAnonymously(window.auth).catch((error) => {
            console.error("Guest login failed", error);
        });
    }
});

console.log("Vibe Config Loaded (Safe Mode)");
// 1. Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// 3. Initialize App
const app = initializeApp(firebaseConfig);

// 4. Initialize Services (Create instances first)
const db = getFirestore(app);
const auth = getAuth(app);

// ==========================================
// COMPATIBILITY LAYER (For your existing site)
// ==========================================
// This ensures your old engine.js still finds these tools on the window
window.db = db;
window.auth = auth;
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
window.updateDoc = updateDoc; // Added this just in case
window.arrayUnion = arrayUnion; // Added this just in case

// ==========================================
// MODERN EXPORT (For the new Multiplayer Game)
// ==========================================
// This allows host-game.html to use "import { db } from..."
export { app, db, auth };

// 5. SMART LOGIN
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Existing user found:", user.uid);
    } else {
        console.log("No user found. Creating Guest Session...");
        signInAnonymously(auth).catch((error) => {
            console.error("Guest login failed", error);
        });
    }
});
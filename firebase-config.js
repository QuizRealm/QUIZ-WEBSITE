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

// 3. Initialize
const app = initializeApp(firebaseConfig);

// 4. ATTACH TO WINDOW (Crucial Step!)
// This makes these tools available to engine.js
window.db = getFirestore(app);
window.auth = getAuth(app);
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;

// 5. SMART LOGIN (The Fix)
// Wait to see if Firebase remembers a user. If not, THEN sign in anonymously.
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Existing user found:", user.uid);
        // Do nothing, let the profile page handle it
    } else {
        console.log("No user found. Creating Guest Session...");
        signInAnonymously(auth).catch((error) => {
            console.error("Guest login failed", error);
        });
    }
});
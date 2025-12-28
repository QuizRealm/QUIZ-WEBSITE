/* UX CORE - FINAL OPTIMIZED (V2 - IDENTITY SUPPORT)
   - Infrastructure: Initializes Firebase for the whole site
   - Global: Exposes 'window.auth' and 'window.db' for Game Engine
   - Tracking: Persists User ID and now tracks Nicknames
*/

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDqRiQs_ezSxSpaYo0BO8WAcJF9LKvyOwo",
  authDomain: "thequizrealm-ef52c.firebaseapp.com",
  projectId: "thequizrealm-ef52c",
  storageBucket: "thequizrealm-ef52c.firebasestorage.app",
  messagingSenderId: "56820951002",
  appId: "1:56820951002:web:3f7d419d62f6d7ee2102e3",
  measurementId: "G-4JL3CD1WQT"
};
// --- INIT FIREBASE ---
let app, db, auth;
if (getApps().length === 0) app = initializeApp(firebaseConfig);
else app = getApp();

db = getFirestore(app);
auth = getAuth(app);

// --- 🛑 CRITICAL: EXPOSE TO WINDOW FOR GAME ENGINE 🛑 ---
// The Game Engine needs these to handle the Popup and saving data
window.db = db;
window.auth = auth;
window.firebase = { 
    auth: { 
        GoogleAuthProvider: GoogleAuthProvider 
    } 
};
// Also expose Firestore functions so Game Engine doesn't have to re-import them
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.serverTimestamp = serverTimestamp;

// --- STATE ---
const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
const startTime = Date.now();
let sessionDocId = null;
let interactions = 0;

// --- 1. PERSISTENT USER IDENTITY ---
// Check LocalStorage -> Then Firebase Auth -> Then Random Fallback
let persistentUid = localStorage.getItem('qr_persistent_uid');

async function initTracker() {
    onAuthStateChanged(auth, async (user) => {
        let finalUserId;

        if (user) {
            finalUserId = user.uid; // Best: Firebase ID
        } else if (persistentUid) {
            finalUserId = persistentUid; // Good: Saved ID
        } else {
            // New User: Create ID and SAVE IT
            finalUserId = 'anon_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('qr_persistent_uid', finalUserId);
            signInAnonymously(auth).catch(() => {});
        }
        
        // Update global variable so other scripts can see it if needed
        window.currentUserId = finalUserId; 

        // Attempt to get nickname from LocalStorage for better tracking logs
        let currentNick = "Anonymous";
        try {
            const profile = JSON.parse(localStorage.getItem("QR_PROFILE"));
            if (profile && profile.nickname) currentNick = profile.nickname;
        } catch(e) {}

        // --- 2. START SESSION ---
        try {
            const docRef = await addDoc(collection(db, "arcade_activity"), {
                userId: finalUserId,
                nickname: currentNick, // Now tracks the name!
                page: currentPage,
                status: "Started",
                time_spent: 0,
                timestamp: serverTimestamp(),
                device: navigator.userAgent
            });
            sessionDocId = docRef.id;

            // --- 3. HEARTBEAT (Every 30s) ---
            setInterval(() => saveData("Heartbeat"), 30000); 

        } catch (e) { console.error("Tracking Error:", e); }
    });
}

// --- SHARED SAVE FUNCTION ---
async function saveData(reason) {
    if (!sessionDocId) return;
    
    const timeSpent = ((Date.now() - startTime) / 1000).toFixed(0);
    const docRef = doc(db, "arcade_activity", sessionDocId);

    // Update nickname if it changed during the session (e.g., user logged in via popup)
    let currentNick = null;
    try {
        const profile = JSON.parse(localStorage.getItem("QR_PROFILE"));
        if (profile && profile.nickname) currentNick = profile.nickname;
    } catch(e) {}

    const updateData = {
        time_spent: parseInt(timeSpent),
        total_clicks: interactions,
        status: reason === "Exit" ? "Closed" : "Active",
        last_update_trigger: reason
    };

    if (currentNick) updateData.nickname = currentNick;

    await updateDoc(docRef, updateData).catch(e => console.warn("Save skipped:", e));
}

// --- CLICK LISTENER ---
document.addEventListener('click', () => interactions++);

// --- 4. THE EXIT SAVE (Catches the 30s players) ---
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {
        saveData("Exit");
    }
});
window.addEventListener('beforeunload', () => {
    saveData("Exit");
});

if (typeof window !== 'undefined') initTracker();
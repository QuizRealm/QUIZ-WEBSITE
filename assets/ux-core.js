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
let persistentUid = localStorage.getItem('qr_persistent_uid');

async function initTracker() {
    onAuthStateChanged(auth, async (user) => {
        let finalUserId;

        if (user) {
            finalUserId = user.uid; 
        } else if (persistentUid) {
            finalUserId = persistentUid; 
        } else {
            finalUserId = 'anon_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('qr_persistent_uid', finalUserId);
            signInAnonymously(auth).catch(() => {});
        }
        
        window.currentUserId = finalUserId; 
        
        // --- 2. START SESSION (INSIDE USERS COLLECTION) ---
        try {
            // We use a sub-collection 'sessions' inside the specific user's document
            const sessionRef = await addDoc(collection(db, "users", finalUserId, "sessions"), {
                page_name: currentPage,
                start_time: serverTimestamp(),
                device_type: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
                entry_point: document.referrer || "Direct",
                
                // Metrics that update live
                metrics: {
                    time_spent_seconds: 0,
                    click_count: 0,
                    scroll_depth: 0,
                    status: "Live"
                }
            });
            sessionDocId = sessionRef.id;

            // --- 3. HEARTBEAT (Every 10s for higher accuracy) ---
            setInterval(() => saveData("Heartbeat"), 10000); 

        } catch (e) { console.error("Tracking Error:", e); }
    });
}

// --- SHARED SAVE FUNCTION ---
async function saveData(reason) {
    if (!sessionDocId || !window.currentUserId) return;
    
    // Calculate exact seconds
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Path: users -> {uid} -> sessions -> {sessionId}
    const docRef = doc(db, "users", window.currentUserId, "sessions", sessionDocId);

    // Dynamic Updates
    await updateDoc(docRef, {
        "metrics.time_spent_seconds": timeSpent,
        "metrics.click_count": interactions,
        "metrics.status": reason === "Exit" ? "Completed" : "Live",
        last_ping: serverTimestamp()
    }).catch(e => console.warn("Save skipped:", e));
    
    // OPTIONAL: Update "Total Time" on the Main User Document (Cumulative)
    // This gives you the "Total Time on Website" metric you asked for
    if (reason === "Heartbeat" && (timeSpent % 60 === 0)) { // Update main doc every minute
        try {
            const { increment } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            const mainUserRef = doc(db, "users", window.currentUserId);
            await updateDoc(mainUserRef, {
                "stats.total_time_on_site": increment(60)
            });
        } catch(e) {}
    }
}
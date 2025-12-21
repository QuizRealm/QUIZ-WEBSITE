/* UX CORE - FINAL OPTIMIZED
   - Persistence: Remembers User ID across pages (localStorage)
   - Cost Saving: Heartbeat every 30s
   - Safety: "Exit Save" catches short sessions
*/

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // ⚠️ PASTE KEYS
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- INIT ---
let app, db, auth;
if (getApps().length === 0) app = initializeApp(firebaseConfig);
else app = getApp();

db = getFirestore(app);
auth = getAuth(app);

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

        // --- 2. START SESSION ---
        try {
            const docRef = await addDoc(collection(db, "arcade_activity"), {
                userId: finalUserId,
                page: currentPage,
                status: "Started",
                time_spent: 0,
                timestamp: serverTimestamp(),
                device: navigator.userAgent
            });
            sessionDocId = docRef.id;

            // --- 3. HEARTBEAT (Every 30s) ---
            // Good balance. You won't hit limits, but data stays relatively fresh.
            setInterval(() => saveData("Heartbeat"), 30000); 

        } catch (e) { console.error("Tracking Error:", e); }
    });
}

// --- SHARED SAVE FUNCTION ---
async function saveData(reason) {
    if (!sessionDocId) return;
    
    const timeSpent = ((Date.now() - startTime) / 1000).toFixed(0);
    const docRef = doc(db, "arcade_activity", sessionDocId);

    // If 'Exit Save', we set status to Closed
    const newStatus = reason === "Exit" ? "Closed" : "Active";

    await updateDoc(docRef, {
        time_spent: parseInt(timeSpent),
        total_clicks: interactions,
        status: newStatus,
        last_update_trigger: reason
    }).catch(e => console.warn("Save skipped:", e));
}

// --- CLICK LISTENER ---
document.addEventListener('click', () => interactions++);

// --- 4. THE EXIT SAVE (Catches the 30s players) ---
// 'visibilitychange' is more reliable on mobile than 'beforeunload'
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {
        saveData("Exit");
    }
});
// Keep 'beforeunload' for desktop tab closes
window.addEventListener('beforeunload', () => {
    saveData("Exit");
});

if (typeof window !== 'undefined') initTracker();
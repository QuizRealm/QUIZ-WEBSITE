/* UX CORE - Experience Optimization Module (SAFE MODE)
   Handles session persistency, metrics, and remote logging.
   Fixes: "Firebase App named '[DEFAULT]' already exists" error.
*/

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- CONFIGURATION ---
// (We still need the config in case this script runs first, but we won't force it)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE", // PASTE YOUR KEY IF NOT ALREADY IN CONFIG
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- INITIALIZATION FIX ---
let app;
let db;

// Check if an app is already initialized to avoid the "Duplicate App" crash
if (getApps().length === 0) {
    // No app exists, so we initialize it (Safe to do here)
    app = initializeApp(firebaseConfig);
} else {
    // App already exists (likely from firebase-config.js), so we just grab it
    app = getApp(); 
}

// Get the Firestore instance from the app we just grabbed/created
db = getFirestore(app);

// --- SESSION VARIABLES ---
const startTime = Date.now();
const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
let sessionDocId = null; 
let interactions = 0;

// 1. USER IDENTIFICATION
let userId = localStorage.getItem('ux_uid');
if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('ux_uid', userId);
}

// 2. ATTEMPT/REFRESH TRACKING
let attempts = parseInt(localStorage.getItem(`attempts_${currentPage}`) || '0');
attempts++;
localStorage.setItem(`attempts_${currentPage}`, attempts);

// 3. START LOGGING
async function initSession() {
    try {
        const docRef = await addDoc(collection(db, "arcade_activity"), {
            userId: userId,
            game: currentPage,
            timestamp: serverTimestamp(),
            status: "In Progress",
            attempts_count: attempts,
            device: navigator.userAgent,
            screen_size: `${window.screen.width}x${window.screen.height}`
        });
        sessionDocId = docRef.id;
    } catch (e) {
        console.error("UX Core Init Error:", e);
    }
}

// Only run if we are actually in a browser environment
if (typeof window !== 'undefined') {
    initSession();
}

// 4. INTERACTION LISTENER
document.addEventListener('click', (e) => {
    interactions++;
});

// 5. RESULT OBSERVER
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.innerText) {
                const text = node.innerText.toLowerCase();
                
                if (text.includes("game over") || text.includes("you win") || text.includes("score:")) {
                    
                    const timeSpent = ((Date.now() - startTime) / 1000).toFixed(1);
                    const scoreMatch = text.match(/score:?\s*(\d+)/) || text.match(/(\d+)\/(\d+)/);
                    const finalScore = scoreMatch ? scoreMatch[0] : "N/A";
                    const outcome = text.includes("win") ? "WIN" : "LOSS/DONE";

                    if (sessionDocId) {
                        const sessionRef = doc(db, "arcade_activity", sessionDocId);
                        updateDoc(sessionRef, {
                            status: "Completed",
                            result_outcome: outcome,
                            final_score: finalScore,
                            duration_seconds: timeSpent,
                            total_clicks: interactions,
                            end_timestamp: serverTimestamp()
                        });
                    }
                    observer.disconnect();
                }
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true });

// 6. ABANDONMENT TRACKING
window.addEventListener('beforeunload', () => {
    if (sessionDocId && interactions > 0) {
        const timeSpent = ((Date.now() - startTime) / 1000).toFixed(1);
        const sessionRef = doc(db, "arcade_activity", sessionDocId);
        // Best effort save on close
        updateDoc(sessionRef, { duration_seconds: timeSpent });
    }
});
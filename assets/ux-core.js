/* UX CORE - Experience Optimization Module (V2 - AUTH FIX)
   - Auto-authenticates to bypass Firestore Security Rules.
   - Handles "Duplicate App" errors safely.
   - Logs specific errors for debugging.
*/

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqRiQs_ezSxSpaYo0BO8WAcJF9LKvyOwo",
  authDomain: "thequizrealm-ef52c.firebaseapp.com",
  projectId: "thequizrealm-ef52c",
  storageBucket: "thequizrealm-ef52c.firebasestorage.app",
  messagingSenderId: "56820951002",
  appId: "1:56820951002:web:3f7d419d62f6d7ee2102e3",
  measurementId: "G-4JL3CD1WQT"
};
// --- INITIALIZATION ---
let app, db, auth;

try {
    // 1. Safe App Initialization
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp(); 
    }

    // 2. Get Services
    db = getFirestore(app);
    auth = getAuth(app);
    
    console.log("🔹 UX Core: Firebase initialized.");

} catch (e) {
    console.error("❌ UX Core Setup Failed. Did you replace 'YOUR_API_KEY'?", e);
}

// --- SESSION VARIABLES ---
const startTime = Date.now();
const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
let sessionDocId = null; 
let interactions = 0;

// --- MAIN LOGIC ---
async function startTracking() {
    // 3. AUTHENTICATE (Crucial for Firestore Permissions)
    try {
        if (!auth.currentUser) {
            await signInAnonymously(auth);
            console.log("👤 UX Core: Signed in anonymously.");
        }
    } catch (e) {
        console.warn("⚠️ UX Core Auth Warning (Data might not save if rules are strict):", e);
    }

    // 4. USER ID (Prefer Auth UID, fallback to LocalStorage)
    let userId = auth.currentUser ? auth.currentUser.uid : localStorage.getItem('ux_uid');
    if (!userId) {
        userId = 'anon_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ux_uid', userId);
    }

    // 5. ATTEMPT COUNTING
    let attempts = parseInt(localStorage.getItem(`attempts_${currentPage}`) || '0');
    attempts++;
    localStorage.setItem(`attempts_${currentPage}`, attempts);

    // 6. CREATE DATABASE ENTRY
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
        console.log(`✅ UX Core: Tracking started for '${currentPage}' (ID: ${sessionDocId})`);
    } catch (e) {
        console.error("❌ UX Core Write Error (Check Firestore Rules):", e);
    }
}

// Only run in browser
if (typeof window !== 'undefined') {
    startTracking();
}

// --- EVENT LISTENERS ---

// A. Track Clicks
document.addEventListener('click', () => {
    interactions++;
});

// B. "Spy" on Game Outcomes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.innerText) {
                const text = node.innerText.toLowerCase();
                
                // Detect Winning/Losing words
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
                        }).then(() => console.log("💾 UX Core: Results saved."));
                    }
                    observer.disconnect();
                }
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true });

// C. Save on Tab Close
window.addEventListener('beforeunload', () => {
    if (sessionDocId && interactions > 0) {
        const timeSpent = ((Date.now() - startTime) / 1000).toFixed(1);
        const sessionRef = doc(db, "arcade_activity", sessionDocId);
        updateDoc(sessionRef, { duration_seconds: timeSpent });
    }
});
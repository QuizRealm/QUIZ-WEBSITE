/* UX CORE - Experience Optimization Module
   Handles session persistency, metrics, and remote logging.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- CONFIGURATION (Paste your Firebase keys here) ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- SESSION VARIABLES ---
const startTime = Date.now();
const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
let sessionDocId = null; // Will hold the ID of the log in Firestore
let interactions = 0;

// 1. USER IDENTIFICATION (Get or Create Anonymous ID)
let userId = localStorage.getItem('ux_uid');
if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('ux_uid', userId);
}

// 2. ATTEMPT/REFRESH TRACKING
let attempts = parseInt(localStorage.getItem(`attempts_${currentPage}`) || '0');
attempts++;
localStorage.setItem(`attempts_${currentPage}`, attempts);

// 3. START LOGGING (Create initial entry in Firestore)
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
initSession();

// 4. INTERACTION LISTENER (Clicks & Hints)
document.addEventListener('click', (e) => {
    interactions++;
    // Optional: Update Firestore every 10 clicks to keep the connection 'alive'
    // or just track locally to save at the end.
});

// 5. RESULT OBSERVER (The "Spy" Logic)
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.innerText) {
                const text = node.innerText.toLowerCase();
                
                // DETECT GAME OVER / WIN
                if (text.includes("game over") || text.includes("you win") || text.includes("score:")) {
                    
                    const timeSpent = ((Date.now() - startTime) / 1000).toFixed(1);
                    
                    // Extract Score (Looks for "Score: 10/10" or just numbers)
                    const scoreMatch = text.match(/score:?\s*(\d+)/) || text.match(/(\d+)\/(\d+)/);
                    const finalScore = scoreMatch ? scoreMatch[0] : "N/A";
                    const outcome = text.includes("win") ? "WIN" : "LOSS/DONE";

                    // Update Firestore with Final Results
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
                    observer.disconnect(); // Stop watching once game ends
                }
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true });

// 6. ABANDONMENT TRACKING (If they close tab without finishing)
window.addEventListener('beforeunload', () => {
    if (sessionDocId && interactions > 0) {
        // We use navigator.sendBeacon for reliability on tab close, 
        // but since we can't use Firestore SDK in Beacon easily, 
        // we rely on the fact that the 'In Progress' status in DB 
        // plus a timestamp will tell you they quit.
        
        // Alternatively, try a quick update:
        const timeSpent = ((Date.now() - startTime) / 1000).toFixed(1);
        const sessionRef = doc(db, "arcade_activity", sessionDocId);
        // This is "fire and forget" - might not always complete on aggressive tab closes
        updateDoc(sessionRef, { duration_seconds: timeSpent });
    }
});
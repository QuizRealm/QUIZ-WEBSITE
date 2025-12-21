import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- ⚠️ PASTE YOUR KEYS HERE AGAIN TO BE SAFE ⚠️ ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- INIT FIREBASE ---
let app, db, auth;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}
db = getFirestore(app);
auth = getAuth(app);

// --- STATE ---
const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
const startTime = Date.now();
let sessionDocId = null;
let interactions = 0;
let highestScoreFound = "N/A";
let gameStatus = "Viewing"; 

// --- MAIN TRACKER ---
async function startTracker() {
    // 1. LOGIN (Required for Database Access)
    if (!auth.currentUser) {
        await signInAnonymously(auth).catch(e => console.warn("Auth Error:", e));
    }
    const userId = auth.currentUser ? auth.currentUser.uid : "anon_user";

    // 2. CREATE INITIAL LOG (The "Page Visit")
    try {
        const docRef = await addDoc(collection(db, "arcade_activity"), {
            userId: userId,
            page: currentPage,
            status: "Started",
            time_spent_seconds: 0, // Starts at 0
            timestamp: serverTimestamp(), // Interaction Time
            date_string: new Date().toLocaleString(), // Readable Date
            device: navigator.userAgent,
            score: "Pending"
        });
        
        sessionDocId = docRef.id;
        console.log(`✅ Tracking Active: ${currentPage} (Doc: ${sessionDocId})`);
        
        // 3. START HEARTBEAT (The Fix for "Not Saving Time")
        // Updates the DB every 5 seconds. If they close the tab, the last update stays.
        setInterval(() => updateHeartbeat(), 5000);

    } catch (e) {
        console.error("❌ DB Write Failed. Check Firestore Rules.", e);
    }
}

// --- UPDATE LOOP (Heartbeat) ---
async function updateHeartbeat() {
    if (!sessionDocId) return;

    const timeSpent = ((Date.now() - startTime) / 1000).toFixed(0); // Seconds

    // Update the existing document
    const docRef = doc(db, "arcade_activity", sessionDocId);
    await updateDoc(docRef, {
        time_spent_seconds: parseInt(timeSpent),
        status: gameStatus,
        total_clicks: interactions,
        score: highestScoreFound
    }).catch(e => console.warn("Heartbeat skip:", e));
}

// --- GAME OVER DETECTOR ---
// Scans for keywords: "Game Over", "Score:", "Result:", "Correct", "Finished"
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.innerText) {
                const text = node.innerText.toLowerCase();
                
                // BROAD KEYWORDS LIST
                if (text.includes("game over") || 
                    text.includes("score") || 
                    text.includes("result") || 
                    text.includes("completed") ||
                    text.includes("you win")) {
                    
                    gameStatus = "Finished"; // Changes status for next Heartbeat

                    // Try to grab a number like "8/10" or "Score: 500"
                    const numberMatch = text.match(/(\d+)\s*\/\s*(\d+)/) || text.match(/score\D*(\d+)/);
                    if (numberMatch) {
                        highestScoreFound = numberMatch[0]; // Saves "8/10" or "Score 500"
                        console.log("🎯 Score Detected:", highestScoreFound);
                        // Trigger immediate save
                        updateHeartbeat();
                    }
                }
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true });

// --- CLICK TRACKER ---
document.addEventListener('click', () => interactions++);

// Start
if (typeof window !== 'undefined') startTracker();
/* UX CORE - FINAL MASTER (V3 - DATA GUARDIAN)
   - Handles: Auth, Sessions, Tech Profiling (User Data)
   - Exposes: DB and Auth for Game Engine
   - Structure: Saves everything to 'users/{uid}'
*/

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, setDoc, getDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // ⚠️ PASTE YOUR KEYS HERE
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- INIT FIREBASE ---
let app, db, auth;
if (getApps().length === 0) app = initializeApp(firebaseConfig);
else app = getApp();

db = getFirestore(app);
auth = getAuth(app);

// --- EXPOSE TOOLS TO WINDOW (For Game Engine) ---
window.db = db;
window.auth = auth;
window.firebase = { auth: { GoogleAuthProvider: GoogleAuthProvider } };
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.serverTimestamp = serverTimestamp;

// --- STATE ---
const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
const startTime = Date.now();
let sessionDocId = null;
let interactions = 0;

// --- DIGITAL FINGERPRINT GENERATOR ---
function getDigitalFingerprint() {
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection || {};
    return {
        timestamp_local: new Date().toString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen_res: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        device_memory: nav.deviceMemory || "unknown",
        platform: nav.platform,
        is_mobile: /Mobi|Android/i.test(nav.userAgent),
        connection_type: conn.effectiveType || "unknown",
        downlink: conn.downlink || 0,
        referrer: document.referrer || "Direct",
        user_agent: nav.userAgent
    };
}

// --- MAIN TRACKER LOGIC ---
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

        // --- A. UPDATE MAIN USER PROFILE (The 20 Data Points) ---
        try {
            const userRef = doc(db, "users", finalUserId);
            const techProfile = getDigitalFingerprint();
            
            // Get nickname if saved locally
            let currentNick = "Anonymous";
            try {
                const localProfile = JSON.parse(localStorage.getItem("QR_PROFILE"));
                if (localProfile && localProfile.nickname) currentNick = localProfile.nickname;
            } catch(e) {}

            await setDoc(userRef, {
                identity: {
                    uid: finalUserId,
                    nickname: user?.displayName || currentNick,
                    is_anonymous: user?.isAnonymous ?? true,
                    last_active: serverTimestamp()
                },
                tech_profile: techProfile,
                stats: {
                    total_visits: increment(1)
                }
            }, { merge: true });
            
            console.log("✅ User Profile Synced to DB");

        } catch (e) { console.error("Profile Save Error:", e); }

        // --- B. START SESSION LOG (Sub-collection) ---
        try {
            // This creates a NEW document inside users/UID/sessions for every visit
            const sessionRef = await addDoc(collection(db, "users", finalUserId, "sessions"), {
                page: currentPage,
                start_time: serverTimestamp(),
                fingerprint: getDigitalFingerprint(), // Save snapshot of tech data for this specific session
                metrics: {
                    time_spent: 0,
                    clicks: 0,
                    status: "Live"
                }
            });
            sessionDocId = sessionRef.id;

            // --- HEARTBEAT (Every 10s) ---
            setInterval(() => saveData("Heartbeat"), 10000); 

        } catch (e) { console.error("Session Error:", e); }
    });
}

async function saveData(reason) {
    if (!sessionDocId || !window.currentUserId) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const docRef = doc(db, "users", window.currentUserId, "sessions", sessionDocId);

    await updateDoc(docRef, {
        "metrics.time_spent": timeSpent,
        "metrics.clicks": interactions,
        "metrics.status": reason === "Exit" ? "Completed" : "Live",
        last_ping: serverTimestamp()
    }).catch(() => {});

    // Update Global Time Counter every minute
    if (reason === "Heartbeat" && timeSpent > 0 && timeSpent % 60 === 0) {
        try {
            const mainRef = doc(db, "users", window.currentUserId);
            await updateDoc(mainRef, { "stats.total_time_on_site": increment(60) });
        } catch(e) {}
    }
}

document.addEventListener('click', () => interactions++);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === 'hidden') saveData("Exit"); });
window.addEventListener('beforeunload', () => saveData("Exit"));

if (typeof window !== 'undefined') initTracker();
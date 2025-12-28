/* UX CORE - HYBRID MASTER (V4 - DUAL SAVE)
   - Handles: Auth, Tech Profiling, Session Tracking
   - SAVES TO: 'users' collection (Structured) AND 'arcade_activity' (Backup)
   - Exposes: DB and Auth for Game Engine
*/

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, setDoc, getDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

// We now track TWO document IDs (one for each collection)
let sessionDocId = null; // Inside users/{uid}/sessions
let arcadeDocId = null;  // Inside arcade_activity
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

        // Get nickname if saved locally
        let currentNick = "Anonymous";
        try {
            const localProfile = JSON.parse(localStorage.getItem("QR_PROFILE"));
            if (localProfile && localProfile.nickname) currentNick = localProfile.nickname;
        } catch(e) {}

        // =========================================================
        // 1. UPDATE MAIN USER PROFILE (The 20 Data Points)
        // =========================================================
        try {
            const userRef = doc(db, "users", finalUserId);
            const techProfile = getDigitalFingerprint();
            
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
            
            console.log("✅ User Profile Synced");
        } catch (e) { console.error("Profile Save Error:", e); }

        // =========================================================
        // 2. START SESSION LOG (Structured)
        // =========================================================
        try {
            const sessionRef = await addDoc(collection(db, "users", finalUserId, "sessions"), {
                page: currentPage,
                start_time: serverTimestamp(),
                fingerprint: getDigitalFingerprint(),
                metrics: {
                    time_spent: 0,
                    clicks: 0,
                    status: "Live"
                }
            });
            sessionDocId = sessionRef.id;
        } catch (e) { console.error("Session Error:", e); }

        // =========================================================
        // 3. START ARCADE LOG (Legacy Backup)
        // =========================================================
        try {
            const arcadeRef = await addDoc(collection(db, "arcade_activity"), {
                userId: finalUserId,
                nickname: currentNick,
                page: currentPage,
                status: "Started",
                time_spent: 0,
                timestamp: serverTimestamp(),
                device: navigator.userAgent
            });
            arcadeDocId = arcadeRef.id;
        } catch (e) { console.error("Arcade Log Error:", e); }

        // Start Heartbeat (Updates both)
        setInterval(() => saveData("Heartbeat"), 10000); 
    });
}

async function saveData(reason) {
    if (!window.currentUserId) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    // A. UPDATE SESSION (Structured)
    if (sessionDocId) {
        const docRef = doc(db, "users", window.currentUserId, "sessions", sessionDocId);
        await updateDoc(docRef, {
            "metrics.time_spent": timeSpent,
            "metrics.clicks": interactions,
            "metrics.status": reason === "Exit" ? "Completed" : "Live",
            last_ping: serverTimestamp()
        }).catch(() => {});
    }

    // B. UPDATE ARCADE LOG (Legacy Backup)
    if (arcadeDocId) {
        const arcadeRef = doc(db, "arcade_activity", arcadeDocId);
        await updateDoc(arcadeRef, {
            time_spent: timeSpent,
            total_clicks: interactions,
            status: reason === "Exit" ? "Closed" : "Active",
            last_update_trigger: reason
        }).catch(() => {});
    }

    // C. UPDATE GLOBAL STATS (Every minute)
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
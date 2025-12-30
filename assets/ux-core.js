/* UX CORE - FINAL V6 (PURE USERS COLLECTION)
   - Collections: 'users' ONLY (plus 'heroes' via Game Engine)
   - Heartbeat: 60s (Quota Safe)
   - Tracks: Tech Profile + Session History inside 'users/{uid}/sessions'
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

// --- EXPOSE TOOLS TO WINDOW ---
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

// --- FINGERPRINT (Tech Data) ---
function getDigitalFingerprint() {
    const nav = navigator;
    return {
        timestamp_local: new Date().toString(),
        screen_res: `${window.screen.width}x${window.screen.height}`,
        platform: nav.platform,
        is_mobile: /Mobi|Android/i.test(nav.userAgent),
        user_agent: nav.userAgent,
        referrer: document.referrer || "Direct"
    };
}

// --- MAIN TRACKER ---
let persistentUid = localStorage.getItem('qr_persistent_uid');

async function initTracker() {
    onAuthStateChanged(auth, async (user) => {
        // 1. IDENTITY RESOLUTION
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

        // 2. GET NICKNAME (If available locally)
        let currentNick = "Anonymous";
        try {
            const local = JSON.parse(localStorage.getItem("QR_PROFILE"));
            if (local && local.nickname) currentNick = local.nickname;
        } catch(e) {}

        // 3. UPDATE MAIN PROFILE (Tech Data) - Runs once per load
        try {
            const userRef = doc(db, "users", finalUserId);
            await setDoc(userRef, {
                identity: {
                    uid: finalUserId,
                    nickname: user?.displayName || currentNick,
                    is_anonymous: user?.isAnonymous ?? true,
                    last_active: serverTimestamp()
                },
                tech_profile: getDigitalFingerprint(),
                stats: { total_visits: increment(1) }
            }, { merge: true });
        } catch (e) {}

        // 4. START SESSION LOG (Replaces Arcade Activity)
        // Saves to: users/{uid}/sessions/{sessionID}
        try {
            const sessionRef = await addDoc(collection(db, "users", finalUserId, "sessions"), {
                page: currentPage,
                start_time: serverTimestamp(),
                device: navigator.platform, // Quick reference
                metrics: { 
                    time_spent: 0, 
                    clicks: 0, 
                    status: "Live" 
                }
            });
            sessionDocId = sessionRef.id;

            // --- HEARTBEAT: 60 SECONDS (Quota Safe) ---
            setInterval(() => saveData("Heartbeat"), 60000); 

        } catch (e) { console.error("Session Start Error:", e); }
    });
}

async function saveData(reason) {
    if (!sessionDocId || !window.currentUserId) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const docRef = doc(db, "users", window.currentUserId, "sessions", sessionDocId);

    // Update Session Data
    await updateDoc(docRef, {
        "metrics.time_spent": timeSpent,
        "metrics.clicks": interactions,
        "metrics.status": reason === "Exit" ? "Completed" : "Live",
        last_ping: serverTimestamp()
    }).catch(() => {});

    // Update Total Time on Site (Only on Heartbeat or Exit)
    // This is efficient: 1 write per minute maximum.
    const interval = reason === "Heartbeat" ? 60 : (timeSpent % 60);
    if (interval > 0) {
        try {
            const mainRef = doc(db, "users", window.currentUserId);
            await updateDoc(mainRef, { 
                "stats.total_time_on_site": increment(interval) 
            });
        } catch(e) {}
    }
}

document.addEventListener('click', () => interactions++);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === 'hidden') saveData("Exit"); });
window.addEventListener('beforeunload', () => saveData("Exit"));

if (typeof window !== 'undefined') initTracker();
/* ============================================================
   QUIZREALM • UNIVERSAL GAME ENGINE (HYBRID V5 - Ghost Edition)
   - Core Logic: Level Up & XP System
   - New: Anonymous Tracking (Ghost Profiles)
   - New: Silent Data Collection (Legal/Tech stats)
   ============================================================ */

// --- FIX: USE FULL URL IMPORTS FOR BROWSER ---
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Initialize Firebase services
// We assume firebase-config.js has already initialized the App, 
// so we just grab the Auth and DB instances here.
const auth = getAuth();
const db = getFirestore();

(function () {
    // 1. CONFIGURATION
    const STORAGE_KEY = "QR_PROFILE";
    
    // Ranks (Every 10 levels)
    const RANK_TITLES = [
        { lvl: 1,  title: "The Drifter" },        // 1-9
        { lvl: 10, title: "Neon Runner" },        // 10-19
        { lvl: 20, title: "Cyber Vanguard" },     // 20-29
        { lvl: 30, title: "Data Hunter" },        // 30-39
        { lvl: 40, title: "Void Walker" },        // 40-49
        { lvl: 50, title: "System Lord" },        // 50-59
        { lvl: 60, title: "Galaxy Sentinel" },    // 60-69
        { lvl: 70, title: "Reality Bender" },     // 70-79
        { lvl: 80, title: "Time Weaver" },        // 80-89
        { lvl: 90, title: "Cosmic Entity" },      // 90-99
        { lvl: 100, title: "The Singularity" }    // 100+
    ];

    // 2. INTERNAL ENGINE STATE
    const Engine = {
        state: {
            uid: null,
            nickname: null,
            avatarSeed: "Player",
            xp: 0,
            level: 1,
            rank: "The Drifter",
            badges: [],
            streak: 0,
            lastLogin: null,
            lastDailyDate: null,
            coins: 0
        },

        // 3. INITIALIZATION
        init() {
            this._loadLocal();
            this._recalculateLevel(false); // Calc stats without animation on load
            this._setupAuth(); // Start the Ghost/User tracking immediately
            
            this.updateHeaderUI();
            this.updateProfileUI();
            this._updateSimpleUI();

            window.GameEngine = Engine;
            console.log("✅ GameEngine Active. Tracking Mode: Hybrid");
        },

        // --- NEW: AUTH & GHOST TRACKING LOGIC ---
        _setupAuth() {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // --- CASE A: USER IS LOGGED IN (OR JUST BECAME A GHOST) ---
                    console.log("User detected:", user.uid);
                    this.state.uid = user.uid;

                    // 1. Sync Game Progress
                    await this._syncWithCloud(user);

                    // 2. Check/Create Ghost Profile (The Legal Data Step)
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        console.log("Creating new Ghost Profile...");
                        await setDoc(userRef, {
                            uid: user.uid,
                            isAnonymous: user.isAnonymous,
                            joinedAt: new Date(),
                            nickname: user.isAnonymous ? "Ghost Guest" : "New Hero",
                            // --- LEGAL / TECH DATA COLLECTION ---
                            deviceModel: navigator.userAgent, 
                            connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
                            platform: navigator.platform,
                            language: navigator.language,
                            screenRes: `${window.screen.width}x${window.screen.height}`
                        });
                    }
                } else {
                    // --- CASE B: NO USER? MAKE THEM A GHOST IMMEDIATELY ---
                    console.log("No user found. initiating Ghost Sequence...");
                    signInAnonymously(auth).catch((e) => console.error("Ghost login failed:", e));
                }
            });
        },

        // --- NEW: SAVE GAME RESULTS ---
        async saveGameResult(gameName, score, totalQuestions, extraStats = {}) {
            if (!this.state.uid) {
                console.warn("Save failed: No User ID yet");
                return; 
            }

            try {
                // Save to: users/{uid}/history
                await addDoc(collection(db, "users", this.state.uid, "history"), {
                    game: gameName,
                    score: score,
                    total: totalQuestions,
                    xpEarned: this.state.xp, // Snapshot of XP at this moment
                    timestamp: serverTimestamp(),
                    
                    // Specifics for personalization
                    avgReactionTime: extraStats.avgTime || 0,
                    ghostClicks: extraStats.ghostClicks || 0,
                    deviceModel: navigator.userAgent,
                    connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
                    timeOfDay: new Date().getHours()
                });
                console.log(`Saved result for ${gameName}`);
                
                // Also give XP locally
                this.addXP(score * 10); 
            } catch (error) {
                console.error("Error saving game data:", error);
            }
        },

        // 4. DATA PERSISTENCE
        _loadLocal() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            try {
                const data = JSON.parse(raw);
                this.state = { ...this.state, ...data };
            } catch (e) {}
        },

        _saveLocal() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        },

        async _syncWithCloud(firebaseUser) {
            const uid = firebaseUser.uid;
            const ref = doc(db, "heroes", uid); // Keeping your 'heroes' collection for Game Stats

            let cloudData = null;
            try {
                const snap = await getDoc(ref);
                if (snap.exists()) cloudData = snap.data();
            } catch (e) {}

            if (cloudData) {
                // Merge Cloud + Local
                this.state = {
                    ...this.state,
                    ...cloudData,
                    xp: Math.max(this.state.xp || 0, cloudData.xp || 0),
                    streak: Math.max(this.state.streak || 0, cloudData.streak || 0),
                    badges: [...new Set([...(cloudData.badges||[]), ...(this.state.badges||[])])]
                };
            }
            this._recalculateLevel(false); 
            this._saveLocal();
            // Write back to cloud to ensure latest sync
            try { await setDoc(ref, this.state, { merge: true }); } catch (e) {}
            
            this.updateHeaderUI();
            this.updateProfileUI();
        },

        async _saveCloudSafe() {
            if (!this.state.uid) return;
            const ref = doc(db, "heroes", this.state.uid);
            try { await setDoc(ref, this.state, { merge: true }); } catch (e) {}
        },

        // --------------------------------------------------------
        // LEVELING LOGIC
        // --------------------------------------------------------
        _getLevelFromXP(xp) {
            let level = Math.floor(Math.sqrt(xp / 100));
            if (level < 1) level = 1;
            return level;
        },

        _getRankTitle(level) {
            let title = RANK_TITLES[0].title;
            for (let r of RANK_TITLES) {
                if (level >= r.lvl) title = r.title;
            }
            return title;
        },

        _recalculateLevel(animate = true) {
            const oldLevel = this.state.level;
            const newLevel = this._getLevelFromXP(this.state.xp);
            const newRank = this._getRankTitle(newLevel);

            this.state.level = newLevel;
            this.state.rank = newRank;

            if (animate && newLevel > oldLevel) {
                this._triggerLevelUpAnimation(newLevel, newRank);
            }
        },

        // --------------------------------------------------------
        // ANIMATION SYSTEM
        // --------------------------------------------------------
        _triggerLevelUpAnimation(level, rank) {
            const overlay = document.createElement('div');
            overlay.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in cursor-pointer";
            overlay.onclick = () => overlay.remove();

            overlay.innerHTML = `
                <div class="relative w-full max-w-md p-8 text-center">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accentCyan/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div class="relative z-10 mb-4">
                        <div class="text-[10px] font-bold text-accentGold uppercase tracking-[0.5em] mb-2 animate-slide-down">Level Up!</div>
                        <div class="text-9xl font-black text-white leading-none drop-shadow-[0_0_30px_rgba(6,182,212,0.8)] animate-scale-bounce">${level}</div>
                    </div>
                    <div class="relative z-10 mb-8 animate-slide-up" style="animation-delay: 0.3s; opacity: 0; animation-fill-mode: forwards;">
                        <div class="text-slate-400 text-sm font-mono mb-1">New Rank Achieved</div>
                        <div class="text-3xl font-bold text-accentCyan font-arcade uppercase tracking-wider">${rank}</div>
                    </div>
                    <div class="relative z-10 mt-10 animate-slide-up" style="animation-delay: 0.6s; opacity: 0; animation-fill-mode: forwards;">
                        <button class="bg-white text-black font-black py-3 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 transition">CLAIM REWARDS</button>
                    </div>
                    <div class="confetti-container absolute inset-0 pointer-events-none"></div>
                </div>
                <style>
                    @keyframes scaleBounce { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }
                    @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    .animate-scale-bounce { animation: scaleBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                    .animate-slide-down { animation: slideDown 0.5s ease-out forwards; }
                    .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
                    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                </style>
            `;
            this._spawnConfetti(overlay);
            document.body.appendChild(overlay);
        },

        _spawnConfetti(container) {
            const colors = ['#06b6d4', '#eab308', '#a855f7', '#ffffff'];
            for(let i=0; i<30; i++) {
                const el = document.createElement('div');
                el.style.cssText = `position: absolute; top: 50%; left: 50%; width: 8px; height: 8px; background: ${colors[Math.floor(Math.random()*colors.length)]}; transform: translate(-50%, -50%); border-radius: 50%; animation: explode 1s ease-out forwards; animation-delay: ${Math.random() * 0.2}s; --x: ${(Math.random() - 0.5) * 600}px; --y: ${(Math.random() - 0.5) * 600}px;`;
                container.querySelector('.confetti-container').appendChild(el);
            }
            const style = document.createElement('style');
            style.innerHTML = `@keyframes explode { to { transform: translate(var(--x), var(--y)); opacity: 0; } }`;
            container.appendChild(style);
        },

        // --------------------------------------------------------
        // CORE ACTIONS
        // --------------------------------------------------------
        addXP(amount) {
            try {
                const add = Number(amount) || 0;
                if (add <= 0) return;

                this.state.xp += add;
                this.state.coins = Math.floor(this.state.xp / 10);
                this._recalculateLevel(true);
                this._saveLocal();
                this._saveCloudSafe();
                this.updateHeaderUI();
                this.updateProfileUI();
                this._updateSimpleUI();
                this._notifyUserUpdate();
                this.showToast(`+${add} XP`, `Total XP: ${this.state.xp.toLocaleString()}`, "text-blue-400");
            } catch (e) { console.error("addXP error:", e); }
        },

        unlockAchievement(id) {
            try {
                if (!id) return;
                if (!Array.isArray(this.state.badges)) this.state.badges = [];
                if (!this.state.badges.includes(id)) {
                    this.state.badges.push(id);
                    this._saveLocal();
                    this._saveCloudSafe();
                    this.updateHeaderUI();
                    this.updateProfileUI();
                    this._notifyUserUpdate();
                    this.showToast("Achievement Unlocked", id, "text-purple-400");
                }
            } catch (e) {}
        },

        completeDailyChallenge() {
            try {
                const todayStr = new Date().toDateString();
                if (this.state.lastDailyDate === todayStr) return { success: false, msg: "ALREADY_COMPLETED" };
                
                let isConsecutive = false;
                if (this.state.lastDailyDate) {
                    const lastDate = new Date(this.state.lastDailyDate);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (lastDate.toDateString() === yesterday.toDateString()) isConsecutive = true;
                }

                if (isConsecutive) this.state.streak = (this.state.streak || 0) + 1;
                else this.state.streak = 1;

                this.state.lastDailyDate = todayStr;
                this._saveLocal();
                this._saveCloudSafe();
                this.updateProfileUI();
                return { success: true, newStreak: this.state.streak };
            } catch (e) { return { success: false, error: e }; }
        },

        // --------------------------------------------------------
        // UI UPDATES
        // --------------------------------------------------------
        _notifyUserUpdate() {
            if (this._notifyScheduled) return;
            this._notifyScheduled = true;
            queueMicrotask(() => {
                this._notifyScheduled = false;
                window.dispatchEvent(new CustomEvent("userUpdate", { detail: this.getUserSnapshot() }));
            });
        },

        updateHeaderUI() {
            try {
                const lvlEl = document.getElementById("headerLevel");
                if (lvlEl) lvlEl.textContent = this.state.level || 1;
                const xpEl = document.getElementById("headerXP");
                if (xpEl) xpEl.textContent = this.state.xp || 0;
                const coinEl = document.getElementById("headerCoins");
                if (coinEl) coinEl.textContent = (this.state.coins || 0).toLocaleString();
                const avatarEl = document.getElementById("headerAvatar");
                if (avatarEl) avatarEl.src = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${this.state.avatarSeed}`;
            } catch (e) {}
        },

        updateProfileUI() {
            try {
                const s = this.state;
                const map = {
                    "profileLevel": s.level, "profileRank": s.rank, "profileXP": `${(s.xp || 0).toLocaleString()} XP`,
                    "profileName": s.nickname || "QuizRealm Hero", "statScore": (s.xp || 0).toLocaleString(),
                    "statStreak": s.streak || 0, "statBadges": s.badges?.length || 0
                };
                for(const [id, val] of Object.entries(map)){
                    const el = document.getElementById(id);
                    if(el) el.textContent = val;
                }
                const xpBar = document.getElementById("xpBarFill");
                if (xpBar) {
                    const currentLvlXP = 100 * (s.level * s.level);
                    const nextLvlXP = 100 * ((s.level + 1) * (s.level + 1));
                    const range = nextLvlXP - currentLvlXP;
                    const progress = s.xp - currentLvlXP;
                    const pct = Math.max(0, Math.min(100, (progress / range) * 100));
                    xpBar.style.width = `${pct}%`;
                }
            } catch (e) {}
        },
 

        _updateSimpleUI() { try { document.getElementById("user-xp").innerText = this.state.xp || 0; } catch (e) {} },

        showToast(title, msg, colorClass = "text-blue-400") {
            try {
                const toast = document.createElement("div");
                toast.className = `fixed bottom-4 right-4 bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4 z-[9999] animate-bounce`;
                toast.innerHTML = `<div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${colorClass}"><i class="fas fa-star"></i></div><div><h4 class="font-bold text-white text-sm">${title}</h4><p class="text-xs text-slate-400">${msg}</p></div>`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 4000);
            } catch (e) {}
        },

        getUserSnapshot() { return { ...this.state }; }
    };

    // ------------------------------------------------------------
    // BACKWARD COMPATIBILITY
    // ------------------------------------------------------------

    // ------------------------------------------------------------
    // BACKWARD COMPATIBILITY
    // ------------------------------------------------------------
    Object.defineProperty(Engine, "xp", {
        get() { return Engine.state.xp || 0; },
        set(v) { Engine.addXP(Number(v) - Engine.state.xp); }
    });
    Object.defineProperty(Engine, "level", { get() { return Engine.state.rank; } });
    Object.defineProperty(Engine, "streak", { get() { return Engine.state.streak; }, set(v) { Engine.state.streak = Number(v); Engine._saveLocal(); } });
    
    // Save hook
    Engine.save = function () { Engine._saveLocal(); Engine._saveCloudSafe(); };

    Engine.init();
})();
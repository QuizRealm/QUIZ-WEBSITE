/* ============================================================
   QUIZREALM • UNIVERSAL GAME ENGINE (HYBRID V7 - GHOST DATA FIX)
   - Fixed: 'lastLogin' was never updating
   - Fixed: 'heroes' collection now gets Server Timestamps
   - Fixed: Ghost profiles now sync correctly to 'heroes'
   ============================================================ */

(function () {
    // 1. CONFIGURATION
    const STORAGE_KEY = "QR_PROFILE";
    
    // Ranks (Every 10 levels)
    const RANK_TITLES = [
        { lvl: 1,  title: "The Drifter" },
        { lvl: 10, title: "Neon Runner" },
        { lvl: 20, title: "Cyber Vanguard" },
        { lvl: 30, title: "Data Hunter" },
        { lvl: 40, title: "Void Walker" },
        { lvl: 50, title: "System Lord" },
        { lvl: 60, title: "Galaxy Sentinel" },
        { lvl: 70, title: "Reality Bender" },
        { lvl: 80, title: "Time Weaver" },
        { lvl: 90, title: "Cosmic Entity" },
        { lvl: 100, title: "The Singularity" }
    ];

    // 2. INTERNAL ENGINE STATE
    const Engine = {
        state: {
            uid: null,
            isAnonymous: false, // Added to track Ghost Status
            nickname: null,
            avatarSeed: "Player",
            xp: 0,
            level: 1,
            rank: "The Drifter",
            badges: [],
            streak: 0,
            lastLogin: null, // This will now be updated
            lastDailyDate: null,
            coins: 0
        },

        // 3. INITIALIZATION LOOP
        init() {
            this._loadLocal();
            this._recalculateLevel(false); 
            this._waitForFirebase();

            this.updateHeaderUI();
            this.updateProfileUI();
            this._updateSimpleUI(); 

            window.GameEngine = Engine;
            console.log("✅ GameEngine Active. Waiting for Firebase...");
        },

        _waitForFirebase() {
            const check = setInterval(() => {
                if (window.auth && window.db) {
                    clearInterval(check);
                    console.log("✅ Firebase Detected. Attaching Auth Listener...");
                    this._attachAuthListener();
                }
            }, 100);
        },

        _attachAuthListener() {
            try {
                window.auth.onAuthStateChanged(async (firebaseUser) => {
                    if (firebaseUser) {
                        console.log("👤 User Connected:", firebaseUser.uid);
                        
                        // --- FIX: UPDATE STATE IMMEDIATELY ---
                        this.state.uid = firebaseUser.uid;
                        this.state.isAnonymous = firebaseUser.isAnonymous;
                        this.state.lastLogin = new Date().toISOString(); // Tracks the exact time of login
                        
                        // 1. Ensure Ghost Profile Exists in BOTH collections
                        await this._checkGhostProfile(firebaseUser);

                        // 2. Sync Stats
                        await this._syncWithCloud(firebaseUser);
                        
                    } else {
                        this.updateHeaderUI();
                        this.updateProfileUI();
                    }
                });
            } catch (err) { console.error("Auth Listener Error:", err); }
        },

        async _checkGhostProfile(user) {
            if (!window.doc || !window.getDoc || !window.setDoc) return;

            // A. Update 'users' collection (Legal/Device Data)
            const userRef = window.doc(window.db, "users", user.uid);
            try {
                const snap = await window.getDoc(userRef);
                
                // Always update 'lastActive' even if profile exists
                const ghostData = {
                    uid: user.uid,
                    isAnonymous: user.isAnonymous,
                    lastActive: new Date().toISOString(),
                    nickname: user.isAnonymous ? "Ghost Guest" : (user.displayName || "Hero"),
                    deviceModel: navigator.userAgent, 
                    platform: navigator.platform,
                    screenRes: `${window.screen.width}x${window.screen.height}`
                };

                if (!snap.exists()) {
                    ghostData.joinedAt = new Date().toISOString(); // Only set join date once
                    console.log("👻 Creating New Ghost Profile...");
                }

                // Merge true ensures we don't overwrite existing fields like 'joinedAt' if they exist
                await window.setDoc(userRef, ghostData, { merge: true });

            } catch (e) { console.warn("Ghost profile check skipped:", e); }
        },

        // 4. DATA SAVING
        async saveGameResult(gameName, score, totalQuestions, extraStats = {}) {
            if (!this.state.uid) { console.warn("Save skipped: No User ID"); return; }

            try {
                const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                
                // Save to History Subcollection
                await addDoc(collection(window.db, "users", this.state.uid, "history"), {
                    game: gameName,
                    score: score,
                    total: totalQuestions,
                    xpEarned: this.state.xp,
                    timestamp: serverTimestamp(),
                    avgReactionTime: extraStats.avgTime || 0,
                    ghostClicks: extraStats.ghostClicks || 0,
                    deviceModel: navigator.userAgent,
                    difficulty: extraStats.difficulty || 'Normal'
                });
                console.log(`💾 Saved result for ${gameName}`);
                
                this.addXP(score * 10); 
            } catch (error) {
                console.error("Save Error:", error);
            }
        },

        // 5. DATA PERSISTENCE
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
            if (!window.doc || !window.getDoc) return;

            const uid = firebaseUser.uid;
            const ref = window.doc(window.db, "heroes", uid);

            let cloudData = null;
            try {
                const snap = await window.getDoc(ref);
                if (snap.exists()) cloudData = snap.data();
            } catch (e) {}

            if (cloudData) {
                this.state = {
                    ...this.state,
                    ...cloudData,
                    // Keep the highest values to prevent data loss on device switch
                    xp: Math.max(this.state.xp || 0, cloudData.xp || 0),
                    streak: Math.max(this.state.streak || 0, cloudData.streak || 0),
                    badges: [...new Set([...(cloudData.badges||[]), ...(this.state.badges||[])])]
                };
            }
            
            this._recalculateLevel(false); 
            this._saveLocal();
            
            // --- FIX: Force Cloud Update Immediately ---
            this._saveCloudSafe(); 

            this.updateHeaderUI();
            this.updateProfileUI();
        },

        async _saveCloudSafe() {
            if (!this.state.uid || !window.setDoc) return;
            
            try {
                // Dynamically import serverTimestamp for accuracy
                const { serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                
                const ref = window.doc(window.db, "heroes", this.state.uid);
                
                // We construct the payload manually to ensure timestamps are added
                const payload = {
                    ...this.state,
                    lastSynced: serverTimestamp(), // Takes server time
                    clientTime: new Date().toISOString() // Takes device time (good for checking timezones)
                };

                await window.setDoc(ref, payload, { merge: true });
            } catch (e) {
                console.error("Cloud Save Error:", e);
            }
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
                <div class="relative w-full max-w-md p-8 text-center text-white">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div class="relative z-10">
                        <div class="text-xs font-bold text-yellow-400 uppercase tracking-[0.5em] mb-2">Level Up!</div>
                        <div class="text-9xl font-black leading-none mb-4">${level}</div>
                        <div class="text-2xl font-bold text-cyan-400 uppercase tracking-widest">${rank}</div>
                        <button class="mt-8 bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition">CONTINUE</button>
                    </div>
                </div>
                <style>@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.3s ease-out; }</style>
            `;
            document.body.appendChild(overlay);
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
                this.showToast(`+${add} XP`, `Total XP: ${this.state.xp.toLocaleString()}`);
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
                    this.showToast("Achievement Unlocked", id);
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
                    "statStreak": s.streak || 0, "statBadges": s.badges?.length || 0,
                    "resScore": s.xp 
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

        showToast(title, msg) {
            try {
                const toast = document.createElement("div");
                toast.className = `fixed bottom-4 right-4 bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4 z-[9999] animate-bounce`;
                toast.innerHTML = `<div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-400"><i class="fas fa-star"></i></div><div><h4 class="font-bold text-white text-sm">${title}</h4><p class="text-xs text-slate-400">${msg}</p></div>`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 4000);
            } catch (e) {}
        },

        getUserSnapshot() { return { ...this.state }; }
    };

    // ------------------------------------------------------------
    // BACKWARD COMPATIBILITY & EXPORT
    // ------------------------------------------------------------
    Object.defineProperty(Engine, "xp", {
        get() { return Engine.state.xp || 0; },
        set(v) { Engine.addXP(Number(v) - Engine.state.xp); }
    });
    Object.defineProperty(Engine, "level", { get() { return Engine.state.rank; } });
    Object.defineProperty(Engine, "streak", { get() { return Engine.state.streak; }, set(v) { Engine.state.streak = Number(v); Engine._saveLocal(); } });
    
    Engine.save = function () { Engine._saveLocal(); Engine._saveCloudSafe(); };

    Engine.init();
})();
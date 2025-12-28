/* ============================================================
   QUIZREALM • GAME ENGINE (HYBRID V9 - LOGIC & IDENTITY)
   - Focus: Game Logic, XP, Levels, and Identity Popup
   - Relies on: 'ux-core.js' for Database Connection & Tech Logging
   ============================================================ */

(function () {
    // 1. CONFIGURATION
    const STORAGE_KEY = "QR_PROFILE";
    
    // Ranks (Every 10 levels)
    const RANK_TITLES = [
        { lvl: 1,  title: "The Drifter" }, { lvl: 10, title: "Neon Runner" },
        { lvl: 20, title: "Cyber Vanguard" }, { lvl: 30, title: "Data Hunter" },
        { lvl: 40, title: "Void Walker" }, { lvl: 50, title: "System Lord" },
        { lvl: 60, title: "Galaxy Sentinel" }, { lvl: 70, title: "Reality Bender" },
        { lvl: 80, title: "Time Weaver" }, { lvl: 90, title: "Cosmic Entity" },
        { lvl: 100, title: "The Singularity" }
    ];

    // Random Name Assets
    const NAME_ADJECTIVES = ["Neon", "Cyber", "Rogue", "Void", "Iron", "Shadow", "Crimson", "Electric", "Silent", "Rapid"];
    const NAME_NOUNS = ["Wolf", "Ghost", "Glitch", "Blade", "Viper", "Phantom", "Ronin", "Stalker", "Surfer", "Titan"];

    // 2. INTERNAL ENGINE STATE
    const Engine = {
        state: {
            uid: null, isAnonymous: false, nickname: null, avatarSeed: "Player",
            xp: 0, level: 1, rank: "The Drifter", badges: [], streak: 0,
            lastLogin: null, lastDailyDate: null, coins: 0
        },

        // 3. INITIALIZATION LOOP
        init() {
            this._loadLocal();
            this._recalculateLevel(false); 
            this._waitForFirebase(); // Waits for ux-core to load DB

            this.updateHeaderUI();
            this.updateProfileUI();
            this._updateSimpleUI(); 
            window.GameEngine = Engine;
        },

        _waitForFirebase() {
            // We wait until ux-core.js has finished setting up window.auth and window.db
            const check = setInterval(() => {
                if (window.auth && window.db) {
                    clearInterval(check);
                    console.log("✅ Engine Connected to Shared Firebase.");
                    this._attachAuthListener();
                }
            }, 100);
        },

        _attachAuthListener() {
            try {
                window.auth.onAuthStateChanged(async (firebaseUser) => {
                    if (firebaseUser) {
                        this.state.uid = firebaseUser.uid;
                        localStorage.setItem('qr_persistent_uid', firebaseUser.uid); 
                        this.state.isAnonymous = firebaseUser.isAnonymous;
                        
                        // If user has a Google Display Name, use it
                        if (!this.state.nickname && firebaseUser.displayName) {
                            this.state.nickname = firebaseUser.displayName;
                        }

                        // 1. Sync Game Stats (XP/Coins) from Heroes Collection
                        await this._syncWithCloud(firebaseUser);

                        // 2. Check Identity (Show Popup if needed)
                        this._enforceIdentityProtocol();
                        
                    } else {
                        // User signed out
                        this.updateHeaderUI();
                        this.updateProfileUI();
                    }
                });
            } catch (err) { console.error("Auth Listener Error:", err); }
        },

        // --------------------------------------------------------
        // 🆕 IDENTITY PROTOCOL (NICKNAME POPUP)
        // --------------------------------------------------------
        _enforceIdentityProtocol() {
            // If nickname is missing or default, show popup
            if (this.state.nickname && this.state.nickname !== "Ghost Guest" && this.state.nickname !== "Player") {
                return;
            }
            this._renderIdentityPopup();
        },

        _renderIdentityPopup() {
            if (document.getElementById('qr-identity-popup')) return;

            const popup = document.createElement('div');
            popup.id = 'qr-identity-popup';
            popup.className = "fixed inset-0 z-[20000] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in";
            
            popup.innerHTML = `
                <div class="relative w-full max-w-md bg-[#0f172a] border border-blue-500/30 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)] p-6 md:p-8 overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-black text-white font-header uppercase tracking-wider mb-2">Identify Yourself</h2>
                        <p class="text-slate-400 text-sm">Enter the Realm. Choose a callsign.</p>
                    </div>
                    <div class="space-y-4">
                        <div class="relative">
                            <input type="text" id="qr-nick-input" placeholder="Enter Nickname..." maxlength="15"
                                class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-bold tracking-wide focus:outline-none focus:border-blue-500 transition-colors uppercase">
                            <button id="qr-btn-random" class="absolute right-2 top-2 bottom-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-blue-400 font-bold uppercase transition"><i class="fas fa-dice"></i></button>
                        </div>
                        <button id="qr-btn-confirm" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">Enter Realm</button>
                    </div>
                    <div class="flex items-center gap-3 my-6"><div class="h-[1px] bg-white/10 flex-1"></div><span class="text-[10px] text-slate-500 font-bold uppercase">OR</span><div class="h-[1px] bg-white/10 flex-1"></div></div>
                    <button id="qr-btn-google" class="w-full py-3 rounded-xl bg-white text-black font-bold uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-slate-200 transition-colors">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5"> Sign In with Google
                    </button>
                </div>
            `;
            document.body.appendChild(popup);

            // 1. Random Name
            document.getElementById('qr-btn-random').onclick = () => {
                const adj = NAME_ADJECTIVES[Math.floor(Math.random() * NAME_ADJECTIVES.length)];
                const noun = NAME_NOUNS[Math.floor(Math.random() * NAME_NOUNS.length)];
                document.getElementById('qr-nick-input').value = `${adj}_${noun}_${Math.floor(Math.random() * 99)}`;
            };

            // 2. Confirm Guest Nickname
            document.getElementById('qr-btn-confirm').onclick = async () => {
                const input = document.getElementById('qr-nick-input');
                let name = input.value.trim();
                if (!name) return;
                if (name.length > 15) name = name.substring(0, 15);

                this.state.nickname = name;
                
                // SAVE TO USERS COLLECTION (Using global tools from UX-Core)
                if(window.setDoc && window.doc && window.db) {
                    try {
                        const userRef = window.doc(window.db, "users", this.state.uid);
                        // We only update the identity part to not mess up tech profile
                        await window.setDoc(userRef, {
                            identity: { 
                                nickname: name,
                                uid: this.state.uid,
                                is_anonymous: true
                            }
                        }, { merge: true });
                        console.log("✅ Nickname Saved to Users Collection");
                    } catch(e) { console.error("Nickname Save Error", e); }
                }

                await this._saveCloudSafe(); // Save to Heroes
                this.updateHeaderUI();
                this.updateProfileUI();
                popup.remove();
                this.showToast("Identity Confirmed", `Welcome, ${name}`);
            };

            // 3. Google Sign In
            document.getElementById('qr-btn-google').onclick = async () => {
                try {
                    const provider = new window.firebase.auth.GoogleAuthProvider();
                    await window.auth.signInWithPopup(provider);
                    popup.remove();
                } catch (e) {
                    console.error("Google Sign In Failed", e);
                    alert("Sign in failed. Please try again.");
                }
            };
        },

        // --------------------------------------------------------
        // DATA SAVING (GAME HISTORY)
        // --------------------------------------------------------
        async saveGameResult(gameName, score, totalQuestions, extraStats = {}) {
            if (!this.state.uid) return;

            try {
                // We dynamically import collection/addDoc because UX-Core doesn't expose them globally to window
                const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                
                // Save to 'users/{uid}/history'
                await addDoc(collection(window.db, "users", this.state.uid, "history"), {
                    game: gameName,
                    score: score,
                    total: totalQuestions,
                    xpEarned: this.state.xp,
                    timestamp: serverTimestamp(),
                    playerNickname: this.state.nickname || "Anonymous", 
                    avgReactionTime: extraStats.avgTime || 0,
                    ghostClicks: extraStats.ghostClicks || 0,
                    difficulty: extraStats.difficulty || 'Normal'
                });
                console.log(`💾 Saved result for ${gameName}`);
                
                this.addXP(score * 10); 
            } catch (error) { console.error("Save Error:", error); }
        },

        // --------------------------------------------------------
        // SYNC & STORAGE
        // --------------------------------------------------------
        _loadLocal() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) { try { this.state = { ...this.state, ...JSON.parse(raw) }; } catch (e) {} }
        },

        _saveLocal() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        },

        async _syncWithCloud(firebaseUser) {
            if (!window.doc || !window.getDoc) return;
            const ref = window.doc(window.db, "heroes", firebaseUser.uid);
            try {
                const snap = await window.getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    this.state = {
                        ...this.state,
                        ...data,
                        xp: Math.max(this.state.xp || 0, data.xp || 0),
                        streak: Math.max(this.state.streak || 0, data.streak || 0),
                        badges: [...new Set([...(data.badges||[]), ...(this.state.badges||[])])]
                    };
                    if (data.nickname) this.state.nickname = data.nickname;
                }
            } catch (e) {}
            
            this._recalculateLevel(false); 
            this._saveLocal();
            this._saveCloudSafe(); 
            this.updateHeaderUI();
            this.updateProfileUI();
        },

        async _saveCloudSafe() {
            if (!this.state.uid || !window.setDoc) return;
            try {
                const ref = window.doc(window.db, "heroes", this.state.uid);
                const payload = {
                    ...this.state,
                    nickname: this.state.nickname || "Anonymous",
                    lastSynced: window.serverTimestamp ? window.serverTimestamp() : new Date()
                };
                await window.setDoc(ref, payload, { merge: true });
            } catch (e) { console.error("Cloud Save Error:", e); }
        },

        // --------------------------------------------------------
        // LEVELING & XP
        // --------------------------------------------------------
        _getLevelFromXP(xp) { return Math.max(1, Math.floor(Math.sqrt(xp / 100))); },

        _getRankTitle(level) {
            let title = RANK_TITLES[0].title;
            for (let r of RANK_TITLES) if (level >= r.lvl) title = r.title;
            return title;
        },

        _recalculateLevel(animate = true) {
            const oldLevel = this.state.level;
            const newLevel = this._getLevelFromXP(this.state.xp);
            const newRank = this._getRankTitle(newLevel);
            this.state.level = newLevel;
            this.state.rank = newRank;
            if (animate && newLevel > oldLevel) this._triggerLevelUpAnimation(newLevel, newRank);
        },

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

        addXP(amount) {
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
        },

        unlockAchievement(id) {
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
        },

        completeDailyChallenge() {
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
        },

        // --------------------------------------------------------
        // UI HELPERS
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
            const lvlEl = document.getElementById("headerLevel"); if (lvlEl) lvlEl.textContent = this.state.level || 1;
            const xpEl = document.getElementById("headerXP"); if (xpEl) xpEl.textContent = this.state.xp || 0;
            const coinEl = document.getElementById("headerCoins"); if (coinEl) coinEl.textContent = (this.state.coins || 0).toLocaleString();
            const avatarEl = document.getElementById("headerAvatar"); if (avatarEl) avatarEl.src = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${this.state.avatarSeed}`;
        },

        updateProfileUI() {
            try {
                const s = this.state;
                const map = {
                    "profileLevel": s.level, "profileRank": s.rank, "profileXP": `${(s.xp || 0).toLocaleString()} XP`,
                    "profileName": s.nickname || "Ghost Guest", "statScore": (s.xp || 0).toLocaleString(),
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
            const toast = document.createElement("div");
            toast.className = `fixed bottom-4 right-4 bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4 z-[9999] animate-bounce`;
            toast.innerHTML = `<div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-400"><i class="fas fa-star"></i></div><div><h4 class="font-bold text-white text-sm">${title}</h4><p class="text-xs text-slate-400">${msg}</p></div>`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);
        },

        getUserSnapshot() { return { ...this.state }; }
    };

    // EXPORT
    Object.defineProperty(Engine, "xp", { get() { return Engine.state.xp || 0; }, set(v) { Engine.addXP(Number(v) - Engine.state.xp); } });
    Object.defineProperty(Engine, "level", { get() { return Engine.state.rank; } });
    Object.defineProperty(Engine, "streak", { get() { return Engine.state.streak; }, set(v) { Engine.state.streak = Number(v); Engine._saveLocal(); } });
    
    Engine.save = function () { Engine._saveLocal(); Engine._saveCloudSafe(); };
    Engine.init();
})();
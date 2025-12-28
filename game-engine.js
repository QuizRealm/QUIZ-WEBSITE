/* ============================================================
   QUIZREALM • GAME ENGINE (FAIL-SAFE V14)
   - Robustness: Handles Firestore Quota limits gracefully.
   - Logic: If Cloud fails, Game continues anyway.
   - Sync: Prioritizes LocalStorage for immediate UI feedback.
   ============================================================ */

(function () {
    const STORAGE_KEY = "QR_PROFILE";
    const CLOUD_SAVE_THROTTLE = 10000; // 10s delay between auto-saves

    const RANK_TITLES = [
        { lvl: 1,  title: "The Drifter" }, { lvl: 10, title: "Neon Runner" },
        { lvl: 20, title: "Cyber Vanguard" }, { lvl: 30, title: "Data Hunter" },
        { lvl: 40, title: "Void Walker" }, { lvl: 50, title: "System Lord" },
        { lvl: 60, title: "Galaxy Sentinel" }, { lvl: 70, title: "Reality Bender" },
        { lvl: 80, title: "Time Weaver" }, { lvl: 90, title: "Cosmic Entity" },
        { lvl: 100, title: "The Singularity" }
    ];

    const Engine = {
        state: {
            uid: null, isAnonymous: true, nickname: "Guest Hero", avatarSeed: "Player",
            xp: 0, level: 1, rank: "The Drifter", streak: 0, coins: 0
        },
        _lastSaveTime: 0,

        init() {
            console.log("🚀 Game Engine Initializing...");
            this._loadLocal(); // 1. Load Local Data First (Instant UI)
            this.updateHeaderUI(); 
            
            // 2. Wait for Firebase (Lazy Load)
            const check = setInterval(() => {
                if (window.auth && window.db) {
                    clearInterval(check);
                    this._attachAuthListener();
                }
            }, 500);

            window.GameEngine = this;
        },

        // --- AUTH LISTENER ---
        _attachAuthListener() {
            try {
                window.auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        this.state.uid = user.uid;
                        this.state.isAnonymous = user.isAnonymous;
                        // If cloud has data, sync it. If not, keep local.
                        await this._syncFromCloud(); 
                    }
                });
            } catch (e) { console.warn("Auth Listener Warning:", e); }
        },

        // --- CORE: SAVE GAME RESULTS (THE FIX) ---
        // This function NEVER throws an error, so your quiz NEVER gets stuck.
        async saveGameResult(gameName, score, total, extra = {}) {
            console.log(`📝 Saving Result: ${gameName} - Score: ${score}`);

            // 1. AWARD XP INSTANTLY (Local)
            const xpEarned = (Number(score) || 0) * 10;
            this.addXP(xpEarned);

            // 2. ATTEMPT CLOUD SAVE (Fail-Safe)
            if (this.state.uid && window.db) {
                try {
                    // Dynamic import to prevent crash if SDK missing
                    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                    
                    await addDoc(collection(window.db, "users", this.state.uid, "history"), {
                        game: gameName,
                        score: Number(score),
                        total: Number(total),
                        xpEarned: xpEarned,
                        timestamp: serverTimestamp(),
                        playerNickname: this.state.nickname,
                        difficulty: extra.difficulty || 'Normal'
                    });
                    console.log("✅ Cloud Save Success");
                } catch (err) {
                    // CRITICAL: If Quota Exceeded, we Log it but DO NOT STOP.
                    console.error("⚠️ Cloud Save Failed (Quota/Network):", err.message);
                    this.showToast("Offline Mode", "Result saved locally only.");
                }
            } else {
                console.log("ℹ️ Guest Mode: Result not saved to cloud history.");
            }

            return true; // Always return true so the quiz continues
        },

        // --- XP & LEVELING ---
        addXP(amount) {
            const val = Number(amount);
            if (!val || val <= 0) return;

            this.state.xp = (this.state.xp || 0) + val;
            this.state.coins = Math.floor(this.state.xp / 10);
            
            // Recalculate Level
            const oldLevel = this.state.level;
            const newLevel = Math.max(1, Math.floor(Math.sqrt(this.state.xp / 100)));
            
            this.state.level = newLevel;
            this.state.rank = this._getRankTitle(newLevel);

            this._saveLocal();
            this.updateHeaderUI();

            if (newLevel > oldLevel) {
                this._showLevelUpPopup(newLevel, this.state.rank);
            }
            
            // Attempt Cloud Sync (Silent)
            this._saveToCloud();
        },

        _getRankTitle(lvl) {
            let t = RANK_TITLES[0].title;
            for (let r of RANK_TITLES) if (lvl >= r.lvl) t = r.title;
            return t;
        },

        // --- DATA PERSISTENCE ---
        _loadLocal() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const data = JSON.parse(raw);
                    this.state = { ...this.state, ...data };
                }
            } catch (e) {}
        },

        _saveLocal() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
                // Dispatch event for other tabs/components
                window.dispatchEvent(new CustomEvent('userUpdate', { detail: this.state }));
            } catch (e) {}
        },

        async _syncFromCloud() {
            if (!this.state.uid || !window.db) return;
            try {
                const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                const ref = doc(window.db, "heroes", this.state.uid);
                const snap = await getDoc(ref);
                
                if (snap.exists()) {
                    const cloudData = snap.data();
                    // Merge: Take highest XP (prevents overwrite if playing on multiple devices)
                    this.state.xp = Math.max(this.state.xp, cloudData.xp || 0);
                    this.state.nickname = cloudData.nickname || this.state.nickname;
                    this.state.avatarSeed = cloudData.avatarSeed || this.state.avatarSeed;
                    this.addXP(0); // Recalc levels/coins based on new XP
                }
            } catch (e) { console.warn("Sync Read Error:", e); }
        },

        async _saveToCloud(force = false) {
            if (!this.state.uid || !window.db) return;
            
            const now = Date.now();
            if (!force && (now - this._lastSaveTime < CLOUD_SAVE_THROTTLE)) return;

            try {
                const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                await setDoc(doc(window.db, "heroes", this.state.uid), {
                    nickname: this.state.nickname,
                    xp: this.state.xp,
                    level: this.state.level,
                    coins: this.state.coins,
                    avatarSeed: this.state.avatarSeed,
                    lastSynced: serverTimestamp()
                }, { merge: true });
                this._lastSaveTime = now;
            } catch (e) { console.warn("Sync Write Error (Quota?):", e); }
        },

        // --- UI UTILS ---
        updateHeaderUI() {
            // Safe DOM updates
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            set("headerLevel", this.state.level);
            set("headerXP", this.state.xp);
            set("headerCoins", this.state.coins.toLocaleString());
            
            const img = document.getElementById("headerAvatar");
            if (img) img.src = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(this.state.avatarSeed)}`;
        },

        _showLevelUpPopup(level, rank) {
            const div = document.createElement("div");
            div.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur animate-fade-in cursor-pointer";
            div.innerHTML = `
                <div class="text-center animate-bounce">
                    <h2 class="text-yellow-400 font-bold text-xl mb-2 tracking-widest">LEVEL UP!</h2>
                    <div class="text-8xl font-black text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">${level}</div>
                    <div class="text-blue-400 font-bold text-2xl uppercase tracking-widest border-t border-blue-500/30 pt-4">${rank}</div>
                    <p class="text-slate-500 text-xs mt-8">Tap to continue</p>
                </div>
            `;
            div.onclick = () => div.remove();
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 4000);
        },

        showToast(title, msg) {
            const t = document.createElement("div");
            t.className = "fixed bottom-5 right-5 bg-slate-800 border border-slate-600 p-4 rounded-xl shadow-2xl z-[9999] flex items-center gap-3 animate-fade-in";
            t.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><i class="fas fa-info"></i></div>
                <div><div class="font-bold text-white text-xs">${title}</div><div class="text-slate-400 text-[10px]">${msg}</div></div>
            `;
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 3000);
        },

        getUserSnapshot() { return { ...this.state }; }
    };

    Engine.init();
})();
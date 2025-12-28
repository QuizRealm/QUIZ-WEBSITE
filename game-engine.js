/* ==========================================================================
   QUIZREALM • GAME ENGINE CORE (ENTERPRISE EDITION V16)
   --------------------------------------------------------------------------
   • Architecture: Modular State Management
   • Features: Hybrid Sync, XP Queue, Achievement System, Fail-Safe Logging
   • Security: Throttled Writes, Local Fallback
   ========================================================================== */

(function () {
    "use strict";

    // --- CONFIGURATION ---
    const CONFIG = {
        STORAGE_KEY: "QR_PROFILE",
        BACKUP_KEY: "QR_BACKUP_V1",
        CLOUD_SAVE_DELAY: 15000, // 15s Throttle (Aggressive but safe)
        DEBUG: true,
        VERSION: "16.0.0"
    };

    // --- CONSTANTS ---
    const RANK_SYSTEM = [
        { lvl: 1,  title: "The Drifter",        xp: 0 },
        { lvl: 5,  title: "Novice Scout",       xp: 2500 },
        { lvl: 10, title: "Neon Runner",        xp: 10000 },
        { lvl: 20, title: "Cyber Vanguard",     xp: 40000 },
        { lvl: 30, title: "Data Hunter",        xp: 90000 },
        { lvl: 40, title: "Void Walker",        xp: 160000 },
        { lvl: 50, title: "System Lord",        xp: 250000 },
        { lvl: 60, title: "Galaxy Sentinel",    xp: 360000 },
        { lvl: 70, title: "Reality Bender",     xp: 490000 },
        { lvl: 80, title: "Time Weaver",        xp: 640000 },
        { lvl: 90, title: "Cosmic Entity",      xp: 810000 },
        { lvl: 100, title: "The Singularity",   xp: 1000000 }
    ];

    const NAME_GEN = {
        adj: ["Neon", "Cyber", "Rogue", "Void", "Iron", "Shadow", "Crimson", "Electric", "Silent", "Rapid", "Solar", "Lunar"],
        noun: ["Wolf", "Ghost", "Glitch", "Blade", "Viper", "Phantom", "Ronin", "Stalker", "Surfer", "Titan", "Ranger", "Pilot"]
    };

    // --- STATE MANAGEMENT ---
    const State = {
        uid: null,
        isAnonymous: true,
        nickname: "Guest Hero",
        avatarSeed: "Player",
        xp: 0,
        level: 1,
        rank: "The Drifter",
        streak: 0,
        coins: 0,
        badges: [],
        lastLogin: Date.now(),
        settings: { sound: true, haptics: true }
    };

    // --- INTERNAL VARS ---
    let _lastCloudSave = 0;
    let _isSaving = false;
    let _pendingXP = 0; // Queue for XP if network fails

    // ==========================================================================
    // MODULE: CORE ENGINE
    // ==========================================================================
    const Engine = {
        
        init() {
            this.log("🚀 Initializing Engine v" + CONFIG.VERSION);
            
            // 1. Load Local Data Immediately
            LocalManager.load();
            this._recalculateLevel(false);
            
            // 2. Setup Event Listeners
            this._setupWindowListeners();
            
            // 3. Initialize UI
            this.updateHeaderUI();
            
            // 4. Connect to Cloud (Lazy Load)
            this._waitForFirebase();

            // 5. Expose Global API
            window.GameEngine = this;
        },

        log(msg, data = "") {
            if (CONFIG.DEBUG) console.log(`[QR-Engine] ${msg}`, data);
        },

        // --- AUTHENTICATION HANDLER ---
        _waitForFirebase() {
            let attempts = 0;
            const check = setInterval(() => {
                attempts++;
                if (window.auth && window.db) {
                    clearInterval(check);
                    this.log("✅ Firebase SDK Detected.");
                    this._attachAuthListener();
                } else if (attempts > 50) {
                    clearInterval(check);
                    console.warn("[QR-Engine] Firebase unavailable. Running in OFFLINE MODE.");
                }
            }, 200);
        },

        _attachAuthListener() {
            try {
                window.auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        this.log("👤 User Authenticated:", user.uid);
                        State.uid = user.uid;
                        State.isAnonymous = user.isAnonymous;
                        
                        // Sync Phase
                        await CloudManager.syncDown();
                        
                        // If user is brand new (no nickname), set one
                        if (!State.nickname || State.nickname === "Guest Hero") {
                            if (user.displayName) State.nickname = user.displayName;
                            else State.nickname = Utils.generateName();
                            CloudManager.syncUp(true); // Force save init data
                        }
                    } else {
                        this.log("👻 Guest Mode Active");
                        State.uid = null;
                        State.isAnonymous = true;
                    }
                    this.updateHeaderUI();
                });
            } catch (e) { console.error("Auth Listener Failed:", e); }
        },

        // --- XP & LEVELING SYSTEM ---
        addXP(amount) {
            const val = Number(amount);
            if (!val || val <= 0) return;

            const oldLevel = State.level;
            
            // Update State
            State.xp += val;
            State.coins = Math.floor(State.xp / 10);
            
            this.log(`✨ XP Gained: +${val}. Total: ${State.xp}`);

            // Level Calc
            this._recalculateLevel(true);

            // Save Pipeline
            LocalManager.save();
            CloudManager.queueSave();
            
            // UI Feedback
            this.updateHeaderUI();
            UIManager.showToast(`+${val} XP`, `Total: ${State.xp}`);
        },

        _recalculateLevel(animate) {
            const oldLevel = State.level;
            
            // Formula: Level = Sqrt(XP / 100)
            // Example: 100xp = Lvl 1, 400xp = Lvl 2, 10000xp = Lvl 10
            const rawLevel = Math.floor(Math.sqrt(State.xp / 100));
            const newLevel = Math.max(1, rawLevel);
            
            State.level = newLevel;
            State.rank = this._getRankTitle(newLevel);

            if (animate && newLevel > oldLevel) {
                this.log("🎉 LEVEL UP!");
                UIManager.showLevelUp(newLevel, State.rank);
                CloudManager.syncUp(true); // Force save on level up
            }
        },

        _getRankTitle(lvl) {
            let currentTitle = RANK_SYSTEM[0].title;
            for (const rank of RANK_SYSTEM) {
                if (lvl >= rank.lvl) currentTitle = rank.title;
            }
            return currentTitle;
        },

        // --- ACHIEVEMENT SYSTEM ---
        unlockAchievement(badgeId) {
            if (!badgeId) return;
            if (!State.badges) State.badges = [];

            // Check duplicate
            if (State.badges.includes(badgeId)) {
                this.log("🏆 Badge already unlocked:", badgeId);
                return;
            }

            // Unlock
            State.badges.push(badgeId);
            this.log("🏆 NEW BADGE:", badgeId);
            
            // Reward
            this.addXP(250); 
            
            // Save & Notify
            LocalManager.save();
            CloudManager.syncUp(true);
            UIManager.showToast("Achievement Unlocked!", badgeId.replace(/_/g, " ").toUpperCase());
        },

        // --- GAME RESULT HANDLER (CRITICAL) ---
        async saveGameResult(gameName, score, total, extra = {}) {
            this.log(`📝 Saving Result: ${gameName} [${score}/${total}]`);

            // 1. Instant Gratification (Local XP)
            const xpReward = (Number(score) || 0) * 10;
            if (xpReward > 0) this.addXP(xpReward);

            // 2. Cloud History (Fire & Forget Logic)
            if (State.uid && window.db) {
                try {
                    // Dynamic import to prevent crash if network is flaky
                    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                    
                    const historyPayload = {
                        game: gameName,
                        score: Number(score),
                        total: Number(total),
                        xpEarned: xpReward,
                        timestamp: serverTimestamp(),
                        playerNickname: State.nickname,
                        difficulty: extra.difficulty || 'Normal',
                        platform: navigator.platform || 'Web'
                    };

                    // We do NOT await this heavily to prevent UI blocking
                    addDoc(collection(window.db, "users", State.uid, "history"), historyPayload)
                        .then(() => this.log("✅ History Saved to Cloud"))
                        .catch(err => this.log("⚠️ History Save Failed (Quota?):", err.message));
                        
                } catch (err) {
                    console.error("Cloud SDK Error:", err);
                }
            }

            return true; // Always return true to let game continue
        },

        // --- UI BINDINGS ---
        updateHeaderUI() {
            // Helper to safe-set text
            const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
            
            set("headerLevel", State.level);
            set("headerXP", State.xp);
            set("headerCoins", State.coins.toLocaleString());
            
            const img = document.getElementById("headerAvatar");
            if(img) img.src = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(State.avatarSeed)}`;
        },

        _setupWindowListeners() {
            // Listen for cross-tab updates
            window.addEventListener('storage', (e) => {
                if (e.key === CONFIG.STORAGE_KEY) {
                    this.log("🔄 Detected storage change from another tab. Reloading...");
                    LocalManager.load();
                    this.updateHeaderUI();
                }
            });
            
            // Listen for custom events
            window.addEventListener('userUpdate', () => {
                LocalManager.load();
                this.updateHeaderUI();
            });
        },

        // Public Accessor
        getUserSnapshot() { return { ...State }; }
    };

    // ==========================================================================
    // MODULE: LOCAL MANAGER (Persistence)
    // ==========================================================================
    const LocalManager = {
        save() {
            try {
                const json = JSON.stringify(State);
                localStorage.setItem(CONFIG.STORAGE_KEY, json);
                // Backup for safety
                if (Math.random() > 0.8) localStorage.setItem(CONFIG.BACKUP_KEY, json); 
            } catch (e) { console.error("Local Save Error:", e); }
        },

        load() {
            try {
                const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (raw) {
                    const data = JSON.parse(raw);
                    // Deep merge to ensure no missing keys
                    Object.assign(State, data);
                }
            } catch (e) {
                console.warn("Corrupt local data, resetting state.");
                localStorage.removeItem(CONFIG.STORAGE_KEY);
            }
        },
        
        reset() {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            localStorage.removeItem(CONFIG.BACKUP_KEY);
        }
    };

    // ==========================================================================
    // MODULE: CLOUD MANAGER (Firebase)
    // ==========================================================================
    const CloudManager = {
        
        async syncDown() {
            if (!State.uid || !window.db) return;
            
            try {
                const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                const ref = doc(window.db, "heroes", State.uid);
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    const cloudData = snap.data();
                    Engine.log("☁️ Cloud Data Received", cloudData);
                    
                    // SMART MERGE STRATEGY
                    // 1. Take MAX of XP (prevents progress loss)
                    State.xp = Math.max(State.xp, cloudData.xp || 0);
                    State.coins = Math.max(State.coins, cloudData.coins || 0);
                    
                    // 2. Take Cloud Strings if valid
                    if (cloudData.nickname) State.nickname = cloudData.nickname;
                    if (cloudData.avatarSeed) State.avatarSeed = cloudData.avatarSeed;
                    
                    // 3. Merge Arrays (Badges)
                    if (cloudData.badges && Array.isArray(cloudData.badges)) {
                        const merged = new Set([...State.badges, ...cloudData.badges]);
                        State.badges = Array.from(merged);
                    }

                    LocalManager.save(); // Update local with new cloud data
                    Engine._recalculateLevel(false);
                }
            } catch (e) {
                console.warn("Cloud Sync Down Failed:", e);
            }
        },

        queueSave() {
            const now = Date.now();
            if (now - _lastCloudSave < CONFIG.CLOUD_SAVE_DELAY) {
                // Too soon, skip unless critical. Data is safe in LocalStorage.
                return;
            }
            this.syncUp(false);
        },

        async syncUp(force) {
            if (!State.uid || !window.db) return;
            if (_isSaving) return;

            _isSaving = true;
            
            try {
                const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                const ref = doc(window.db, "heroes", State.uid);
                
                const payload = {
                    nickname: State.nickname,
                    avatarSeed: State.avatarSeed,
                    xp: State.xp,
                    level: State.level,
                    rank: State.rank,
                    coins: State.coins,
                    badges: State.badges,
                    lastSynced: serverTimestamp(),
                    clientVersion: CONFIG.VERSION
                };

                await setDoc(ref, payload, { merge: true });
                
                _lastCloudSave = Date.now();
                Engine.log("☁️ Cloud Save Complete");
                
            } catch (e) {
                console.error("Cloud Save Failed:", e);
                // Fail silently, user has local data
            } finally {
                _isSaving = false;
            }
        }
    };

    // ==========================================================================
    // MODULE: UI MANAGER (Visuals)
    // ==========================================================================
    const UIManager = {
        showToast(title, msg) {
            const id = 'toast-' + Date.now();
            const div = document.createElement("div");
            div.id = id;
            div.className = "fixed bottom-5 right-5 z-[9999] bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce";
            div.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <i class="fas fa-bell"></i>
                </div>
                <div>
                    <h4 class="font-bold text-white text-xs uppercase tracking-wide">${title}</h4>
                    <p class="text-xs text-slate-400 mt-0.5">${msg}</p>
                </div>
            `;
            document.body.appendChild(div);
            
            // Cleanup
            setTimeout(() => {
                const el = document.getElementById(id);
                if(el) {
                    el.style.opacity = '0';
                    setTimeout(() => el.remove(), 500);
                }
            }, 3000);
        },

        showLevelUp(level, rank) {
            const overlay = document.createElement('div');
            overlay.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in cursor-pointer";
            overlay.onclick = () => overlay.remove();
            
            overlay.innerHTML = `
                <div class="text-center animate-bounce">
                    <h2 class="text-yellow-400 font-bold text-xl mb-4 tracking-[0.3em] uppercase">Level Up!</h2>
                    <div class="relative inline-block">
                        <div class="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                        <div class="text-9xl font-black text-white relative z-10 drop-shadow-2xl">${level}</div>
                    </div>
                    <div class="mt-6">
                        <div class="text-slate-500 text-xs uppercase tracking-widest mb-1">New Rank Unlocked</div>
                        <div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 uppercase tracking-widest border-t border-white/10 pt-2">${rank}</div>
                    </div>
                    <p class="text-slate-600 text-[10px] mt-12 animate-pulse">Tap anywhere to continue</p>
                </div>
            `;
            document.body.appendChild(overlay);
            
            // Audio Effect (Optional)
            try {
                const audio = new Audio('assets/levelup.mp3'); // Ensure this file exists or remove this block
                audio.volume = 0.5;
                audio.play().catch(() => {});
            } catch(e) {}
        }
    };

    // ==========================================================================
    // MODULE: UTILITIES
    // ==========================================================================
    const Utils = {
        generateName() {
            const a = NAME_GEN.adj[Math.floor(Math.random() * NAME_GEN.adj.length)];
            const n = NAME_GEN.noun[Math.floor(Math.random() * NAME_GEN.noun.length)];
            const num = Math.floor(Math.random() * 999);
            return `${a} ${n} ${num}`;
        }
    };

    // --- BOOTSTRAP ---
    Engine.init();

})();
/* ==========================================================================
   QUIZREALM • GAME ENGINE CORE (ENTERPRISE V16.1)
   --------------------------------------------------------------------------
   • Fix: Restored "Identity Popup" for new players.
   • Architecture: Modular State Management (Auth, Cloud, Local, UI).
   • Stability: Handles network failures and quotas gracefully.
   ========================================================================== */

(function () {
    "use strict";

    // --- CONFIGURATION ---
    const CONFIG = {
        STORAGE_KEY: "QR_PROFILE",
        CLOUD_SAVE_DELAY: 15000, 
        DEBUG: true,
        VERSION: "16.1.0"
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
        lastLogin: Date.now()
    };

    let _lastCloudSave = 0;
    let _isSaving = false;

    // ==========================================================================
    // MODULE: CORE ENGINE
    // ==========================================================================
    const Engine = {
        
        init() {
            this.log("🚀 Initializing Engine v" + CONFIG.VERSION);
            
            // 1. Load Local Data
            LocalManager.load();
            this._recalculateLevel(false);
            
            // 2. Check Identity (Fix: Show Popup if default name)
            if (!State.nickname || State.nickname === "Guest Hero") {
                UIManager.showIdentityModal();
            }

            // 3. Setup Listeners
            this._setupWindowListeners();
            
            // 4. Initialize UI
            this.updateHeaderUI();
            
            // 5. Connect to Cloud
            this._waitForFirebase();

            window.GameEngine = this;
        },

        log(msg, data = "") {
            if (CONFIG.DEBUG) console.log(`[QR-Engine] ${msg}`, data);
        },

        // --- AUTH ---
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
                }
            }, 200);
        },

        _attachAuthListener() {
            try {
                window.auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        State.uid = user.uid;
                        State.isAnonymous = user.isAnonymous;
                        await CloudManager.syncDown();
                    } else {
                        State.uid = null;
                        State.isAnonymous = true;
                    }
                    this.updateHeaderUI();
                });
            } catch (e) { console.error("Auth Listener Failed:", e); }
        },

        // --- XP & LEVELING ---
        addXP(amount) {
            const val = Number(amount);
            if (!val || val <= 0) return;

            const oldLevel = State.level;
            State.xp += val;
            State.coins = Math.floor(State.xp / 10);
            
            this.log(`✨ XP Gained: +${val}. Total: ${State.xp}`);
            this._recalculateLevel(true);

            LocalManager.save();
            CloudManager.queueSave();
            this.updateHeaderUI();
            UIManager.showToast(`+${val} XP`, `Total: ${State.xp}`);
        },

        _recalculateLevel(animate) {
            const oldLevel = State.level;
            const rawLevel = Math.floor(Math.sqrt(State.xp / 100));
            const newLevel = Math.max(1, rawLevel);
            
            State.level = newLevel;
            State.rank = this._getRankTitle(newLevel);

            if (animate && newLevel > oldLevel) {
                UIManager.showLevelUp(newLevel, State.rank);
                CloudManager.syncUp(true); 
            }
        },

        _getRankTitle(lvl) {
            let currentTitle = RANK_SYSTEM[0].title;
            for (const rank of RANK_SYSTEM) {
                if (lvl >= rank.lvl) currentTitle = rank.title;
            }
            return currentTitle;
        },

        // --- ACHIEVEMENTS ---
        unlockAchievement(badgeId) {
            if (!badgeId) return;
            if (!State.badges) State.badges = [];

            if (State.badges.includes(badgeId)) return;

            State.badges.push(badgeId);
            this.addXP(250); 
            
            LocalManager.save();
            CloudManager.syncUp(true);
            UIManager.showToast("Achievement Unlocked!", badgeId.replace(/_/g, " ").toUpperCase());
        },

        // --- GAME RESULTS ---
        async saveGameResult(gameName, score, total, extra = {}) {
            this.log(`📝 Saving Result: ${gameName} [${score}/${total}]`);

            const xpReward = (Number(score) || 0) * 10;
            if (xpReward > 0) this.addXP(xpReward);

            if (State.uid && window.db) {
                try {
                    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                    
                    await addDoc(collection(window.db, "users", State.uid, "history"), {
                        game: gameName,
                        score: Number(score),
                        total: Number(total),
                        xpEarned: xpReward,
                        timestamp: serverTimestamp(),
                        playerNickname: State.nickname,
                        difficulty: extra.difficulty || 'Normal'
                    });
                } catch (err) {
                    console.error("Cloud Save Warning:", err);
                }
            }
            return true;
        },

        updateHeaderUI() {
            const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
            set("headerLevel", State.level);
            set("headerXP", State.xp);
            set("headerCoins", State.coins.toLocaleString());
            const img = document.getElementById("headerAvatar");
            if(img) img.src = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(State.avatarSeed)}`;
        },

        _setupWindowListeners() {
            window.addEventListener('storage', (e) => {
                if (e.key === CONFIG.STORAGE_KEY) {
                    LocalManager.load();
                    this.updateHeaderUI();
                }
            });
            window.addEventListener('userUpdate', () => {
                LocalManager.load();
                this.updateHeaderUI();
            });
        },

        getUserSnapshot() { return { ...State }; }
    };

    // ==========================================================================
    // MODULE: LOCAL MANAGER
    // ==========================================================================
    const LocalManager = {
        save() {
            try {
                const json = JSON.stringify(State);
                localStorage.setItem(CONFIG.STORAGE_KEY, json);
            } catch (e) {}
        },
        load() {
            try {
                const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (raw) Object.assign(State, JSON.parse(raw));
            } catch (e) {}
        }
    };

    // ==========================================================================
    // MODULE: CLOUD MANAGER
    // ==========================================================================
    const CloudManager = {
        async syncDown() {
            if (!State.uid || !window.db) return;
            try {
                const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                const snap = await getDoc(doc(window.db, "heroes", State.uid));

                if (snap.exists()) {
                    const cloudData = snap.data();
                    State.xp = Math.max(State.xp, cloudData.xp || 0);
                    State.coins = Math.max(State.coins, cloudData.coins || 0);
                    
                    if (cloudData.nickname) State.nickname = cloudData.nickname;
                    if (cloudData.avatarSeed) State.avatarSeed = cloudData.avatarSeed;
                    
                    if (cloudData.badges) {
                        State.badges = Array.from(new Set([...State.badges, ...cloudData.badges]));
                    }

                    LocalManager.save();
                    Engine._recalculateLevel(false);
                }
            } catch (e) {}
        },

        queueSave() {
            const now = Date.now();
            if (now - _lastCloudSave < CONFIG.CLOUD_SAVE_DELAY) return;
            this.syncUp(false);
        },

        async syncUp(force) {
            if (!State.uid || !window.db || _isSaving) return;
            _isSaving = true;
            
            try {
                const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                await setDoc(doc(window.db, "heroes", State.uid), {
                    nickname: State.nickname,
                    avatarSeed: State.avatarSeed,
                    xp: State.xp,
                    level: State.level,
                    rank: State.rank,
                    coins: State.coins,
                    badges: State.badges,
                    lastSynced: serverTimestamp()
                }, { merge: true });
                _lastCloudSave = Date.now();
            } catch (e) {} finally { _isSaving = false; }
        }
    };

    // ==========================================================================
    // MODULE: UI MANAGER (POPUP RESTORED)
    // ==========================================================================
    const UIManager = {
        showIdentityModal() {
            if (document.getElementById('qr-identity-popup')) return;
            
            const popup = document.createElement('div');
            popup.id = 'qr-identity-popup';
            popup.className = "fixed inset-0 z-[20000] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in";
            popup.innerHTML = `
                <div class="relative w-full max-w-md bg-[#0f172a] border border-blue-500/30 rounded-2xl shadow-2xl p-8 m-4">
                    <h2 class="text-2xl font-black text-white text-center mb-2">IDENTIFY YOURSELF</h2>
                    <p class="text-slate-400 text-sm text-center mb-6">Enter a callsign to track your stats.</p>
                    <div class="space-y-4">
                        <div class="relative">
                            <input type="text" id="qr-nick-input" placeholder="Nickname..." maxlength="15"
                                class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-bold uppercase focus:border-blue-500 outline-none">
                            <button id="qr-btn-random" class="absolute right-2 top-2 bottom-2 px-3 bg-white/5 rounded text-xs text-blue-400 font-bold hover:bg-white/10">RND</button>
                        </div>
                        <button id="qr-btn-confirm" class="w-full py-3 rounded-xl bg-blue-600 text-white font-bold uppercase shadow-lg hover:bg-blue-500 transition">Confirm Identity</button>
                    </div>
                    <div class="my-4 text-center">
                        <button id="qr-btn-google" class="text-xs text-slate-400 underline hover:text-white transition">Or Sign In with Google</button>
                    </div>
                </div>`;
            document.body.appendChild(popup);

            // 1. Random Name Logic
            const input = document.getElementById('qr-nick-input');
            input.value = Utils.generateName(); // Pre-fill with random name

            document.getElementById('qr-btn-random').onclick = () => {
                input.value = Utils.generateName();
            };

            // 2. Confirm Logic
            document.getElementById('qr-btn-confirm').onclick = () => {
                const name = input.value.trim() || "Ghost_Agent";
                State.nickname = name.substring(0, 15);
                LocalManager.save();
                CloudManager.syncUp(true);
                Engine.updateHeaderUI();
                
                // Also update profile UI if on profile page
                const profileName = document.getElementById('profileName');
                if(profileName) profileName.textContent = State.nickname;

                popup.remove();
            };

            // 3. Google Login Logic (Dynamic Import Fix)
            document.getElementById('qr-btn-google').onclick = async () => {
                try {
                    const { signInWithPopup, GoogleAuthProvider } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
                    const provider = new GoogleAuthProvider();
                    await signInWithPopup(window.auth, provider);
                    popup.remove();
                } catch (e) { alert("Login failed: " + e.message); }
            };
        },

        showToast(title, msg) {
            const div = document.createElement("div");
            div.className = "fixed bottom-5 right-5 z-[9999] bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce";
            div.innerHTML = `<div class="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400"><i class="fas fa-bell"></i></div><div><h4 class="font-bold text-white text-xs uppercase">${title}</h4><p class="text-xs text-slate-400">${msg}</p></div>`;
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 3000);
        },

        showLevelUp(level, rank) {
            const div = document.createElement("div");
            div.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in cursor-pointer";
            div.onclick = () => div.remove();
            div.innerHTML = `<div class="text-center animate-bounce"><h2 class="text-yellow-400 font-bold text-xl mb-4 tracking-[0.3em] uppercase">Level Up!</h2><div class="text-9xl font-black text-white relative z-10 drop-shadow-2xl">${level}</div><div class="mt-6"><div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 uppercase tracking-widest border-t border-white/10 pt-2">${rank}</div></div></div>`;
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 4000);
        }
    };

    const Utils = {
        generateName() {
            const a = NAME_GEN.adj[Math.floor(Math.random() * NAME_GEN.adj.length)];
            const n = NAME_GEN.noun[Math.floor(Math.random() * NAME_GEN.noun.length)];
            return `${a} ${n} ${Math.floor(Math.random() * 999)}`;
        }
    };

    Engine.init();
})();
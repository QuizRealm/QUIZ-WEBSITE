/* ============================================================
   QUIZREALM • GAME ENGINE (HYBRID V13 - SYNC FIX)
   - Feature: Nickname updates sync instantly between Profile/Game
   ============================================================ */

(function () {
    const STORAGE_KEY = "QR_PROFILE"; // The ONE place data lives
    const CLOUD_SAVE_DELAY = 30000;
    
    // ... (Keep your RANK_TITLES and NAME arrays here) ...
    const RANK_TITLES = [
        { lvl: 1,  title: "The Drifter" }, { lvl: 10, title: "Neon Runner" },
        { lvl: 20, title: "Cyber Vanguard" }, { lvl: 30, title: "Data Hunter" },
        { lvl: 40, title: "Void Walker" }, { lvl: 50, title: "System Lord" },
        { lvl: 60, title: "Galaxy Sentinel" }, { lvl: 70, title: "Reality Bender" },
        { lvl: 80, title: "Time Weaver" }, { lvl: 90, title: "Cosmic Entity" },
        { lvl: 100, title: "The Singularity" }
    ];

    const NAME_ADJECTIVES = ["Neon", "Cyber", "Rogue", "Void", "Iron", "Shadow", "Crimson", "Electric", "Silent", "Rapid"];
    const NAME_NOUNS = ["Wolf", "Ghost", "Glitch", "Blade", "Viper", "Phantom", "Ronin", "Stalker", "Surfer", "Titan"];

    const Engine = {
        state: {
            uid: null, isAnonymous: false, nickname: null, avatarSeed: "Player",
            xp: 0, level: 1, rank: "The Drifter", badges: [], streak: 0,
            lastLogin: null, coins: 0
        },
        _lastCloudSave: 0,

        init() {
            this._loadLocal(); // Load data first
            
            // Check if URL has a nickname update (from Profile page redirect)
            this._checkForExternalUpdates();

            this._recalculateLevel(false); 
            this.updateHeaderUI();
            this._waitForFirebase();
            window.GameEngine = this;
        },

        _checkForExternalUpdates() {
            // Listen for updates from Profile Page
            window.addEventListener('storage', (e) => {
                if (e.key === STORAGE_KEY) {
                    this._loadLocal();
                    this.updateHeaderUI();
                }
            });
        },

        _waitForFirebase() {
            const check = setInterval(() => {
                if (window.auth && window.db) {
                    clearInterval(check);
                    this._attachAuthListener();
                }
            }, 100);
        },

        _attachAuthListener() {
            try {
                window.auth.onAuthStateChanged(async (firebaseUser) => {
                    if (firebaseUser) {
                        this.state.uid = firebaseUser.uid;
                        this.state.isAnonymous = firebaseUser.isAnonymous;
                        if (!this.state.nickname && firebaseUser.displayName) {
                            this.state.nickname = firebaseUser.displayName;
                        }
                        await this._syncWithCloud(firebaseUser);
                        this._enforceIdentityProtocol();
                    }
                });
            } catch (err) {}
        },

        _enforceIdentityProtocol() {
            // If nickname is missing or default, show popup
            if (this.state.nickname && this.state.nickname !== "Ghost Guest" && this.state.nickname !== "Player") return;
            // Only show if user has actually played (XP > 0) or is brand new
            this._renderIdentityPopup();
        },

        _renderIdentityPopup() {
            if (document.getElementById('qr-identity-popup')) return;
            // ... (Keep your existing HTML for the popup here) ...
            const popup = document.createElement('div');
            popup.id = 'qr-identity-popup';
            popup.className = "fixed inset-0 z-[20000] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in";
            popup.innerHTML = `
                <div class="relative w-full max-w-md bg-[#0f172a] border border-blue-500/30 rounded-2xl shadow-2xl p-8">
                    <h2 class="text-2xl font-black text-white text-center mb-2">IDENTIFY YOURSELF</h2>
                    <p class="text-slate-400 text-sm text-center mb-6">Enter a callsign.</p>
                    <div class="space-y-4">
                        <div class="relative">
                            <input type="text" id="qr-nick-input" placeholder="Nickname..." maxlength="15"
                                class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-bold uppercase">
                            <button id="qr-btn-random" class="absolute right-2 top-2 bottom-2 px-3 bg-white/5 rounded text-xs text-blue-400 font-bold">RND</button>
                        </div>
                        <button id="qr-btn-confirm" class="w-full py-3 rounded-xl bg-blue-600 text-white font-bold uppercase shadow-lg hover:bg-blue-500 transition">Confirm</button>
                    </div>
                    <div class="my-4 text-center"><button id="qr-btn-google" class="text-xs text-slate-400 underline">Or Sign In with Google</button></div>
                </div>`;
            document.body.appendChild(popup);

            // Random Name Button
            document.getElementById('qr-btn-random').onclick = () => {
                const adj = NAME_ADJECTIVES[Math.floor(Math.random() * NAME_ADJECTIVES.length)];
                const noun = NAME_NOUNS[Math.floor(Math.random() * NAME_NOUNS.length)];
                document.getElementById('qr-nick-input').value = `${adj}_${noun}_${Math.floor(Math.random() * 99)}`;
            };

            // Confirm Button
            document.getElementById('qr-btn-confirm').onclick = async () => {
                const name = document.getElementById('qr-nick-input').value.trim() || "Ghost_Agent";
                this.state.nickname = name.substring(0, 15);
                
                // 1. Save to Local
                this._saveLocal(); 

                // 2. Save to Cloud (if tools exist)
                if(window.setDoc && window.doc && window.db) {
                    try {
                        await window.setDoc(window.doc(window.db, "users", this.state.uid), {
                            identity: { nickname: name, is_anonymous: true }
                        }, { merge: true });
                    } catch(e) {}
                }
                
                await this._saveCloudSafe(true); 
                this.updateHeaderUI();
                popup.remove();
            };

            // Google Button
            document.getElementById('qr-btn-google').onclick = async () => {
                try {
                    const provider = new window.firebase.auth.GoogleAuthProvider();
                    await window.auth.signInWithPopup(provider);
                    popup.remove();
                } catch (e) { alert("Login failed"); }
            };
        },

        // --- CORE SAVING LOGIC ---
        _loadLocal() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                try { 
                    const data = JSON.parse(raw);
                    // Merge local data into state
                    this.state = { ...this.state, ...data };
                } catch (e) {}
            }
        },

        _saveLocal() {
            // This is the CRITICAL fix: We save everything to QR_PROFILE
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            
            // Dispatch event so Profile/Header knows data changed
            window.dispatchEvent(new CustomEvent('userUpdate', { detail: this.state }));
        },

        // ... (Keep existing addXP, syncWithCloud, and helper functions) ...
        addXP(amount) {
            const add = Number(amount) || 0;
            if (add <= 0) return;
            this.state.xp += add;
            this.state.coins = Math.floor(this.state.xp / 10);
            this._recalculateLevel(true);
            this._saveLocal();
            this._saveCloudSafe(false);
            this.updateHeaderUI();
        },

        async _syncWithCloud(firebaseUser) {
            if (!window.doc || !window.getDoc) return;
            const ref = window.doc(window.db, "heroes", firebaseUser.uid);
            try {
                const snap = await window.getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    this.state = { ...this.state, ...data, xp: Math.max(this.state.xp, data.xp || 0) };
                    // If cloud has a nickname, prefer it
                    if (data.nickname) this.state.nickname = data.nickname;
                }
            } catch (e) {}
            this._recalculateLevel(false);
            this._saveLocal();
            this.updateHeaderUI();
        },

        async _saveCloudSafe(force = false) {
            if (!this.state.uid || !window.setDoc) return;
            const now = Date.now();
            if (!force && (now - this._lastCloudSave < CLOUD_SAVE_DELAY)) return;
            try {
                const ref = window.doc(window.db, "heroes", this.state.uid);
                await window.setDoc(ref, { 
                    ...this.state, 
                    nickname: this.state.nickname || "Anonymous",
                    lastSynced: new Date()
                }, { merge: true });
                this._lastCloudSave = now;
            } catch (e) {}
        },

        _getLevelFromXP(xp) { return Math.max(1, Math.floor(Math.sqrt(xp / 100))); },
        _getRankTitle(lvl) { 
            let t = RANK_TITLES[0].title;
            for (let r of RANK_TITLES) if (lvl >= r.lvl) t = r.title; 
            return t; 
        },
        _recalculateLevel(anim) {
            const oldLevel = this.state.level;
            const newLvl = this._getLevelFromXP(this.state.xp);
            this.state.level = newLvl;
            this.state.rank = this._getRankTitle(newLvl);
            if (anim && newLvl > oldLevel) this._triggerLevelUpAnimation(newLvl, this.state.rank);
        },
        _triggerLevelUpAnimation(level, rank) {
             const overlay = document.createElement('div');
            overlay.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in cursor-pointer";
            overlay.onclick = () => overlay.remove();
            overlay.innerHTML = `<div class="text-center text-white"><div class="text-9xl font-black">${level}</div><div class="text-2xl font-bold uppercase">${rank}</div></div>`;
            document.body.appendChild(overlay);
            setTimeout(() => overlay.remove(), 3000);
        },
        updateHeaderUI() {
            const el = document.getElementById("headerLevel"); if (el) el.textContent = this.state.level;
            const xp = document.getElementById("headerXP"); if (xp) xp.textContent = this.state.xp;
            const coin = document.getElementById("headerCoins"); if (coin) coin.textContent = this.state.coins;
            const av = document.getElementById("headerAvatar"); if (av) av.src = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${this.state.avatarSeed}`;
        },
        
        getUserSnapshot() { return { ...this.state }; }
    };

    window.GameEngine = Engine;
    Engine.init();
})();
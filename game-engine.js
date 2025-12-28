/* ============================================================
   QUIZREALM • GAME ENGINE (HYBRID V9 - CLEAN)
   - Focus: Game Logic, XP, Nickname Popup
   - Removed: Duplicate data saving (handled by UX Core)
   ============================================================ */

(function () {
    const STORAGE_KEY = "QR_PROFILE";
    
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
            lastLogin: null, lastDailyDate: null, coins: 0
        },

        init() {
            this._loadLocal();
            this._recalculateLevel(false); 
            this._waitForFirebase();
            this.updateHeaderUI();
            this.updateProfileUI();
        },

        _waitForFirebase() {
            // Wait for UX Core to set up window.auth
            const check = setInterval(() => {
                if (window.auth && window.db) {
                    clearInterval(check);
                    console.log("✅ Engine Connected to Firebase.");
                    this._attachAuthListener();
                }
            }, 100);
        },

        _attachAuthListener() {
            window.auth.onAuthStateChanged(async (firebaseUser) => {
                if (firebaseUser) {
                    this.state.uid = firebaseUser.uid;
                    this.state.isAnonymous = firebaseUser.isAnonymous;
                    
                    if (!this.state.nickname && firebaseUser.displayName) {
                        this.state.nickname = firebaseUser.displayName;
                    }

                    // Sync Heroes Data (XP/Levels)
                    await this._syncWithCloud(firebaseUser);
                    
                    // Check if we need the Popup
                    this._enforceIdentityProtocol();
                }
            });
        },

        // --- IDENTITY POPUP ---
        _enforceIdentityProtocol() {
            if (this.state.nickname && this.state.nickname !== "Ghost Guest" && this.state.nickname !== "Player") return;
            this._renderIdentityPopup();
        },

        _renderIdentityPopup() {
            if (document.getElementById('qr-identity-popup')) return;
            const popup = document.createElement('div');
            popup.id = 'qr-identity-popup';
            popup.className = "fixed inset-0 z-[20000] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in";
            
            popup.innerHTML = `
                <div class="relative w-full max-w-md bg-[#0f172a] border border-blue-500/30 rounded-2xl shadow-2xl p-8">
                    <h2 class="text-2xl font-black text-white text-center mb-2">IDENTIFY YOURSELF</h2>
                    <p class="text-slate-400 text-sm text-center mb-6">Enter a callsign to save your stats.</p>
                    <div class="space-y-4">
                        <div class="relative">
                            <input type="text" id="qr-nick-input" placeholder="Nickname..." maxlength="15"
                                class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-bold uppercase">
                            <button id="qr-btn-random" class="absolute right-2 top-2 bottom-2 px-3 bg-white/5 rounded text-xs text-blue-400 font-bold">RND</button>
                        </div>
                        <button id="qr-btn-confirm" class="w-full py-3 rounded-xl bg-blue-600 text-white font-bold uppercase shadow-lg hover:bg-blue-500 transition">Confirm Identity</button>
                    </div>
                    <div class="flex items-center gap-3 my-6"><div class="h-px bg-white/10 flex-1"></div><span class="text-[10px] text-slate-500 uppercase">OR</span><div class="h-px bg-white/10 flex-1"></div></div>
                    <button id="qr-btn-google" class="w-full py-3 rounded-xl bg-white text-black font-bold uppercase hover:bg-slate-200 transition">Sign In with Google</button>
                </div>
            `;
            document.body.appendChild(popup);

            document.getElementById('qr-btn-random').onclick = () => {
                const adj = NAME_ADJECTIVES[Math.floor(Math.random() * NAME_ADJECTIVES.length)];
                const noun = NAME_NOUNS[Math.floor(Math.random() * NAME_NOUNS.length)];
                document.getElementById('qr-nick-input').value = `${adj}_${noun}_${Math.floor(Math.random() * 99)}`;
            };

            document.getElementById('qr-btn-confirm').onclick = async () => {
                const name = document.getElementById('qr-nick-input').value.trim() || "Ghost_Agent";
                this.state.nickname = name.substring(0, 15);
                
                // Save Nickname to USERS collection (using global exposed by UX Core)
                if(window.setDoc && window.doc && window.db) {
                    await window.setDoc(window.doc(window.db, "users", this.state.uid), {
                        identity: { nickname: this.state.nickname }
                    }, { merge: true });
                }

                await this._saveCloudSafe(); // Save to Heroes
                this.updateHeaderUI();
                this.updateProfileUI();
                popup.remove();
            };

            document.getElementById('qr-btn-google').onclick = async () => {
                try {
                    const provider = new window.firebase.auth.GoogleAuthProvider();
                    await window.auth.signInWithPopup(provider);
                    popup.remove();
                } catch (e) { console.error(e); }
            };
        },

        // --- DATA SYNC ---
        async _syncWithCloud(firebaseUser) {
            if (!window.doc || !window.getDoc) return;
            const ref = window.doc(window.db, "heroes", firebaseUser.uid);
            try {
                const snap = await window.getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    this.state = { ...this.state, ...data, xp: Math.max(this.state.xp, data.xp || 0) };
                }
            } catch (e) {}
            this._recalculateLevel(false);
            this.updateHeaderUI();
            this.updateProfileUI();
        },

        async _saveCloudSafe() {
            if (!this.state.uid || !window.setDoc) return;
            const ref = window.doc(window.db, "heroes", this.state.uid);
            await window.setDoc(ref, { 
                ...this.state, 
                lastSynced: window.serverTimestamp() 
            }, { merge: true });
        },

        // --- LOCAL STORAGE ---
        _loadLocal() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) this.state = { ...this.state, ...JSON.parse(raw) };
        },
        _saveLocal() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        },

        // --- GAME LOGIC (XP/Rank) ---
        addXP(amount) {
            this.state.xp += Number(amount);
            this.state.coins = Math.floor(this.state.xp / 10);
            this._recalculateLevel(true);
            this._saveLocal();
            this._saveCloudSafe();
            this.updateHeaderUI();
            this.updateProfileUI();
        },

        _getLevelFromXP(xp) { return Math.max(1, Math.floor(Math.sqrt(xp / 100))); },
        _getRankTitle(lvl) { 
            let t = RANK_TITLES[0].title;
            for (let r of RANK_TITLES) if (lvl >= r.lvl) t = r.title; 
            return t; 
        },
        _recalculateLevel(anim) {
            const newLvl = this._getLevelFromXP(this.state.xp);
            if (anim && newLvl > this.state.level) this._triggerLevelUpAnimation(newLvl);
            this.state.level = newLvl;
            this.state.rank = this._getRankTitle(newLvl);
        },
        
        // --- UI ---
        _triggerLevelUpAnimation(lvl) {
            const div = document.createElement('div');
            div.className = "fixed inset-0 z-[50] flex items-center justify-center bg-black/90 text-white font-bold text-4xl animate-bounce";
            div.innerText = `LEVEL UP: ${lvl}`;
            div.onclick = () => div.remove();
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 3000);
        },
        updateHeaderUI() {
            const el = document.getElementById("headerLevel"); if(el) el.textContent = this.state.level;
            const xp = document.getElementById("headerXP"); if(xp) xp.textContent = this.state.xp;
            const av = document.getElementById("headerAvatar"); if(av) av.src = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${this.state.avatarSeed}`;
        },
        updateProfileUI() { /* Your profile UI code here if needed */ }
    };

    // Export
    Object.defineProperty(Engine, "xp", { get() { return Engine.state.xp; }, set(v) { Engine.addXP(Number(v) - Engine.state.xp); } });
    Engine.save = function() { Engine._saveLocal(); Engine._saveCloudSafe(); };
    Engine.init();
})();
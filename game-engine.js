// game-engine.js
// Central logic for XP, Levels, and Achievements
// Ready for Firebase integration later.

const GameEngine = {
    // Default User State
    user: {
        nickname: "Player",
        avatarSeed: "Player",
        xp: 0,
        level: 1,
        coins: 0,
        stats: {
            gamesPlayed: 0,
            wins: 0,
            perfectRuns: 0
        },
        achievements: [] // Stores IDs like ['first_win', 'speedster']
    },

    // Achievement Database
    achievementsDB: {
        'first_win': { title: "First Blood", icon: "fa-trophy", desc: "Win your first game." },
        'novice': { title: "Novice", icon: "fa-star", desc: "Reach Level 5." },
        'speedster': { title: "Speedster", icon: "fa-bolt", desc: "Answer in under 3 seconds." },
        'collector': { title: "Collector", icon: "fa-gem", desc: "Earn 1000 Coins." }
    },

    // Initialize: Load from Storage (later this will load from Firebase)
    init() {
        const saved = localStorage.getItem('QR_PROFILE');
        if (saved) {
            // Merge saved data with default structure (safe against updates)
            this.user = { ...this.user, ...JSON.parse(saved) };
        }
        this.updateLevel();
        console.log("GameEngine Loaded. User:", this.user.nickname);
    },

    // Save: Write to Storage (later this will write to Firebase)
    save() {
        localStorage.setItem('QR_PROFILE', JSON.stringify(this.user));
        this.updateHeaderUI(); // Auto-update header if it exists
    },

    // Core Action: Add XP
    addXP(amount) {
        this.user.xp += amount;
        this.user.coins += Math.floor(amount / 10); // 1 Coin per 10 XP
        
        // Check for Level Up
        const oldLevel = this.user.level;
        this.updateLevel();
        
        if (this.user.level > oldLevel) {
            this.showToast(`LEVEL UP!`, `You reached Level ${this.user.level}`, "text-yellow-400");
        } else {
            this.showToast(`+${amount} XP`, `Total: ${this.user.xp}`, "text-blue-400");
        }

        this.save();
    },

    // Logic: Calculate Level based on XP (Progressive Difficulty)
    updateLevel() {
        let level = 1;
        let xp = this.user.xp;
        let cost = 1000;

        // Level 1=0-1000, Lvl 2=1000-3000, etc.
        while (xp >= cost) {
            xp -= cost;
            level++;
            cost = level * 1000;
        }
        this.user.level = level;
    },

    // Core Action: Unlock Achievement
    unlockAchievement(id) {
        if (!this.user.achievements.includes(id)) {
            this.user.achievements.push(id);
            this.addXP(500); // Bonus XP for achievements
            
            const ach = this.achievementsDB[id] || { title: "Secret", desc: "Unlocked a hidden achievement" };
            this.showToast(`ACHIEVEMENT UNLOCKED`, ach.title, "text-purple-400");
            this.save();
        }
    },

    // Helper: Update the Header UI immediately without reload
    updateHeaderUI() {
        const xpEl = document.getElementById('headerXP'); // We will add this ID to header
        const lvlEl = document.getElementById('headerLevel'); // We will add this ID
        const coinEl = document.getElementById('headerCoins');
        
        if (coinEl) coinEl.textContent = this.user.coins.toLocaleString();
        // Custom event so other components can listen
        window.dispatchEvent(new CustomEvent('userUpdate', { detail: this.user }));
    },

    // Visual: Notification Toast
    showToast(title, msg, colorClass) {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4 z-[9999] animate-bounce`;
        toast.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${colorClass}"><i class="fas fa-star"></i></div>
            <div>
                <h4 class="font-bold text-white text-sm">${title}</h4>
                <p class="text-xs text-slate-400">${msg}</p>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

// Auto-init on load
GameEngine.init();
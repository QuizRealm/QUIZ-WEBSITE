// components.js - QUIZREALM GLOBAL LAYOUT (HEADER + FOOTER)
// components.js - QUIZREALM GLOBAL LAYOUT
console.log("Loading QuizRealm Components...");

/* =========================================
   1. HELPER: GET USER DATA
   ========================================= */
function getHeaderUserSnapshot() {
    let snapshot = { level: 1, coins: 0, xp: 0, avatarSeed: "Player" };

    // Try GameEngine first
    try {
        if (window.GameEngine && typeof window.GameEngine.getUserSnapshot === "function") {
            const u = window.GameEngine.getUserSnapshot();
            snapshot.level = u.level ?? 1;
            snapshot.coins = u.coins ?? 0;
            snapshot.xp = u.xp ?? 0;
            snapshot.avatarSeed = u.avatarSeed || "Player";
            return snapshot;
        }
    } catch (e) { console.warn("Header: Engine snapshot failed.", e); }

    // Fallback to LocalStorage
    try {
        const saved = localStorage.getItem("QR_PROFILE");
        if (saved) {
            const data = JSON.parse(saved);
            snapshot.level = data.level ?? snapshot.level;
            snapshot.coins = data.coins ?? snapshot.coins;
            snapshot.xp = data.xp ?? snapshot.xp;
            snapshot.avatarSeed = data.avatarSeed || snapshot.avatarSeed;
        }
    } catch (e) { console.warn("Header: LocalStorage parsing failed.", e); }

    return snapshot;
}

/* =========================================
   2. HELPER: ARCADE LINKS
   ========================================= */
function getArcadeLinksMarkup() {
    const games = [
        { url: 'fusion-core.html', icon: 'fa-microchip', color: 'green', title: 'Logic League', sub: 'Mastermind' },
        { url: 'nexus.html', icon: 'fa-th', color: 'yellow', title: 'Connections', sub: 'Grouping' },
        { url: 'mini-crossword.html', icon: 'fa-border-all', color: 'blue', title: 'Mini Cross', sub: '5x5 Puzzle' },
        { url: 'word-ladder.html', icon: 'fa-stairs', color: 'pink', title: 'Word Ladder', sub: 'Bridge Gap' },
        { url: 'tango-logic.html', icon: 'fa-chess-board', color: 'indigo', title: 'Tango Logic', sub: 'Binary' },
        { url: 'timeline-history.html', icon: 'fa-hourglass-half', color: 'amber', title: 'Timeline', sub: 'History' },
        { url: 'cryptex.html', icon: 'fa-lock', color: 'lime', title: 'Cryptex', sub: 'Code Break' },
        { url: 'odd-one-out.html', icon: 'fa-shapes', color: 'teal', title: 'Odd One Out', sub: 'Pattern' },
        { url: 'two-truths-trap.html', icon: 'fa-mask', color: 'rose', title: 'Two Truths', sub: 'Find Trap' },
        { url: 'spelling.html', icon: 'fab fa-forumbee', color: 'orange', title: 'Spelling', sub: '7 Letters' },
        { url: 'rapid.html', icon: 'fa-bolt', color: 'red', title: 'Rapid Fire', sub: 'Speed' },
        { url: 'hangman.html', icon: 'fa-font', color: 'emerald', title: 'Hangman', sub: 'Classic' },
        { url: 'minigames.html', icon: 'fa-pencil-alt', color: 'fuchsia', title: 'Pictionary', sub: 'Draw' }
    ];

    return games.map(g => `
        <a href="${g.url}" class="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition group/item">
            <div class="w-6 h-6 rounded bg-${g.color}-500/10 flex items-center justify-center text-${g.color}-400 border border-${g.color}-500/20 group-hover/item:bg-${g.color}-500 group-hover/item:text-black transition">
                <i class="${g.icon} text-[10px]"></i>
            </div>
            <div class="flex flex-col overflow-hidden">
                <span class="text-slate-200 text-[10px] font-bold uppercase truncate">${g.title}</span>
                <span class="text-[8px] text-slate-600 truncate">${g.sub}</span>
            </div>
        </a>
    `).join('');
}

/* =========================================
   3. MAIN HEADER COMPONENT
   ========================================= */
function getQuizHeaderMarkup() {
    const user = getHeaderUserSnapshot();
    const level = user.level || 1;
    const coins = user.coins || 0;
    const xp = user.xp || 0;
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(user.avatarSeed)}`;

    return `
    <header class="w-full sticky top-0 z-50 backdrop-blur-2xl bg-[#020617]/90 border-b border-white/10 shadow-xl shadow-black/40 relative mb-0">
        <!-- slim top accent line -->
        <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-60"></div>

        <!-- MAIN BAR (reduced height for less gap) -->
        <div class="max-w-[1400px] mx-auto px-3 sm:px-4 h-14 md:h-16 flex items-center justify-between gap-3">
            
            <!-- BRAND -->
            <a href="index.html" class="flex items-center gap-2.5 group shrink-0">
                <div class="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-900 to-[#020617] border border-blue-500/30 flex items-center justify-center shadow-[0_0_14px_rgba(59,130,246,0.35)] group-hover:shadow-[0_0_22px_rgba(59,130,246,0.6)] transition-all duration-300 group-hover:scale-105">
                    <i class="fas fa-ghost text-base md:text-lg text-blue-400 group-hover:text-white transition-colors"></i>
                </div>
                <div class="flex flex-col justify-center leading-none">
                    <span class="font-arcade text-base md:text-lg text-white tracking-[0.18em]">
                        QUIZ<span class="text-blue-400">REALM</span>
                    </span>
                    <span class="text-[9px] md:text-[10px] text-slate-500 font-mono tracking-[0.25em] uppercase group-hover:text-blue-300 transition-colors">
                        Experience Engine
                    </span>
                </div>
            </a>

            <!-- DESKTOP NAV -->
            <nav class="hidden xl:flex items-center gap-1 bg-white/5/0 px-1 py-0.5 rounded-full border border-white/5">
                
                <!-- Premium CTA -->
                <a href="premium.html" class="relative group px-4 py-1.5 rounded-full overflow-hidden mr-1">
                    <div class="absolute inset-0 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 opacity-100 group-hover:opacity-95 transition-opacity"></div>
                    <div class="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.35)_0,transparent_40%,transparent_60%,rgba(255,255,255,0.35)_100%)] opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div class="relative flex items-center gap-1.5">
                        <i class="fas fa-crown text-amber-900 text-xs"></i>
                        <span class="text-[10px] font-black text-amber-950 uppercase tracking-[0.22em]">Premium</span>
                    </div>
                </a>

                <!-- Identity Lab -->
                <a href="identity-lab.html" class="relative group px-4 py-1.5 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] mr-1">
                    <div class="absolute inset-0 bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 border border-violet-500/40 group-hover:border-fuchsia-400/70 rounded-full transition-colors"></div>
                    <div class="relative flex items-center gap-1.5">
                        <i class="fas fa-fingerprint text-[10px] text-fuchsia-300 group-hover:text-white transition-colors"></i>
                        <span class="text-[10px] font-semibold uppercase tracking-[0.22em] text-fuchsia-100 group-hover:text-white transition-colors">Identity Lab</span>
                    </div>
                </a>

                <!-- Categories -->
                <a href="categories.html" class="px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 group/cat">
                    <i class="fas fa-layer-group text-slate-500 group-hover/cat:text-blue-400 transition-colors text-xs"></i>
                    <span>Categories</span>
                </a>

                <div class="w-px h-4 bg-white/10 mx-1"></div>

                <!-- Arcade + dropdown -->
                <div class="relative group h-full">
                    <a href="arcade.html" class="px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5">
                        <i class="fas fa-gamepad text-slate-500 group-hover:text-pink-400 transition-colors text-xs"></i> 
                        <span>Arcade</span>
                        <i class="fas fa-chevron-down text-[8px] opacity-50 ml-0.5 group-hover:translate-y-0.5 transition-transform"></i>
                    </a>
                    <div class="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[340px] hidden group-hover:block z-[100]">
                        <div class="bg-[#020617]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_18px_60px_-16px_rgba(0,0,0,0.9)] p-3">
                            <div class="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-[0.22em] border-b border-white/5 mb-2 flex justify-between items-center">
                                <span>Arcade Collection</span>
                                <i class="fas fa-gamepad text-slate-700"></i>
                            </div>
                            <div class="grid grid-cols-2 gap-1">
                                ${getArcadeLinksMarkup()}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- USER CLUSTER -->
            <div class="flex items-center gap-3 shrink-0">
                <!-- Coins / XP (desktop) -->
                <div class="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/40 border border-amber-500/25 shadow-inner">
                    <div class="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/60">
                        <i class="fas fa-coins text-[10px] text-amber-300"></i>
                    </div>
                    <span id="headerCoins" class="text-[11px] font-mono font-bold text-amber-100">
                        ${coins.toLocaleString()}
                    </span>
                    <span class="hidden lg:inline text-[9px] text-slate-500 uppercase tracking-[0.18em] ml-1">
                        Lvl <span id="headerLevel">${level}</span>
                    </span>
                </div>
                
                <!-- Profile -->
                <button onclick="window.location.href='profile.html'" class="flex items-center gap-2.5 pl-1.5 pr-1.5 md:pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 transition-all group relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                    <div class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 p-[1px] relative z-10 shadow-lg">
                        <img id="headerAvatar" src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover rounded-full">
                    </div>
                    <div class="hidden md:flex flex-col items-start leading-none relative z-10">
                        <span class="text-[11px] font-semibold text-slate-100 group-hover:text-white">Profile</span>
                       
                    </div>
                </button>
            </div>
        </div>

        <!-- MOBILE DOCK NAV (moved slightly up + centered FAB fully visible) -->
        <div class="xl:hidden fixed left-0 right-0 bottom-3 sm:bottom-4 z-[80]">
            <div class="mx-auto max-w-md rounded-[1.25rem] bg-[#020617]/95 backdrop-blur-2xl border border-white/10 shadow-[0_18px_60px_-20px_rgba(0,0,0,0.9)] pb-[env(safe-area-inset-bottom)]">
                <div class="flex justify-around items-center px-2 pt-2 pb-3 relative">
                    
                    <a href="categories.html" class="flex flex-col items-center gap-1 group w-14">
                        <i class="fas fa-layer-group text-base text-slate-500 group-hover:text-blue-400 transition-colors"></i>
                        <span class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 group-hover:text-slate-200">Topics</span>
                    </a>
                    
                    <a href="arcade.html" class="flex flex-col items-center gap-1 group w-14">
                        <i class="fas fa-gamepad text-base text-slate-500 group-hover:text-pink-400 transition-colors"></i>
                        <span class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 group-hover:text-slate-200">Arcade</span>
                    </a>

                    <!-- Center FAB: raised enough so it's never cut off -->
                    <a href="premium.html" class="absolute left-1/2 -translate-x-1/2 -translate-y-5">
                        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 p-[2px] shadow-[0_0_22px_rgba(245,158,11,0.65)]">
                            <div class="w-full h-full rounded-full bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden group">
                                <div class="absolute inset-0 bg-gradient-to-br from-amber-400/25 to-transparent"></div>
                                <i class="fas fa-crown text-lg text-amber-300 mb-0.5 group-active:scale-95 transition-transform"></i>
                                <span class="text-[8px] font-black text-amber-200 uppercase tracking-tight">Gold</span>
                            </div>
                        </div>
                    </a>

                    <a href="identity-lab.html" class="flex flex-col items-center gap-1 group w-14 ml-6">
                        <i class="fas fa-fingerprint text-base text-slate-500 group-hover:text-fuchsia-400 transition-colors"></i>
                        <span class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 group-hover:text-slate-200">ID Lab</span>
                    </a>
                    
                    <a href="profile.html" class="flex flex-col items-center gap-1 group w-14">
                        <i class="fas fa-user text-base text-slate-500 group-hover:text-purple-400 transition-colors"></i>
                        <span class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 group-hover:text-slate-200">Me</span>
                    </a>
                </div>
            </div>
        </div>
    </header>
    `;
}

/* =========================================
   4. COMPONENT INJECTION
   ========================================= */
class QuizHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = getQuizHeaderMarkup();
    }
}

if (!customElements.get('quiz-header')) {
    customElements.define('quiz-header', QuizHeader);
}

class QuizFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="bg-[#020617] border-t border-white/5 pt-16 pb-8">
            <div class="max-w-[1400px] mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div class="col-span-1 md:col-span-2">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-[#020617] border border-blue-500/20 flex items-center justify-center">
                                <i class="fas fa-ghost text-blue-400"></i>
                            </div>
                            <span class="font-arcade text-xl text-white tracking-[0.2em]">QUIZ<span class="text-blue-500">REALM</span></span>
                        </div>
                        <p class="text-slate-500 text-sm leading-relaxed max-w-md">
                            The world's most advanced quiz engine. Combining psychology, pop culture, and cognitive training.
                        </p>
                    </div>
                    <div>
                        <h4 class="text-white font-bold uppercase tracking-widest text-xs mb-6">Ecosystem</h4>
                        <ul class="space-y-3 text-sm text-slate-500">
                            <li><a href="identity-lab.html" class="hover:text-blue-400 transition">Identity Lab</a></li>
                            <li><a href="arcade.html" class="hover:text-blue-400 transition">The Arcade</a></li>
                            <li><a href="categories.html" class="hover:text-blue-400 transition">Knowledge Base</a></li>
                            <li><a href="premium.html" class="hover:text-amber-400 transition">QuizRealm Gold</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-white font-bold uppercase tracking-widest text-xs mb-6">Company</h4>
                        <ul class="space-y-3 text-sm text-slate-500">
                            <li><a href="about.html" class="hover:text-white transition">About Protocol</a></li>
                            <li><a href="privacy.html" class="hover:text-white transition">Privacy & Data</a></li>
                            <li><a href="contact.html" class="hover:text-white transition">Contact Support</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>&copy; 2025 QuizRealm Inc. All systems operational.</p>
                    <div class="flex gap-6">
                        <a href="#" class="hover:text-white transition"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="hover:text-white transition"><i class="fab fa-discord"></i></a>
                        <a href="#" class="hover:text-white transition"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define('quiz-header', QuizHeader);
customElements.define('quiz-footer', QuizFooter);
// =================================================================
// 2. FOOTER MARKUP GENERATOR
// =================================================================
function getQuizFooterMarkup() {
    const year = new Date().getFullYear();
    return `
    <footer class="relative mt-20 bg-[#050505] pt-16 pb-24 md:pb-8 font-sans text-xs border-t border-green-500/20">
        
        <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-green-500/5 blur-[80px] pointer-events-none"></div>

        <div class="max-w-[1400px] mx-auto px-6 relative z-10">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                
                <div class="col-span-2 md:col-span-1">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-8 h-8 rounded-lg bg-blue-900/50 flex items-center justify-center border border-blue-500/30">
                            <i class="fas fa-ghost text-blue-400"></i>
                        </div>
                        <div class="font-arcade text-lg text-white tracking-widest">QUIZ<span class="text-blue-500">REALM</span></div>
                    </div>
                    <p class="text-slate-500 leading-relaxed mb-6">
                        The ultimate destination for trivia enthusiasts. Train your brain, challenge friends, and explore the archives.
                    </p>
                    <div class="flex gap-3">
                        <a href="#" class="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition"><i class="fab fa-discord"></i></a>
                    </div>
                </div>

                <div>
                    <h4 class="text-white font-bold uppercase tracking-wider mb-5 text-[10px]">Explore</h4>
                    <ul class="space-y-3 text-slate-400">
                        <li><a href="index.html" class="hover:text-white transition flex items-center gap-2"><i class="fas fa-home text-[10px] text-slate-600" aria-label="Go to Homepage"></i> Home</a></li>
                        <li><a href="christmas-hub.html" class="text-red-400 hover:text-red-300 transition font-bold flex items-center gap-2"><i class="fas fa-tree text-[10px]"></i> Holiday Hub</a></li>
                        <li><a href="categories.html" class="hover:text-white transition">All Categories</a></li>
                        <li><a href="arcade.html" class="hover:text-white transition text-pink-400">The Arcade</a></li>
                        <li><a href="achievements.html" class="hover:text-white transition">Trophy Room</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-bold uppercase tracking-wider mb-5 text-[10px]">Company</h4>
                    <ul class="space-y-3 text-slate-400">
                        <li><a href="about.html" class="hover:text-white transition">About Us</a></li>
                        <li><a href="contact.html" class="hover:text-white transition">Contact</a></li>
                        <li><a href="privacy.html" class="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="Terms.html" class="hover:text-white transition">Terms of Use</a></li>
                        <li><a href="FAQ.html" class="hover:text-white transition">FAQs</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-bold uppercase tracking-wider mb-5 text-[10px]">System Status</h4>
                    <div class="flex items-center gap-2 text-emerald-400 bg-emerald-900/10 border border-emerald-900/50 px-3 py-2 rounded-lg w-fit mb-3">
                        <span class="relative flex h-2 w-2">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span class="font-bold">Servers Online</span>
                    </div>
                    <p class="text-slate-600 text-[10px]">Version 2.1.0 (Arcade Patch)</p>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-2">
                <span>&copy; ${year} QuizRealm Inc.</span>
                <span class="hidden md:block text-slate-700">|</span>
                <span class="text-slate-500">Licensed under QuizRealm Proprietary License.</span>
            </div>
        </div>
    </footer>`;
}

// =================================================================
// 3. CUSTOM ELEMENTS
// =================================================================

function setupHeaderElement(el) {
  // Initial render
  el.innerHTML = getQuizHeaderMarkup();

  // Render header from a snapshot (no events fired)
  const renderHeaderFromSnapshot = (s) => {
    if (!s) return;

    const lvlEl = el.querySelector("#headerLevel");
    if (lvlEl) lvlEl.textContent = s.level || 1;

    const xpEl = el.querySelector("#headerXP");
    if (xpEl) xpEl.textContent = s.xp || 0;

    const coinEl = el.querySelector("#headerCoins");
    if (coinEl) coinEl.textContent = (s.coins || 0).toLocaleString();

    const avatarEl = el.querySelector("#headerAvatar");
    if (avatarEl) {
      avatarEl.src = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(s.avatarSeed || "Player")}`;
    }
  };

  // One-time update after init (OK even if it dispatches userUpdate once)
  if (window.GameEngine?.updateHeaderUI) {
    window.GameEngine.updateHeaderUI();
  }

  // Listen for userUpdate events and render from e.detail (NO calling updateHeaderUI here)
  const handler = (e) => {
    renderHeaderFromSnapshot(e?.detail);
  };

  el._qrUserHandler = handler;
  window.addEventListener("userUpdate", handler);

  // If GameEngine already exists, render immediately (useful on SPA-like pages)
  if (window.GameEngine?.getUserSnapshot) {
    renderHeaderFromSnapshot(window.GameEngine.getUserSnapshot());
  }
}

function makeHeaderLinksRootScoped(root = "/") {
  document.querySelectorAll("quiz-header a[href], quiz-footer a[href]").forEach(a => {
    const href = a.getAttribute("href") || "";
    // Ignore external, anchors, mailto/tel, already-rooted
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("/")) return;
    a.setAttribute("href", root + href.replace(/^\.\//, ""));
  });
}

window.addEventListener("DOMContentLoaded", () => makeHeaderLinksRootScoped("/"));

function teardownHeaderElement(el) {
    if (el._qrUserHandler) {
        window.removeEventListener("userUpdate", el._qrUserHandler);
        delete el._qrUserHandler;
    }
}

// Define Header
if (!customElements.get("quiz-header")) {
    class QuizHeader extends HTMLElement {
        connectedCallback() {
            setupHeaderElement(this);
        }
        disconnectedCallback() {
            teardownHeaderElement(this);
        }
    }
    customElements.define("quiz-header", QuizHeader);
}

// Define Home Header (same behavior, just a different tag)
if (!customElements.get("quiz-home-header")) {
    class QuizHomeHeader extends HTMLElement {
        connectedCallback() {
            setupHeaderElement(this);
        }
        disconnectedCallback() {
            teardownHeaderElement(this);
        }
    }
    customElements.define("quiz-home-header", QuizHomeHeader);
}

// Define Footer
if (!customElements.get("quiz-footer")) {
    class QuizFooter extends HTMLElement {
        connectedCallback() {
            this.innerHTML = getQuizFooterMarkup();
        }
    }
    customElements.define("quiz-footer", QuizFooter);
}

// Define SEO Content (unchanged)
if (!customElements.get("quiz-seo-content")) {
    class QuizSeoContent extends HTMLElement {
        connectedCallback() {
            this.innerHTML = `
            <section class="mt-12 mb-8 rounded-xl border border-white/10 p-6 md:p-8 relative overflow-hidden group bg-black/50">
                
                <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-all duration-700"></div>

                <h1 class="text-xl md:text-2xl font-sans font-bold text-white mb-6 tracking-wide flex items-center gap-3">
                    <i class="fas fa-info-circle text-blue-500"></i>
                    ABOUT <span class="text-blue-500">QUIZREALM</span>
                </h1>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                    
                    <div>
                        <h2 class="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                            How It Works
                        </h2>
                        <p class="text-sm text-slate-300 leading-relaxed mb-4 text-justify">
                            Welcome to QuizRealm, the premier destination for online trivia. Our platform is designed to test your knowledge across <strong>science, history, technology, and geography</strong>.
                        </p>
                        <p class="text-sm text-slate-300 leading-relaxed text-justify">
                            Challenge yourself with our daily modes. You have exactly <strong>30 seconds per question</strong> to select the correct answer. Quick thinking is key to maintaining your daily streak and climbing the leaderboards.
                        </p>
                    </div>

                    <div>
                        <h2 class="text-sm font-bold text-pink-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                            Features & Rewards
                        </h2>
                        <p class="text-sm text-slate-300 leading-relaxed mb-4 text-justify">
                            Playing regularly helps improve your global ranking. Successful games award <strong>XP (Experience Points)</strong> and unlock unique <strong>digital achievements</strong> to display on your profile.
                        </p>
                        <div class="bg-white/5 rounded-lg p-3 border-l-2 border-blue-500">
                            <p class="text-xs text-slate-400">
                                <strong class="text-white">PRO TIP:</strong> Check out <strong>The Arcade</strong> to play unique mini-games like Logic League and History Timeline to earn extra coins.
                            </p>
                        </div>
                    </div>

                </div>

                <div class="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2 text-[10px] text-slate-600 uppercase tracking-widest">
                    <span><i class="fas fa-tag mr-1"></i>Brain Training</span>
                    <span>•</span>
                    <span><i class="fas fa-tag mr-1"></i>Trivia Games</span>
                    <span>•</span>
                    <span><i class="fas fa-tag mr-1"></i>Educational</span>
                    <span>•</span>
                    <span><i class="fas fa-tag mr-1"></i>Leaderboards</span>
                </div>
            </section>
            `;
        }
    }
    customElements.define("quiz-seo-content", QuizSeoContent);
}

console.log("Components.js loaded successfully.");

// =================================================================
// 4. AUTO-INJECT FAVICONS (SEO & BRANDING)
// =================================================================
(function injectFavicons() {
    const favicons = `
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/manifest.json">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff">
    `;

    // Check if favicons already exist to avoid duplicates
    if (!document.querySelector("link[rel='apple-touch-icon']")) {
        document.head.insertAdjacentHTML('beforeend', favicons);
    }
})();
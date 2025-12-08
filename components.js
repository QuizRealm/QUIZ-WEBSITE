// components.js - CHRISTMAS EDITION (FULL FEATURES) 🎄

console.log("Loading QuizRealm Components...");
        <script src="https://cdn.tailwindcss.com"></script>

/* * © 2025 QuizRealm Inc. - All Rights Reserved.
 * * UNAUTHORIZED COPYING OF THIS FILE, VIA ANY MEDIUM, IS STRICTLY PROHIBITED.
 * PROPRIETARY AND CONFIDENTIAL.
 * * Written by [Your Name/Handle], December 2025.
 */
// =================================================================
// 1. HEADER MARKUP GENERATOR
// =================================================================
function getQuizHeaderMarkup() {
    return `
    <header class="w-full sticky top-0 z-50 backdrop-blur-xl bg-[#020617]/90 border-b border-white/10 shadow-lg shadow-red-900/5 relative overflow-hidden">
        
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 opacity-50"></div>

        <div class="hidden sm:flex items-center justify-between text-[10px] font-mono text-slate-400 px-4 py-1 border-b border-white/5 bg-black/40">
            <div class="flex items-center gap-2">
                <i class="fas fa-snowflake text-[10px] text-white animate-spin-slow"></i>
                <span class="text-red-200 font-bold tracking-wider">WINTER EVENT ACTIVE</span>
                <span class="text-slate-600">|</span>
                <span>Play daily • Compete globally</span>
            </div>
            <div class="flex items-center gap-2">
                <a href="christmas-hub.html" class="hover:text-green-400 transition flex items-center gap-1 group">
                    <i class="fas fa-gift text-green-500 group-hover:animate-bounce"></i> Daily Gift Available
                </a>
            </div>
        </div>

        <div class="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
            
            <a href="index.html" class="flex items-center gap-3 group shrink-0">
                <div class="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all relative border border-white/10">
                    <div class="absolute -top-1.5 -right-1.5 bg-red-600 w-4 h-4 rounded-full border-2 border-[#020617] z-20"></div>
                    <i class="fas fa-ghost text-xl md:text-2xl text-white relative z-10"></i>
                </div>
                
                <div class="flex flex-col justify-center">
                    <span class="font-arcade text-lg md:text-2xl text-white leading-none tracking-widest drop-shadow-md group-hover:text-blue-200 transition-colors">
                        QUIZ<span class="text-blue-500">REALM</span>
                    </span>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold text-slate-300 uppercase tracking-wider border border-white/5">
                            HOME
                        </span>
                    </div>
                </div>
            </a>

            <nav class="hidden xl:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                
                <a href="christmas-hub.html" class="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-900/80 to-red-800/80 border border-red-500/30 hover:border-red-400 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all group mr-2">
                    <i class="fas fa-tree text-green-400 group-hover:animate-bounce"></i>
                    <span class="text-xs font-bold text-white uppercase tracking-wide">Xmas Hub</span>
                </a>

                <div class="w-[1px] h-6 bg-white/10 mx-1"></div>

                <a href="categories.html" class="px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
                    <i class="fas fa-layer-group text-blue-400"></i> Categories
                </a>
                <a href="quiz.html?mode=daily" class="px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
                    <i class="fas fa-calendar-day text-emerald-400"></i> Daily
                </a>
                <a href="timeline-history.html" class="px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
                    <i class="fas fa-hourglass-half text-amber-400"></i> Timeline
                </a>
                <a href="hangman.html" class="px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
                    <i class="fas fa-font text-purple-400"></i> Hangman
                </a>
                <a href="minigames.html" class="px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
                    <i class="fas fa-gamepad text-pink-400"></i> Mini-Games
                </a>
            </nav>

            <div class="flex items-center gap-3">
                
                <a href="christmas-hub.html" class="xl:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-red-900 to-black border border-red-500/30 flex items-center justify-center text-red-400 animate-pulse active:scale-95 transition">
                    <i class="fas fa-gift"></i>
                </a>

                <button onclick="window.location.href='profile.html'" 
                    class="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500 flex items-center justify-center text-black font-bold shadow-lg ring-2 ring-black/50">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="hidden sm:flex flex-col items-start leading-none">
                        <span class="text-xs font-bold text-white group-hover:text-blue-200">My Profile</span>
                        <span class="text-[10px] text-slate-400">Level 1</span>
                    </div>
                </button>
            </div>
        </div>

        <div class="md:hidden border-t border-white/10 bg-[#020617]/95 backdrop-blur-xl px-2 py-2">
            <nav class="grid grid-cols-5 gap-1">
                <a href="categories.html" class="flex flex-col items-center justify-center py-2 rounded-lg active:bg-white/5 text-slate-400 hover:text-white">
                    <i class="fas fa-layer-group text-sm mb-1 text-blue-400"></i>
                    <span class="text-[9px] font-bold">Categories</span>
                </a>
                <a href="hangman.html" class="flex flex-col items-center justify-center py-2 rounded-lg active:bg-white/5 text-slate-400 hover:text-white">
                    <i class="fas fa-font text-sm mb-1 text-purple-400"></i>
                    <span class="text-[9px] font-bold">Word</span>
                </a>
                <a href="christmas-hub.html" class="flex flex-col items-center justify-center py-2 rounded-lg bg-red-900/20 text-red-400 border border-red-500/20">
                    <i class="fas fa-tree text-sm mb-1 animate-bounce"></i>
                    <span class="text-[9px] font-bold">Xmas</span>
                </a>
                <a href="timeline-history.html" class="flex flex-col items-center justify-center py-2 rounded-lg active:bg-white/5 text-slate-400 hover:text-white">
                    <i class="fas fa-hourglass-half text-sm mb-1 text-amber-400"></i>
                    <span class="text-[9px] font-bold">Time</span>
                </a>
                <a href="minigames.html" class="flex flex-col items-center justify-center py-2 rounded-lg active:bg-white/5 text-slate-400 hover:text-white">
                    <i class="fas fa-gamepad text-sm mb-1 text-pink-400"></i>
                    <span class="text-[9px] font-bold">Games</span>
                </a>
            </nav>
        </div>
    </header>`;
}

// =================================================================
// 2. FOOTER MARKUP GENERATOR (Full 4-Column Version)
// =================================================================
function getQuizFooterMarkup() {
    const year = new Date().getFullYear();
    return `
    <footer class="relative mt-20 bg-[#050505] pt-16 pb-8 font-sans text-xs border-t border-green-500/20">
        
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
                        <li><a href="achievements.html" class="hover:text-white transition">Trophy Room</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-bold uppercase tracking-wider mb-5 text-[10px]">Company</h4>
                    <ul class="space-y-3 text-slate-400">
                        <li><a href="about.html" class="hover:text-white transition">About Us</a></li>
                        <li><a href="contact.html" class="hover:text-white transition">Contact</a></li>
                        <li><a href="privacy.html" class="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="terms.html" class="hover:text-white transition">Terms of Use</a></li>
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
                    <p class="text-slate-600 text-[10px]">Version 2.0.4 (Winter Patch)</p>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-2">
    <span>&copy; ${year} QuizRealm Inc.</span>
    <span class="hidden md:block text-slate-700">|</span>
    <span class="text-slate-500">Licensed under QuizRealm Proprietary License.</span>
</div>
            </div>
        </div>
    </footer>`;
}

// =================================================================
// 3. DEFINE CUSTOM ELEMENTS
// =================================================================

// Define Header
if (!customElements.get('quiz-header')) {
    class QuizHeader extends HTMLElement {
        connectedCallback() {
            this.innerHTML = getQuizHeaderMarkup();
        }
    }
    customElements.define('quiz-header', QuizHeader);
}

// Define Home Header
if (!customElements.get('quiz-home-header')) {
    class QuizHomeHeader extends HTMLElement {
        connectedCallback() {
            this.innerHTML = getQuizHeaderMarkup();
        }
    }
    customElements.define('quiz-home-header', QuizHomeHeader);
}

// Define Footer
if (!customElements.get('quiz-footer')) {
    class QuizFooter extends HTMLElement {
        connectedCallback() {
            this.innerHTML = getQuizFooterMarkup();
        }
    }
    customElements.define('quiz-footer', QuizFooter);
}

// Define SEO Content (Restored Full Version)
if (!customElements.get('quiz-seo-content')) {
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
                                <strong class="text-white">PRO TIP:</strong> Stuck on a difficult question? Use your <strong>Power-Ups</strong>. The <em>50/50 Split</em> removes two wrong answers, while <em>Time Freeze</em> pauses the clock for 10 seconds.
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
    customElements.define('quiz-seo-content', QuizSeoContent);
}

console.log("Components.js loaded successfully.");
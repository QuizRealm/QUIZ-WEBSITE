// daily-logic.js
import { WEEKLY_SCHEDULE } from './daily-schedule.js';

// === DOM ELEMENTS ===
const UI = {
    title: document.getElementById('dailyTitle'),
    desc: document.getElementById('dailyDesc'),
    bg: document.getElementById('heroBg'),
    xp: document.getElementById('xpReward'),
    timer: document.getElementById('countdown'),
    streak: document.getElementById('streakCount'),
    bounty1: document.getElementById('bounty1-bar'),
    bounty2: document.getElementById('bounty2-bar'),
    btn: document.getElementById('playBtn')
};

// === STATE MANAGEMENT ===
let currentDaily = null;

function init() {
    // 1. Determine Today's Content
    const todayIndex = new Date().getDay();
    currentDaily = WEEKLY_SCHEDULE[todayIndex];

    if (!currentDaily) {
        console.error("No daily scheduled for index " + todayIndex);
        return;
    }

    // 2. Render Hero Section
    UI.title.innerHTML = `Today: <span class="text-accentCyan">${currentDaily.title}</span>`;
    UI.desc.textContent = currentDaily.desc;
    UI.xp.textContent = `+${currentDaily.xp} XP`;
    UI.bg.style.backgroundImage = `url('${currentDaily.img}')`;

    // 3. Start Clocks
    startTimers();

    // 4. Wait for Game Engine to Sync Data
    waitForEngine();
}

// === ENGINE SYNC ===
function waitForEngine() {
    const check = setInterval(() => {
        if (window.GameEngine && window.GameEngine.state) {
            clearInterval(check);
            syncUserProgress();
        }
    }, 200);
}

function syncUserProgress() {
    const state = window.GameEngine.state;
    const todayStr = new Date().toDateString();

    // 1. UPDATE STREAK
    UI.streak.textContent = state.streak || 0;

    // 2. CHECK IF PLAYED TODAY
    // We look at 'lastDailyDate' in the engine
    const hasPlayed = state.lastDailyDate === todayStr;

    if (hasPlayed) {
        // Change Button to "Completed"
        UI.btn.innerHTML = `<i class="fas fa-check"></i> MISSION COMPLETE`;
        UI.btn.classList.remove('bg-accentCyan', 'hover:bg-cyan-400');
        UI.btn.classList.add('bg-green-500', 'cursor-default');
        UI.btn.onclick = null; // Disable click
    }

    // 3. UPDATE BOUNTIES (Real Logic)
    // We assume the Engine tracks 'dailyStats' object. 
    // If not, we default to 0.
    const stats = state.dailyStats || { accuracy: 0, time: 999 };
    
    // Bounty 1: Sharpshooter (Accuracy)
    // If played today and accuracy is 100%, fill bar
    if (hasPlayed && stats.accuracy >= 100) {
        updateBountyUI('bounty1', 100, "1/1 Complete");
    } else if (hasPlayed) {
        updateBountyUI('bounty1', stats.accuracy, `${stats.accuracy}% / 100%`);
    } else {
        updateBountyUI('bounty1', 0, "0/1 Complete");
    }

    // Bounty 2: Speed Demon (Time - arbitrary example < 60s)
    // If played today and time < 60s
    if (hasPlayed && stats.time < 60) {
        updateBountyUI('bounty2', 100, "Fast Run!");
    } else {
        updateBountyUI('bounty2', 0, "Not achieved");
    }
}

function updateBountyUI(id, percent, text) {
    const bar = document.getElementById(id + '-bar');
    const txt = document.getElementById(id + '-text');
    if(bar) bar.style.width = `${percent}%`;
    if(txt) txt.textContent = text;
}

// === ACTIONS ===
window.playDaily = function() {
    if (!currentDaily) return;
    
    // Save "Start Attempt" to local storage temporarily
    localStorage.setItem('QR_DAILY_ATTEMPT', JSON.stringify({
        id: currentDaily.id,
        date: new Date().toDateString(),
        xp: currentDaily.xp
    }));

    // Redirect
    window.location.href = `quiz.html?id=${currentDaily.id}&mode=daily&diff=${currentDaily.difficulty}`;
};

// === TIMERS ===
function startTimers() {
    // Countdown to Midnight
    setInterval(() => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24,0,0,0);
        const diff = midnight - now;
        
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        
        UI.timer.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        
        // Server Time
        document.getElementById('serverTime').textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    }, 1000);
}

// Start
document.addEventListener('DOMContentLoaded', init);
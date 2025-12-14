/**
 * THE VIBE LAB // CORE ENGINE
 * Version: 2.2 (Patched & Stabilized)
 */

// --- 1. THE DATA BANK ---
const questionBank = [
    {
        id: 1,
        prompt: "SELECT YOUR ENVIRONMENT",
        options: [
            { 
                text: "A CROWDED BASEMENT AT 2 AM", 
                effects: { energy: 0.8, valence: 0.3, acousticness: 0.1 } 
            },
            { 
                text: "A SILENT MOUNTAIN AT 6 AM", 
                effects: { energy: 0.2, valence: 0.6, acousticness: 0.9 } 
            }
        ]
    },
    {
        id: 2,
        prompt: "CHOOSE A TEXTURE",
        options: [
            { 
                text: "BROKEN GLASS", 
                effects: { energy: 0.7, valence: 0.2, danceability: 0.6 } 
            },
            { 
                text: "HEAVY VELVET", 
                effects: { energy: 0.3, valence: 0.5, danceability: 0.3 } 
            }
        ]
    },
    {
        id: 3,
        prompt: "DEFINE YOUR MEMORY",
        options: [
            { 
                text: "I WANT TO REMEMBER", 
                effects: { valence: 0.3, acousticness: 0.7, nostalgia: 0.8 } 
            },
            { 
                text: "I WANT TO FORGET", 
                effects: { valence: 0.6, energy: 0.7, nostalgia: 0.1 } 
            }
        ]
    }
];

// --- 2. ARCHETYPE DEFINITIONS ---
const archetypes = {
    industrial: {
        title: "THE INDUSTRIAL NIHILIST",
        desc: "You find comfort in chaos. Your auditory cortex seeks structure within noise. You prefer high-fidelity aggression over organic warmth.",
        track: "GESAFFELSTEIN - PURSUIT"
    },
    kinetic: {
        title: "THE NEON KINETIC",
        desc: "You are fueled by forward motion. You reject silence. Your brain requires a constant BPM of 120+ to maintain optimal dopamine levels.",
        track: "FRED AGAIN.. - MAREA"
    },
    void: {
        title: "THE VOID GAZER",
        desc: "You thrive in the empty spaces between notes. You seek isolation and introspection. Melancholy is not a mood for you; it is an environment.",
        track: "BURIAL - ARCHANGEL"
    },
    analog: {
        title: "THE ANALOG PURIST",
        desc: "You reject the digital coldness. You seek warmth, imperfections, and dust. You are looking for a memory that doesn't exist yet.",
        track: "KHRAUNGBIN - TEXAS SUN"
    }
};

// --- 3. STATE & ELEMENTS ---
let userState = {
    energy: 0.5,
    valence: 0.5,
    acousticness: 0.5,
    danceability: 0.5,
    currentQuestionIndex: 0
};

// Store DOM elements here after load
let elements = {};

// --- 4. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Capture Elements Safely
    elements = {
        btn: document.querySelector('.primary-btn'),
        hero: document.querySelector('.hero-block'),
        dataGrid: document.querySelector('.data-grid'),
        contentLayer: document.querySelector('.content-layer'),
        terminalText: document.querySelector('.terminal-prompt'),
        footer: document.querySelector('.control-panel')
    };

    // 2. Add Event Listeners
    if (elements.btn) {
        elements.btn.addEventListener('click', startCalibration);
    }

    // 3. Inject Critical Styles (Animations & Modules)
    injectSystemStyles();
});

// --- 5. CORE FUNCTIONS ---

function startCalibration() {
    // Lock Button
    elements.btn.style.pointerEvents = 'none';
    elements.btn.innerHTML = '<span class="btn-text">INITIALIZING...</span>';
    
    // Boot Sequence "Theater"
    let steps = ["CONNECTING TO API...", "MAPPING CORTEX...", "SYNCING..."];
    let stepIndex = 0;

    const bootInterval = setInterval(() => {
        if (stepIndex < steps.length) {
            if(elements.terminalText) elements.terminalText.innerHTML = `<span class="blink">></span> ${steps[stepIndex]}`;
            stepIndex++;
        } else {
            clearInterval(bootInterval);
            launchInterface();
        }
    }, 600);
}

function launchInterface() {
    // Fade Out Landing Page
    if(elements.hero) elements.hero.style.opacity = '0';
    if(elements.dataGrid) elements.dataGrid.style.opacity = '0';
    if(elements.footer) elements.footer.style.opacity = '0';
    
    // Remove & Render
    setTimeout(() => {
        if(elements.hero) elements.hero.remove();
        if(elements.dataGrid) elements.dataGrid.remove();
        if(elements.footer) elements.footer.remove();
        renderQuestion(0);
    }, 500);
}

function renderQuestion(index) {
    if (index >= questionBank.length) {
        showResults();
        return;
    }

    const q = questionBank[index];
    const questionHTML = `
        <div class="question-module" style="opacity: 0; animation: fadeIn 0.5s forwards;">
            <div class="q-meta">SYS_QUERY_0${q.id} // PARAMETER_CHECK</div>
            <h2 class="q-prompt">${q.prompt}</h2>
            
            <div class="option-stack">
                <button class="option-btn" onclick="handleChoice(0, ${index})">
                    <span class="opt-letter">A</span>
                    <span class="opt-text">${q.options[0].text}</span>
                </button>
                <button class="option-btn" onclick="handleChoice(1, ${index})">
                    <span class="opt-letter">B</span>
                    <span class="opt-text">${q.options[1].text}</span>
                </button>
            </div>
            
            <div class="progress-bar">
                <div class="fill" style="width: ${(index / questionBank.length) * 100}%"></div>
            </div>
        </div>
    `;

    elements.contentLayer.innerHTML = questionHTML;
}

// Global scope for HTML onclick access
window.handleChoice = function(optionIndex, qIndex) {
    const q = questionBank[qIndex];
    const choice = q.options[optionIndex];
    
    // Update Vector State
    for (const [key, value] of Object.entries(choice.effects)) {
        if (userState[key] !== undefined) {
            userState[key] = (userState[key] + value) / 2;
        } else {
            userState[key] = value;
        }
    }
    
    // Log for debugging
    console.log("Updated Vector:", userState);

    // Next Question
    userState.currentQuestionIndex++;
    setTimeout(() => {
        renderQuestion(userState.currentQuestionIndex);
    }, 200);
};

function showResults() {
    // 1. Calculate Archetype (Simple Quadrant Logic)
    let result = archetypes.void; // Default fallback
    
    if (userState.energy >= 0.5) {
        if (userState.valence >= 0.5) result = archetypes.kinetic;
        else result = archetypes.industrial;
    } else {
        if (userState.valence >= 0.5) result = archetypes.analog;
        else result = archetypes.void;
    }

    // 2. Render Result Card
    elements.contentLayer.innerHTML = `
        <div class="result-module" style="opacity: 0; animation: fadeIn 1s forwards;">
            
            <div class="sys-id">
                <span>SUBJECT ID: ${Math.floor(Math.random() * 999999)}</span>
                <span>STATUS: LOCKED</span>
            </div>

            <h1 class="arch-title">${result.title}</h1>
            
            <div class="arch-desc">
                <p>"${result.desc}"</p>
            </div>

            <div class="stat-block">
                <div class="stat-row">
                    <span class="stat-label">ENERGY</span>
                    <div class="stat-track"><div class="stat-fill" style="width: ${userState.energy * 100}%"></div></div>
                </div>
                <div class="stat-row">
                    <span class="stat-label">VALENCE</span>
                    <div class="stat-track"><div class="stat-fill" style="width: ${userState.valence * 100}%"></div></div>
                </div>
                <div class="stat-row">
                    <span class="stat-label">ACOUSTIC</span>
                    <div class="stat-track"><div class="stat-fill" style="width: ${userState.acousticness * 100}%"></div></div>
                </div>
            </div>

            <div class="track-rec">
                <span class="rec-label">RECOMMENDED FREQUENCY</span>
                <span class="rec-val">${result.track}</span>
            </div>

            <button class="primary-btn" onclick="location.reload()" style="margin-top: 30px;">
                <span class="btn-text">RESET SYSTEM</span>
                <span class="btn-arrow">↻</span>
            </button>
        </div>
    `;
}

// --- 6. DYNAMIC STYLE INJECTION ---
function injectSystemStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .question-module { margin-top: auto; margin-bottom: auto; width: 100%; }
        .q-meta { font-family: var(--font-code); color: var(--accent-neon); font-size: 10px; margin-bottom: 20px; }
        .q-prompt { font-size: 24px; font-weight: 900; line-height: 1.1; margin-bottom: 40px; text-transform: uppercase; }
        .option-stack { display: flex; flex-direction: column; gap: 15px; }
        .option-btn { background: transparent; border: 1px solid var(--border-bright); color: white; padding: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: all 0.2s; text-align: left; }
        .option-btn:hover { background: var(--text-primary); color: black; border-color: white; }
        .opt-letter { font-family: var(--font-code); background: var(--border-dim); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 10px; border-radius: 2px; }
        .option-btn:hover .opt-letter { color: white; background: black; }
        .opt-text { font-family: var(--font-head); font-weight: 600; font-size: 14px; letter-spacing: 0.5px; }
        .progress-bar { height: 2px; background: var(--border-dim); margin-top: 40px; width: 100%; }
        .fill { height: 100%; background: var(--accent-neon); transition: width 0.3s ease; }
    `;
    document.head.appendChild(style);
}
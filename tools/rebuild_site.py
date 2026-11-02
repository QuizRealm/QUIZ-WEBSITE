"""Build the discovery pages and normalize the retained game archive.

Standard library only. Keep public game URLs stable. Never access files outside
this repository. Run from the repository root; generated HTML is committed.
"""
from pathlib import Path
from html import escape, unescape
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from datetime import date
import json, re, shutil, time
from homepage import build_home
from rapid_page import build_rapid
from sitemap import render_sitemap

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = 'https://thequizrealm.com'
TODAY = date.today().isoformat()
CATALOG = json.loads((ROOT / 'site/catalog.json').read_text(encoding='utf-8-sig'))
REFLECTIONS = json.loads((ROOT / 'site/reflections.json').read_text(encoding='utf-8-sig'))
GENERATED = set()
KINDS = {'trivia':'Trivia', 'logic':'Logic', 'words':'Word games', 'arcade':'Quick play', 'social':'With friends', 'personality':'Reflections','guide':'Guide'}
ALIASES = {'rick-and-morty.html':'rickandmorty.html','index-funnels.html':'directory.html','encyclopedia.html':'directory.html','premium.html':'categories.html','1v1-duel.html':'duel.html'}
ALIASES.update({'social-battery.html':'social-battery-test.html','social-battery2.html':'social-battery-test.html','career-burnout.html':'burnout-test.html','career-quiet-quit.html':'burnout-test.html','dating-recovery.html':'dating-mirror.html','toxic-analysis.html':'toxic-radar-test.html','identity-portal.html':'identity-lab.html','vibe-lab/index.html':'music-vibe.html','vibe-lab/index1.html':'music-vibe.html'})
ALIASES.update({
 'aesthetic-hub.html':'color-hub.html','aesthetic-architect.html':'color-hub.html','aesthetic-curator.html':'color-hub.html','aesthetic-director.html':'color-hub.html','aesthetic-red.html':'color-hub.html','modern-dating-and-aesthetics-hub.html':'couples-hub.html','music-vibe-and-sonic-identity-hub.html':'music-vibe.html',
 'article-404.html':'404.html','article-about-quizrealm.html':'about.html',
 'red-flag-test.html':'toxic-radar-test.html','family-origins.html':'family-trauma-test.html',
 'dating-audit-1.html':'dating-mirror.html','dating-detective.html':'dating-mirror.html','dating-situationship.html':'dating-mirror.html',
 'couples-compatibility-test1.html':'couples-compatibility-test.html','article-roommate2.html':'article-roommate.html',
 'article-social-science.html':'social-quiz-guide.html','article-social-battery-audit.html':'social-quiz-guide.html','article-corporate-horoscopes-vs-mbti.html':'social-quiz-guide.html','article-identity-lab-best-personality-tests.html':'social-quiz-guide.html',
 'article-games-for-work.html':'games-for-a-work-break.html','article-burnout-index.html':'games-for-a-work-break.html','corporate-burnout-and-gamification.html':'games-for-a-work-break.html',
 'article-intelligence-audit.html':'what-a-game-score-means.html',
 'top-5-netflix-shows-2026.html':'tv-trivia-night.html','top-5-netflix-shows-2026-watchlist.html':'tv-trivia-night.html','netflix-binge-culture-and-chill.html':'tv-trivia-night.html',
 'article-ultimate-quiz-night-playbook.html':'host-a-better-quiz-night.html','article-best-online-trivia-games-for-groups.html':'host-a-better-quiz-night.html','funnel-group-trivia-guide.html':'host-a-better-quiz-night.html'
})
for name in ['calibration','chronos','cyber','lexicon','syndicate','zen']:
    ALIASES[f'funnel-arcade-{name}.html']='arcade.html'
for folder in ['encyclopedia','rick-and-morty']:
    for p in (ROOT / folder).glob('*.html'):
        ALIASES[p.relative_to(ROOT).as_posix()] = ALIASES.get(p.name,p.name)
RETIRED = ['ai-models-showdown.html','avatar-medium-post.html','claude-AI.html','gemini-vs-chatgpt.html','Grok-review.html','grok-pros.html','grok-aurora.html','jasper-ai-tool.html','llama-ai-tool.html','tech-encyclopedia.html','omni-math-and-financial-calculator.html','mortgage-loan-and-salary-calculator.html','health-bmi-bmr-tdee-calculator.html','tools-import.html','dev.html']
NOINDEX = set(RETIRED + ['quiz.html','mode.html','play.html','host-game.html','profile.html','achievements.html','random.html','404.html'])

def write(name, text):
    path = ROOT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    normalized='\n'.join(line.rstrip() for line in text.splitlines()).rstrip()+'\n'
    if path.exists() and path.read_text(encoding='utf-8')==normalized:return
    temporary=path.with_name(path.name+'.build-tmp')
    with temporary.open('w',encoding='utf-8',newline='\n') as output:output.write(normalized)
    for attempt in range(8):
        try:
            temporary.replace(path)
            break
        except OSError as error:
            if attempt==7 or error.errno not in [13,16,22]:raise
            time.sleep(.05*(attempt+1))

def brand():
    return '<a class="qr-brand" href="/" aria-label="TheQuizRealm home"><img class="qr-brand-logo" src="/android-chrome-192x192.png" alt="" width="42" height="42"><span>TheQuiz<span class="qr-brand-realm">Realm</span></span></a>'

def header(current=''):
    links=[('daily.html','Daily Ten'),('categories.html','All games'),('group-hub.html','With friends'),('game-guides.html','Field notes')]
    nav=''.join(f'<a href="/{url}"'+(' aria-current="page"' if current==url else '')+f'>{label}</a>' for url,label in links)
    return f'''<a class="qr-skip" href="#main-content">Skip to content</a><header class="qr-site-header"><div class="qr-header-inner">{brand()}<nav class="qr-header-nav" id="realm-nav" aria-label="Main navigation">{nav}</nav><a class="qr-player" href="/profile.html" aria-label="Your player progress"><span class="qr-player-dot" aria-hidden="true">✦</span><span>Level <b id="headerLevel">1</b></span><span class="qr-xp">· <span id="headerXP">0</span> XP</span></a><button class="qr-menu-toggle" type="button" aria-controls="realm-nav" aria-expanded="false">Menu</button></div></header>'''

def footer():
    return f'''<footer class="qr-site-footer"><div class="qr-footer-inner"><div class="qr-footer-top"><div>{brand()}<p>A little curiosity. A good challenge. Free browser games for your everyday break.</p></div><div><strong>Find your next game</strong><ul><li><a href="/daily.html">The Daily Ten</a></li><li><a href="/categories.html">All games</a></li><li><a href="/arcade.html">Word &amp; logic games</a></li><li><a href="/identity-lab.html">Reflection quizzes</a></li><li><a href="/directory.html">Complete directory</a></li></ul></div><div><strong>Behind the games</strong><ul><li><a href="/about.html">About TheQuizRealm</a></li><li><a href="/editorial-policy.html">How we make things</a></li><li><a href="/game-guides.html">Field notes &amp; guides</a></li><li><a href="/contact.html">Contact &amp; corrections</a></li><li><a href="/FAQ.html">Common questions</a></li></ul></div><div><strong>Your space</strong><ul><li><a href="/profile.html">My progress</a></li><li><a href="/achievements.html">Achievements</a></li><li><a href="/privacy.html">Privacy</a></li><li><a href="/Terms.html">Terms</a></li><li><button class="qr-text-button" type="button" data-privacy>Privacy choices</button></li></ul></div></div><div class="qr-footer-bottom"><span>© {date.today().year} TheQuizRealm. Made for curious people.</span><span>Free to play · No subscriptions</span></div></div></footer>'''

def page(name, title, description, body, scripts=(), noindex=False, prose=False, theme=""):
    GENERATED.add(name)
    canonical=DOMAIN+('/' if name=='index.html' else '/'+name)
    ld={'@context':'https://schema.org','@type':'WebPage','name':title,'description':description,'url':canonical,'isPartOf':{'@type':'WebSite','name':'TheQuizRealm','url':DOMAIN+'/'}}
    theme_css='<link rel="stylesheet" href="/assets/home.css">' if theme=='home' else ''
    body_class='realm-page realm-home' if theme=='home' else 'realm-page'
    script_tags=''.join(f'<script src="/{s}" defer></script>' for s in scripts)
    text=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{escape(title)}</title><meta name="description" content="{escape(description,quote=True)}"><meta name="robots" content="{'noindex,follow' if noindex else 'index,follow'}"><link rel="canonical" href="{canonical}"><meta name="theme-color" content="#101819"><meta name="google-adsense-account" content="ca-pub-6205081520399538"><meta property="og:type" content="website"><meta property="og:site_name" content="TheQuizRealm"><meta property="og:title" content="{escape(title,quote=True)}"><meta property="og:description" content="{escape(description,quote=True)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{DOMAIN}/assets/qr-hero-banner-1920x900.webp"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.json"><link rel="stylesheet" href="/assets/realm.css"><script type="application/ld+json">{json.dumps(ld,ensure_ascii=False)}</script><script src="/assets/privacy.js" defer></script><script src="/assets/progress.js" defer></script><script src="/components.js" defer></script><script src="/assets/site.js" defer></script>{script_tags}{theme_css}</head><body class="{body_class}"><quiz-header>{header(name)}</quiz-header><main class="{'r-container r-prose' if prose else 'r-container'}" id="main-content">{body}</main><quiz-footer>{footer()}</quiz-footer></body></html>'''
    write(name,text)

def card(g, i=0):
    image=g.get('image','assets/brain.png')
    if not (ROOT/image).is_file(): image='assets/brain.png'
    thumb='assets/thumbs/'+Path(image).stem+'.webp'
    if (ROOT/thumb).exists(): image=thumb
    return f'''<a class="r-card" href="/{escape(g['url'],quote=True)}" data-title="{escape(g['title'],quote=True)}" data-kind="{g['kind']}" data-tags="{escape(g['tags'],quote=True)}" data-order="{i}"><div class="r-card-art"><img src="/{image}" alt="" width="560" height="340" loading="lazy" decoding="async"></div><div class="r-card-copy"><span class="r-card-tag">{KINDS[g['kind']]}</span><h3>{escape(g['title'])}</h3><p>{escape(g['description'])}</p><div class="r-card-meta"><span>{g['time']}</span><span aria-hidden="true">↗</span></div></div></a>'''

def grid(items): return '<div class="r-grid">'+''.join(card(g,i) for i,g in enumerate(items))+'</div>'
def head(eyebrow,title,description): return f'<header class="r-page-head"><span class="r-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></header>'
def section(title,description,items,link='/categories.html',label='Explore all games'):
    return f'<section class="r-section"><div class="r-section-heading"><div><h2>{title}</h2><p>{description}</p></div><a class="r-text-link" href="{link}">{label} ↗</a></div>{grid(items)}</section>'

def build_hubs():
    build_home(CATALOG,card,page)
    for filename,title,intro,items,default_kind in [
        ('categories.html','Find your next good game.','Browse a curated collection of trivia, word games, logic puzzles, and games to play with friends. Pick a category or search for a favorite.',CATALOG,'all'),
        ('arcade.html','A little challenge. A good break.','Wordplay, pattern spotting, and quick experiments. These games are made for a few satisfying minutes in your browser.',[g for g in CATALOG if g['kind'] in ['words','logic','arcade']],'all'),
        ('identity-lab.html','A moment to reflect.','Light, recreational quizzes about everyday preferences. There are no diagnoses, compatibility verdicts, or predictions—just choices that can start a conversation.',[g for g in CATALOG if g['kind']=='personality'],'all')]:
        filters='<div class="r-filters" aria-label="Filter games"><button class="r-filter" data-filter="all" aria-pressed="true">All games</button>'+''.join(f'<button class="r-filter" data-filter="{k}" aria-pressed="false">{v}</button>' for k,v in KINDS.items() if any(g['kind']==k for g in items))+'</div>'
        body=head('The game library',title,intro)+f'<div class="r-toolbar"><label class="r-hidden" for="game-search">Search games</label><input class="r-search" id="game-search" type="search" placeholder="Search games, topics, or a mood…" aria-label="Search games"><label class="r-hidden" for="game-sort">Sort games</label><select class="r-select" id="game-sort" aria-label="Sort games"><option value="featured">Curated order</option><option value="az">A–Z</option></select></div>{filters}<p class="r-count" id="library-count" aria-live="polite">{len(items)} games to explore</p><div class="r-grid" id="library-grid">'+''.join(card(g,i) for i,g in enumerate(items))+'</div><div class="r-empty" id="library-empty" hidden><h2>No games found.</h2><p>Try a shorter search or choose another category.</p></div><section class="r-note r-section"><h2>A few ways to play</h2><p>Choose trivia for a ten-question round, words for clues and vocabulary, or logic for patterns and deduction. The Daily Ten gives everyone the same set for the day. Games with friends include both same-device play and a hosted room.</p><p>Every game is free to open. Individual game pages explain their controls and rules. For a complete list of topic collections and articles, visit the <a class="r-text-link" href="/directory.html">site directory</a>.</p></section>'
        page(filename,('Reflection Quizzes' if filename=='identity-lab.html' else 'Free Word & Logic Games' if filename=='arcade.html' else 'Free Browser Games & Trivia Library')+' | TheQuizRealm',intro,body)
    body=head('A small daily ritual','Ten questions.<br>A fresh start.','A mixed round of science, geography, history, food, and more. A fresh set arrives at midnight UTC. Everyone gets the same questions for the day.')
    body+='''<div class="r-split"><section class="r-daily-card"><div class="r-daily-top"><span id="daily-date">Today’s challenge</span><span class="r-live-pill">DAILY TEN</span></div><div class="r-orbit-art" aria-hidden="true"><span></span><span></span><span></span></div><div class="r-daily-bottom"><div><h2>Ready when<br>you are.</h2><p>10 questions · No timer · One good break</p></div><a class="r-arrow-button" href="/quiz.html?category=mixed&amp;mode=daily" aria-label="Start today’s Daily Ten">↗</a></div></section><div class="r-note"><span class="r-eyebrow">Your daily ritual</span><h2>Come for the questions.<br>Stay curious.</h2><p id="daily-status">Your first completed daily round earns XP. Replays are welcome.</p><p>Next set in <strong id="daily-countdown">00:00:00</strong> · resets at 00:00 UTC</p><div class="r-actions"><a class="r-button" href="/quiz.html?category=mixed&amp;mode=daily">Start the Daily Ten ↗</a></div><p class="r-footnote">No account. No speed bonus. Take the time you need.</p></div></div><section class="r-prose r-section"><h2>How the Daily Ten works</h2><p>The daily round draws ten distinct questions from a curated set with short answer explanations. Choose one answer for each question, then review the correct answer before moving on. At the end, you can revisit every question and copy your result to challenge a friend.</p><p>The question set changes at midnight UTC, so people in different time zones can compare the same challenge. Your first completion on each date is recorded; replaying the same daily set does not award another completion. Your play streak uses the local date on your device and increases when you finish a game on consecutive days.</p><p>Progress is stored in this browser. You can export a backup from <a href="/profile.html">your player profile</a>. If you would rather choose a topic, try the <a href="/categories.html">game library</a> instead.</p></section>'''
    page('daily.html','The Daily Ten — A Free Daily Trivia Challenge | TheQuizRealm','Ten mixed trivia questions, a new set at midnight UTC. Play without a timer, review your answers, and build a daily streak.',body)
    page('quiz.html','Play a Trivia Round | TheQuizRealm','Play a ten-question trivia round, see the correct answers, and save your progress locally.',head('A little everyday curiosity','<span id="quiz-topic">Your quiz</span>','Choose an answer, learn the result, and keep going. There is no timer, so take the time you need.')+'<div id="quiz-app" class="r-game-shell"><p>Loading the question bank…</p></div><p class="r-footnote" style="text-align:center;margin-top:25px"><a class="r-text-link" href="/categories.html">Choose another topic</a> · Keyboard: 1–4 to answer</p>',scripts=['data.js','assets/daily-bank.js','assets/quiz.js'],noindex=True)
    for slug,title,intro,instructions in [
        ('memory-trail','Memory Trail','Follow the sequence. Find your rhythm.','Watch the numbered tiles light up, then tap them in the same order. Each successful round adds one tile. A mistake ends the run. The game stops after twelve completed rounds. You can use a mouse, touch, or Tab and Enter. Focus on a small group of positions at a time rather than trying to name the whole sequence.'),
        ('reaction-five','Reaction Five','Wait. Watch. Tap when it turns green.','Start a round and wait for the target to turn green. Tap or click once when it changes, or use Space or Enter while the target has keyboard focus. An early response repeats that trial. After five successful trials, the game shows the middle result—the median—so one unusually fast or slow tap does not dominate the score. Device latency and browser timing affect the result, so compare your own runs on the same device.')]:
        body=head('New in the arcade',title,intro)+f'<div id="new-game" class="r-game-shell" data-game="{"memory" if slug=="memory-trail" else "reaction"}"><p>Loading game…</p></div><section class="r-prose r-section"><h2>How to play {title}</h2><p>{instructions}</p><h2>A good challenge, without a verdict</h2><p>This is a recreational browser game. Your score describes this run on this device. It is not a measure of intelligence, health, attention, or any medical condition. Play at a comfortable pace, and take a break whenever you want.</p><h2>Keep your small wins</h2><p>A completed run is added to your local game history and earns a small amount of XP. Visit <a href="/profile.html">your profile</a> to see your progress, or explore <a href="/arcade.html">more word and logic games</a> for a different kind of challenge.</p></section>'
        page(slug+'.html',title+' — Free Browser Game | TheQuizRealm',intro+' Play free, with local progress and no account required.',body,scripts=['assets/arcade-new.js'])

def build_profiles():
    body=head('Your little wins','<span id="player-name">Curious Player</span>','Your progress lives in this browser. Finish games to earn XP, build a play streak, and unlock achievements.')
    body+='''<div class="r-stat-grid" id="player-stats"></div><section class="r-note"><span class="r-eyebrow">Room to grow</span><h2 id="player-rank">Curious Mind</h2><div class="r-progress" role="progressbar" aria-label="Progress to next level" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="margin:25px 0 0"><span id="level-progress" style="width:0%"></span></div><form class="r-form-row" id="nickname-form"><label for="nickname">Your player name</label><input class="r-search" name="nickname" id="nickname" maxlength="24" required autocomplete="nickname"><button class="r-button" type="submit">Save name</button></form><p class="r-footnote">This name stays on this device. It does not create a public account.</p></section><section class="r-section"><div class="r-section-heading"><div><h2>Recently played</h2><p>Your last twenty finished games.</p></div><a class="r-text-link" href="/achievements.html">View achievements ↗</a></div><div id="game-history"></div></section><section class="r-note r-section"><h2>Keep a copy of your progress.</h2><p>Clearing browser storage removes local progress. Export a backup to keep it, or import a TheQuizRealm backup to restore it on this device. Imported data replaces the current profile.</p><div class="r-actions"><button class="r-button" id="export-progress">Export progress</button><label class="r-button secondary" for="import-progress">Import a backup</label><input class="r-hidden" type="file" id="import-progress" accept=".json,application/json"><button class="qr-text-button" id="reset-progress">Reset this profile</button></div><div class="r-note" id="reset-confirm" hidden style="margin-top:20px"><strong>Delete this browser’s progress?</strong><p>This clears XP, achievements, and local game history. Export a backup first if you want to keep them.</p><div class="r-actions"><button class="r-button secondary" id="reset-cancel">Keep progress</button><button class="r-button" id="reset-yes">Delete local progress</button></div></div><p class="r-message" id="profile-message" role="status"></p></section>'''
    page('profile.html','Your Player Progress | TheQuizRealm','See your XP, level, play streak, achievements, and local game history. Export or restore your progress without an account.',body,noindex=True)
    page('achievements.html','Your Achievements | TheQuizRealm','Track ten achievements earned through completed games, daily challenges, and regular play.',head('Little milestones','A collection of small wins.','Ten achievements, earned through play. Try a new topic, finish a perfect round, or make time for a daily challenge.')+'<div class="r-grid" id="achievement-grid"></div><section class="r-prose r-section"><h2>Earned, not bought</h2><p>Achievements unlock when your saved progress reaches the stated goal. There are no purchases, paid boosts, or hidden rewards for signing up. A perfect round requires at least five scored questions with every answer correct.</p><p>Your streak counts consecutive local dates with a finished game. Daily challenge achievements count different daily sets. Your profile and achievements stay in this browser; use <a href="/profile.html">Export progress</a> to make a backup.</p></section>',noindex=True)

def build_collections():
    for filename,c in json.loads((ROOT/'site/collections.json').read_text(encoding='utf-8')).items():
        games=[{'title':title,'url':url,'image':image,'kind':kind,'description':desc,'tags':title,'time':'Read & explore' if kind=='guide' else 'Play in your browser'} for title,url,image,kind,desc in c['games']]
        body=head(c['eyebrow'],c['title'],c['description'])+grid(games)+f'<section class="r-note r-section"><h2>A good way to start</h2><p>{c["note"]}</p><p>Open a game card to see its controls and instructions. Most activities work on a phone or a larger screen. For hosted group play, every player needs an internet connection and a device to answer on.</p><div class="r-actions"><a class="r-button secondary" href="/categories.html">Explore the full library ↗</a><a class="r-text-link" href="/contact.html">Report a question or a broken control</a></div></section>'
        page(filename,c['title']+' | TheQuizRealm',c['description'],body)

def build_social():
    page('duel.html','Two-Player Trivia Duel — One Screen, Two Players | TheQuizRealm','Take turns answering five different trivia questions each. Play untimed or add a real 15-second question limit.',head('A little friendly competition','Pass. Play. Repeat.','Two players, one device, and ten different questions. Choose a topic, take turns, and see who takes the round.')+'<div class="r-game-shell" id="duel-app"><p>Loading the question bank…</p></div><section class="r-prose r-section"><h2>How the same-device duel works</h2><p>Enter two player names, choose a topic, and start. Player one answers the first question, then passes the device to player two for a different question. You each answer five questions. Every correct answer earns one point, and the higher total wins. Equal totals give a draw.</p><p>Questions are hidden behind a handover screen between turns, so you can pass the device without starting the next turn early. By default there is no timer. If you enable the optional 15-second limit, the question clock starts only after the next player presses I’m ready. An unanswered question earns no point when the timer ends.</p><h2>Make it a good match</h2><p>Choose mixed knowledge for a broad round or pick a shared interest. A topic you both enjoy usually makes a better contest than one only one player knows. For a larger group on separate phones, try <a href="/group-hub.html">hosting a trivia room</a>.</p></section>',scripts=['data.js','assets/duel.js'])
    setup=head('Choose your round','<span id="setup-title">Your quiz</span>','Ten questions, four choices, and time to think. Choose a difficulty to get started.')+'<div class="r-game-shell r-game-card" id="quiz-setup"><form><label for="quiz-difficulty">Difficulty</label><div class="r-actions"><select class="r-select" id="quiz-difficulty"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select><button class="r-button" type="submit">Start my round ↗</button></div></form><p class="r-footnote">Some topics have a smaller question bank. The closest available level is used if your choice is unavailable.</p></div>'
    page('mode.html','Choose Your Quiz Difficulty | TheQuizRealm','Choose an easy, medium, or hard trivia round on TheQuizRealm.',setup,scripts=['data.js','assets/setup.js'],noindex=True)
    body=head('Bring your favorite people','Make it a game night.','A shared-screen host, phones for answers, and a room code to bring everyone together. For two players on one device, try the quick duel instead.')
    body+='''<div class="r-split"><section class="r-note"><span class="r-eyebrow">Got a room code?</span><h2>Join your friends.</h2><form id="join-room-form"><div class="r-form-row"><label for="room-code">Four-letter code</label><input class="r-search" id="room-code" name="code" maxlength="4" pattern="[A-Za-z]{4}" placeholder="ABCD" autocomplete="off" autocapitalize="characters" required></div><button class="r-button" type="submit">Join a room ↗</button><p id="room-message" role="status"></p></form></section><section class="r-note"><span class="r-eyebrow">Take the host seat</span><h2>Start a trivia room.</h2><form id="host-room-form"><div class="r-form-row"><label for="host-topic">Choose a topic</label><select class="r-select" id="host-topic"><option value="general_easy">Mixed knowledge</option><option value="science">Science</option><option value="geography">Geography</option><option value="history">History</option><option value="friends">Friends</option><option value="theoffice">The Office</option><option value="food">Food</option></select></div><button class="r-button" type="submit">Create a room ↗</button></form></section></div><section class="r-prose r-section"><h2>A simple setup</h2><ol><li>Open the host screen on a laptop, tablet, or display everyone can see.</li><li>Choose a topic and create a room. A four-letter code and QR link will appear.</li><li>Players join on their phones and choose a nickname. Use a nickname rather than personal information.</li><li>When everyone is in the lobby, start the round. The host controls the pace.</li></ol><p>Hosted rooms need an internet connection. If a room cannot connect, try the same-device duel while the service is unavailable.</p><h2>Playing on one device?</h2><p>The <a href="/duel.html">same-device duel</a> is a simpler option for two players. Take turns, choose an optional timer, and keep the whole game on one screen.</p><p>For a longer evening, read <a href="/host-a-better-quiz-night.html">Host a Better Quiz Night</a> for pacing and format ideas.</p></section>'''
    page('group-hub.html','Games With Friends — Host or Join Trivia | TheQuizRealm','Host a trivia room, join with a four-letter code, or play a same-device duel. Free group games in your browser.',body,scripts=['assets/group-hub.js'])
    page('host-game.html','Host a Trivia Room | TheQuizRealm','Host a shared-screen trivia round and let players join on their phones.',head('The host seat','Your next game night.','Keep this screen visible to the group. Players answer on their own devices.')+'<div class="r-game-shell" id="room-app" data-role="host"><p>Preparing the host screen…</p></div>',scripts=['data.js','assets/rooms.js'],noindex=True)
    page('play.html','Join a Trivia Room | TheQuizRealm','Enter a room code and nickname to join a hosted TheQuizRealm game.',head('You bring the curiosity','Take your seat.','Join a host’s room, answer on your phone, and see how the round unfolds.')+'<div class="r-game-shell" id="room-app" data-role="player"></div>',scripts=['assets/rooms.js'],noindex=True)

def build_reflections():
    write('assets/reflections.json',json.dumps(REFLECTIONS,ensure_ascii=False,separators=(',',':')))
    for slug,c in REFLECTIONS.items():
        body=head('Everyday reflections',escape(c['title']),escape(c['intro']))+f'<div id="reflection-app" class="r-game-shell" data-quiz="{slug}"><p>Loading the questions…</p></div>'
        body+='<section class="r-prose r-section"><h2>What this quiz explores</h2><p>'+escape(c['intro'])+'</p><p>The eight prompts use ordinary situations rather than a clinical checklist. There are no right answers, and you can skip a question or go back to change a choice. Try answering for how you feel today instead of choosing what you think a person ought to do.</p><h2>Two styles, room for both</h2><p>The possible styles are <strong>'+escape(c['axis'][0])+'</strong> and <strong>'+escape(c['axis'][1])+'</strong>. A balanced result is possible too. '+escape(c['result'][0])+' '+escape(c['result'][1])+'</p><h2>Use the answers as a conversation starter</h2><p>After the result, choose one prompt you found difficult and explain why. The discussion is often more useful than the label. Preferences can change with the people involved, the day, or the choices available to you. A short browser quiz cannot describe a whole person.</p><p>These questions are recreational, are not a validated assessment, and do not provide health or relationship advice. If you would rather play a scored game, try the <a href="/daily.html">Daily Ten</a>. For another reflective activity, visit the <a href="/identity-lab.html">reflection collection</a>.</p></section>'
        page(slug+'.html',c['title']+' — A Recreational Reflection | TheQuizRealm',c['intro'],body,scripts=['assets/reflection.js'])

GUIDES={
 'how-to-play-nexus-grid.html':('How to Play Nexus Grid','A practical guide to grouping words, spotting red herrings, and working through the final connection.', '''<p>Nexus Grid asks you to find four groups of four related words. All sixteen words are visible, but a word may suggest more than one connection. Your job is to work out which grouping uses the whole grid consistently.</p><h2>Start with a candidate, not a click</h2><p>Read every word before submitting a group. Look for a connection you can explain in a short phrase: a set of objects, a shared word ending, a familiar expression, or a category. Select four candidates and ask whether all four fit equally well. Three strong matches and a fourth that only half fits are a reason to pause.</p><h2>Keep an eye on the leftovers</h2><p>A tempting group may use a word needed somewhere else. Before committing, check what the remaining words could form. If a choice leaves an obvious group with only three members, try swapping an overlapping word. The puzzle is solved as a complete arrangement, not as four unrelated guesses.</p><h2>Make each attempt useful</h2><p>If a group is rejected, do not immediately submit nearly the same set. Reconsider the category itself. Is it too broad? Could one word have a second meaning? Does the connection rely on how a word sounds rather than what it means? Keep a rejected idea in mind without letting it dominate the rest of the puzzle.</p><h2>When you get stuck</h2><p>Read the remaining words aloud or rearrange them if the game offers a shuffle. A new order can break the visual grouping you have been assuming. Taking a short break can help too. The goal is an enjoyable deduction, so there is no benefit to rushing a guess just to keep moving.</p><p>Ready to try? <a href="/nexus.html">Play Nexus Grid</a>. If you prefer a single hidden sequence with direct feedback after each guess, try <a href="/fusion-core.html">Fusion Core</a> next.</p>'''),
 'host-a-better-quiz-night.html':('Host a Better Quiz Night','A simple plan for choosing a format, setting a friendly pace, and helping everyone take part.', '''<p>A good quiz night gives people something to talk about between questions. You do not need a complicated scoring system or a long list of rules. Start with a format that suits the number of people and the devices you have.</p><h2>Choose the format first</h2><p>For two people on one device, use the <a href="/duel.html">same-device duel</a> and take turns. For a larger group with phones and a shared screen, open the <a href="/group-hub.html">group hub</a>, choose a topic, and create a room. Players can enter the displayed room code or scan the QR code. The hosted format needs an internet connection and the existing Firebase service to be available.</p><h2>Do a small trial round</h2><p>Before starting a long session, check that everyone has joined and can read the questions. On a shared screen, test the viewing distance. On phones, ask someone to answer one practice question. Fixing a missing player before the first scored round is easier than trying to repair the scores later.</p><h2>Mix familiarity with discovery</h2><p>Pick a broad topic for the first round, then let players take turns choosing a favorite subject. A specialist round is more enjoyable when it is followed by something the rest of the group knows. If people have different knowledge levels, use teams or agree that the first round is only for practice.</p><h2>Leave space for conversation</h2><p>Read the answer clearly before moving on. Let someone share why they knew it, then keep the next question close enough that the game does not lose its rhythm. Agree on the number of rounds in advance so players know when the session will finish.</p><h2>Keep the result friendly</h2><p>Celebrate an interesting guess or a surprising recovery as well as the winning score. If a question seems ambiguous, note the exact wording and send it through <a href="/contact.html">Contact &amp; corrections</a>. You can skip a disputed question rather than let one answer take over the evening.</p>'''),
 'how-progress-works.html':('How TheQuizRealm Progress Works','Understand local saves, XP, levels, streaks, daily rounds, and progress backups.', '''<p>TheQuizRealm keeps a player profile in your browser. You can start without an email address or an account. The profile holds your display name, XP, achievements, play streak, and recent completed games.</p><h2>XP comes from finished play</h2><p>The rebuilt trivia experience gives a small completion reward plus points for correct answers. Older arcade games can use their own scoring rules; the shared progress engine records their result without multiplying an XP total as though it were a number of correct answers. XP is a game mechanic, not a measurement of knowledge or ability.</p><h2>Levels grow gradually</h2><p>Level one starts at zero XP. The threshold for level L is 100 × (L − 1)² XP, so the first few levels arrive quickly and later levels take more play. Your profile shows the remaining XP before the next level. Coins are a legacy display derived from XP and have no monetary value.</p><h2>Two different kinds of daily progress</h2><p>A play streak counts consecutive local dates on which you finish a game. Playing several games on one day does not add extra days to the streak. The Daily Ten has its own worldwide reset at midnight UTC. Its first completion for each UTC date is recorded; repeating that set is welcome but does not earn another daily completion.</p><h2>What stays on this device</h2><p>Your profile is saved in local browser storage. It is not automatically uploaded or synchronized between devices. Private browsing, a different browser, or clearing site data can give you a fresh profile. The history display keeps your most recent two hundred completed games, while cumulative totals preserve your earned milestones.</p><h2>Keep a backup</h2><p>Open <a href="/profile.html">My progress</a> and select Export progress to download a JSON backup. You can import that file on another device. Importing replaces the current local profile, so export that profile first if you want to keep both. Only import a backup you trust.</p><p>Achievements are listed with their exact requirements in the <a href="/achievements.html">achievement collection</a>. There are no paid levels, subscriptions, or purchases.</p>'''),
 'word-ladder-guide.html':('A Practical Guide to Word Ladders','Work backward, preserve useful letters, and find a path between two words.', '''<p>A word ladder connects a starting word to a target word by changing one letter at each step. Each intermediate step must also be a word accepted by the game. The length stays the same: changing COLD to CORD is one move; adding a letter is not.</p><h2>Look at the letters that differ</h2><p>Compare the start and target positions. Every different position needs at least one change, which gives you a useful lower bound. A direct replacement may not form a word, so the actual path can be longer. Do not assume the shortest-looking idea is the only valid route.</p><h2>Work from both ends</h2><p>If you cannot find a useful neighbor of the starting word, try changing one letter of the target. A familiar word near the target can give you an intermediate goal. You can keep one or two possible paths in mind and look for a word that joins them.</p><h2>Use flexible letter patterns</h2><p>Some words have many common neighbors; others leave you with very few. A small detour through a flexible pattern can be more productive than a direct-looking move into a dead end. Read each candidate as a whole word before submitting it rather than changing letters at random.</p><h2>Learn from the dictionary feedback</h2><p>A rejected word may be outside the game's dictionary even if you have seen it elsewhere. Proper names, abbreviations, and specialist terms are often excluded. Try an everyday alternative. If a common word is consistently rejected, send the word and the puzzle details through the correction page.</p><p><a href="/word-ladder.html">Play Word Ladder</a>, or switch to <a href="/mini-crossword.html">Mini Crossword</a> for a different kind of word puzzle.</p>''')
}

def build_editorial():
    extra=json.loads((ROOT/'site/articles.json').read_text(encoding='utf-8'))
    for filename,c in extra.items():
        page(filename,c['title']+' | TheQuizRealm',c['description'],f'<p class="r-breadcrumb"><a href="/game-guides.html">Field notes</a> / Guide</p><span class="r-eyebrow">From the TheQuizRealm notebook</span><h1>{c["title"]}</h1><p>{c["description"]}</p>'+c['body'].replace('\\"','"')+f'<p class="r-footnote">Updated {TODAY} · <a href="/contact.html">Suggest a correction</a></p>',prose=True)
    for filename,(title,description,content) in GUIDES.items():
        page(filename,title+' | TheQuizRealm',description,f'<p class="r-breadcrumb"><a href="/game-guides.html">Field notes</a> / Guide</p><span class="r-eyebrow">From the TheQuizRealm notebook</span><h1>{title}</h1><p>{description}</p>{content}<p class="r-footnote">Updated {TODAY} · <a href="/contact.html">Suggest a correction</a></p>',prose=True)
    body=head('The TheQuizRealm notebook','A little more to explore.','Practical game guides, ideas for playing together, and a clear look at how the site works.')
    body+=''.join(f'<a class="r-editorial" href="/{name}"><span class="r-editorial-number">{i+1:02}</span><div><h2 style="font-size:23px">{title}</h2><p>{desc}</p></div></a>' for i,(name,(title,desc,_)) in enumerate(GUIDES.items()))
    body+=''.join(f'<a class="r-editorial" href="/{name}"><span class="r-editorial-number">↗</span><div><h2 style="font-size:23px">{c["title"]}</h2><p>{c["description"]}</p></div></a>' for name,c in extra.items())
    body+='<section class="r-note r-section"><h2>Useful before lengthy</h2><p>These notes explain the actual controls and choices in the games. We favor examples, readable rules, and honest limitations over promises about brain training. If a rule or a question seems wrong, send the page link and the wording through <a class="r-text-link" href="/contact.html">Contact &amp; corrections</a>.</p></section>'
    page('game-guides.html','Field Notes — Game Guides & Quiz Night Ideas | TheQuizRealm','Practical guides to Nexus Grid, word ladders, hosting a quiz night, and keeping your TheQuizRealm progress.',body)
    documents={
      'about.html':('About TheQuizRealm','An independent place for trivia, puzzles, and a little everyday curiosity.', '''<p>TheQuizRealm is an independently maintained collection of browser games. It began with a simple idea: make it easy to spend a few minutes answering a good question, solving a puzzle, or playing something with a friend.</p><h2>What you can play</h2><p>The collection brings together trivia about television, movies, science, geography, history, and culture; word games such as crosswords and word ladders; and visual or logic puzzles. There are also shared-screen games and a hosted trivia format for groups.</p><p>The <a href="/daily.html">Daily Ten</a> gives you a fresh mixed round each day. The <a href="/categories.html">game library</a> is a shorter, curated route into the larger archive, while the <a href="/directory.html">directory</a> lists the remaining collections and articles.</p><h2>A few clear choices</h2><p>Games are free to open and do not require a subscription. The rebuilt player profile saves progress on your device. Optional analytics is a separate choice, and routine play does not create a background Firebase tracking session.</p><p>Reflection quizzes are recreational conversation starters. They are not clinical assessments, diagnoses, or predictions. Scores and levels are game mechanics, not claims about a player's intelligence or health.</p><h2>Still a work in progress</h2><p>The archive has grown over time, and some older games use a different visual style or scoring system. The ongoing work is to make the useful parts easier to find, improve accessibility, and correct unclear questions. If you find a broken control or an ambiguous answer, include the page address and the exact wording when you <a href="/contact.html">get in touch</a>.</p><p>You can read the <a href="/editorial-policy.html">editorial policy</a> for how content and corrections are handled.</p>'''),
      'editorial-policy.html':('How We Make Things','Our approach to game content, corrections, and honest descriptions.', '''<p>TheQuizRealm publishes recreational browser games and supporting guides. A useful page should let you do something clear: play a game, understand its rules, choose a collection, or resolve a question about the site.</p><h2>Game text and trivia</h2><p>Question banks are maintained as part of the site source. Questions should have a clear answer, distinct alternatives, and wording that gives enough context. Facts that change over time need a date or should be replaced by a more stable question. The archive is large and has not received a complete independent fact check.</p><p>If a question is ambiguous or outdated, send its wording, the topic, and the correct answer or a reliable source through the contact page. A correction may change the wording, replace the alternatives, or remove the question.</p><h2>Guides and automated assistance</h2><p>Some writing and code are developed with automated assistance. That is a tool for drafting and maintenance, not evidence of research or first-hand product testing. We do not present invented benchmarks, fabricated credentials, or automated quiz scores as professional assessments.</p><p>Guides should describe the controls and behavior of the actual game. Reflection results should explain their simple scoring and avoid diagnosing a player or making predictions about their relationships, health, or future.</p><h2>Images and fandom references</h2><p>Some games refer to television, film, sport, or other third-party subjects. TheQuizRealm is an independent fan-oriented site and is not endorsed by the people, studios, clubs, or brands mentioned. If you own material that you believe should be removed or credited differently, contact us with the exact URL and details.</p><h2>Advertising and corrections</h2><p>Advertising is currently disabled in the rebuilt experience. The existing publisher verification remains in place. Any future advertising must be kept separate from game controls and must follow the applicable publisher and consent requirements. Corrections and suggestions can be sent to <a href="/contact.html">the public support address</a>.</p>'''),
      'contact.html':('Contact & Corrections','Found a broken game, an unclear question, or a problem with the site? Send the details.', '''<p>The public support address for TheQuizRealm is <a href="mailto:mustafasharaf2023@gmail.com">mustafasharaf2023@gmail.com</a>. This opens your own email application; it does not send a message automatically.</p><h2>Report a game problem</h2><p>Please include the page address, what you were trying to do, and what happened instead. The device and browser can also help reproduce a layout or control issue. Do not include passwords, private account information, or personal details about other players.</p><h2>Suggest a trivia correction</h2><p>Copy the exact question and the answer choices if possible. Tell us which answer you believe is correct and why. A link to a primary or authoritative source is especially useful for dates, names, and facts that change over time.</p><h2>Rights and attribution</h2><p>If you own material used on the site and have a concern, include the exact page or asset URL and enough information to identify the work and your request. The site is independent of the third-party brands and fictional worlds discussed in its games.</p><h2>Before writing</h2><p>The <a href="/FAQ.html">common questions page</a> explains local progress, daily resets, and group play. You can export or reset your browser's progress from <a href="/profile.html">My progress</a>. There is no subscription or billing account to cancel.</p>'''),
      'privacy.html':('Privacy & Your Choices','What is saved on your device, when third-party services are used, and how to change your choices.', '''<p>This page describes the rebuilt TheQuizRealm experience. Updated '''+TODAY+'''.</p><h2>Local game progress</h2><p>The player profile uses browser local storage under QR_PROFILE to save your chosen name, XP, achievements, streak, and recent results. It is not automatically uploaded by the shared progress engine. Some older games also save their own settings locally. Clearing site data removes those local saves. You can export a progress backup from your profile.</p><h2>Optional analytics</h2><p>Analytics is off by default. If you choose Allow analytics, the site loads the existing Google Tag Manager container, GTM-ML3F7KLZ. Analytics can report page visits and game events to help improve the site. Advertising-related consent remains denied. You can reopen <button class="qr-text-button" data-privacy type="button">Privacy choices</button> from the footer and select Essential only. The site respects a browser's Global Privacy Control signal by leaving analytics disabled.</p><p>The rebuilt shared scripts no longer create automatic Firebase visit logs or recurring session heartbeats. A Tag Manager container is separately configured by its owner; this source rebuild does not change the container's internal account settings.</p><h2>Hosted group games</h2><p>Hosting or joining a multiplayer room uses the existing Google Firebase project for game-room state, player names, answers, and scores. Guest authentication can be used for this function. Choose a nickname rather than a full real name. Other players in that room can see the name and score you submit. Public game rooms are not suitable for private information. Resetting a local profile does not delete room data held by the existing service.</p><h2>Other network requests</h2><p>The site is served through the existing GitHub Pages setup. Older game pages may request fonts, icon styles, or libraries from third-party CDNs. Hosted game QR codes use api.qrserver.com and contain the public joining URL. Those services receive normal connection information such as an IP address. Their own privacy policies apply to their processing.</p><h2>Advertising</h2><p>Advertising requests are disabled in the rebuilt site. A publisher verification meta tag and ads.txt remain so the existing publisher account can be reviewed. Enabling ads later requires the appropriate approved account and consent setup; the optional analytics choice is not a certified advertising consent platform.</p><h2>Contact and controls</h2><p>Sending an email uses your email provider and includes the details you choose to send. Do not send sensitive personal information. For questions about this site, use <a href="/contact.html">Contact &amp; corrections</a>. To remove local progress, use Reset this profile or your browser's site-data controls.</p>'''),
      'Terms.html':('Terms of Use','A few straightforward conditions for playing and using TheQuizRealm.', '''<p>TheQuizRealm provides free recreational browser games and supporting content. By using the site, you agree to use it lawfully and avoid disrupting games or other players.</p><h2>Recreational content</h2><p>Trivia questions can contain mistakes or become outdated. Scores, levels, and achievements are for entertainment and have no cash value. Reflection quizzes are not validated assessments and do not provide medical, psychological, financial, or relationship advice.</p><h2>Shared games</h2><p>Use a suitable nickname and treat other players respectfully. Do not enter personal information into public rooms, impersonate another player, or interfere with a hosted session. Group games depend on an internet connection and the availability of third-party services.</p><h2>Progress and availability</h2><p>Most rebuilt progress is stored on your device. The site cannot recover a local save after it is deleted unless you kept an exported backup. Games and features may change or be retired, and uninterrupted access is not guaranteed.</p><h2>Third-party material</h2><p>Referenced names, fictional characters, television programs, films, clubs, and brands belong to their respective owners. TheQuizRealm is independent and does not claim endorsement by them. Contact us with an exact URL if you have a rights or attribution concern.</p><h2>No purchases</h2><p>There are no subscriptions, paid levels, or in-game purchases in the rebuilt site. External services or links are governed by their own terms; the site does not ask you to buy access to a game.</p><p>Questions and corrections can be sent through the <a href="/contact.html">contact page</a>. For data handling and browser-storage controls, read <a href="/privacy.html">Privacy &amp; your choices</a>.</p>'''),
      'FAQ.html':('Common Questions','Quick answers about playing, progress, daily challenges, and group rooms.', '''<details open><summary>Do I need an account or a subscription?</summary><p>No. The games are free to open, and the rebuilt player progress works without an account. There are no paid boosts or subscriptions.</p></details><details><summary>Where is my progress saved?</summary><p>In this browser's local storage. A different browser or device starts with a separate profile. Export a backup from <a href="/profile.html">My progress</a> if you want to keep or transfer your save.</p></details><details><summary>When does the Daily Ten reset?</summary><p>At midnight UTC. Everyone gets the same daily set. A replay does not add another daily completion. Your ordinary play streak counts consecutive local dates with a finished game.</p></details><details><summary>Why did a game not add an achievement?</summary><p>Achievements have specific requirements shown on the achievements page. Older games may have their own scoring and may not report every activity to the shared profile. Merely opening a page does not count as finishing a game.</p></details><details><summary>Can I play with friends?</summary><p>Yes. Same-device games work on a shared screen. Hosted trivia rooms use the existing Firebase service and an internet connection; other players join with a code or QR link.</p></details><details><summary>Are the reflection quizzes scientific tests?</summary><p>No. They are recreational prompts with simple scoring and fictional result categories. They cannot diagnose a condition, predict an outcome, or determine compatibility.</p></details><details><summary>How do I report an incorrect answer?</summary><p>Send the page link and exact question through <a href="/contact.html">Contact &amp; corrections</a>. Include a reliable source when possible.</p></details><details><summary>Can I turn off analytics?</summary><p>Analytics is off unless you choose to allow it. Reopen Privacy choices in the footer to change your preference. Local progress remains available when you choose Essential only.</p></details>''')
    }
    for filename,(title,desc,body) in documents.items():
        page(filename,title+' | TheQuizRealm',desc,f'<span class="r-eyebrow" style="margin-top:40px">Behind the games</span><h1>{title}</h1><p>{desc}</p>{body}',prose=True)
    ALIASES['Cookies.html']='privacy.html'
    page('404.html','Page Not Found | TheQuizRealm','Find your way back to TheQuizRealm’s games and daily challenge.',head('A small wrong turn','This page wandered off.','The link may be old, or the address may have changed. Your next game is still here.')+'<div class="r-actions"><a class="r-button" href="/categories.html">Find a game ↗</a><a class="r-button secondary" href="/daily.html">Play the Daily Ten</a></div>'+section('A few good places to start','Try one of these favorites.',CATALOG[1:5]),noindex=True)
    for filename in RETIRED:
        page(filename,'This Page Has Been Retired | TheQuizRealm','This older page has been retired while TheQuizRealm focuses on its browser games.',head('From the older archive','This page has been retired.','TheQuizRealm is focusing on playable trivia, word games, and puzzles. This older tool or review is no longer maintained and has been removed from the active collection.')+'<div class="r-actions"><a class="r-button" href="/categories.html">Explore the games ↗</a><a class="r-button secondary" href="/editorial-policy.html">How we make things</a></div>',noindex=True)

class Spans(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=False);self.text=text;self.offsets=[0];self.stack=[];self.spans=[];self.comments=[]
        for line in text.splitlines(keepends=True):self.offsets.append(self.offsets[-1]+len(line))
    def position(self):line,col=self.getpos();return self.offsets[line-1]+col
    def handle_starttag(self,tag,attrs):
        if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:
            self.stack.append((tag,dict(attrs),self.position(),self.position()+len(self.get_starttag_text())))
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag:
                t,a,start,open_end=self.stack.pop(i);end=self.text.find('>',self.position())+1;self.spans.append((t,a,start,end,open_end,self.position()));break
    def handle_comment(self,text):self.comments.append((text,self.position()))

def edits_apply(text,edits):
    accepted=[]
    for s,e,r in sorted(edits,key=lambda x:(x[0],-x[1])):
        if accepted and s<accepted[-1][1]:continue
        accepted.append((s,e,r))
    for s,e,r in reversed(accepted):text=text[:s]+r+text[e:]
    return text

def related_for(name):
    collections=json.loads((ROOT/'site/collections.json').read_text(encoding='utf-8'))
    notes_by_url=json.loads((ROOT/'site/game-notes.json').read_text(encoding='utf-8'))
    links=[]
    for route in json.loads((ROOT/'site/reading-paths.json').read_text(encoding='utf-8')):
        members=route['pages']
        if name not in members:continue
        index=members.index(name)
        for step in range(1,min(4,len(members))):
            url=members[(index+step)%len(members)]
            document=(ROOT/url).read_text(encoding='utf-8')
            title=re.search(r'<title[^>]*>(.*?)</title>',document,re.I|re.S)
            title_text=notes_by_url.get(url,{}).get('pageTitle',title[1] if title else Path(url).stem.replace('-',' ').title())
            label=unescape(re.sub(r'\s*[|•—]\s*(?:The)?QuizRealm.*$','',title_text)).strip()
            links.append((url,label))
        break
    for url,collection in collections.items():
        if links:break
        if any(game[1].split('?')[0]==name for game in collection['games']):
            links=[(url,collection['title'])]+[(game[1],game[0]) for game in collection['games'] if game[1].split('?')[0]!=name][:2]
            break
    if not links:
        game=next((game for game in CATALOG if game['url'].split('?')[0]==name),None)
        if game:links=[(other['url'],other['title']) for other in CATALOG if other['kind']==game['kind'] and other['url'].split('?')[0]!=name][:3]
    guides={'nexus.html':'how-to-play-nexus-grid.html','word-ladder.html':'word-ladder-guide.html','minigames.html':'host-a-better-quiz-night.html','rapid.html':'what-a-game-score-means.html'}
    if name in guides:
        guide=guides[name];links.append((guide,GUIDES[guide][0] if guide in GUIDES else 'What a game score means'))
    if not links:links=[('daily.html','Daily Ten'),('arcade.html','Word & logic games'),('game-guides.html','Game guides')]
    links.append(('categories.html','All games'))
    return '<nav class="r-related" aria-label="Explore more games"><h2>Something else to try</h2>'+''.join(f'<a href="/{escape(url,quote=True)}">{escape(title)}</a>' for url,title in links)+'</nav>'

def normalize_archive():
    removed=0
    game_notes=json.loads((ROOT/'site/game-notes.json').read_text(encoding='utf-8'))
    for p in sorted(ROOT.rglob('*.html')):
        name=p.relative_to(ROOT).as_posix()
        if any(x in p.parts for x in ['.git','node_modules','.cache','test-results','playwright-report']) or name in GENERATED or name in ALIASES:continue
        text=p.read_text(encoding='utf-8-sig',errors='replace');parser=Spans(text);parser.feed(text);edits=[];loaded=set()
        for tag,a,s,e,oe,ce in parser.spans:
            block=text[s:e]
            if tag=='div' and 'qr-seo-wrapper' in a.get('class','').split() and '<script' not in block.lower():edits.append((s,e,''));removed+=1
            if tag=='quiz-seo-content':edits.append((s,e,''))
            if tag in ['quiz-header','quiz-home-header']:edits.append((s,e,f'<{tag}>{header(name)}</{tag}>'))
            if tag=='quiz-footer':edits.append((s,e,f'<quiz-footer>{footer()}</quiz-footer>'))
            if tag=='nav' and 'r-related' in a.get('class','').split():edits.append((s,e,related_for(name)))
            if tag=='section' and 'r-game-notes' in a.get('class','').split():edits.append((s,e,''))
            if tag=='noscript' and 'googletagmanager' in block:edits.append((s,e,''))
            if tag=='script':
                src=a.get('src','');path=urlsplit(src).path
                if src and not urlsplit(src).scheme and not src.startswith('//'):
                    if Path(path).name=='hangman.html':edits.append((s,e,''));continue
                    target=(ROOT/path.lstrip('/')) if path.startswith('/') else p.parent/path
                    rel=target.resolve().relative_to(ROOT).as_posix() if target.resolve().is_relative_to(ROOT) else ''
                    if not target.exists() and (ROOT/Path(path).name).is_file():rel=Path(path).name
                    if Path(path).name=='ux-core.js':rel='assets/ux-core.js'
                    if rel in ['game-engine.js','assets/progress.js','components.js','assets/ux-core.js','assets/privacy.js']:
                        edits.append((s,e,''));continue
                    if rel=='firebase-config.js' and name not in ['host-game.html','play.html']:
                        edits.append((s,e,''));continue
                    if rel:
                        if rel in loaded:edits.append((s,e,''));continue
                        loaded.add(rel);edits.append((s,e,re.sub(r'(\bsrc\s*=\s*[\"\'])[^\"\']+',lambda m:m[1]+'/'+rel,block,count=1)))
                if ('googletagmanager.com' in block or 'pagead2.googlesyndication.com' in src or 'google-analytics.com' in src) and not ('function' in block and len(block)>2500):edits.append((s,e,''))
        for comment,pos in parser.comments:
            if re.search(r'VERSION [ABCD]:',comment):
                candidates=sorted([x for x in parser.spans if x[0]=='section' and x[2]>pos],key=lambda x:x[2])
                if candidates:
                    x=candidates[0];block=text[x[2]:x[3]]
                    if '<script' not in block.lower() and 'r-game-notes' not in block and x[2]-pos<400:edits.append((x[2],x[3],''));removed+=1
        text=edits_apply(text,edits)
        text=re.sub(r'<script\b[^>]*src=[\"\']https://polyfill\.io[^\"\']*[\"\'][^>]*>\s*</script>','',text,flags=re.I)
        text=text.replace('maximum-scale=1.0, user-scalable=no','').replace(', user-scalable=no','').replace('user-scalable=no','')
        text=text.replace("transform: translateY(0)","transform: 'translateY(0)'").replace("transform: translateY(-4px)","transform: 'translateY(-4px)'") if name=='challenge-latakia.html' else text
        title_match=re.search(r'<title[^>]*>(.*?)</title>',text,re.S|re.I)
        title=unescape(re.sub('<[^>]+>','',title_match[1])).strip() if title_match else p.stem.replace('-',' ').title()+' | TheQuizRealm'
        title=re.sub(r'\s*[•|]\s*TheQuizRealm.*$',' | TheQuizRealm',title,flags=re.I)
        desc_match=re.search(r'<meta\b(?=[^>]*\bname=[\"\']description[\"\'])(?=[^>]*\bcontent=[\"\']([^\"\']*)[\"\'])[^>]*>',text,re.I)
        desc=unescape(desc_match[1]) if desc_match else f'Explore {p.stem.replace("-"," ")} on TheQuizRealm. Play in your browser and discover related games and collections.'
        if name in game_notes:
            title=game_notes[name].get('pageTitle',title)
            desc=game_notes[name].get('description',desc)
        # One clear set of search/social metadata; remove stale or invented structured data.
        head_match=re.search(r'<head[^>]*>(.*?)</head>',text,re.S|re.I)
        if head_match:
            h=head_match[1]
            h=re.sub(r'<title\b[^>]*>.*?</title>','',h,flags=re.S|re.I)
            h=re.sub(r'<meta\b(?=[^>]*(?:name=[\"\'](?:description|robots|keywords|theme-color|twitter:[^\"\']+|google-adsense-account)[\"\']|property=[\"\']og:[^\"\']+[\"\']))[^>]*>','',h,flags=re.I)
            h=re.sub(r'<link\b(?=[^>]*rel=[\"\']canonical[\"\'])[^>]*>','',h,flags=re.I)
            h=re.sub(r'<script\b[^>]*type=[\"\']application/ld\+json[\"\'][^>]*>.*?</script>','',h,flags=re.S|re.I)
            h=re.sub(r'<meta\b(?=[^>]*http-equiv=[\"\']Content-Security-Policy[\"\'])[^>]*>','',h,flags=re.I)
            canonical=DOMAIN+'/'+name
            meta=f'<title>{escape(title)}</title><meta name="description" content="{escape(desc,quote=True)}"><meta name="robots" content="{"noindex,follow" if name in NOINDEX else "index,follow"}"><link rel="canonical" href="{canonical}"><meta name="google-adsense-account" content="ca-pub-6205081520399538"><meta name="theme-color" content="#101819"><meta property="og:title" content="{escape(title,quote=True)}"><meta property="og:description" content="{escape(desc,quote=True)}"><meta property="og:url" content="{canonical}"><meta property="og:type" content="website"><link rel="stylesheet" href="/assets/realm.css"><script src="/assets/privacy.js" defer></script><script src="/assets/progress.js" defer></script><script src="/components.js" defer></script>'
            h=re.sub(r'<link\b(?=[^>]*rel=[\"\']stylesheet[\"\'])(?=[^>]*href=[\"\']/assets/realm\.css(?:\?[^\"\']*)?[\"\'])[^>]*>','',h,flags=re.I)
            text=text[:head_match.start(1)]+h+meta+text[head_match.end(1):]
        if '<quiz-header' not in text and '<quiz-home-header' not in text:text=re.sub(r'(<body\b[^>]*>)',lambda m:m[1]+'<quiz-header>'+header(name)+'</quiz-header>',text,count=1,flags=re.I)
        if '<quiz-footer' not in text:text=text.replace('</body>','<quiz-footer>'+footer()+'</quiz-footer></body>')
        # Preserve IDs used by game logic. A skip target must never replace one.
        def repair_main_id(m):
            tag=m[0];ids=re.findall(r'\bid\s*=\s*[\"\']([^\"\']+)[\"\']',tag)
            if len(ids)>1 and 'main-content' in ids:tag=re.sub(r'\s+id=[\"\']main-content[\"\']','',tag)
            return tag
        text=re.sub(r'<main\b[^>]*>',repair_main_id,text,flags=re.I)
        if 'id="main-content"' not in text:
            main=re.search(r'<main\b[^>]*>',text,re.I)
            if main and not re.search(r'\bid\s*=',main[0]):text=text[:main.start()]+main[0].replace('<main','<main id="main-content" tabindex="-1"',1)+text[main.end():]
            elif main:text=text[:main.start()]+'<div id="main-content" tabindex="-1"></div>'+text[main.start():]
            else:text=re.sub(r'(<quiz-header>.*?</quiz-header>|<quiz-home-header>.*?</quiz-home-header>)',r'\1<div id="main-content" tabindex="-1"></div>',text,count=1,flags=re.S)
        # Replace broken links with the actual corresponding collection, never unrelated keywords.
        mapping={'syrian-collection.html':'syrian-courtyard.html','/ux-core.js':'/assets/ux-core.js','/archive-reviews.html':'/game-guides.html','/llama-3-review.html':'/categories.html','/claude-review.html':'/categories.html','article-lighthouses.html':'article-light.html','article-mountains.html':'article-volcano.html','world-pulse.html':'orbital-game.html','/world-pulse.html':'/orbital-game.html','/roommate.html':'/article-roommate.html','/roommate2.html':'/article-roommate2.html','/sudoku.html':'/tango-logic.html','/settings.html':'/profile.html','article-cities.html':'orbital-game.html','/site.webmanifest':'/manifest.json','site.webmanifest':'/manifest.json','/assets/rm-favicon.ico':'/favicon.ico','/jasper-ai-review.html':'/categories.html','/future-trends.html':'/game-guides.html','avatar-middle-post.html':'avatar-movies.html','indian-cinema-lore.html':'100-bollywood-trivia-questions.html','indian-mythology-history.html':'indian-epics-cryptex.html','dopamine_menu-test.html':'identity-lab.html','/assets/bernabeu-new.jpg':'/assets/bernabeu-new.png','/assets/rm-squad.png':'/assets/rm-hero-white.png','/assets/florentino-sig.png':'/assets/rm-crest-hd.png','syria-architecture-timeline.html':'syria-interactive-map.html','/privacy':'/privacy.html','/terms':'/Terms.html'}
        def fix_ref(m):
            start,ref,end=m.groups();u=urlsplit(ref)
            if u.scheme or u.netloc or not u.path or u.path=='/':return m[0]
            target=(ROOT/unquote(u.path).lstrip('/')) if u.path.startswith('/') else p.parent/unquote(u.path)
            if target.exists():
                rel=target.resolve().relative_to(ROOT).as_posix()
                rel=ALIASES.get(rel,rel)
                return start+'/'+rel+('?' + u.query if u.query else '')+('#'+u.fragment if u.fragment else '')+end
            new=mapping.get(ref) or mapping.get(u.path)
            if new:return start+('/'+new.lstrip('/'))+end
            if (ROOT/unquote(u.path).lstrip('/')).exists():return start+'/'+unquote(u.path).lstrip('/')+end
            return m[0]
        text=re.sub(r'((?:href|src|poster)\s*=\s*[\"\'])([^\"\']+)([\"\'])',fix_ref,text)
        text=text.replace('TheQuizRealm Inc.','TheQuizRealm')
        # A compact, useful path back into the library replaces repeated promotional essays.
        if 'class="r-related"' not in text:
            text=text.replace('<quiz-footer>',related_for(name)+'<quiz-footer>',1)
        if name in game_notes:
            notes=game_notes[name]
            section='<section class="r-prose r-game-notes"><h2>'+escape(notes['title'])+'</h2>'+notes['body'].replace('\\"','"')+'</section>'
            text=text.replace('<nav class="r-related"',section+'<nav class="r-related"',1)
        write(name,text)
    return removed

def build_aliases():
    for name,target in ALIASES.items():
        url='/'+target
        # The visible link and canonical work without JS. JS also retains query/hash.
        text=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>This Page Has Moved | TheQuizRealm</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="{DOMAIN+url}"><meta http-equiv="refresh" content="0;url={url}"><link rel="stylesheet" href="/assets/realm.css"></head><body class="realm-page"><main class="r-container r-prose"><h1>This page has moved.</h1><p><a href="{url}">Continue to the current page</a>.</p></main><script>location.replace({json.dumps(url)}+location.search+location.hash);</script></body></html>'''
        write(name,text)

def build_directory():
    groups={'Collections':[],'Games & activities':[],'Articles & guides':[],'About & support':[]}
    collection_words=['hub','collection','courtyard','portal','vault-hub','directory','color-hub']
    for p in ROOT.glob('*.html'):
        name=p.name
        if name in ALIASES or name in NOINDEX or name in RETIRED or name in ['index.html','directory.html']:continue
        text=p.read_text(encoding='utf-8');match=re.search(r'<title[^>]*>(.*?)</title>',text,re.S|re.I)
        title=unescape(re.sub('<[^>]+>','',match[1] if match else p.stem))
        title=re.sub(r'\s*[•|—]\s*TheQuizRealm.*$','',title).strip()
        group='About & support' if name in ['about.html','contact.html','privacy.html','Terms.html','FAQ.html','editorial-policy.html'] else 'Collections' if any(w in name for w in collection_words) else 'Articles & guides' if name.startswith('article-') or name in GUIDES or name in ['social-quiz-guide.html','games-for-a-work-break.html','tv-trivia-night.html','what-a-game-score-means.html','couples-compatibility-test.html'] or any(w in name for w in ['guide','best-','psychology-','history-of','evolution-','the-acceleration','the-anti-trend']) else 'Games & activities'
        groups[group].append((name,title))
    body=head('The complete map','Follow a thread.','A directory of TheQuizRealm’s games, regional collections, and reading. Start with the curated library if you would like a shorter list.')+'<div class="r-actions"><a class="r-button" href="/categories.html">Visit the game library ↗</a><a class="r-button secondary" href="/daily.html">Try the Daily Ten</a></div>'
    for group,items in groups.items():
        body+=f'<section class="r-section" id="{"collections" if group=="Collections" else "articles" if group=="Articles & guides" else "support" if group=="About & support" else "activities"}"><div class="r-section-heading"><h2>{group}</h2></div><div class="r-list-grid">'+''.join(f'<a href="/{name}">{escape(title)}</a>' for name,title in sorted(items,key=lambda x:x[1].casefold()))+'</div></section>'
    page('directory.html','Complete Game & Topic Directory | TheQuizRealm','Browse TheQuizRealm’s game pages, regional collections, and practical guides from one crawlable directory.',body)

def sitemap():
    document=render_sitemap(ROOT)
    write('sitemap.xml',document)
    write('robots.txt',f'User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml')
    write('manifest.json',json.dumps({'name':'TheQuizRealm — Games for Curious People','short_name':'TheQuizRealm','start_url':'/','display':'standalone','background_color':'#101819','theme_color':'#101819','icons':[{'src':'/android-chrome-192x192.png','sizes':'192x192','type':'image/png'},{'src':'/android-chrome-512x512.png','sizes':'512x512','type':'image/png'}]},indent=2))
    return document.count('<loc>')

def main():
    write('components.js',(ROOT/'site/components.js').read_text(encoding='utf-8'))
    write('game-engine.js','/* Compatibility entry point for modules importing the shared engine. */\nimport "/assets/progress.js";\nexport const GameEngine = window.GameEngine;')
    write('assets/ux-core.js','/* Legacy entry point: automatic Firebase telemetry has been retired. */\nexport const trackEvent = (name, data = {}) => window.GameEngine?.trackEvent(name, data);')
    write('firebase-config.js',(ROOT/'site/firebase-config.js').read_text(encoding='utf-8'))
    daily=json.loads((ROOT/'site/daily-bank.json').read_text(encoding='utf-8'))
    write('assets/daily-bank.js','/* Curated Daily Ten questions and answer explanations. */\nconst DAILY_BANK = '+json.dumps([{'question':q,'options':a,'correctIndex':0,'explanation':e} for q,a,e in daily],ensure_ascii=False,separators=(',',':'))+';')
    write('assets/nexus/puzzles.json',(ROOT/'site/nexus-puzzles.json').read_text(encoding='utf-8'))
    build_hubs();build_profiles();build_reflections();build_social();build_editorial();build_collections()
    build_rapid(page,head,related_for)
    removed=normalize_archive();build_aliases();build_directory();count=sitemap()
    print(json.dumps({'generated_pages':len(GENERATED),'redirect_aliases':len(ALIASES),'removed_repeated_blocks':removed,'sitemap_urls':count}))

if __name__=='__main__':main()

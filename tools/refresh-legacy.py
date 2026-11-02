"""Refresh retained game copy without changing selectors, questions, or controls."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import rebuild_site as build

ROOT = Path(__file__).resolve().parents[1]
THEMED = set('nexus word-ladder fusion-core cryptex mini-crossword crossword minigames rapid mathsprint hangman spelling tango-logic odd-one-out rank-it'.split())
# Complete labels only: identifiers and trivia questions stay unchanged.
LABELS = {
    'Neural Draw': 'Sketch and Guess',
    'Rapid Fire Protocol': 'Rapid Fire Trivia',
    'Neon Ladder': 'Word Ladder',
    'Word Association Protocol': 'A One-Letter-at-a-Time Puzzle',
    'Word Decryption Puzzle': 'Five-Letter Word Puzzle',
    'Logic Decryption': 'Logic Puzzle',
    'Binary Logic Protocol': 'Binary Logic Puzzle',
    'Vektor Cyberpath Protocol': 'Refract Light Puzzle',
    'Initialize teams for visual data transmission protocol.': 'Choose your teams, a word category, and a time limit.',
    'GAME CONFIG': 'Set up your drawing game',
    'Signal Calibration': 'Before you start',
    'CONFIDENTIAL INTEL': 'Your secret word',
    'Cyber Punks': 'Team One', 'Neon Riders': 'Team Two',
    'SIGNAL LOST': 'Out of guesses',
    'Mission Brief': 'How to play', 'MISSION BRIEF': 'How to play',
    'Mission Parameters': 'How to play', 'MISSION PARAMETERS': 'How to play',
    'Mission Progress': 'Round progress', 'Mission Complete': 'Round complete',
    'Retry Mission': 'Play again', 'Next Mission': 'Next round',
    'Initiate Decryption': 'Start the puzzle', 'Decryption Complete': 'Puzzle complete',
    'Initiate Simulation': 'Try the map game', 'Initiate Sequence': 'Start playing',
    'Initiate Radar': 'Start the round', 'Initiate Your Event': 'Plan your game night',
    'Initiate Snap Module': 'Play Split Second', 'Initiate Grid Module': 'Play the grid game',
    'Initiate Auction Module': 'Play Trivia Auction', 'Initiate Tug-of-War': 'Play Tug of War',
    'INITIATE ARCADE': 'Explore the arcade', 'Start Protocol': 'Start the quiz',
    'Launch Protocol': 'Play the quiz', 'Protocol Complete': 'Round complete',
    'FILE DECRYPTION': 'Answer the questions',
    '[ PROTOCOL ] Sparks Rules': 'How to play Sparks',
    '[ PROTOCOL ] Flag Rules': 'How to play',
    '[ PROTOCOL ] Midnight Rules': 'How to play',
    '[ PROTOCOL ] Unhinged Rules': 'How to play',
    '[ SYS.LOG ] Protocol Rules': 'Auction rules',
    'INTERNAL PROTOCOL // CONFLICT & DAMAGE CONTROL': 'A reflection on handling disagreements',
    'MEMORY RESTORATION PROTOCOL v9.2': 'A memory puzzle for Rick and Morty fans',
    'The Mission': 'The challenge', 'The Protocol': 'How to play',
    'How the Memory Protocol Works': 'How the memory game works',
    'Level 10 (The Omega Protocol):': 'Level 10 (The final challenge):',
    'Re-Calibrate': 'Try again', 'Calibrate Instincts': 'Try a round',
    'Calibrate Your Vision': 'Take a closer look',
    'Cognitive Protocol': 'How to play', 'Asylum Admission Protocol': 'Your fictional character match',
    'More Logic Protocols': 'More logic puzzles',
    'Historical Timeline Protocol': 'History Timeline', 'History Timeline Protocol': 'History Timeline',
    'Odd One Out Protocol': 'Odd One Out', 'The Odd One Out Protocol': 'Odd One Out',
    'Mapless Geography Protocol': 'Mapless Geography', 'Word Ladder Protocol': 'Word Ladder',
    'Hawkins Persona Protocol': 'Hawkins Character Quiz', 'Fire & Ash Lore Protocol': 'Fire & Ash Quiz',
    'Fire & Ash Protocol': 'Fire & Ash Quiz', 'Personality Protocol': 'Character Quiz',
    'Fire & Ash personality protocol': 'Fire & Ash character quiz',
    'The Boundary Protocol': 'Talking about boundaries',
    'Date Night Escalation Protocol': 'Date Night Conversation Ideas',
    'The Escalation Protocol': 'Choosing a comfortable pace',
    'The Binary Choice Protocol': 'How to choose a question',
    'The Anti-Distraction Protocol': 'A Little Time Away from Distractions',
    'The Cachupa Protocol': 'A Guide to Cachupa', 'Explore The Protocol': 'Explore the guide',
    'The Extreme Environment Survival Protocol': 'Living with an extreme environment',
    'Visual Anomaly Protocol': 'Visual Puzzle', 'Math Sprint Protocol': 'Math Sprint',
    'Digital Spelling Bee Protocol': 'Spelling Bee', 'Orbital Geography Protocol': 'Map Quiz',
    'Impossible Batman Trivia Protocol': 'Batman Trivia',
    'Stranger Things Upside Down Protocol': 'Stranger Things Quiz',
    'Visual Decryption': 'Visual Puzzles',
    'From Pubs to Cyber Arenas': 'From Pub Nights to Browser Games',
    'Low Latency Protocol': 'Keep setup simple',
    'The zero-install protocol': 'Playing without an installation',
    'The Zero-Install Protocol': 'Playing without an installation',
    'ESCAPISM PROTOCOL:': 'A familiar favorite:',
    'Mission Link': 'Try the map game',
    'World Pulse missions': 'map rounds',
    'Cyber Mode': 'Logic puzzles', 'Calibration Mode': 'Quick challenges',
    'Cognitive training protocols and pattern recognition.': 'Word games, visual puzzles, and quick trivia.',
    'Test Your Neural Link': 'Try the character quiz',
    'Cryptex Decryption': 'CryptEx Word Puzzle',
    'Cyber Terminal': 'Word and logic games',
    'Neural Training': 'Quick trivia rounds',
    'Binary Protocol': 'A binary logic puzzle',
    'INITIATE TEST': 'Start the quiz',
    'Initiate Security Scan': 'Start the quiz',
    'Connection Stable': 'Ladder complete',
    'LINK ESTABLISHED': 'Ladder complete',
    'ACCESS GRANTED': 'Word solved',
    'Decryption Instructions': 'How to solve the cryptogram',
    '[ PROTOCOL ] Secret Rules': 'How to play',
    'VIBE LAB PROTOCOLS': 'Personality and reflection quizzes',
    'The Science of Mental Math': 'A quick arithmetic challenge',
    'Tactical Guide': 'How to play',
    'One operative draws, others intercept (guess).': 'One person draws while their team guesses.',
    'TARGET IDENTIFIER:': 'YOUR WORD:',
    'Cognitive Science': 'About the game',
    'Time limits eliminate distractions and enforce tunnel vision.': 'Read the arithmetic expression, then select an answer before the round ends.',
    'Daily Brain Activation': 'A short word puzzle',
    'A simple decryption strategy that wins more often': 'A practical way to use the letter clues',
    'word decryption puzzle': 'five-letter word puzzle',
    'Vortex Cross • Premium Speed Puzzle': 'Mini Crossword — A 5×5 Word Puzzle',
    'Chronos Lexicon • Hangman v2': 'Hangman — Themed Word Puzzles | TheQuizRealm',
    'A futuristic evolution of Hangman. Race against the Chronos timer to decrypt words before your lifeline runs out. High-speed vocabulary training.': 'Guess letters in themed words and phrases. Play with six allowed mistakes, optional hints, and a shared local player profile. No countdown timer.',
    'The premium 5x5 mini crossword. Solve daily logic puzzles against a global timer.': 'Solve a compact five-by-five crossword using clue lists and an on-screen keyboard. Your round timer and results stay local.',
}

def labels(text):
    for old,new in sorted(LABELS.items(),key=lambda item:-len(item[0])):
        text=text.replace(old,new)
    return text

class FriendlyText(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=False)
        self.text=text;self.offsets=[0];self.skipped=0;self.edits=[]
        for line in text.splitlines(keepends=True):self.offsets.append(self.offsets[-1]+len(line))
    def handle_starttag(self,tag,attrs):
        if tag in ['script','style']:self.skipped+=1
    def handle_endtag(self,tag):
        if tag in ['script','style']:self.skipped=max(0,self.skipped-1)
    def handle_data(self,text):
        if self.skipped:return
        replacement=labels(text)
        if text.strip()=='Protocols':replacement=text.replace('Protocols','How to play')
        if text.strip()=='Protocol':replacement=text.replace('Protocol','How to play')
        if text.strip()=='Protocol.':replacement=text.replace('Protocol.','A playful reflection.')
        if text.strip()=='INITIATE':replacement=text.replace('INITIATE','Start playing')
        if text.strip()=='CONNECTED':replacement=text.replace('CONNECTED','Connections found')
        replacement=re.sub(r'\bMission (\d+)\b',r'Map \1',replacement)
        if replacement!=text:
            line,col=self.getpos();start=self.offsets[line-1]+col
            self.edits.append((start,start+len(text),replacement))

changed=[];removed=0
for path in ROOT.glob('*.html'):
    text=path.read_text(encoding='utf-8-sig');original=text
    if '<body class="realm-page">' in text or 'http-equiv="refresh"' in text:continue
    parser=build.Spans(text);parser.feed(text);edits=[]
    for tag,attrs,start,end,_,_ in parser.spans:
        if tag!='section' or attrs.get('id'):continue
        block=text[start:end]
        if re.search(r'<script|<button|<input|\bon\w+\s*=',block,re.I):continue
        if ('The Neural Gym' in block and 'Cryptex Decryption' in block) or ('Explore The Archives' in block and 'Seasonal Protocols' in block):
            edits.append((start,end,''));removed+=1
    text=build.edits_apply(text,edits)
    # This panel was decorative telemetry, not a connection to a real service.
    if path.name=='minigames.html':
        if 'id="turnDisplay"' not in text:
            text=text.replace('<span class="text-xs font-bold text-slate-400" id="roundDisplay">ROUND 1 / 10</span>',
                '<div><span class="text-xs font-bold text-slate-400" id="roundDisplay">ROUND 1 / 10</span><span id="turnDisplay" class="block text-xs font-bold text-accentBlue">Team One Drawing</span></div>')
        text=re.sub(r'> SYSTEM_CHECK: ONLINE<br>\s*> NEURAL_LINK: STABLE<br>\s*> UPLINK_SPEED: 100%<br><br>\s*This module tests rapid visual communication protocols\. Ensure all operatives are ready before initiating timer sequence\.',
                    'One person draws while their team guesses. Keep the secret word out of sight, agree on any drawing rules, and pass the device when the turn ends.',text)
    if path.name=='hangman.html':
        text=text.replace('Chronos <span','Hangman <span').replace('>Lexicon</span>','>Word Puzzle</span>')
    text=labels(text)
    parser=FriendlyText(text);parser.feed(text);text=build.edits_apply(text,parser.edits)
    if path.stem in THEMED:
        if 'qr-legacy-page' not in text:
            text=re.sub(r'<body\b([^>]*)>',lambda m:'<body'+re.sub(r'\bclass="([^"]*)"',lambda a:'class="'+a[1]+' qr-legacy-page"',m[1])+'>' if 'class="' in m[1] else '<body class="qr-legacy-page"'+m[1]+'>',text,count=1)
        if '/assets/legacy.css' not in text:text=text.replace('</head>','<link rel="stylesheet" href="/assets/legacy.css"></head>',1)
    if text!=original:build.write(path.name,text);changed.append(path.name)

for name in ['catalog.json','collections.json']:
    path=ROOT/'site'/name;text=path.read_text(encoding='utf-8');updated=labels(text)
    if updated!=text:path.write_text(updated,encoding='utf-8');changed.append('site/'+name)
print(json.dumps({'refreshed_pages':len(changed),'removed_repeated_sections':removed}))

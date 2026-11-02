"""Small, idempotent repairs to retained standalone games."""
from pathlib import Path
import re, shutil
ROOT=Path(__file__).resolve().parents[1]
for name in ['European-History.html','euro-history-trivia2.html']:
    p=ROOT/name;text=p.read_text(encoding='utf-8');main_position=text.lower().find('<main');moved=[]
    def move(m):
        if m.start()<main_position and 'getElementById' in m[0] and 'tailwind.config' not in m[0]:moved.append(m[0]);return ''
        return m[0]
    text=re.sub(r'<script\b[^>]*>[\s\S]*?</script>',move,text,flags=re.I)
    if moved:text=text.replace('</body>','\n'.join(moved)+'\n</body>');p.write_text(text,encoding='utf-8')
vendor=ROOT/'assets/vendor';vendor.mkdir(exist_ok=True)
shutil.copyfile(ROOT/'node_modules/sortablejs/Sortable.min.js',vendor/'sortable.min.js')
shutil.copyfile(ROOT/'node_modules/sortablejs/LICENSE',vendor/'sortable.LICENSE.txt')
p=ROOT/'rank-it.html';text=p.read_text(encoding='utf-8');text=re.sub(r'https://[^\"\']*Sortable\.min\.js','/assets/vendor/sortable.min.js',text);text=text.replace('You are an absolute psychopath and a danger to society.','That ranking will definitely start a conversation.');p.write_text(text,encoding='utf-8')
print('Repaired retained game startup and vendored the drag-and-drop dependency.')

# The hangman toast contained a copied example that saved a fictitious 8/10.
p=ROOT/'hangman.html';text=p.read_text(encoding='utf-8')
text=re.sub(r'\s*// Example usage inside your End Game function\s*saveGameResult\([\s\S]*?\n\);','',text,count=1)
if '/* realm:hangman-results */' not in text:
    text=text.replace('this.saveProfile(); this.showModal(true, earned);','this.saveProfile(); this.showModal(true, earned);\n/* realm:hangman-results */\nwindow.GameEngine?.addXP(earned); window.GameEngine?.saveGameResult("Hangman", 1, 1);')
    text=text.replace('this.state.isGameOver=true; this.state.streak=0; this.saveProfile();','this.state.isGameOver=true; this.state.streak=0; this.saveProfile();\nwindow.GameEngine?.completeGame("Hangman", 0, 1);')
p.write_text(text,encoding='utf-8')

# Restore the missing crossword autosave function, including safe resume.
p=ROOT/'crossword.html';text=p.read_text(encoding='utf-8')
if 'function scheduleAutosave(' not in text:
    marker='    function formatTime(sec){'
    helper='''    let autosaveTimer = null;
    function scheduleAutosave(immediate = false){
      clearTimeout(autosaveTimer);
      const save = () => {
        if (!cells || !currentCategory) return;
        try { localStorage.setItem('QR_CW15_GAME', JSON.stringify({key: nowDateKey()+'|'+currentCategory.key+'|'+currentSeedCounter, values: cells.map(row=>row.map(c=>c.val||'')), hints:state.hintsUsed, elapsed:Math.max(0,Date.now()-state.startedAt), solved:state.solved})); } catch(e) {}
      };
      if(immediate)save();else autosaveTimer=setTimeout(save,250);
    }
    function restoreCrossword(){
      try {
        const saved=JSON.parse(localStorage.getItem('QR_CW15_GAME'));
        if(!saved || saved.key!==nowDateKey()+'|'+currentCategory.key+'|'+currentSeedCounter || !Array.isArray(saved.values))return;
        for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)if(!cells[r][c].isBlock)cells[r][c].val=/^[A-Z]$/.test(saved.values[r]?.[c]||'') ? saved.values[r][c] : '';
        state.hintsUsed=Math.max(0,Number(saved.hints)||0);state.startedAt=Date.now()-Math.min(86400000,Math.max(0,Number(saved.elapsed)||0));state.solved=Boolean(saved.solved);
      } catch(e) {}
    }
'''
    text=text.replace(marker,helper+marker)
    text=text.replace('      state.solved = false;\n\n      const first = findFirstOpen();','      state.solved = false;\n      state.hintsUsed = 0;\n      restoreCrossword();\n\n      const first = findFirstOpen();')
    text=text.replace('Auto-detected ${total} crossword ${total === 1 ? "bank" : "banks"} from your loaded JS.','Choose from ${total} crossword ${total === 1 ? "collection" : "collections"}.')
p.write_text(text,encoding='utf-8')

# Decorative artwork must not create horizontal scrolling.
for name,replacements in {
 'lifestyle-blog.html': [('top-4 left-4 w-full h-full','top-4 left-4 h-full'),('class="absolute top-4 left-4 h-full border border-ink pointer-events-none"','class="absolute top-4 left-4 h-full border border-ink pointer-events-none r-fixed-decoration" style="width:calc(100% - 2rem)"')],
 'lumina-valley.html':[('top: -10%; left: -10%;','top: -10%; left: 0;'),('bottom: 10%; right: -10%;','bottom: 10%; right: 0;')],
 'sitcom-geek-culture-hub.html':[('right: -50px;','right: 15px;'),('left: -100px;','left: 15px;')]
}.items():
    p=ROOT/name;text=p.read_text(encoding='utf-8')
    for before,after in replacements:text=text.replace(before,after)
    p.write_text(text,encoding='utf-8')

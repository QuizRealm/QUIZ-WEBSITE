"""Remove unsupported promotional claims without touching game controls."""
from pathlib import Path
import re
import rebuild_site as build
ROOT=Path(__file__).resolve().parents[1]
removed=0
claim=re.compile(r'cortisol|dopamine|acetylcholine|prefrontal cortex|neuroplasticity|delaying cognitive decline|medical tool|evaluate the mental health|scientifically proven|trauma can be inherited|neural (?:pathways|firing)|motor cortex|synaptic delay|enhances working memory|improves overall executive function|single biggest predictor of relationship longevity',re.I)
for p in ROOT.glob('*.html'):
    text=p.read_text(encoding='utf-8')
    original=text
    if '<body class="realm-page">' in text:continue
    parser=build.Spans(text);parser.feed(text);edits=[]
    for tag,attrs,start,end,_,_ in parser.spans:
        if tag not in ['p','li'] or attrs.get('id'):continue
        block=text[start:end]
        if re.search(r'\bid\s*=|\bon\w+\s*=|<script|<button|<input',block,re.I):continue
        if claim.search(re.sub('<[^>]+>',' ',block)):
            edits.append((start,end,''));removed+=1
    text=build.edits_apply(text,edits)
    if p.name=='quiz-gotham-villain.html':
        text=re.sub(r'psycho:\s*"(?:[^"\\]|\\.)*"','psycho: "Your choices match the dramatic style of this fictional character. This is a fandom match, not a psychological assessment."',text)
        text=text.replace('Psychological Profile','Character Notes').replace('Psychological Analysis','Character Notes')
        q=build.Spans(text);q.feed(text)
        text=build.edits_apply(text,[(s,e,'') for tag,a,s,e,_,_ in q.spans if a.get('id')=='lockOverlay'])
    if p.name=='ick-test.html':
        text=text.replace('Diagnostic Result','Your Fictional Style').replace('empathy is dangerously high','preference for considerate behavior stands out').replace('Empathy low, snobbery high','Your answers favored presentation and first impressions')
    if p.name=='cronenberg-match.html':
        text=text.replace('biologically compatible soulmate','fictional creature match').replace('genetic queries','fictional scenario questions').replace('Compatibility Confirmed','Fictional Match Revealed').replace('OFFSPRING PROJECTED','YOUR FICTIONAL CREATURE').replace('Genetic Simulation Complete. Viability High.','Character match complete. For entertainment only.')
        text=re.sub(r'<meta name="description"[^>]*>','<meta name="description" content="A fictional creature personality quiz inspired by Rick and Morty. Choose answers to playful scenarios and reveal a character match.">',text,count=1)
    if p.name=='quiz-xmas-persona.html':text=text.replace('psychometric analysis of your holiday spirit','playful holiday character quiz')
    if p.name=='quiz-xmas-persona.html':
        q=build.Spans(text);q.feed(text)
        text=build.edits_apply(text,[(s,e,'') for tag,a,s,e,_,_ in q.spans if a.get('id')=='lockOverlay'])
    if p.name=='TBBTPERSON.html':text=text.replace('CALCULATING IQ…','MATCHING YOUR ANSWERS…').replace('CALCULATING IQ...','MATCHING YOUR ANSWERS...').replace('FACTORING IN MOTHER ISSUES…','CHECKING THE ROOMMATE AGREEMENT…').replace('FACTORING IN MOTHER ISSUES...','CHECKING THE ROOMMATE AGREEMENT...')
    if text!=original:build.write(p.name,text)
print(f'Removed {removed} unsupported promotional paragraphs; retained game controls.')

"""Build the timed trivia page and its crawlable, game-specific guidance."""
from html import escape
import json
from pathlib import Path

def build_rapid(page,head,related_for):
    root=Path(__file__).resolve().parents[1]
    notes=json.loads((root/'site/game-notes.json').read_text(encoding='utf-8'))['rapid.html']
    body=head('One minute. Plenty of questions.','Rapid Fire Trivia','Choose a topic and answer as many questions as you can in sixty seconds. A wrong answer costs five seconds. Every answer gives you something to review.')
    body+='<div id="rapid-app" class="r-game-shell"><p>Preparing the topic list…</p></div>'
    body+='<section class="r-prose r-game-notes"><h2>'+escape(notes['title'])+'</h2>'+notes['body'].replace('\\"','"')+'</section>'+related_for('rapid.html')
    page('rapid.html','Rapid Fire Trivia — A 60-Second Quiz | TheQuizRealm','Play a sixty-second trivia round with a topic of your choice. Correct answers build your score; mistakes cost five seconds. Review every answer after the round.',body,scripts=['data.js','assets/rapid.js'])

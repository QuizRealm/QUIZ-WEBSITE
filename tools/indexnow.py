"""Submit the checked canonical sitemap to IndexNow, using the public key file."""
from pathlib import Path
from urllib.request import Request, urlopen
import json, re, xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
keys=[p for p in root.glob('*.txt') if re.fullmatch(r'[a-fA-F0-9]{32}',p.stem) and p.read_text().strip()==p.stem]
if not keys:
    print('IndexNow skipped: no matching public verification file.')
    raise SystemExit(0)
urls=[e.text for e in ET.parse(root/'sitemap.xml').getroot().iter() if e.tag.endswith('loc')]
payload={'host':'thequizrealm.com','key':keys[0].stem,'keyLocation':'https://thequizrealm.com/'+keys[0].name,'urlList':urls}
request=Request('https://api.indexnow.org/indexnow',data=json.dumps(payload).encode(),headers={'Content-Type':'application/json'},method='POST')
with urlopen(request,timeout=30) as response:
    print(f'IndexNow accepted {len(urls)} canonical URLs (HTTP {response.status}).')

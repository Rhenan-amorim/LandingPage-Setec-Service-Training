"""Static integrity checks for the design migration, against the committed baseline."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
from urllib.parse import urlsplit, unquote
import subprocess, re, unicodedata, hashlib, json

ROOT = Path(__file__).resolve().parent.parent
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
COPY_TAGS = set('h1 h2 h3 h4 h5 p li label option'.split())
COPY_CLASSES = set('pillar-text func-item ead-perk t-hours t-tag ci-info nr-card-link'.split())

def normalize(value):
    return ' '.join(''.join(c for c in value if unicodedata.category(c) not in {'So','Mn','Me','Sk'}).split())

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.stack=[]; self.copy=[]; self.ids=[]; self.refs=[]; self.errors=[]; self.nav=[]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs); classes=set(a.get('class','').split())
        if 'id' in a: self.ids.append(a['id'])
        for attr in ('src','href'):
            if attr in a: self.refs.append(a[attr])
        if 'srcset' in a:
            self.refs.extend(x.strip().split()[0] for x in a['srcset'].split(','))
        if 'dock-link' in classes: self.nav.append(a.get('data-section'))
        if tag not in VOID:
            self.stack.append({'tag':tag,'text':[], 'capture':(tag in COPY_TAGS or bool(classes & COPY_CLASSES)) and not any(x['tag']=='nav' for x in self.stack)})
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag,attrs)
        if tag not in VOID: self.handle_endtag(tag)
    def handle_data(self, data):
        for frame in self.stack: frame['text'].append(data)
    def handle_endtag(self, tag):
        if tag in VOID: return
        if not self.stack or self.stack[-1]['tag'] != tag:
            self.errors.append('Unexpected closing '+tag)
            return
        frame=self.stack.pop()
        if frame['capture']:
            self.copy.append(normalize(''.join(frame['text'])))

pages=[ROOT/'index.html',*sorted((ROOT/'nr').glob('*.html')),*[ROOT/name for name in ('termos-de-uso.html','politica-de-privacidade.html','compliance.html')]]
docs={path:Document(path.read_text(encoding='utf-8')) for path in pages}
errors=[]
for path, doc in docs.items():
    relative=path.relative_to(ROOT).as_posix()
    if doc.errors or doc.stack: errors.append([relative,'HTML structure',doc.errors,[x['tag'] for x in doc.stack]])
    repeated=[key for key,count in Counter(doc.ids).items() if count>1]
    if repeated: errors.append([relative,'duplicate IDs',repeated])
    if doc.nav != ['home','quem-somos','servicos','gestao','treinamentos','nr-cursos','contato']:
        errors.append([relative,'seven navigation links',doc.nav])
    old=subprocess.check_output(['git','show','HEAD:'+relative],cwd=ROOT).decode('utf-8')
    before=Counter(Document(old).copy)
    missing=before-Counter(doc.copy)
    if missing: errors.append([relative,'missing original copy',dict(missing)])
    for ref in doc.refs:
        url=urlsplit(ref)
        if url.scheme or url.netloc: continue
        target=(path.parent/unquote(url.path)).resolve() if url.path else path
        if not target.is_file(): errors.append([relative,'missing asset',ref]); continue
        if url.fragment and target.suffix=='.html':
            other=docs.get(target)
            if other and url.fragment not in other.ids: errors.append([relative,'missing anchor',ref])

unchanged=0
for folder in ['logos','img']:
    tracked=subprocess.check_output(['git','ls-files',folder],cwd=ROOT).decode().splitlines()
    for name in tracked:
        old=subprocess.check_output(['git','show','HEAD:'+name],cwd=ROOT)
        if hashlib.sha256(old).digest()!=hashlib.sha256((ROOT/name).read_bytes()).digest():
            errors.append([name,'original asset modified'])
        unchanged+=1
result={'pages':len(pages),'original_assets_unchanged':unchanged,'errors':errors}
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))

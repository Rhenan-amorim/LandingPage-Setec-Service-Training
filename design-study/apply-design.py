"""One-time markup migration. Text and logo preservation are checked separately."""
from pathlib import Path
import re
from PIL import Image

root = Path(__file__).resolve().parent.parent
home = root / 'index.html'
source = home.read_text(encoding='utf-8')
assert 'class="glass-dock"' not in source, 'Migration already applied'
brand = re.search(r'<a href="#home" class="nav-logo".*?</a>', source, re.S).group()
brand = re.sub(r'\s*<img class="logo-scrolled"[^>]+>', '', brand)
wa = re.search(r'<a href="https://wa.me/5521982874662".*?</a>', source, re.S).group().replace('wa-float', 'header-wa')
modal = re.search(r'<!-- Modal Redes Sociais do Desenvolvedor -->(.*?)<script src="script.js', source, re.S).group(1).strip()
modal = modal.replace('aria-hidden="true" role="dialog"', 'aria-hidden="true" aria-modal="true" role="dialog"')
destinations = [('home','Início','home'),('quem-somos','Quem Somos','company'),('servicos','Serviços','services'),('gestao','Plataforma','platform'),('treinamentos','Treinamentos','training'),('nr-cursos','Cursos NR','book'),('contato','Contato','contact')]

def icon(name, prefix=''):
    return f'<svg class="ui-icon" aria-hidden="true"><use href="{prefix}img/ui-icons.svg#{name}"></use></svg>'

def shell(prefix='', internal=False):
    target = prefix + 'index.html' if internal else ''
    logo = brand.replace('href="#home"', f'href="{target}#home"').replace('src="logos/', f'src="{prefix}logos/')
    links = '\n'.join(f'<a class="dock-link" href="{target}#{id}" data-section="{id}">{icon(symbol,prefix)}<span>{label}</span></a>' for id,label,symbol in destinations)
    return f'''<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header"><div class="container header-inner">{logo}<div class="header-actions"><a class="header-contact" href="{target}#contato">Solicitar Proposta {icon('arrow',prefix)}</a>{wa}</div></div></header>
<nav class="glass-dock" aria-label="Navegação principal"><span class="dock-indicator" aria-hidden="true"></span>{links}</nav>'''

# A single navigation system, with original brand markup and seven explicit links.
source = re.sub(r'<!-- ============ WHATSAPP FLOAT ============ -->.*?</nav>', shell(), source, count=1, flags=re.S)
source = source.replace('<body>', '<body class="home-page">')
source = source.replace('<div class="scroll-container">','<main class="scroll-container" id="conteudo" tabindex="-1">')
source = source.replace('</div> <!-- End .scroll-container -->', '</main> <!-- End main content -->')
# Remove decorative backgrounds; retain all editorial text and original assets on disk.
source = re.sub(r'  <div class="section-bg hero-slider">.*?  </div>\s*<div class="hero-overlay"></div>\s*<div class="hero-blue-tint"></div>', '''  <picture class="hero-image">
    <img src="img/hero-bg-2.jpg" srcset="img/hero-bg-2.jpg 764w, img/ct-cabine-vidro.jpg 1792w" sizes="(max-width: 700px) 100vw, 62vw" width="1792" height="2400" alt="Cabine de Vidro de 2 Andares" fetchpriority="high" decoding="async" />
  </picture>''', source, count=1, flags=re.S)
source = re.sub(r'  <!-- Logo mobile:.*?<div class="container hero-content', '  <div class="container hero-content', source, flags=re.S)
source = re.sub(r'  <div class="section-bg"[^>]*></div>\s*', '', source)
source = re.sub(r'  <div class="section-overlay"[^>]*></div>\s*', '', source)
source = re.sub(r'\s*<canvas id="ead-canvas"></canvas>', '', source)
source = re.sub(r'\s*<div class="neon-glow-rings".*?</div>', '', source, flags=re.S)
source = source.replace('class="btn btn-neon-glow"', 'class="btn btn-primary"')

# Actual company photography, never generated company evidence.
source = source.replace('<div class="qs-visual reveal reveal-delay-1">', '<div class="qs-visual reveal reveal-delay-1"><img class="team-photo" src="img/hero-bg-3.jpg" alt="Equipe Grupo SETEC" width="1024" height="576" loading="lazy" decoding="async" />')
# Strip duplicated carousel items, keeping every unique client and its original logo.
seen=set()
def unique_logo(match):
    name=re.search(r'src="([^"]+)"',match.group()).group(1)
    if name in seen: return ''
    seen.add(name)
    return match.group()
source = re.sub(r'<div class="client-card">.*?</div>', unique_logo, source)
source = re.sub(r'(<section id="clientes"[^>]*?) style="[^"]*"', r'\1', source)
source = source.replace('class="label" style="color: var(--cobre);"','class="label"')
source = source.replace('style="color: var(--azul);"','').replace('style="color: var(--noite);"','')

# Service cards now lead to the relevant existing content; the full descriptions remain.
service_targets=iter(['locacao','nr-cursos','gestao','ead','simulador','contato'])
def service(match):
    block=match.group()
    block=block.replace('<div class="sv-card">',f'<a class="sv-card" href="#{next(service_targets)}">',1)
    return block[:-6]+'</a>'
source=re.sub(r'<div class="sv-card">.*?<div class="sv-card__accent"></div>\s*</div>',service,source,flags=re.S)

# Consistent decorative iconography, without changing the associated wording.
icon_groups={
 'pillar-icon':['clock','award','shield'], 'sv-card__icon':['people','book','platform','training','company','shield'],
 'sf-icon':['company','anchor','bolt'], 'ead-perk-icon':['globe','device','award'], 'ci-icon':['location','phone','contact']}
for cls,names in icon_groups.items():
    it=iter(names)
    source=re.sub(rf'(<(?:div|span) class="{cls}">).*?(</(?:div|span)>)',lambda m:m[1]+icon(next(it))+m[2],source,flags=re.S)
func_icons=iter(['book','calendar','platform','shield','shield','people','book','contact'])
source=re.sub(r'(<div class="func-item"><span>).*?(</span>)',lambda m:m[1]+icon(next(func_icons))+m[2],source)

# Gallery anchors provide a useful no-JS fallback; JS enhances them into a dialog.
def gallery_image(m):
    tag=m.group()
    src=re.search(r'src="([^"]+)"',tag).group(1)
    alt=re.search(r'alt="([^"]+)"',tag).group(1)
    width,height=Image.open(root/src).size
    return f'<a class="gallery-link" href="{src}" aria-label="{alt}">{tag[:-1]} width="{width}" height="{height}" decoding="async">{icon("expand")}</a>'
source=re.sub(r'<img src="img/ct-[^"]+"[^>]*>',gallery_image,source)

# Supplement the real existing product illustration without inventing product UI.
source=source.replace('<div class="gestao-content reveal">','<figure class="platform-visual"><img src="img/bg-gestao.jpg" alt="" loading="lazy" decoding="async" /></figure><div class="gestao-content reveal">',1)
source=source.replace('<div class="ead-left-col"></div>','<div class="ead-left-col"><img src="img/bg-ead.jpg" alt="" loading="lazy" decoding="async" /></div>')

# Course images are the original illustrations already used on detail pages.
source=re.sub(r'(<a href="nr/nr(\d+)\.html" class="nr-card reveal" data-nr="\d+">)',lambda m:m[1]+f'<img class="nr-card-image" src="img/nr/nr{m[2]}.jpg" alt="" loading="lazy" decoding="async" width="640" height="360" />',source)
# Progressive enhancement: every course is present without JavaScript.
source=source.replace('class="nr-tabs" role="tablist"','class="nr-tabs" role="tablist" aria-label="Categorias de cursos NR"')
source=re.sub(r'(class="nr-tab-btn[^"\n]*" role="tab" aria-selected="(?:true|false)" data-category="([^"]+)")',lambda m:m[1]+f' id="nr-tab-{m[2]}" aria-controls="nr-cat-{m[2]}"',source)
source=re.sub(r'(id="nr-cat-([^"]+)" role="tabpanel")',lambda m:m[1]+f' aria-labelledby="nr-tab-{m[2]}" tabindex="0"',source)

# Native form validity and keyboard submission, retaining original labels and placeholders.
source=source.replace('<div class="contact-form glass-card reveal reveal-delay-1">','<form id="proposal-form" class="contact-form glass-card reveal reveal-delay-1">')
source=source.replace('onclick="submitForm(event)"','')
source=source.replace('Enviar Solicitação →\n        </button>\n      </div>','Enviar Solicitação →\n        </button>\n        <p class="form-status" role="status" aria-live="polite" hidden></p>\n      </form>')
for name,auto in [('nome','name'),('empresa','organization'),('email','email'),('telefone','tel')]:
    source=source.replace(f'name="{name}"',f'name="{name}" autocomplete="{auto}"')
source=source.replace('type="tel" id=', 'type="tel" inputmode="tel" id=')
source=source.replace('aria-hidden="true" role="dialog"','aria-hidden="true" aria-modal="true" role="dialog"')
source=re.sub(r'<script src="script\.js[^>]*></script>.*?</body>', '<script src="script.js?v=marinho-1" defer></script>\n</body>',source,flags=re.S)
source=re.sub(r'style\.css\?v=\d+', 'style.css?v=marinho-1', source)
home.write_text(source,encoding='utf-8')

for page in sorted((root/'nr').glob('*.html')):
    text=page.read_text(encoding='utf-8')
    text=re.sub(r'<nav id="navbar".*?</nav>',shell('../',True),text,count=1,flags=re.S)
    text=text.replace('<main class="nr-detail-content">','<main class="nr-detail-content" id="conteudo" tabindex="-1">')
    text=re.sub(r'<div class="nr-geo-bg"[^>]*></div>','',text)
    text=re.sub(r'<script src="../nr-page\.js[^>]*></script>',modal.replace('src="img/', 'src="../img/')+'\n<script src="../script.js?v=marinho-1" defer></script>',text)
    text=re.sub(r'style\.css\?v=\d+', 'style.css?v=marinho-1', text)
    page.write_text(text,encoding='utf-8')

for name in ['termos-de-uso.html','politica-de-privacidade.html','compliance.html']:
    page=root/name
    text=page.read_text(encoding='utf-8')
    text=text.replace('<body>', '<body class="legal-page">\n'+shell('',True))
    text=text.replace('<main>','<main id="conteudo" tabindex="-1">')
    text=text.replace('</body>','<script src="script.js?v=marinho-1" defer></script>\n</body>')
    # Load shared design after page-specific legacy declarations.
    text=re.sub(r'\s*<link rel="stylesheet" href="style.css[^>]+>','',text)
    text=text.replace('</head>','<link rel="stylesheet" href="style.css?v=marinho-1" />\n</head>')
    page.write_text(text,encoding='utf-8')

print('Updated home, 20 NR pages and 3 legal pages; original images/logos unchanged.')

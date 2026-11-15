"""Refresh the complete no-JavaScript English page from data/portfolio.json.
This is an optional content maintenance command, not a frontend build step.
"""
import json
import sys
import subprocess
import hashlib
import re
from pathlib import Path
from html import escape
from datetime import date
from urllib.parse import urlparse
from render_sections import seo_markup
from render_projects import project_card, project_pages
LOCALE='ar' if '--arabic' in sys.argv else 'en'
D=json.loads(Path('data/portfolio.json').read_text(encoding='utf-8'));EN=D[LOCALE];P=D['profile']
styles='\n'.join(Path(f'css/{name}.css').read_text(encoding='utf-8-sig') for name in ['tokens','base','layout','components','responsive','engineering','refactor'])
styles=re.sub(r'/\*[\s\S]*?\*/','',styles)
styles=re.sub(r'\s+',' ',styles)
styles=re.sub(r'\s*([{};])\s*',r'\1',styles).strip()
Path('css/site.css').write_text(styles,encoding='utf-8')
style_version=hashlib.sha256(styles.encode('utf-8')).hexdigest()[:12]
def value(key,lang='en'):
 v=D[lang]
 for k in key.split('.'):v=v[int(k)] if isinstance(v,list) else v[k]
 return v
def copy(key,tag='span',cls='',attrs=''):
 return f'<{tag} data-copy="{key}"'+(f' class="{cls}"' if cls else '')+(f' {attrs}' if attrs else '')+'>'+f'<span class="locale-en">{escape(value(key))}</span><span class="locale-ar">{escape(value(key,"ar"))}</span>'+f'</{tag}>'
def attr(key):return escape(value(key,LOCALE),quote=True)
arrow='<span class="arrow" aria-hidden="true">↗</span>'
portrait_srcset=(f' srcset="{escape(P["portraitSrcset"],quote=True)}"' if P.get('portraitSrcset') else '')
nav=''.join(f'<a href="#{k}">{copy("nav."+k)}</a>' for k in ['top','work','services','about','contact'])
cv=P.get('cv') if P.get('cv') and Path(P['cv']).is_file() else None
resume=f'<a class="nav-resume" href="{escape(cv,quote=True)}" download>{copy("nav.resume")}</a>' if cv else ''
hero_resume=f'<a class="text-link" href="{escape(cv,quote=True)}" download>{copy("hero.resume")}<span aria-hidden="true">↓</span></a>' if cv else ''
projects=''.join(project_card(D,i,copy,LOCALE) for i in range(len(P['projects'])))
S=json.loads(Path('data/skills.json').read_text(encoding='utf-8'))
skills={s['id']:s for s in S['skills']}
def skill_icon(skill):
 if skill['icon']!='competency':
  return f'<img src="assets/icons/{escape(skill["icon"],quote=True)}.svg" width="24" height="24" alt="" aria-hidden="true" loading="lazy">'
 return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m8 5-7 7 7 7m8-14 7 7-7 7m-3-17-2 20"/></svg>'
def skill_tag(sid,featured=False):
 s=skills[sid]
 return f'<li class="{"featured-technology" if featured else "skill-token"}" data-skill-id="{s["id"]}">{skill_icon(s)}<bdi translate="no" dir="ltr">{escape(s["name"])}</bdi></li>'
groups=''
for i,group in enumerate(S['homepageGroups']):
 heading=''.join(f'<span class="locale-{lang}">{escape(group["title"][lang])}</span>' for lang in ['en','ar'])
 groups+=f'<div class="stack-group"><h3>{heading}</h3><ul>'+''.join(skill_tag(sid) for sid in group['skills'])+'</ul></div>'
services=''
for i,service in enumerate(P['services']):
 project=next((r for r in P['projects'] if r['id']==service['project']),None)
 href=('/ar/' if LOCALE=='ar' else '/')+'projects/'+project['slug']+'/' if project else '#contact'
 route_attr=f' data-local-path="projects/{project["slug"]}/"' if project else ''
 services+=f'<article class="service"><span class="service-number" aria-hidden="true">0{i+1}</span><div>{copy(f"services.items.{i}.title","h3")}{copy(f"services.items.{i}.text","p")}<a class="text-link" href="{href}"{route_attr}>{copy(f"services.items.{i}.project")}{arrow}</a></div></article>'
steps=''.join(f'<li><span class="process-index" aria-hidden="true">0{i+1}</span>{copy(f"process.steps.{i}.title","h3")}{copy(f"process.steps.{i}.text","p")}</li>' for i in range(len(EN['process']['steps'])))
links=''
for key in ['github','linkedin','leetcode','cv']:
 if P.get(key) and (key!='cv' or cv):
  attributes='download' if key=='cv' else 'target="_blank" rel="noopener noreferrer"'
  links+=f'<a href="{escape(P[key],quote=True)}" {attributes}>{copy("contact."+key)}{arrow}</a>' 
email=(f'<a class="contact-email" href="mailto:{escape(P["email"],quote=True)}"><bdi>{escape(P["email"])}</bdi>{arrow}</a>' if P.get('email') else '')
channels=''
for i,channel in enumerate(P.get('whatsapp',[])):
 number=escape(channel['number'],quote=True)
 display=escape(channel['display'])
 channels+=f'''<a class="contact-channel" href="https://wa.me/{number}" target="_blank" rel="noopener noreferrer"><span class="contact-channel-heading">{copy('contact.whatsapp',attrs=f'id="whatsapp-label-{i}"')}<span class="meta" aria-hidden="true">0{i+1}</span></span><span class="contact-channel-number"><bdi id="whatsapp-number-{i}" dir="ltr">{display}</bdi>{arrow}</span>{copy('contact.startChat','span','contact-channel-action')}</a>'''
fields=''
for field,tag in [('name','input'),('message','textarea')]:
 attrs=(f'type="{"email" if field=="email" else "text"}" autocomplete="{field}" maxlength="{254 if field=="email" else 100}"' if tag=='input' else 'rows="5" maxlength="1500"')
 attrs+=(' dir="ltr" inputmode="email" spellcheck="false"' if field=='email' else ' dir="auto"')
 control=f'<{tag} id="contact-{field}" name="{field}" data-message-field {attrs} required placeholder="{attr("contact."+field+"Placeholder")}" data-copy-placeholder="contact.{field}Placeholder" aria-describedby="contact-{field}-error"'+('>' if tag=='textarea' else '>')+('</textarea>' if tag=='textarea' else '')
 fields+=f'<div class="contact-field contact-field-{field}"><label for="contact-{field}">{copy("contact."+field+"Label")}</label>{control}<p class="field-error" id="contact-{field}-error" data-field-error="{field}"></p></div>'
form=f'''<form id="contact-form" class="contact-form" aria-labelledby="contact-form-title" aria-describedby="contact-form-hint" hidden>
{copy('contact.formTitle','h3',attrs='id="contact-form-title"')}{copy('contact.formHint','p','form-hint',attrs='id="contact-form-hint"')}
<div class="contact-fields">{fields}</div>
<div class="contact-form-actions"><button class="button" type="submit" name="action" value="whatsapp">{copy('contact.openWhatsApp')}{arrow}</button><button class="text-link" type="submit" name="action" value="copy">{copy('contact.copy')}</button></div>
{copy('contact.whatsappHint','p','form-hint whatsapp-hint')}
<p class="contact-feedback" id="contact-feedback" role="status" aria-live="polite" aria-atomic="true"></p>
<div id="contact-prepared" hidden><label for="prepared-message">{copy('contact.prepared')}</label><textarea id="prepared-message" rows="6" readonly dir="auto"></textarea></div>
</form>'''
def runtime_content(data):
 # Keep source history available to the owner, but embed only active UI content.
 keys=['name','wordmark','title','seo','nav','hero','work','projects','services','stack','about','process','contact','footer']
 result={lang:{key:data[lang][key] for key in keys} for lang in ['en','ar']}
 result['profile']={key:value for key,value in data['profile'].items() if key not in ['experience','architecture']}
 return result

html=f'''<!doctype html>
<html lang="{LOCALE}" dir="{'rtl' if LOCALE=='ar' else 'ltr'}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
{'<base href="/">' if LOCALE=='ar' else ''}
<title>{escape(EN['seo']['title'])}</title><meta name="description" content="{attr('seo.description')}">
<meta property="og:title" content="{attr('seo.title')}"><meta property="og:description" content="{attr('seo.description')}"><meta property="og:type" content="website"><meta property="og:locale" content="{'ar_EG' if LOCALE=='ar' else 'en_US'}">
{seo_markup(D,LOCALE)}
<script src="js/preference.js"></script>
<meta name="theme-color" content="#EAE8E1"><link rel="icon" href="assets/images/ahmed-algohary.ico" sizes="any"><link rel="icon" href="assets/images/ahmed-algohary-icon.png" type="image/png" sizes="64x64"><link rel="apple-touch-icon" href="assets/images/ahmed-algohary-apple.png" sizes="180x180">
<noscript><link rel="preload" href="assets/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin></noscript>
<link rel="stylesheet" href="css/site.css?v={style_version}">
<script type="module" src="js/main.js"></script>
<script type="application/json" id="portfolio-content">{json.dumps(runtime_content(D),ensure_ascii=False,separators=(',',':')).replace('<',chr(92)+'u003c')}</script>
</head>
<body id="top">
<a class="skip-link" href="#main">{copy('nav.skip')}</a>
<header class="site-header wrap">
<a class="wordmark" href="#top" data-copy-aria-label="nav.home" aria-label="{attr('nav.home')}">{copy('wordmark')}<span class="wordmark-square" aria-hidden="true"></span></a>
<nav id="navigation" class="navigation" aria-label="{attr('nav.label')}" data-copy-aria-label="nav.label">{nav}</nav>
<div class="header-controls">{resume}<button class="language-switch" type="button" data-language data-copy-aria-label="nav.language" aria-label="{attr('nav.language')}" hidden><span data-language-name lang="ar">العربية</span><span aria-hidden="true" class="language-icon">↔</span></button><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" hidden>{copy('nav.menu')}<span aria-hidden="true">+</span></button></div>
</header>
<main id="main" tabindex="-1">
<section class="hero wrap" aria-labelledby="hero-title">
<div class="hero-top"><p class="eyebrow">{copy('title')}</p></div>
<div class="hero-grid"><div class="hero-content"><h1 id="hero-title">{copy('hero.line1','span','hero-line')}{copy('hero.line2','span','hero-line')}{copy('hero.line3','span','hero-line hero-accent')}</h1>{copy('hero.description','p','hero-description')}<div class="hero-actions"><a class="button" href="#work">{copy('hero.work')}{arrow}</a><a class="text-link" href="#contact">{copy('hero.contact')}{arrow}</a></div></div>
<figure class="hero-art"><div class="hero-portrait-frame"><img class="hero-portrait" src="{P['portrait']}"{portrait_srcset} sizes="(max-width:600px) 140px, (max-width:800px) 230px, 290px" data-profile-image width="1122" height="1402" fetchpriority="high" decoding="async" alt="{attr('hero.portraitAlt')}" data-copy-alt="hero.portraitAlt"></div><figcaption><div>{copy('name','span','portrait-name')}{copy('title','p')}</div><span class="portrait-signature" aria-hidden="true">↗</span></figcaption></figure></div>
<div class="hero-bottom">{copy('hero.index','p','meta')}<a class="scroll-cue" href="#work">{copy('hero.scroll')}<span aria-hidden="true">↓</span></a></div>
</section>
<section id="work" class="work wrap section" aria-labelledby="work-title"><div class="section-heading"><div>{copy('work.label','p','eyebrow')}{copy('work.title','h2',attrs='id="work-title"')}</div>{copy('work.intro','p','section-intro')}</div><div class="projects">{projects}</div></section>
<section id="services" class="services section" aria-labelledby="services-title"><div class="wrap"><div class="section-heading"><div>{copy('services.label','p','eyebrow')}{copy('services.title','h2',attrs='id="services-title"')}</div></div><div class="service-list">{services}</div></div></section>
<section id="stack" class="stack wrap section" aria-labelledby="stack-title"><span id="expertise" class="legacy-anchor"></span><div class="section-heading"><div>{copy('stack.label','p','eyebrow')}{copy('stack.title','h2',attrs='id="stack-title"')}</div></div><div class="stack-groups">{groups}</div>{copy('stack.note','p','stack-note')}</section>
<section id="about" class="about section" aria-labelledby="about-title"><span id="experience" class="legacy-anchor"></span><span id="architecture" class="legacy-anchor"></span><div class="wrap"><div class="section-heading"><div>{copy('about.label','p','eyebrow')}{copy('about.title','h2',attrs='id="about-title"')}</div></div><div class="about-grid"><figure class="portrait"><img src="{P['portrait']}"{portrait_srcset} sizes="(max-width:600px) 180px, 260px" data-profile-image width="1122" height="1402" loading="lazy" decoding="async" alt="{attr('about.portraitAlt')}" data-copy-alt="about.portraitAlt"></figure><div class="about-copy">{copy('about.bio','p')}{copy('about.philosophy','p')}{hero_resume}</div></div></div></section>
<section id="process" class="process wrap section" aria-labelledby="process-title"><div class="section-heading"><div>{copy('process.label','p','eyebrow')}{copy('process.title','h2',attrs='id="process-title"')}</div></div><ol class="process-list">{steps}</ol></section>
<section id="contact" class="contact section" aria-labelledby="contact-title"><div class="wrap"><div class="contact-grid"><div class="contact-lead">{copy('contact.label','p','eyebrow')}{copy('contact.title','h2','multiline',attrs='id="contact-title"')}{copy('contact.invitation','p','contact-invitation')}<div class="contact-copy">{copy('contact.description','p')}<div id="contact-action" class="contact-channels" role="group" aria-label="{attr('contact.directTitle')}" data-copy-aria-label="contact.directTitle">{channels}</div>{email}<div class="social-links" id="social-links">{links}</div></div></div><div class="contact-compose">{form}</div></div></div></section>
</main>
<footer class="site-footer wrap"><p><span>© {date.today().year}</span> {copy('footer.copyright')}</p><nav aria-label="{attr('nav.footer')}" data-copy-aria-label="nav.footer"><a href="#work">{copy('nav.work')}</a><a href="#contact">{copy('nav.contact')}</a><button type="button" class="footer-language" data-language data-copy-aria-label="footer.languageLabel" aria-label="{attr('footer.languageLabel')}" hidden>{copy('footer.language')}</button><a href="#top">{copy('footer.top')}<span aria-hidden="true">↑</span></a></nav></footer>
</body></html>'''
fallback_language='<noscript><a class="language-switch" href="'+('/' if LOCALE=='ar' else '/ar/')+'" lang="'+('en' if LOCALE=='ar' else 'ar')+'">'+('English' if LOCALE=='ar' else 'العربية')+'</a></noscript>'
html=html.replace('<div class="header-controls">','<div class="header-controls">'+fallback_language)
if LOCALE=='ar':html=html.replace('href="#','href="/ar/#')
target=Path('ar/index.html') if LOCALE=='ar' else Path('index.html')
target.parent.mkdir(exist_ok=True)
target.write_text(html,encoding='utf-8')
project_pages(D,copy,LOCALE,html)
print(f'Updated {target} with complete localized content.')
if LOCALE=='en':
 Path('robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+P['url']+'sitemap.xml\n',encoding='utf-8')
 routes=['']+['projects/'+r['slug']+'/' for r in P['projects']]
 urls=[]
 for path in routes:
  alternates=''.join(f'<xhtml:link rel="alternate" hreflang="{lang}" href="{P["url"]}{"ar/" if lang=="ar" else ""}{path}"/>' for lang in ['en','ar'])
  for prefix in ['', 'ar/']:
   urls.append(f'<url><loc>{P["url"]}{prefix}{path}</loc>{alternates}</url>')
 Path('sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+''.join(urls)+'</urlset>\n',encoding='utf-8')
 subprocess.run([sys.executable,str(Path(__file__).resolve()),'--arabic'],check=True)

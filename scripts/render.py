"""Refresh the complete no-JavaScript English page from data/portfolio.json.
This is an optional content maintenance command, not a frontend build step.
"""
import json
from pathlib import Path
from html import escape
from datetime import date
from urllib.parse import urlparse
D=json.loads(Path('data/portfolio.json').read_text(encoding='utf-8'));EN=D['en'];P=D['profile']
def value(key,lang='en'):
 v=D[lang]
 for k in key.split('.'):v=v[int(k)] if isinstance(v,list) else v[k]
 return v
def copy(key,tag='span',cls='',attrs=''):
 return f'<{tag} data-copy="{key}"'+(f' class="{cls}"' if cls else '')+(f' {attrs}' if attrs else '')+'>'+f'<span class="locale-en">{escape(value(key))}</span><span class="locale-ar">{escape(value(key,"ar"))}</span>'+f'</{tag}>'
def attr(key):return escape(value(key),quote=True)
arrow='<span class="arrow" aria-hidden="true">↗</span>'
portrait_srcset=(f' srcset="{escape(P["portraitSrcset"],quote=True)}"' if P.get('portraitSrcset') else '')
nav=''.join(f'<a href="#{k}">{copy("nav."+k)}</a>' for k in ['work','about','expertise','process','contact'])
scene_fallback='<div class="scene-fallback"><span></span><span></span><span></span></div>'
projects=''
for i,p in enumerate(P['projects']):
 k=f'projects.{i}'
 image_src=p.get('images',{}).get('en',f"assets/images/{p['image']}-en.svg")
 responsive=p.get('srcset',{}).get('en','')
 image_attrs=(f' srcset="{escape(responsive,quote=True)}" sizes="(max-width:600px) calc(100vw - 40px), (max-width:1600px) 54vw, 800px"' if responsive else '')
 preview_src=p.get('preview',image_src)
 private=p.get('private',False)
 status='work.private' if private else 'work.sample'
 caption='work.privatePreview' if private else 'work.preview'
 window_label=copy('work.private') if private else '<bdi>'+escape(urlparse(p['url']).netloc)+'</bdi>'
 action=(f'<a class="button project-visit" href="{escape(p["url"],quote=True)}" target="_blank" rel="noopener noreferrer" aria-label="{attr(k+".visitLabel")}" data-copy-aria-label="{k}.visitLabel">{copy("work.visit")}{arrow}</a>' if p.get('url') else copy(k+'.privacyNote','p','project-privacy'))
 projects+=f'''<article class="project" id="project-{p['id']}" aria-labelledby="project-title-{i}">
 <figure class="project-visual"><div class="project-window"><div class="project-browser" aria-hidden="true"><span class="browser-dots"><i></i><i></i><i></i></span>{window_label}<span class="browser-mark">↗</span></div><img src="{escape(image_src,quote=True)}"{image_attrs} data-project-image="{p['image']}" width="1600" height="900" loading="lazy" decoding="async" alt="{attr(k+'.alt')}" data-copy-alt="{k}.alt"></div><figcaption>{copy(caption)}<a href="{escape(preview_src,quote=True)}" target="_blank" rel="noopener noreferrer" data-project-preview aria-label="{attr(k+'.previewLabel')}" data-copy-aria-label="{k}.previewLabel">{copy('work.fullSize')}{arrow}</a></figcaption></figure>
 <div class="project-copy"><div class="project-meta"><span class="index">{i+1:02d}</span>{copy(status,cls='project-status'+(' is-private' if private else ''))}</div>{copy(k+'.category','p','meta')}{copy(k+'.title','h3',attrs=f'id="project-title-{i}"')}{copy(k+'.description','p','project-description')}
 <ul class="technologies" aria-label="{attr('work.stack')}" data-copy-aria-label="work.stack">{''.join('<li>'+copy(k+f'.highlights.{j}')+'</li>' for j in range(len(value(k+'.highlights'))))}</ul>
 <div class="project-actions">{action}</div>
 <details id="case-{p['id']}"><summary aria-labelledby="case-action-{p['id']} project-title-{i}">{copy('work.details',attrs=f'id="case-action-{p["id"]}"')}<span class="detail-symbol" aria-hidden="true">+</span></summary><div class="case-study">
 {copy('work.problem','h4')}{copy(k+'.problem','p')}{copy('work.solution','h4')}{copy(k+'.solution','p')}{copy('work.role','h4')}{copy(k+'.role','p')}
 <a class="case-permalink" href="#case-{p['id']}">{copy('work.permalink')}</a>
 </div></details></div></article>'''
S=json.loads(Path('data/skills.json').read_text(encoding='utf-8'))
skills={s['id']:s for s in S['skills']}
def skill_icon(skill):
 if skill['icon']!='competency':
  return f'<img src="assets/icons/{escape(skill["icon"],quote=True)}.svg" width="24" height="24" alt="" aria-hidden="true" loading="lazy">'
 return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m8 5-7 7 7 7m8-14 7 7-7 7m-3-17-2 20"/></svg>'
def skill_tag(sid,featured=False):
 s=skills[sid]
 return f'<li class="{"featured-technology" if featured else "skill-token"}" data-skill-id="{s["id"]}">{skill_icon(s)}<bdi translate="no" dir="ltr">{escape(s["name"])}</bdi></li>'
featured=f'<div class="featured-stack">{copy("expertise.featuredTitle","h3")}{copy("expertise.featuredNote","p","featured-note")}<ul class="featured-technologies">'+''.join(skill_tag(sid,True) for sid in S['featured'])+'</ul></div>'
groups=''
for i,c in enumerate(sorted(S['categories'],key=lambda c:c['order'])):
 key=f'expertise.groups.{i}'
 groups+=f'<article class="skill-category" aria-labelledby="skill-category-{i}"><div class="skill-category-heading"><span class="meta" aria-hidden="true">{i+1:02d}</span>{copy(key+".title","h3",attrs=f"id=\"skill-category-{i}\"")}</div>{copy(key+".description","p","skill-category-description")}<ul class="skill-list">'+''.join(skill_tag(sid) for sid in c['skills'])+'</ul></article>'
steps=''.join(f'<li><span class="process-index" aria-hidden="true">0{i+1}</span>{copy(f"process.steps.{i}.title","h3")}{copy(f"process.steps.{i}.text","p")}</li>' for i in range(4))
links=''
for key in ['github','linkedin','cv']:
 if P.get(key):links+=f'<a href="{escape(P[key],quote=True)}">{copy("contact."+key)}{arrow}</a>'
email=(f'<a class="contact-email" href="mailto:{escape(P["email"],quote=True)}"><bdi>{escape(P["email"])}</bdi>{arrow}</a>' if P.get('email') else '')
channels=''
for i,channel in enumerate(P.get('whatsapp',[])):
 number=escape(channel['number'],quote=True)
 display=escape(channel['display'])
 channels+=f'''<a class="contact-channel" href="https://wa.me/{number}" target="_blank" rel="noopener noreferrer" aria-labelledby="whatsapp-label-{i} whatsapp-number-{i}"><span class="contact-channel-heading">{copy('contact.whatsapp',attrs=f'id="whatsapp-label-{i}"')}<span class="meta" aria-hidden="true">0{i+1}</span></span><span class="contact-channel-number"><bdi id="whatsapp-number-{i}" dir="ltr">{display}</bdi>{arrow}</span>{copy('contact.startChat','span','contact-channel-action')}</a>'''
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
html=f'''<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(EN['seo']['title'])}</title><meta name="description" content="{attr('seo.description')}">
<meta property="og:title" content="{attr('seo.title')}"><meta property="og:description" content="{attr('seo.description')}"><meta property="og:type" content="website"><meta property="og:locale" content="en_US">
<script src="js/preference.js"></script>
<meta name="theme-color" content="#EAE8E1"><link rel="icon" href="assets/images/ahmed-algohary.ico" sizes="any"><link rel="icon" href="assets/images/ahmed-algohary-icon.png" type="image/png" sizes="64x64"><link rel="apple-touch-icon" href="assets/images/ahmed-algohary-apple.png" sizes="180x180">
<noscript><link rel="preload" href="assets/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin></noscript>
{''.join(f'<link rel="stylesheet" href="css/{x}.css">' for x in ['tokens','base','layout','components','responsive','motion','skills'])}
<script type="module" src="js/main.js"></script>
<script type="application/json" id="portfolio-content">{json.dumps(D,ensure_ascii=False).replace('<',chr(92)+'u003c')}</script>
</head>
<body id="top">
<a class="skip-link" href="#main">{copy('nav.skip')}</a>
<header class="site-header wrap">
<a class="wordmark" href="#top" data-copy-aria-label="nav.home" aria-label="{attr('nav.home')}">{copy('wordmark')}<span class="wordmark-square" aria-hidden="true"></span></a>
<nav id="navigation" class="navigation" aria-label="{attr('nav.label')}" data-copy-aria-label="nav.label">{nav}</nav>
<div class="header-controls"><button class="language-switch" type="button" data-language data-copy-aria-label="nav.language" aria-label="{attr('nav.language')}" hidden><span data-language-name lang="ar">العربية</span><span aria-hidden="true" class="language-icon">↔</span></button><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" hidden>{copy('nav.menu')}<span aria-hidden="true">+</span></button></div>
</header>
<main id="main" tabindex="-1">
<section class="hero wrap" aria-labelledby="hero-title">
<div class="hero-top"><p class="eyebrow">{copy('title')}</p>{copy('hero.intro','p','meta')}</div>
<div class="hero-grid"><div class="hero-content"><h1 id="hero-title">{copy('hero.line1','span','hero-line')}{copy('hero.line2','span','hero-line')}{copy('hero.line3','span','hero-line expressive')}</h1>{copy('hero.description','p','hero-description')}<div class="hero-actions"><a class="button" href="#work">{copy('hero.work')}{arrow}</a><a class="text-link" href="#contact">{copy('hero.contact')}{arrow}</a></div></div>
<figure class="hero-art"><div class="scene-slot hero-scene" data-scene="hero" aria-hidden="true">{scene_fallback}</div><div class="hero-portrait-frame"><img class="hero-portrait" src="{P['portrait']}"{portrait_srcset} sizes="(max-width:600px) min(100vw - 40px, 320px), (max-width:1100px) 40vw, 420px" data-profile-image width="1122" height="1402" fetchpriority="high" decoding="async" alt="{attr('hero.portraitAlt')}" data-copy-alt="hero.portraitAlt"></div><figcaption><div>{copy('name','span','portrait-name')}{copy('title','p')}</div><span class="portrait-signature" aria-hidden="true">↗</span></figcaption></figure></div>
<div class="hero-bottom">{copy('hero.index','p','meta')}<a class="scroll-cue" href="#work">{copy('hero.scroll')}<span aria-hidden="true">↓</span></a></div>
</section>
<section id="work" class="work wrap section" aria-labelledby="work-title"><div class="work-stage"><div class="section-heading"><div>{copy('work.label','p','eyebrow')}{copy('work.title','h2','multiline',attrs='id="work-title"')}</div>{copy('work.intro','p','section-intro')}</div><div class="showcase-tools" hidden><span class="showcase-count" data-project-counter>01 / 05</span><div class="showcase-progress" aria-hidden="true"></div><div class="showcase-navigation"><button type="button" data-project-previous aria-label="Previous project"><span>&larr;</span></button><button type="button" data-project-next aria-label="Next project"><span>&rarr;</span></button></div></div><div class="project-viewport"><div class="projects">{projects}</div></div></div></section>
<section id="about" class="about section" aria-labelledby="about-title"><div class="wrap"><div class="section-heading"> <div>{copy('about.label','p','eyebrow')}{copy('about.title','h2','multiline',attrs='id="about-title"')}</div>{copy('about.placeholder','p','meta')}</div><div class="about-grid"><figure class="portrait"><img src="{P['portrait']}"{portrait_srcset} sizes="(max-width:600px) calc(100vw - 40px), (max-width:1100px) 36vw, 430px" data-profile-image width="1122" height="1402" loading="lazy" decoding="async" alt="{attr('about.portraitAlt')}" data-copy-alt="about.portraitAlt"><figcaption>{copy('about.caption')}</figcaption></figure><div class="about-copy">{copy('about.intro','p','about-statement')}{copy('about.bio','p')}{copy('about.philosophy','p')}<div class="interests">{copy('about.interests','h3','meta')}{copy('about.interestText','p')}</div></div></div></div></section>
<section id="expertise" class="expertise wrap section" aria-labelledby="expertise-title"><div class="section-heading"><div>{copy('expertise.label','p','eyebrow')}{copy('expertise.title','h2','multiline',attrs='id="expertise-title"')}{copy('expertise.specialization','p','expertise-specialization')}</div>{copy('expertise.intro','p','section-intro')}</div>{featured}{copy('expertise.catalogTitle','h3','skills-catalog-title')}<div class="skills-grid">{groups}</div></section>
<section id="process" class="process wrap section" aria-labelledby="process-title"><div class="section-heading"><div>{copy('process.label','p','eyebrow')}{copy('process.title','h2',attrs='id="process-title"')}</div>{copy('process.intro','p','section-intro')}</div><ol class="process-list">{steps}</ol></section>
<section id="contact" class="contact section" aria-labelledby="contact-title"><div class="wrap"><div class="contact-grid"><div class="contact-lead"><div class="scene-slot contact-scene" data-scene="contact" aria-hidden="true">{scene_fallback}</div>{copy('contact.label','p','eyebrow')}{copy('contact.title','h2','multiline',attrs='id="contact-title"')}{copy('contact.invitation','p','contact-invitation')}<div class="contact-copy">{copy('contact.description','p')}<div id="contact-action" class="contact-channels" role="group" aria-label="{attr('contact.directTitle')}" data-copy-aria-label="contact.directTitle">{channels}</div>{email}<div class="social-links" id="social-links">{links}</div></div></div><div class="contact-compose">{form}</div></div></div></section>
</main>
<footer class="site-footer wrap"><p><span>© {date.today().year}</span> {copy('footer.copyright')}</p><nav aria-label="{attr('nav.footer')}" data-copy-aria-label="nav.footer"><a href="#work">{copy('nav.work')}</a><a href="#contact">{copy('nav.contact')}</a><button type="button" class="footer-language" data-language data-copy-aria-label="footer.languageLabel" aria-label="{attr('footer.languageLabel')}" hidden>{copy('footer.language')}</button><a href="#top">{copy('footer.top')}<span aria-hidden="true">↑</span></a></nav></footer>
<button type="button" class="motion-switch" data-motion-switch aria-pressed="false" hidden>Pause motion</button></body></html>'''
Path('index.html').write_text(html,encoding='utf-8')
print('Updated index.html with complete default-language content.')

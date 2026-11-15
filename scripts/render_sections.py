"""Escaped render helpers for additions to the existing static portfolio."""
from html import escape
import json


def seo_markup(data,locale='en'):
    profile = data['profile']
    base = profile['url']
    canonical=base+('ar/' if locale=='ar' else '')
    person = {'@type':'Person','@id':base+'#person','name':data['en']['name'],'alternateName':data['ar']['name'],'url':base,'jobTitle':data['en']['title'],'image':base+profile['portrait'],'email':profile['email'],'telephone':'+'+profile['whatsapp'][0]['number'],'sameAs':[profile[k] for k in ['github','linkedin','leetcode'] if profile.get(k)]}
    graph = [person, {'@type':'WebSite','@id':base+'#website','url':base,'name':data['en']['name']+' — Portfolio','inLanguage':['en','ar']}, {'@type':'ProfilePage','@id':canonical+'#profile','url':canonical,'inLanguage':locale,'mainEntity':{'@id':base+'#person'}}]
    for record, project in zip(profile['projects'],data[locale]['projects']):
        graph.append({'@type':'CreativeWork','@id':base+'#work-'+record['id'],'name':project['title'],'description':project['description'],'url':canonical+'#case-'+record['id'],'image':base+record['images'][locale],'author':{'@id':base+'#person'}})
    structured=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('<',r'\u003c')
    title=escape(data[locale]['seo']['title'],quote=True)
    description=escape(data[locale]['seo']['description'],quote=True)
    return f'''<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="en" href="{base}"><link rel="alternate" hreflang="ar" href="{base}ar/"><link rel="alternate" hreflang="x-default" href="{base}">
<meta property="og:url" content="{canonical}"><meta property="og:site_name" content="Ahmed Algohary">
<meta property="og:image" content="{base}assets/images/social-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Ahmed Algohary — Full-Stack Python Developer">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{title}" data-copy-content="seo.title"><meta name="twitter:description" content="{description}" data-copy-content="seo.description"><meta name="twitter:image" content="{base}assets/images/social-card.png">
<script type="application/ld+json">{structured}</script>'''


def experience_section(data, copy, locale='en'):
    rows = []
    for i, record in enumerate(data['profile']['experience']):
        key = f'experience.items.{i}'
        kind = 'training' if record['type'] == 'training' else 'employment'
        points = ''.join(copy(f'{key}.points.{j}', 'li') for j in range(len(data['en']['experience']['items'][i]['points'])))
        technologies = ''.join(f'<li><bdi dir="ltr" translate="no">{escape(t)}</bdi></li>' for t in record['technologies'])
        rows.append(f'''<article class="experience-entry" data-experience="{record['type']}" aria-labelledby="experience-{record['id']}">
<div class="experience-period">{copy(key+'.period','p','meta')}{copy('experience.'+kind,'p','experience-kind')}</div>
<div class="experience-body"><div class="experience-heading"><h3 id="experience-{record['id']}"><bdi dir="ltr">{escape(record['company'])}</bdi></h3>{copy(key+'.location','span','meta')}</div>{copy(key+'.role','h4','experience-role')}<ul class="experience-points">{points}</ul><ul class="experience-technologies">{technologies}</ul></div></article>''')
    return f'''<section id="experience" class="experience wrap section" aria-labelledby="experience-title"><div class="section-heading"><div>{copy('experience.label','p','eyebrow')}{copy('experience.title','h2',attrs='id="experience-title"')}</div>{copy('experience.intro','p','section-intro')}</div><div class="experience-timeline">{''.join(rows)}</div></section>'''


def case_study(data, index, copy, locale='en'):
    key = f'projects.{index}'
    record = data['profile']['projects'][index]
    sections = []
    for title, field in [('overview','description'),('problem','problem'),('role','role'),('solution','solution')]:
        sections.append(f'<section class="case-part">{copy("work."+title,"h4")}{copy(key+"."+field,"p")}</section>')
    features = ''.join(copy(f'{key}.highlights.{j}', 'li') for j in range(len(data['en']['projects'][index]['highlights'])))
    sections.append(f'<section class="case-part">{copy("work.features","h4")}<ul>{features}</ul></section>')
    sections.append(f'<section class="case-part">{copy("work.architecture","h4")}{copy(key+".caseStudy.architecture","p")}</section>')
    sections.append(f'<section class="case-part">{copy("work.technology","h4")}{copy("work.stackUnknown","p")}</section>')
    for title, field in [('challenge','challenge'),('results','results')]:
        sections.append(f'<section class="case-part">{copy("work."+title,"h4")}{copy(key+".caseStudy."+field,"p")}</section>')
    sections.append(f'''<section class="case-part case-gallery">{copy('work.gallery','h4')}<a href="{escape(record['preview'],quote=True)}" target="_blank" rel="noopener noreferrer"><img src="{escape(record['images'][locale],quote=True)}" width="1600" height="900" loading="lazy" decoding="async" alt="{escape(data[locale]['projects'][index]['alt'],quote=True)}" data-copy-alt="{key}.alt">{copy('work.fullSize')}<span aria-hidden="true"> ↗</span></a>{copy('work.privatePreview' if record.get('private') else 'work.galleryNote','p','meta')}</section>''')
    return '<div class="case-sections">'+''.join(sections)+'</div>'


def architecture_section(data, copy):
    nodes, explanations = [], []
    for i, record in enumerate(data['profile']['architecture']['nodes']):
        sid, tech = record['id'], escape(record['technology'])
        nodes.append(f'''<a class="architecture-node node-{sid}" data-architecture-node="{sid}" href="#architecture-{sid}" aria-controls="architecture-{sid}"><span class="architecture-node-index" aria-hidden="true">0{i+1}</span>{copy(f'architecture.nodes.{i}.title','span','architecture-node-title')}<bdi dir="ltr" translate="no">{tech}</bdi>{copy(f'architecture.nodes.{i}.relationship','span','architecture-node-route')}<span class="node-port" aria-hidden="true"></span></a>''')
        explanations.append(f'''<details class="architecture-explanation" id="architecture-{sid}" name="architecture-responsibilities"{' open' if i==0 else ''}><summary>{copy(f'architecture.nodes.{i}.title')}<span class="detail-symbol" aria-hidden="true">+</span></summary>{copy(f'architecture.nodes.{i}.description','p')}</details>''')
    static_paths='<g data-connections>'+''.join(f'<path class="architecture-link" pathLength="1" marker-end="url(#flow-arrow)" d="{path}"/>' for path in ['M280 300H365','M500 225V175','M635 300H680V90H730','M635 300H730','M865 375V425','M970 500H990V90H970','M500 375V425'])+'</g>'
    return f'''<section id="architecture" class="architecture section" aria-labelledby="architecture-title"><div class="wrap"><div class="section-heading"><div>{copy('architecture.label','p','eyebrow')}{copy('architecture.title','h2',attrs='id="architecture-title"')}</div>{copy('architecture.intro','p','section-intro')}</div>{copy('architecture.note','p','architecture-note')}<div class="architecture-runtime"><div class="architecture-runtime-heading">{copy('architecture.runtime','h3','meta')}<span aria-hidden="true" class="architecture-status"></span></div><div class="architecture-map"><svg class="architecture-connections" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><marker id="flow-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" fill="currentColor"/></marker></defs>{static_paths}</svg>{''.join(nodes)}</div><div class="architecture-map-caption">{copy('architecture.request','p','meta')}{copy('architecture.interaction','p','meta')}</div></div><div class="architecture-delivery"><div>{copy('architecture.delivery','h3')}<p class="delivery-tools"><bdi dir="ltr" translate="no">Docker / GitHub Actions / Cloud</bdi></p></div>{copy('architecture.deliveryNote','p')}</div><div class="architecture-responsibilities"><h3 class="meta">{copy('architecture.details')}</h3>{''.join(explanations)}</div></div></section>'''

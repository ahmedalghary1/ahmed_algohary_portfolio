"""Escaped render helpers for additions to the existing static portfolio."""
from html import escape
import json


def career_markup(data, copy):
    """Historical roles from the CV; no claim that an open-ended role is current."""
    companies = [r['company'] for r in data['profile']['experience'] if r['type'] == 'employment']
    items = ''.join(
        f'<li><div>{copy(f"career.items.{i}.period", "p", "career-period")}'
        f'<h3>{escape(company)}</h3>{copy(f"career.items.{i}.role", "p", "career-role")}</div>'
        f'{copy(f"career.items.{i}.text", "p", "career-summary")}</li>'
        for i, company in enumerate(companies)
    )
    return f'''<section id="experience" class="career wrap section" aria-labelledby="career-title">
<div class="section-heading"><div>{copy('career.label','p','eyebrow')}{copy('career.title','h2',attrs='id="career-title"')}</div></div>
<ol class="career-list">{items}</ol><details class="career-training"><summary>{copy('career.training')}</summary>{copy('career.trainingText','p')}</details></section>'''


def testimonials_markup(data, locale, copy):
    records = data['profile'].get('testimonials', [])
    if not records:
        return ''
    quotes = ''.join('<figure><blockquote><p>'+''.join(
        f'<span class="locale-{lang}">{escape(item["quote"][lang])}</span>' for lang in ['en','ar']
    )+'</p></blockquote><figcaption>'+escape(item['name'])+'</figcaption></figure>' for item in records)
    return f'<section class="testimonials wrap section" aria-labelledby="testimonials-title">{copy("projectUI.testimonials","h2",attrs="id=\"testimonials-title\"")}{quotes}</section>'


def seo_markup(data,locale='en'):
    profile = data['profile']
    base = profile['url']
    canonical=base+('ar/' if locale=='ar' else '')
    person = {'@type':'Person','@id':base+'#person','name':data['en']['name'],'alternateName':data['ar']['name'],'url':base,'jobTitle':data['en']['title'],'image':base+profile['portrait'],'email':profile['email'],'telephone':'+'+profile['whatsapp'][0]['number'],'sameAs':[profile[k] for k in ['github','linkedin','leetcode'] if profile.get(k)]}
    graph = [person, {'@type':'WebSite','@id':base+'#website','url':base,'name':data['en']['name']+' — Portfolio','inLanguage':['en','ar']}, {'@type':'ProfilePage','@id':canonical+'#profile','url':canonical,'inLanguage':locale,'mainEntity':{'@id':base+'#person'}}]
    for record, project in zip(profile['projects'],data[locale]['projects']):
        graph.append({'@type':'CreativeWork','@id':base+'#work-'+record['id'],'name':project['title'],'description':project['description'],'url':canonical+'projects/'+record['slug']+'/','image':base+record['images'][locale],'author':{'@id':base+'#person'}})
    structured=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('<',r'\u003c')
    title=escape(data[locale]['seo']['title'],quote=True)
    description=escape(data[locale]['seo']['description'],quote=True)
    return f'''<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="en" href="{base}"><link rel="alternate" hreflang="ar" href="{base}ar/"><link rel="alternate" hreflang="x-default" href="{base}">
<meta property="og:url" content="{canonical}"><meta property="og:site_name" content="Ahmed Algohary">
<meta property="og:image" content="{base}assets/images/social-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Ahmed Algohary — Full-Stack Software Developer">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{title}" data-copy-content="seo.title"><meta name="twitter:description" content="{description}" data-copy-content="seo.description"><meta name="twitter:image" content="{base}assets/images/social-card.png">
<script type="application/ld+json">{structured}</script>'''


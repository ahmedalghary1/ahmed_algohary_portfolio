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


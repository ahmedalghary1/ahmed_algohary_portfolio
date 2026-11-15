"""Reusable project cards and localized static detail routes; no client router."""
import json
import re
from pathlib import Path
from html import escape


def route(record, locale):
    return ('/ar/' if locale=='ar' else '/')+'projects/'+record['slug']+'/'


def project_card(data, index, copy, locale):
    record=data['profile']['projects'][index]
    key=f'projects.{index}'
    url=route(record,locale)
    path='projects/'+record['slug']+'/'
    image=record['images'][locale]
    sizes='(max-width:800px) calc(100vw - 40px), 60vw' if record['featured'] else '(max-width:600px) calc(100vw - 40px), 46vw'
    featured=copy('work.featured','p','featured-project-label') if record['featured'] else ''
    live=(f'<a class="text-link" href="{escape(record["url"],quote=True)}" target="_blank" rel="noopener noreferrer" aria-label="{escape(data[locale]["projects"][index]["visitLabel"],quote=True)}" data-copy-aria-label="{key}.visitLabel">{copy("work.visit")}<span aria-hidden="true">↗</span></a>' if record.get('url') else copy('work.private','span','meta'))
    tech=''.join(f'<li><bdi>{escape(t)}</bdi></li>' for t in record['technologies'])
    technology=f'<ul class="technologies">{tech}</ul>' if tech else ''
    return f'''<article class="project{' project-featured' if record['featured'] else ''}" id="project-{record['id']}" aria-labelledby="project-title-{index}">
<figure class="project-visual"><div class="project-window"><a href="{url}" data-local-path="{path}"><img src="{image}" srcset="{record['srcset'][locale]}" sizes="{sizes}" width="1600" height="900" loading="lazy" decoding="async" alt="{escape(data[locale]['projects'][index]['alt'],quote=True)}" data-copy-alt="{key}.alt"></a></div></figure>
<div class="project-copy"><span class="legacy-anchor" id="case-{record['id']}"></span>{featured}{copy(key+'.category','p','meta')}{copy(key+'.title','h3',attrs=f'id="project-title-{index}"')}{copy(key+'.description','p','project-description')}{technology}
<div class="project-actions"><a class="text-link" href="{url}" data-local-path="{path}">{copy('work.details')}<span aria-hidden="true">↗</span></a>{live}</div></div></article>'''


def project_pages(data, copy, locale, home_html):
    records=data['profile']['projects']
    base=data['profile']['url']
    header=home_html.split('<main id="main"')[0]
    footer=home_html[home_html.index('<footer '):]
    # Project nav goes home; explicit page-local links remain on the detail page.
    header=re.sub(r'href="(?:/ar/)?#(top|work|services|about|contact)"',lambda m:'href="'+('/ar/' if locale=='ar' else '/')+'#'+m[1]+'" data-home-anchor="'+m[1]+'"',header)
    for i,r in enumerate(records):
        k=f'projects.{i}'
        p=data[locale]['projects'][i]
        title=p['title']+' — '+data[locale]['name']
        description=p['description']
        canonical=base.rstrip('/')+route(r,locale)
        page=header.replace('<html lang=',f'<html data-project-id="{r["id"]}" lang=')
        if '<base ' not in page:page=page.replace('<head>','<head>\n<base href="/">')
        page=re.sub(r'<title>.*?</title>','<title>'+escape(title)+'</title>',page)
        for name,content in [('description',description),('og:title',title),('og:description',description),('og:url',canonical),('twitter:title',title),('twitter:description',description),('og:image',base+r['images'][locale]),('twitter:image',base+r['images'][locale])]:
            page=re.sub(r'(<meta (?:name|property)="'+name+r'" content=")[^"]*("[^>]*>)',lambda m:m[1]+escape(content,quote=True)+m[2].replace(' data-copy-content="seo.title"','').replace(' data-copy-content="seo.description"',''),page)
        page=re.sub(r'<link rel="canonical"[^>]*>',f'<link rel="canonical" href="{canonical}">',page)
        page=re.sub(r'<link rel="alternate" hreflang="(en|ar|x-default)"[^>]*>',lambda m:f'<link rel="alternate" hreflang="{m[1]}" href="{base.rstrip("/")+route(r,"ar" if m[1]=="ar" else "en")}">',page)
        page=re.sub(r'<noscript><a class="language-switch"[^>]*>.*?</a></noscript>',f'<noscript><a class="language-switch" href="{route(r,"en" if locale=="ar" else "ar")}" lang="{"en" if locale=="ar" else "ar"}">{"English" if locale=="ar" else "العربية"}</a></noscript>',page)
        graph={'@context':'https://schema.org','@type':'CreativeWork','@id':canonical+'#project','url':canonical,'name':p['title'],'description':description,'inLanguage':locale,'image':base+r['images'][locale],'author':{'@type':'Person','name':data['en']['name'],'url':base}}
        page=re.sub(r'<script type="application/ld\+json">.*?</script>',lambda _: '<script type="application/ld+json">'+json.dumps(graph,ensure_ascii=False).replace('<',r'\u003c')+'</script>',page,flags=re.S)
        page=page.replace('content="1200"','content="1600"').replace('content="630"','content="900"')
        page=re.sub(r'(<meta property="og:image:alt" content=")[^"]*(">)',lambda m:m[1]+escape(p['alt'],quote=True)+m[2],page)
        parts=[]
        for label,field in [('overview','overview'),('role','role'),('problem','problem'),('solution','solution')]:
            parts.append('<section>'+copy('work.'+label,'h2')+copy(k+'.'+field,'p')+'</section>')
        features=''.join(copy(k+f'.highlights.{j}','li') for j in range(len(p['highlights'])))
        parts.append('<section>'+copy('work.features','h2')+'<ul>'+features+'</ul></section>')
        if r['technologies']:
            tech='<ul>'+''.join('<li><bdi>'+escape(t)+'</bdi></li>' for t in r['technologies'])+'</ul>'
            parts.append('<section>'+copy('work.technology','h2')+tech+'</section>')
        gallery=''.join(f'<a href="{escape(s["src"],quote=True)}" target="_blank" rel="noopener noreferrer"><img src="{escape(s["thumbnail"],quote=True)}" alt="{escape(p["alt"],quote=True)}" data-copy-alt="{s["altKey"]}" width="1600" height="900" loading="lazy" decoding="async">{copy("work.fullSize")}<span aria-hidden="true"> ↗</span></a>' for s in r['screenshots'])
        parts.append('<section class="gallery-section">'+copy('work.gallery','h2')+'<div class="gallery-grid">'+gallery+'</div></section>')
        external=(f'<a class="button" href="{r["url"]}" target="_blank" rel="noopener noreferrer">{copy("work.visit")}<span aria-hidden="true">↗</span></a>' if r.get('url') else copy(k+'.privacyNote','p','project-privacy'))
        if r.get('repositoryUrl'):external+=f'<a class="text-link" href="{escape(r["repositoryUrl"],quote=True)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>'
        next_i=(i+1)%len(records);next_record=records[next_i]
        home='/ar/' if locale=='ar' else '/'
        content=f'''<main id="main" tabindex="-1"><div class="wrap"><header class="case-header"><a class="text-link" href="{home}#work" data-home-anchor="work">{copy('work.back')}</a>{copy(k+'.category','p','eyebrow')}{copy(k+'.title','h1')}{copy(k+'.description','p','project-description')}</header>
<figure class="case-cover"><img src="{r['images'][locale]}" srcset="{r['srcset'][locale]}" sizes="(max-width:1600px) 92vw, 1440px" width="1600" height="900" fetchpriority="high" decoding="async" alt="{escape(p['alt'],quote=True)}" data-copy-alt="{k}.alt"><figcaption>{copy('work.privatePreview' if r.get('private') else 'work.preview')}</figcaption></figure>
<div class="case-content">{''.join(parts)}</div><div class="case-footer"><div>{copy('work.links','h2','meta')}<div class="project-actions">{external}</div></div><div>{copy('work.next','p','meta')}<a class="next-project" href="{route(next_record,locale)}" data-local-path="projects/{next_record['slug']}/">{copy(f'projects.{next_i}.title')}<span aria-hidden="true"> ↗</span></a></div></div></div>
<section class="case-cta" aria-labelledby="case-contact-title"><div class="wrap">{copy('contact.title','h2',attrs='id="case-contact-title"')}<a class="button" href="{home}#contact" data-home-anchor="contact">{copy('hero.contact')}<span aria-hidden="true">↗</span></a></div></section></main>'''
        page_footer=re.sub(r'href="(?:/ar/)?#(work|contact)"',lambda m:'href="'+home+'#'+m[1]+'" data-home-anchor="'+m[1]+'"',footer)
        page_footer=page_footer.replace('href="#top"',f'href="{route(r,locale)}#top"').replace('href="/ar/#top"',f'href="{route(r,locale)}#top"')
        target=Path(route(r,locale).strip('/'))/'index.html'
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(page+content+page_footer,encoding='utf-8')

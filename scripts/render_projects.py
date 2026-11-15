"""Reusable project cards and localized static detail routes; no client router."""
import json
import re
from pathlib import Path
from html import escape
from render_media import gallery_markup, videos_markup, lightbox_markup


def route(record, locale):
    return ('/ar/' if locale=='ar' else '/')+'projects/'+record['slug']+'/'


def project_card(data, index, copy, locale):
    record=data['profile']['projects'][index]
    key=f'projects.{index}'
    url=route(record,locale)
    path='projects/'+record['slug']+'/'
    image=record['images'][locale]
    srcset=f' srcset="{escape(record["srcset"][locale],quote=True)}"' if record['srcset'].get(locale) else ''
    sizes='(max-width:800px) calc(100vw - 40px), 60vw' if record['featured'] else '(max-width:600px) calc(100vw - 40px), 46vw'
    featured=copy('work.featured','p','featured-project-label') if record['featured'] else ''
    live=(f'<a class="text-link" href="{escape(record["url"],quote=True)}" target="_blank" rel="noopener noreferrer">{copy("work.visit")}<span aria-hidden="true">↗</span></a>' if record.get('url') else copy('work.private','span','meta') if record.get('private') else '')
    tech=''.join(f'<li><bdi>{escape(t)}</bdi></li>' for t in record['technologies'])
    technology=f'<ul class="technologies">{tech}</ul>' if tech else ''
    features = ''.join(copy(f'{key}.keyFeatures.{j}.title', 'li') for j in range(min(4, len(data[locale]['projects'][index].get('keyFeatures', [])))))
    feature_list = f'<ul class="project-highlights">{features}</ul>' if record['featured'] and features else ''
    category = 'systems' if record['projectType']=='business-management-system' else 'commerce' if record['projectType']=='e-commerce' else 'websites'
    return f'''<article class="project{' project-featured' if record['featured'] else ''}" data-category="{category}" id="project-{record['id']}" aria-labelledby="project-title-{index}">
<figure class="project-visual"><div class="project-window"><a href="{url}" data-local-path="{path}"><img src="{image}"{srcset} sizes="{sizes}" width="1600" height="900" loading="lazy" decoding="async" alt="{escape(data[locale]['projects'][index]['alt'],quote=True)}" data-copy-alt="{key}.alt"></a></div></figure>
<div class="project-copy"><span class="legacy-anchor" id="case-{record['id']}"></span>{featured}{copy(key+'.category','p','meta')}{copy(key+'.title','h3',attrs=f'id="project-title-{index}"')}{copy(key+'.description','p','project-description')}{feature_list}{technology}
<div class="project-actions"><a class="text-link" href="{url}" data-local-path="{path}">{copy('work.details')}<span aria-hidden="true">↗</span></a>{live}</div></div></article>'''


def project_pages(data, copy, locale, home_html):
    records=data['profile']['projects']
    base=data['profile']['url']
    header=home_html.split('<main id="main"')[0]
    footer=home_html[home_html.index('<footer '):]
    # Project nav goes home; explicit page-local links remain on the detail page.
    header=re.sub(r'href="(?:/ar/)?#(top|work|stack|services|experience|about|contact)"',lambda m:'href="'+('/ar/' if locale=='ar' else '/')+'#'+m[1]+'" data-home-anchor="'+m[1]+'"',header)
    for i,r in enumerate(records):
        k=f'projects.{i}'
        p=data[locale]['projects'][i]
        title=p.get('seoMetadata',{}).get('title') or p['title']+' — '+data[locale]['name']
        description=p.get('seoMetadata',{}).get('description') or p['description']
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
        if p.get('overview'):
            parts.append('<section class="case-overview">'+copy('work.overview','h2')+copy(k+'.overview','p')+'</section>')
        facts=[]
        for label, value in [('type', 'types.'+r['projectType'] if r.get('projectType') else None),
                             ('platform', 'platforms.'+r['platform'] if r.get('platform') else None),
                             ('status', 'statuses.'+r['status'] if r.get('status') else None),
                             ('access', 'private' if r.get('private') else 'public')]:
            if value:
                facts.append('<div>'+copy('projectUI.'+label,'dt')+copy('projectUI.'+value,'dd')+'</div>')
        if p.get('role'):
            facts.append('<div>'+copy('work.role','dt')+copy(k+'.role','dd')+'</div>')
        if r['technologies']:
            facts.append('<div>'+copy('work.technology','dt')+'<dd><ul class="case-technologies">'+''.join('<li><bdi translate="no" dir="ltr">'+escape(t)+'</bdi></li>' for t in r['technologies'])+'</ul></dd></div>')
        if facts:
            parts.append('<section class="case-information">'+copy('projectUI.information','h2')+'<dl>'+''.join(facts)+'</dl></section>')
        for label,field in [('problem','problem'),('solution','solution')]:
            if p.get(field):
                parts.append('<section>'+copy('work.'+label,'h2')+copy(k+'.'+field,'p')+'</section>')
        features=''.join('<li>'+copy(k+f'.keyFeatures.{j}.title','h3')+copy(k+f'.keyFeatures.{j}.text','p')+'</li>' for j in range(len(p.get('keyFeatures',[]))))
        if features and not p.get('modules'):
            parts.append('<section class="case-features">'+copy('work.features','h2')+'<ul>'+features+'</ul></section>')
        modules=[]
        for j, module in enumerate(p.get('modules',[])):
            media_id = r.get('modules',[])[j].get('screenshotId') if j<len(r.get('modules',[])) else None
            media_index = next((n for n,s in enumerate(r['screenshots']) if s.get('id')==media_id), None) if media_id else None
            image=''
            if media_index is not None:
                media=r['screenshots'][media_index]
                image=f'<a class="module-preview" href="{escape(media["src"],quote=True)}" data-gallery-index="{media_index}" target="_blank" rel="noopener noreferrer"><img src="{escape(media.get("thumbnail") or media["src"],quote=True)}" width="{media.get("width",1600)}" height="{media.get("height",900)}" alt="{escape(p["media"][media_index]["alt"],quote=True)}" data-copy-alt="projects.{i}.media.{media_index}.alt" loading="lazy">{copy("projectUI.openImage")}</a>'
            modules.append('<li>'+image+copy(k+f'.modules.{j}.title','h3')+copy(k+f'.modules.{j}.text','p')+'</li>')
        if modules:
            parts.append('<section class="case-modules">'+copy('projectUI.modules','h2')+'<ul>'+''.join(modules)+'</ul></section>')
        parts.append(gallery_markup(r,i,copy,locale,p))
        parts.append(videos_markup(r,i,copy,locale,p))
        if r.get('relatedProjects'):
            related=[]
            for related_id in r['relatedProjects']:
                related_index=next(n for n,item in enumerate(records) if item['id']==related_id)
                item=records[related_index]
                related.append(f'<li><a href="{route(item,locale)}" data-local-path="projects/{item["slug"]}/">{copy(f"projects.{related_index}.title")}</a></li>')
            parts.append('<section class="case-related">'+copy('projectUI.related','h2')+'<ul>'+''.join(related)+'</ul></section>')
        external=(f'<a class="button" href="{escape(r["url"],quote=True)}" target="_blank" rel="noopener noreferrer">{copy("work.visit")}<span aria-hidden="true">↗</span></a>' if r.get('url') else copy(k+'.privacyNote','p','project-privacy') if p.get('privacyNote') else '')
        if r.get('repositoryUrl'):external+=f'<a class="text-link" href="{escape(r["repositoryUrl"],quote=True)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>'
        if not r.get('url') and not r.get('repositoryUrl'):
            external+=f'<a class="text-link" href="{"/ar/" if locale=="ar" else "/"}#contact" data-home-anchor="contact">{copy("projectUI.discuss")}<span aria-hidden="true"> ↗</span></a>'
        next_i=(i+1)%len(records);next_record=records[next_i]
        previous_i=(i-1)%len(records);previous_record=records[previous_i]
        home='/ar/' if locale=='ar' else '/'
        status=copy('projectUI.statuses.'+r['status'],'p','case-status') if r.get('status') else ''
        subtitle=copy(k+'.subtitle','p','case-subtitle') if p.get('subtitle') else ''
        cover_srcset=f' srcset="{escape(r["srcset"][locale],quote=True)}"' if r['srcset'].get(locale) else ''
        navigation=f'''<nav class="case-navigation" aria-label="{escape(data[locale]['work']['links'],quote=True)}" data-copy-aria-label="work.links"><div>{copy('projectUI.previous','p','meta')}<a class="previous-project" href="{route(previous_record,locale)}" data-local-path="projects/{previous_record['slug']}/">{copy(f'projects.{previous_i}.title')}</a></div><div>{copy('work.next','p','meta')}<a class="next-project" href="{route(next_record,locale)}" data-local-path="projects/{next_record['slug']}/">{copy(f'projects.{next_i}.title')}<span aria-hidden="true"> ↗</span></a></div></nav>''' if len(records)>1 else ''
        content=f'''<main id="main" tabindex="-1"><div class="wrap"><header class="case-header"><a class="text-link" href="{home}#work" data-home-anchor="work">{copy('work.back')}</a>{copy(k+'.category','p','eyebrow')}{copy(k+'.title','h1')}{subtitle}{copy(k+'.description','p','project-description')}{status}<div class="project-actions">{external}</div></header>
<figure class="case-cover"><img src="{r['images'][locale]}"{cover_srcset} sizes="(max-width:1600px) 92vw, 1440px" width="1600" height="900" fetchpriority="high" decoding="async" alt="{escape(p['alt'],quote=True)}" data-copy-alt="{k}.alt"><figcaption>{copy('work.privatePreview' if r.get('private') else 'work.preview')}</figcaption></figure>
<div class="case-content">{''.join(parts)}</div>{navigation}<a class="text-link case-back" href="{home}#work" data-home-anchor="work">{copy('work.back')}</a></div>
<section class="case-cta" aria-labelledby="case-contact-title"><div class="wrap">{copy('projectUI.similar','h2',attrs='id="case-contact-title"')}<a class="button" href="{home}#contact" data-home-anchor="contact">{copy('projectUI.discuss')}<span aria-hidden="true">↗</span></a></div></section></main>{lightbox_markup(copy) if r['screenshots'] else ''}'''
        page_footer=re.sub(r'href="(?:/ar/)?#(work|contact)"',lambda m:'href="'+home+'#'+m[1]+'" data-home-anchor="'+m[1]+'"',footer)
        page_footer=page_footer.replace('href="#top"',f'href="{route(r,locale)}#top"').replace('href="/ar/#top"',f'href="{route(r,locale)}#top"')
        target=Path(route(r,locale).strip('/'))/'index.html'
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(page+content+page_footer,encoding='utf-8')

"""One-time source migration, preserving the existing contact form rendering."""
from pathlib import Path
p=Path('scripts/render.py');s=p.read_text(encoding='utf-8')
s=s.replace('from render_sections import experience_section, case_study, architecture_section, seo_markup','from render_sections import seo_markup\nfrom render_projects import project_card, project_pages')
a=s.index("projects=''\n");b=s.index("S=json.loads",a)
s=s[:a]+"projects=''.join(project_card(D,i,copy,LOCALE) for i in range(len(P['projects'])))\n"+s[b:]
a=s.index("featured='<div");b=s.index("steps=''.join",a)
s=s[:a]+'''groups=''
for i,group in enumerate(S['homepageGroups']):
 heading=''.join(f'<span class="locale-{lang}">{escape(group["title"][lang])}</span>' for lang in ['en','ar'])
 groups+=f'<div class="stack-group"><h3>{heading}</h3><ul>'+''.join(skill_tag(sid) for sid in group['skills'])+'</ul></div>'
services=''
for i,service in enumerate(P['services']):
 project=next((r for r in P['projects'] if r['id']==service['project']),None)
 href=('/ar/' if LOCALE=='ar' else '/')+'projects/'+project['slug']+'/' if project else '#contact'
 route_attr=f' data-local-path="projects/{project["slug"]}/"' if project else ''
 services+=f'<article class="service"><span class="service-number" aria-hidden="true">0{i+1}</span><div>{copy(f"services.items.{i}.title","h3")}{copy(f"services.items.{i}.text","p")}<a class="text-link" href="{href}"{route_attr}>{copy(f"services.items.{i}.project")}{arrow}</a></div></article>'
''' +s[b:]
a=s.index('<section id="stack"');b=s.index('<section id="process"',a)
s=s[:a]+'''<section id="work" class="work wrap section" aria-labelledby="work-title"><div class="section-heading"><div>{copy('work.label','p','eyebrow')}{copy('work.title','h2',attrs='id="work-title"')}</div>{copy('work.intro','p','section-intro')}</div><div class="projects">{projects}</div></section>
<section id="services" class="services section" aria-labelledby="services-title"><div class="wrap"><div class="section-heading"><div>{copy('services.label','p','eyebrow')}{copy('services.title','h2',attrs='id="services-title"')}</div></div><div class="service-list">{services}</div></div></section>
<section id="stack" class="stack wrap section" aria-labelledby="stack-title"><span id="expertise" class="legacy-anchor"></span><div class="section-heading"><div>{copy('stack.label','p','eyebrow')}{copy('stack.title','h2',attrs='id="stack-title"')}</div></div><div class="stack-groups">{groups}</div>{copy('stack.note','p','stack-note')}</section>
<section id="about" class="about section" aria-labelledby="about-title"><span id="experience" class="legacy-anchor"></span><span id="architecture" class="legacy-anchor"></span><div class="wrap"><div class="section-heading"><div>{copy('about.label','p','eyebrow')}{copy('about.title','h2',attrs='id="about-title"')}</div></div><div class="about-grid"><figure class="portrait"><img src="{P['portrait']}"{portrait_srcset} sizes="(max-width:600px) 180px, 260px" data-profile-image width="1122" height="1402" loading="lazy" decoding="async" alt="{attr('about.portraitAlt')}" data-copy-alt="about.portraitAlt"></figure><div class="about-copy">{copy('about.bio','p')}{copy('about.philosophy','p')}{hero_resume}</div></div></div></section>
''' + s[b:]
s=s.replace("{copy('process.intro','p','section-intro')}", '')
s=s.replace("<button type=\"button\" class=\"motion-switch\" data-motion-switch aria-pressed=\"false\" hidden>Pause motion</button>", '')
s=s.replace("target.write_text(html,encoding='utf-8')", "target.write_text(html,encoding='utf-8')\nproject_pages(D,copy,LOCALE,html)")
a=s.index(" alternates=f'");b=s.index(' subprocess.run',a)
s=s[:a]+''' routes=['']+['projects/'+r['slug']+'/' for r in P['projects']]
 urls=[]
 for path in routes:
  alternates=''.join(f'<xhtml:link rel="alternate" hreflang="{lang}" href="{P["url"]}{"ar/" if lang=="ar" else ""}{path}"/>' for lang in ['en','ar'])
  for prefix in ['', 'ar/']:
   urls.append(f'<url><loc>{P["url"]}{prefix}{path}</loc>{alternates}</url>')
 Path('sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+''.join(urls)+'</urlset>\\n',encoding='utf-8')
''' + s[b:]
p.write_text(s,encoding='utf-8')

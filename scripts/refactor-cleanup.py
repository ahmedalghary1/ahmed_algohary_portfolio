"""Remove obsolete modules after native project pages pass browser verification."""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
p=root/'css/engineering.css'
p.write_text('''/* Shared portrait treatment and navigation states. */
.hero-portrait-frame { position:relative; padding:10px; border:1px solid var(--rule); background:var(--paper); }
.hero-portrait-frame::after { content:''; position:absolute; inset-inline-end:-3px; inset-block-end:32px; inline-size:5px; block-size:64px; background:var(--vermilion); }
.hero-portrait { inline-size:100%; aspect-ratio:4/5; object-fit:cover; object-position:center; }
.portrait-name { font-size:20px; font-weight:500; }
.navigation a[aria-current=location] { color:var(--accent); }
.navigation a[aria-current=location]::after { transform:scaleX(1); }
.nav-resume { font-size:12px; min-block-size:44px; display:inline-flex; align-items:center; text-decoration:underline; text-underline-offset:5px; }
.navigation a[href$="#contact"] { background:var(--ink); color:var(--paper); padding-inline:14px; }
.social-links { gap:8px 24px; }
.social-links a { overflow-wrap:anywhere; }
@media(max-width:1100px) {
 .site-header { flex-wrap:wrap; gap:8px 24px; padding-block:14px; }
 .header-controls { margin-inline-start:auto; }
 .navigation { order:3; inline-size:100%; justify-content:space-between; flex-wrap:wrap; gap:8px; }
 .js .menu-toggle { display:flex; }
 .has-js .navigation,.js .navigation { display:none; }
 .js .navigation.is-open { display:flex; flex-direction:column; align-items:stretch; padding-block:12px; }
 .js .navigation.is-open a { font-size:21px; padding-block:4px; }
 .js .navigation.is-open a::after { display:none; }
}
@media(min-width:1101px) { .navigation { gap:clamp(14px,1.6vw,24px); } .header-controls { gap:14px; } .site-header { gap:24px; } }
@media(max-width:800px) { .nav-resume { display:none; } }
@media(max-width:600px) {
 .site-header { gap:8px; }
 .wordmark { font-size:clamp(18px,5.3vw,22px); }
 .header-controls { gap:10px; } .language-switch { gap:8px; padding-inline-start:10px; }
 .language-icon { display:none; } .menu-toggle { gap:8px; font-size:12px; }
}
''',encoding='utf-8')
p=root/'scripts/render.py';s=p.read_text(encoding='utf-8').replace("'responsive','motion','skills','engineering'","'responsive','engineering'")
s=s.replace("json.dumps(D,ensure_ascii=False)","json.dumps(runtime_content(D),ensure_ascii=False,separators=(',',':'))")
position=s.index("html=f'''<!doctype html>")
s=s[:position]+'''def runtime_content(data):
 # Keep source history available to the owner, but embed only active UI content.
 keys=['name','wordmark','title','seo','nav','hero','work','projects','services','stack','about','process','contact','footer']
 result={lang:{key:data[lang][key] for key in keys} for lang in ['en','ar']}
 result['profile']={key:value for key,value in data['profile'].items() if key not in ['experience','architecture']}
 return result

'''+s[position:]
p.write_text(s,encoding='utf-8')
p=root/'scripts/render_sections.py';s=p.read_text(encoding='utf-8');p.write_text(s[:s.index('\ndef experience_section')],encoding='utf-8')
# These exact files have no remaining imports in the active application.
obsolete=['js/architecture.js','js/case-studies.js','js/motion.js','js/motion/config.js','js/motion/performance-manager.js','js/motion/project-showcase.js','js/motion/scene-manager.js','js/motion/shaders.js','css/motion.css','css/skills.css','scripts/vendor.mjs']
obsolete += [str(p.relative_to(root)) for p in (root/'assets/vendor').glob('*') if p.is_file()]
for filename in obsolete:
 target=(root/filename).resolve()
 if not target.is_relative_to(root):raise ValueError(filename)
 if target.is_file():target.unlink()
p=root/'package.json';d=json.loads(p.read_text(encoding='utf-8'));d['dependencies']={};d['scripts'].pop('vendor',None)
d['scripts']['test']='node scripts/refactor-check.mjs'
d['scripts']['test:motion']='node scripts/refactor-interactions.mjs'
d['scripts']['test:layouts']='node scripts/refactor-check.mjs'
p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf-8')
p=root/'package-lock.json';d=json.loads(p.read_text(encoding='utf-8'));d['packages']={'':{'name':d['name'],'version':d['version']}};p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf-8')
print('Removed obsolete animation/architecture modules and production dependencies; retained source evidence.')

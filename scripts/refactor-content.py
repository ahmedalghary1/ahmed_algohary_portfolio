"""One-time migration of existing evidence-backed content to project-first copy."""
import json
from pathlib import Path
p=Path('data/portfolio.json')
d=json.loads(p.read_text(encoding='utf-8'))
order=['garment-factory','rocks-ev','bonyan','ahmed-nabil','ahmed-gamal']
indices=[next(i for i,p in enumerate(d['profile']['projects']) if p['id']==sid) for sid in order]
for lang in ['en','ar']:
 d[lang]['projects']=[d[lang]['projects'][i] for i in indices]
d['profile']['projects']=[d['profile']['projects'][i] for i in indices]
for i,r in enumerate(d['profile']['projects']):
 r.update(slug=r['id'],featured=i==0,technologies=[],repositoryUrl=None,status='private' if r.get('private') else 'public',screenshots=[{'src':r['preview'],'thumbnail':r['images']['en'],'altKey':f'projects.{i}.alt'}])
en,ar=d['en'],d['ar']
for c,title,home,services in [(en,'Full-Stack Software Developer','Home','Services'),(ar,'مطور برمجيات Full-Stack','الرئيسية','الخدمات')]:
 c['title']=title;c['nav'].update(top=home,services=services)
en['hero'].update(line1='I build websites,',line2='applications and',line3='business systems.',description='From modern websites and e-commerce platforms to custom systems that keep your business running.',work='Explore my work',contact='Let’s talk')
ar['hero'].update(line1='أطوّر مواقع وتطبيقات',line2='وأنظمة لإدارة',line3='الأعمال.',description='من المواقع والمتاجر الإلكترونية إلى أنظمة مخصصة لتنظيم أعمال الشركات والمصانع.',work='تصفح أعمالي',contact='تواصل معي')
en['work'].update(label='01 / Selected projects',title='Built for real work.',intro='Business systems, online stores and websites.',details='View case study',featured='Featured project',next='Next project',back='All projects',links='Explore the project',gallery='Interface preview',role='My role')
ar['work'].update(label='01 / مشاريع مختارة',title='حلول تعمل على أرض الواقع.',intro='أنظمة أعمال ومتاجر إلكترونية ومواقع.',details='تفاصيل المشروع',featured='المشروع الرئيسي',next='المشروع التالي',back='جميع المشاريع',links='استكشف المشروع',gallery='معاينة الواجهة',role='دوري في المشروع')
descriptions=[
 ('Sales, purchasing, inventory and accounts in one Arabic workspace.','المبيعات والمشتريات والمخزون والحسابات في مساحة عمل عربية واحدة.'),
 ('An online store for EV charging products, with clear routes to products and purchasing information.','متجر لمنتجات شحن السيارات الكهربائية، يسهّل الوصول للمنتجات ومعلومات الشراء.'),
 ('A company website presenting marketing services and a direct path to consultation.','موقع يعرض خدمات التسويق وتطوير الأعمال، مع وصول مباشر لطلب استشارة.'),
 ('A personal website presenting an IT specialist’s experience and qualifications.','موقع شخصي يعرض خبرات متخصص في تقنية المعلومات ومؤهلاته.'),
 ('A portfolio connecting customer service, sales and creative work.','معرض أعمال يجمع خبرات خدمة العملاء والمبيعات والعمل الإبداعي.')]
categories=[('Business management system','نظام إدارة أعمال'),('E-commerce','متجر إلكتروني'),('Corporate website','موقع شركة'),('Personal website','موقع شخصي'),('Personal website','موقع شخصي')]
for i in range(5):
 for n,c in enumerate([en,ar]):
  c['projects'][i]['overview']=c['projects'][i]['description']
  c['projects'][i]['description']=descriptions[i][n]
  c['projects'][i]['category']=categories[i][n]
en['projects'][1]['solution']='Product navigation connects shoppers with the catalogue, buying guide, quotation requests, order tracking and support.'
ar['projects'][1]['solution']='تنقل واضح يربط الزائر بدليل المنتجات ومعلومات الشراء وطلب عروض الأسعار وتتبع الطلبات والدعم.'
en['services']={'label':'02 / Services','title':'What I build','items':[
 {'title':'Web development','text':'Clear, responsive websites for companies and independent professionals.','project':'See Bonyan'},
 {'title':'E-commerce','text':'Online stores that connect your products with customers and purchasing information.','project':'See ROCKS EV'},
 {'title':'Business management systems','text':'Connected tools for inventory, sales, purchasing and everyday operations.','project':'See the factory system'},
 {'title':'Backend & APIs','text':'Application logic, secure APIs and database integrations that keep your tools connected.','project':'Discuss your requirements'}]}
ar['services']={'label':'02 / الخدمات','title':'الخدمات التي أقدمها','items':[
 {'title':'تطوير المواقع','text':'مواقع واضحة ومتجاوبة للشركات وأصحاب الأعمال والمستقلين.','project':'شاهد مشروع بنيان'},
 {'title':'المتاجر الإلكترونية','text':'متاجر تربط منتجاتك بالعملاء وتسهّل الوصول لمعلومات الشراء.','project':'شاهد متجر ROCKS EV'},
 {'title':'أنظمة إدارة الأعمال','text':'أدوات مترابطة لتنظيم المخزون والمبيعات والمشتريات والعمليات اليومية.','project':'شاهد نظام المصنع'},
 {'title':'الأنظمة الخلفية وواجهات API','text':'منطق أعمال وواجهات آمنة وربط لقواعد البيانات والتطبيقات.','project':'ناقش متطلبات مشروعك'}]}
d['profile']['services']=[{'project':'bonyan'},{'project':'rocks-ev'},{'project':'garment-factory'},{'project':None}]
en['stack'].update(label='03 / Technology',title='Tools behind the work.',intro='',note='A selection of my toolkit. Each project uses what its requirements call for.')
ar['stack'].update(label='03 / التقنيات',title='أدوات العمل.',intro='',note='مجموعة من الأدوات التي أستخدمها، وأختار منها ما يناسب متطلبات كل مشروع.')
en['about'].update(label='04 / About',title='Ahmed Algohary',bio='I’m a software developer based in Egypt. I focus on turning everyday business workflows into software that is clear to use and straightforward to maintain.',philosophy='I work across the interface, application logic and data, keeping the people using the system at the centre of each decision.')
ar['about'].update(label='04 / نبذة عني',title='أحمد الجوهري',bio='أنا مطور برمجيات مقيم في مصر. أركز على تحويل إجراءات العمل اليومية إلى برامج واضحة الاستخدام وسهلة الصيانة.',philosophy='أعمل على الواجهات ومنطق التطبيق والبيانات، وأضع احتياجات مستخدمي النظام في صميم كل قرار.')
en['process'].update(label='05 / How we work',title='From idea to delivery.',intro='',steps=[{'title':a,'text':b} for a,b in [('Discover','Understand your goals and how your business works.'),('Design','Map the experience, data and solution.'),('Develop','Build and review working software together.'),('Deliver','Test, launch and hand over the project.')]])
ar['process'].update(label='05 / خطوات العمل',title='من الفكرة إلى التسليم.',intro='',steps=[{'title':a,'text':b} for a,b in [('نفهم','نحدد أهدافك ومتطلبات العمل.'),('نصمم','نرسم تجربة الاستخدام وننظم البيانات والحل.'),('نطوّر','نبني البرنامج ونراجع التقدم معًا.'),('نسلّم','نختبر المشروع ونجهزه للإطلاق والتسليم.')]])
en['contact'].update(label='06 / Let’s talk',title='Have a project in mind?',invitation='Let’s build something useful.',description='Share your idea. We’ll work out the right next step.')
ar['contact'].update(label='06 / تواصل معي',title='هل لديك مشروع تريد تنفيذه؟',invitation='لنبنِ حلًا يناسب احتياجاتك.',description='احكِ لي عن فكرتك، ونحدد معًا الخطوة المناسبة.')
en['seo'].update(title='Ahmed Algohary — Full-Stack Software Developer',description='Websites, e-commerce and business management systems by Ahmed Algohary. Explore real projects and discuss your next software project.')
ar['seo'].update(title='أحمد الجوهري — مطور برمجيات Full-Stack',description='مواقع ومتاجر إلكترونية وأنظمة إدارة أعمال من تطوير أحمد الجوهري. تصفح المشاريع وتواصل لمناقشة مشروعك القادم.')
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
s=Path('data/skills.json');v=json.loads(s.read_text(encoding='utf-8'))
v['homepageGroups']=[{'title':{'en':'Frontend','ar':'الواجهات'},'skills':['html','css','javascript','react-js']},{'title':{'en':'Backend','ar':'الأنظمة الخلفية'},'skills':['python','django','django-rest-framework-drf','restful-apis']},{'title':{'en':'Data','ar':'البيانات'},'skills':['postgresql','redis']},{'title':{'en':'Delivery & tools','ar':'التسليم والأدوات'},'skills':['docker','git','github']}]
s.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

"""Generate original local sample illustrations; no external imagery or client data."""
from pathlib import Path
from html import escape
import math
out=Path('assets/images');out.mkdir(exist_ok=True)
def text(x,y,s,size=14,fill='#171717',weight=400,anchor='start'):
 return f'<text x="{x}" y="{y}" font-family="Arial,sans-serif" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{escape(str(s))}</text>'
def rect(x,y,w,h,fill,stroke='none',r=0):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" rx="{r}"/>'
def line(x,y,x2,y2,stroke='#d7d8d0',width=1):return f'<path d="M{x} {y}L{x2} {y2}" stroke="{stroke}" stroke-width="{width}" fill="none"/>'
def svg(body,w=900,h=600):return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>'
for lang in ['en','ar']:
 ar=lang=='ar'
 for kind in ['inventory','commerce','maintenance','hospitality']:
  dark=kind=='maintenance'; bg='#292e2d' if dark else '#f6f5ef'; ink='#eae8e1' if dark else '#242923'; muted='#b0b7ae' if dark else '#60695e'; border='#46504a' if dark else '#d7dbd2'; accent='#c43c28'
  titles={'inventory':('Inventory overview','نظرة على المخزون'),'commerce':('Precision. In every part.','الدقة في كل قطعة.'),'maintenance':('Maintenance workspace','مساحة عمل الصيانة'),'hospitality':('A considered stay.','إقامة مدروسة.')}
  b=rect(0,0,900,600,{'inventory':'#d5d9cf','commerce':'#d9d4cb','maintenance':'#364139','hospitality':'#d4d6d0'}[kind])
  b+=rect(42,42,816,516,bg)+rect(42,42,816,46,'#171d19' if dark else '#fffefa')
  b+=rect(61,59,12,12,accent)+text(82,70,{'inventory':'STOCKROOM','commerce':'FORM / INDUSTRIAL','maintenance':'FIELDWORK','hospitality':'THE GUESTBOOK'}[kind],12,ink,700)
  b+=text(824,70,'تصوّر للواجهة' if ar else 'CONCEPT INTERFACE',9,muted,anchor='end')+line(42,88,858,88,border)
  if kind=='inventory':
   b+=rect(42,89,140,469,'#e9ece4')
   for i,s in enumerate(['Overview','Inventory','Movements','Suppliers','Settings'] if not ar else ['نظرة عامة','المخزون','الحركات','المورّدون','الإعدادات']):
    if i==1:b+=rect(55,147,114,31,'#d6ddd0')
    b+=text(66,133+i*35,s,11,ink if i==1 else muted,600 if i==1 else 400)
   b+=text(206,129,titles[kind][ar],24,ink,600)+text(206,153,'المستودع الرئيسي / عرض توضيحي' if ar else 'Main warehouse / Sample workspace',11,muted)
   for i,(a,c) in enumerate([('الأصناف' if ar else 'Tracked items','248'),('بحاجة للطلب' if ar else 'Reorder queue','12'),('الحركات' if ar else 'Movements','86')]):
    x=206+i*211;b+=text(x,193,a,11,muted)+text(x,227,c,30,ink,500)+line(x,243,x+186,243,border)
   b+=text(206,279,'سجل المخزون' if ar else 'Inventory register',15,ink,600)
   for i,h in enumerate(['الصنف','المخزون','الحالة'] if ar else ['ITEM / REFERENCE','ON HAND','STATUS']):b+=text([206,607,714][i],312,h,9,muted)
   for j,(name,qty,state) in enumerate([('محمل صناعي' if ar else 'Radial bearing / RB-204','64','متاح' if ar else 'In stock'),('وصلة نحاسية' if ar else 'Brass coupling / BC-018','120','متاح' if ar else 'In stock'),('صمام تحكّم' if ar else 'Control valve / CV-032','8','إعادة طلب' if ar else 'Reorder'),('حلقة إحكام' if ar else 'Seal assembly / SA-006','56','متاح' if ar else 'In stock')]):
    y=351+j*50;b+=line(206,y-21,827,y-21,border)+rect(206,y-12,23,23,'#e3e7dd')+text(244,y+3,name,11,ink)+text(615,y+3,qty,12,ink)+text(714,y+3,state,10,accent if j==2 else '#42603d')
  elif kind=='commerce':
   b+=text(76,140,'كتالوج المكوّنات / 01' if ar else 'COMPONENT CATALOGUE / 01',10,muted)+text(76,184,titles[kind][ar],36,ink,600)
   b+=text(76,211,'مكوّنات هندسية. مواصفات واضحة.' if ar else 'Engineered components. Clearly specified.',13,muted)
   b+=line(76,235,824,235,border)
   for j,s in enumerate(['جميع المكوّنات','المحامل','الصمامات','الوصلات'] if ar else ['All components','Bearings','Valves','Couplings']):b+=text(76+j*181,264,s,12,ink)
   for j,label in enumerate(['Precision bearing','Control valve','Shaft coupling'] if not ar else ['محمل دقيق','صمام تحكّم','وصلة محور']):
    x=76+j*256;b+=rect(x,287,236,182,'#e8e8df')
    if j==0:
     for rad,c in [(64,'#899185'),(48,'#c5cbbf'),(33,'#5a6657'),(24,'#e8e8df')]:b+=f'<circle cx="{x+118}" cy="379" r="{rad}" fill="{c}"/>'
     for k in range(10):
      t=k*math.tau/10;b+=f'<circle cx="{x+118+48*math.cos(t)}" cy="{379+48*math.sin(t)}" r="8" fill="#e1e4da" stroke="#697665"/>'
    elif j==1:
     b+=rect(x+54,354,130,54,'#778371')+rect(x+91,313,55,116,'#abb4a4')+rect(x+72,310,93,15,'#45583f')+rect(x+48,350,15,62,'#4d6047')+rect(x+177,350,15,62,'#4d6047')
    else:
     b+=rect(x+54,343,128,70,'#828f79')+rect(x+91,331,55,94,'#5d6f52')
     for k in range(6):b+=line(x+99+k*8,335,x+99+k*8,420,'#a1ad96',2)
    b+=text(x,497,label,15,ink,500)+text(x,520,'عرض المواصفات' if ar else 'View specifications',11,muted)
  elif kind=='maintenance':
   b+=text(76,132,'العمليات / أوامر العمل' if ar else 'OPERATIONS / WORK ORDERS',10,muted)+text(76,175,titles[kind][ar],28,ink,500)
   b+=line(76,198,824,198,border)
   for j,title in enumerate(['مخطّط','قيد التنفيذ','للمراجعة'] if ar else ['Planned','In progress','Review']):
    x=76+j*256;b+=text(x,234,title,13,ink,600)+text(x+219,234,'02',12,muted,anchor='end')
    for k in range(2):
     y=257+k*134;b+=rect(x,y,232,115,'#333c35',border)+rect(x+15,y+17,24,3,accent if j==1 else '#a7b49b')
     names=[['فحص خط الإنتاج','مراجعة منظومة التبريد'],['صيانة المضخّة','معايرة المستشعر'],['فحص السلامة','مراجعة ناقل الحركة']] if ar else [['Production line check','Cooling system review'],['Pump servicing','Sensor calibration'],['Safety inspection','Drive assembly review']]
     b+=text(x+15,y+46,names[j][k],13,ink,500)+text(x+15,y+70,f'EQ-0{j+1}{k+4} / '+('صيانة دورية' if ar else 'Preventive'),10,muted)+text(x+15,y+99,'مسؤول الصيانة' if ar else 'Maintenance team',10,muted)
  else:
   b+=text(76,133,'الحجوزات / عرض توضيحي' if ar else 'RESERVATIONS / SAMPLE WORKSPACE',10,muted)+text(76,178,titles[kind][ar],34,ink,500)
   b+=text(76,216,'مخطّط الغرف' if ar else 'Room planner',14,ink,600)+text(824,216,'أسبوع توضيحي' if ar else 'Illustrative week',11,muted,anchor='end')
   for j,day in enumerate(['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'] if ar else ['MON','TUE','WED','THU','FRI','SAT']):
    x=208+j*103;b+=text(x+14,258,day,10,muted)+line(x,278,x,513,border)
   for k in range(5):
    y=278+k*47;b+=line(76,y,824,y,border)+text(76,y+29,('غرفة ' if ar else 'Room ')+str(101+k),11,ink)
    start=[0,2,1,0,3][k];length=[3,3,2,2,3][k];b+=rect(211+103*start,y+7,103*length-8,32,['#c9d4bc','#dbcfbf','#bccabd','#c9d4bc','#dbcfbf'][k])+text(224+103*start,y+28,'حجز توضيحي' if ar else 'Sample reservation',10,'#34412e')
  (out/f'{kind}-{lang}.svg').write_text(svg(b))
# Architectural silhouette: an original placeholder, not a real portrait.
b=rect(0,0,600,720,'#c7c6bb')
for x in range(40,601,52):b+=line(x,0,x,720,'#b5b5a9',.5)
for y in range(44,721,52):b+=line(0,y,600,y,'#b5b5a9',.5)
b+='<path d="M100 720V620c0-109 77-171 127-187-32-32-45-75-45-126 0-93 43-161 118-161s118 68 118 161c0 51-13 94-45 126 50 16 127 78 127 187v100" fill="#646c5e"/>'
b+='<path d="M300 146c-75 0-118 68-118 161 0 51 13 94 45 126-50 16-127 78-127 187v100h200z" fill="#4b5447"/>'
b+=rect(42,42,52,5,'#a62d20')+line(300,90,300,666,'#a8afa1',.7)+f'<circle cx="300" cy="307" r="153" fill="none" stroke="#a8afa1" stroke-width=".7"/>'
(out/'portrait.svg').write_text(svg(b,600,720))
# Static projection of the same stacked square frames used by the Three.js scene.
def project(x,y,z):
 a=.63;xx=x*math.cos(a)+z*math.sin(a);zz=-x*math.sin(a)+z*math.cos(a)
 return (300+xx*87,272-y*87+zz*35)
b=''
for j in range(23):
 a=j*.043;y=(j-11)*.125;pts=[]
 for x,z in [(-1.25,-1.25),(1.25,-1.25),(1.25,1.25),(-1.25,1.25)]:
  xx=x*math.cos(a)-z*math.sin(a);zz=x*math.sin(a)+z*math.cos(a);pts.append(project(xx,y,zz))
 b+='<polygon points="'+' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)+'" fill="none" stroke="#c43c28" stroke-width="1.05"/>'
(out/'sculpture.svg').write_text(svg(b,600,560))
(out/'favicon.svg').write_text(svg('<rect width="64" height="64" fill="#171717"/><path d="M16 46L30 16h5l14 30h-7l-3-7H26l-3 7zm12-13h9l-4-10z" fill="#eae8e1"/><rect x="47" y="45" width="6" height="6" fill="#c43c28"/>',64,64))
print('Created bilingual original project previews, portrait, sculpture and favicon.')

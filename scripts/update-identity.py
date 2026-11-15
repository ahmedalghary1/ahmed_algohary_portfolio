"""Apply the owner's name and generate small tab icons from the original portrait."""
import json
from pathlib import Path
from PIL import Image, ImageOps

p=Path('data/portfolio.json');data=json.loads(p.read_text(encoding='utf-8'))
for lang,old,new in [('en','Ahmed','Ahmed Algohary'),('ar','أحمد','أحمد الجوهري')]:
    # Only owner copy is updated: client/project names are preserved.
    data[lang]['name']=new
    data[lang]['wordmark']=new
    for section,keys in [('seo',['title','description']),('nav',['home']),('hero',['description','portraitAlt']),('about',['bio','caption','portraitAlt']),('footer',['copyright'])]:
        for key in keys:
            if new not in data[lang][section][key]:
                data[lang][section][key]=data[lang][section][key].replace(old,new)
p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
image=ImageOps.exif_transpose(Image.open('image.png')).convert('RGB')
# Square framing focuses on the face and hair for recognition at small sizes.
square=ImageOps.fit(image,(512,512),method=Image.Resampling.LANCZOS,centering=(.5,.25))
square.resize((64,64),Image.Resampling.LANCZOS).save('assets/images/ahmed-algohary-icon.png')
square.resize((180,180),Image.Resampling.LANCZOS).save('assets/images/ahmed-algohary-apple.png')
square.save('assets/images/ahmed-algohary.ico',format='ICO',sizes=[(16,16),(32,32),(48,48),(64,64)])

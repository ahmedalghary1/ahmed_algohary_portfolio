"""Generate a lightweight SVG fallback from the hero's modular frame geometry."""
from math import sin, cos
from pathlib import Path

faces=[]
def rotate(v, axis, a):
 x,y,z=v;c,s=cos(a),sin(a)
 return (x,y*c-z*s,y*s+z*c) if axis=='x' else ((x*c+z*s,y,-x*s+z*c) if axis=='y' else (x*c-y*s,x*s+y*c,z))

for i in range(6):
 for j in range(4):
  a=j*1.57079632679
  vertices=[]
  for x,y,z in [(-.85,-.055,-.065),(.85,-.055,-.065),(.85,.055,-.065),(-.85,.055,-.065),(-.85,-.055,.065),(.85,-.055,.065),(.85,.055,.065),(-.85,.055,.065)]:
   v=rotate((x,y,z),'z',a)
   v=(v[0]+sin(a)*.85,v[1]+cos(a)*.85,v[2])
   v=rotate(v,'z',(i-2.5)*.13)
   v=(v[0],v[1],v[2]+(i-2.5)*.24)
   v=rotate(rotate(rotate(v,'z',-.16),'y',.65),'x',.38)
   vertices.append(v)
  accent=i==2
  for k,indices in enumerate([(0,1,2,3),(4,7,6,5),(0,4,5,1),(3,2,6,7),(0,3,7,4),(1,5,6,2)]):
   points=[vertices[v] for v in indices]
   palette=['#7e8578','#b7bcae','#4e574c','#d1d4c8','#979f90','#666f62'] if not accent else ['#b73b26','#dc7152','#83291c','#e4997c','#c95137','#a73522']
   faces.append((sum(v[2] for v in points)/4,points,palette[k]))
paths=[]
for _,points,color in sorted(faces,key=lambda f:f[0]):
 xy=' '.join(f'{300+x*135:.2f},{290-y*135:.2f}' for x,y,z in points)
 paths.append(f'<polygon points="{xy}" fill="{color}" stroke="{color}" stroke-width=".4" stroke-linejoin="round"/>')
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600"><title>Modular architectural sculpture</title><ellipse cx="300" cy="500" rx="128" ry="12" fill="#171717" opacity=".06"/>'+''.join(paths)+'</svg>'
Path('assets/images/system-sculpture.svg').write_text(svg,'utf-8')
print('Generated static architectural sculpture fallback.')

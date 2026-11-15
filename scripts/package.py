"""Package only the files required by a static host. No compilation or bundler."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import runpy
root=Path(__file__).resolve().parent.parent
if Path.cwd()!=root:
 raise SystemExit('Run this command from the portfolio project directory.')
runpy.run_path(str(root/'scripts/render.py'),run_name='__main__')
with ZipFile(root/'portfolio-static.zip','w',compression=ZIP_DEFLATED,compresslevel=9) as archive:
 for filename in ['index.html','robots.txt','sitemap.xml']:
  archive.write(root/filename,filename)
 for directory in ['ar','css','js','data','assets']:
  for path in sorted((root/directory).rglob('*')):
   if path.is_file():archive.write(path,path.relative_to(root))
print('Created portfolio-static.zip — extract its contents into the static host document root.')

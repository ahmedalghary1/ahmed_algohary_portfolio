"""Render a clean static document root and ZIP it. Standard-library only."""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'dist'
ARCHIVE = ROOT / 'portfolio-static.zip'


def main():
    # Fixed build-owned paths only. A failed build must not retain old output.
    if OUTPUT.is_symlink():
        raise RuntimeError('dist must not be a symlink')
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    ARCHIVE.unlink(missing_ok=True)
    subprocess.run([sys.executable, str(ROOT / 'scripts/render.py')], cwd=ROOT, check=True)

    data = json.loads((ROOT / 'data/portfolio.json').read_text(encoding='utf-8'))
    slugs = [project['slug'] for project in data['profile']['projects']]
    if len(slugs) != len(set(slugs)) or any(
        not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug) for slug in slugs
    ):
        raise ValueError('Project slugs must be unique, safe route segments')

    files = {Path(name) for name in ('index.html', 'ar/index.html', 'robots.txt', 'sitemap.xml')}
    for prefix in ('projects', 'ar/projects'):
        files.update(Path(prefix) / slug / 'index.html' for slug in slugs)
    # Select current routes explicitly: old pages and raw screenshots may
    # remain in the source ar/ and projects/ trees after content maintenance.
    for directory, extensions in {
        'css': {'.css'},
        'js': {'.js'},
        'assets/images': {'.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.ico', '.gif'},
        'assets/icons': {'.svg'},
        'assets/fonts': {'.woff', '.woff2', '.ttf', '.otf', '.txt'},
        'assets/documents': {'.pdf'},
    }.items():
        files.update(
            path.relative_to(ROOT) for path in (ROOT / directory).rglob('*')
            if path.is_file() and path.suffix.lower() in extensions
            and not any(part.startswith('.') for part in path.relative_to(ROOT).parts)
        )
    for relative in sorted(files):
        source = ROOT / relative
        if source.resolve() != source.absolute():
            raise RuntimeError(f'Public files must not traverse symlinks: {relative}')
        target = OUTPUT / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)

    # Keep the JS fallback identical to public embedded content, excluding
    # historical owner records from the source JSON directory.
    html = (OUTPUT / 'index.html').read_text(encoding='utf-8')
    content = re.search(r'<script type="application/json" id="portfolio-content">(.*?)</script>', html, re.S)
    if content is None:
        raise RuntimeError('Generated homepage is missing runtime content')
    (OUTPUT / 'data').mkdir()
    (OUTPUT / 'data/portfolio.json').write_text(
        json.dumps(json.loads(content[1]), ensure_ascii=False, separators=(',', ':')), encoding='utf-8'
    )

    public_files = sorted(path for path in OUTPUT.rglob('*') if path.is_file())
    with ZipFile(ARCHIVE, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for path in public_files:
            archive.write(path, path.relative_to(OUTPUT).as_posix())
    print(f'Created dist/ ({len(public_files)} files) and portfolio-static.zip from the same output.')


if __name__ == '__main__':
    main()

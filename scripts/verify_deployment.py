"""Verify the actual deployment artifact using a local HTTP server; no packages."""
import functools
import json
import re
import threading
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import urlopen
from urllib.error import HTTPError
from zipfile import ZipFile
from project_data import prepare_public_data

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.ids, self.refs = set(), []
        self.base, self.lang, self.direction = None, None, None
        self.feed(html)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'html':
            self.lang, self.direction = attrs.get('lang'), attrs.get('dir')
        if tag == 'base':
            self.base = attrs.get('href')
            return
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        for name in ('href', 'src', 'poster'):
            if attrs.get(name):
                self.refs.append(attrs[name])
        for candidate in attrs.get('srcset', '').split(','):
            if candidate.strip():
                self.refs.append(candidate.strip().split()[0])


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main():
    assert (DIST / 'index.html').is_file(), 'Run npm run build first'
    config = json.loads((ROOT / 'vercel.json').read_text())
    assert config['outputDirectory'] == 'dist'
    assert config['buildCommand'] == 'npm run build' and config['framework'] is None
    files = {p.relative_to(DIST).as_posix(): p for p in DIST.rglob('*') if p.is_file()}
    data = prepare_public_data(json.loads((ROOT / 'data/portfolio.json').read_text(encoding='utf-8')))
    expected_pages = {'index.html', 'ar/index.html'} | {
        f'{prefix}projects/{project["slug"]}/index.html'
        for prefix in ('', 'ar/') for project in data['profile']['projects']
    }
    assert {name for name in files if name.endswith('.html')} == expected_pages
    assert all(name.split('/')[0] in {'index.html', 'robots.txt', 'sitemap.xml', 'ar', 'projects', 'assets', 'css', 'js', 'data'} for name in files)
    assert not any(part.startswith('.') or part in {'node_modules', '__pycache__'} for name in files for part in name.split('/'))
    assert not any(name.endswith(('.zip', '.py', '.mjs')) for name in files)
    assert all(name.endswith('/index.html') for name in files if name.startswith(('projects/', 'ar/')))
    with ZipFile(ROOT / 'portfolio-static.zip') as archive:
        assert len(archive.namelist()) == len(set(archive.namelist())), 'Duplicate ZIP entries'
        assert set(archive.namelist()) == set(files), 'ZIP differs from deployment output'
        for name, path in files.items():
            assert archive.read(name) == path.read_bytes(), name
    pages = {name: Page(files[name].read_text(encoding='utf-8')) for name in expected_pages}
    for name, page in pages.items():
        lang = 'ar' if name.startswith('ar/') else 'en'
        assert (page.lang, page.direction) == (lang, 'rtl' if lang == 'ar' else 'ltr'), name
    public = json.loads((DIST / 'data/portfolio.json').read_text(encoding='utf-8'))
    assert 'experience' not in public['profile'] and 'architecture' not in public['profile']
    assert (DIST / data['profile']['cv']).read_bytes() == (ROOT / data['profile']['cv']).read_bytes()

    handler = functools.partial(QuietHandler, directory=str(DIST))
    server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    origin = f'http://127.0.0.1:{server.server_port}'
    checks = 0

    def check(ref, base):
        nonlocal checks
        target = urlsplit(urljoin(base, ref))
        if f'{target.scheme}://{target.netloc}' != origin:
            return
        name = unquote(target.path).lstrip('/')
        if not name or name.endswith('/'):
            name += 'index.html'
        # Exact dictionary membership also detects case errors on Windows.
        assert name in files, f'Missing or wrong-case reference: {ref} from {base}'
        if target.fragment and name in pages:
            assert unquote(target.fragment) in pages[name].ids, f'Missing fragment: {ref} from {base}'
        with urlopen(target._replace(fragment='').geturl(), timeout=10) as response:
            assert response.status == 200
            assert response.read() == files[name].read_bytes(), name
        checks += 1

    try:
        for name in files:
            check('/' + name, origin + '/')
        for name, page in pages.items():
            route = '/' + name.removesuffix('index.html')
            check(route, origin + '/')
            base = urljoin(origin + route, page.base or '')
            for ref in page.refs:
                check(ref, base)
        for name, path in files.items():
            text = path.read_text(encoding='utf-8') if path.suffix in {'.css', '.js'} else ''
            refs = re.findall(r'url\(\s*[\'"]?([^\s)\'"]+)', text) if path.suffix == '.css' else []
            if path.suffix == '.js':
                refs += re.findall(r'(?:from\s*|import\s*)[\'"]([^\'"]+)', text)
                refs += re.findall(r'new URL\([\'"]([^\'"]+)[\'"],\s*import.meta.url', text)
            for ref in refs:
                check(ref, origin + '/' + name)
        for element in ET.parse(DIST / 'sitemap.xml').iter():
            if element.tag.endswith('}loc'):
                check(urlsplit(element.text).path, origin + '/')
            if 'href' in element.attrib:
                check(urlsplit(element.attrib['href']).path, origin + '/')
        for private in ['/.git/config', '/package.json', '/scripts/package.py',
                        '/data/projects-drafts.json', '/projects/3.png', '/portfolio-static.zip',
                        '/output/pdf/ahmed-algohary-cv-review.pdf']:
            try:
                urlopen(origin + private, timeout=10)
            except HTTPError as error:
                assert error.code == 404, private
            else:
                raise AssertionError(f'Private source file is publicly served: {private}')
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
    print(f'PASS: {len(pages)} localized pages, {len(files)} files, {checks} HTTP/link/asset checks, exact ZIP parity and public-file boundaries.')


if __name__ == '__main__':
    main()

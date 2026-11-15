"""Public project model shared by rendering, packaging and validation.

Localized fields stay in en/ar.projects, preserving the existing copy system.
Unpublished records and owner-only notes never enter the public data model.
"""
from copy import deepcopy
from pathlib import PurePosixPath
import re
from urllib.parse import urlsplit

LOCALES = ('en', 'ar')
TYPES = {'web-application', 'corporate-website', 'e-commerce', 'desktop-application',
         'mobile-application', 'business-management-system', 'backend-api', 'personal-website'}
STATUSES = {'completed', 'in-development', 'internal-system', 'prototype'}


def public_asset(value):
    """Local approved assets only; no source files, traversal or active schemes."""
    path = PurePosixPath(value)
    if not value.startswith('assets/') or '\\' in value or '..' in path.parts or urlsplit(value).query or urlsplit(value).fragment:
        raise ValueError(f'Invalid public asset path: {value}')
    return value


def secure_url(value):
    parsed = urlsplit(value)
    if parsed.scheme != 'https' or not parsed.netloc or parsed.username or parsed.password:
        raise ValueError('Public external links must use HTTPS without credentials')
    return value


def prepare_public_data(source):
    data = deepcopy(source)
    selected = [(i, r) for i, r in enumerate(data['profile']['projects']) if r.get('published', True)]
    selected.sort(key=lambda item: (not item[1].get('featured', False), item[1].get('displayOrder', item[0])))
    ids, slugs = set(), set()
    for _, record in selected:
        if not all(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', record[key]) for key in ('id','slug')):
            raise ValueError('Project slug must be a safe path segment')
        if record['slug'] in slugs or record['id'] in ids:
            raise ValueError('Project IDs and slugs must be unique')
        ids.add(record['id']); slugs.add(record['slug'])
        if record.get('projectType') and record['projectType'] not in TYPES:
            raise ValueError('Unknown project type')
        if record.get('status') and record['status'] not in STATUSES:
            raise ValueError('Project status must describe an evidenced lifecycle state')
        record['url'] = record.get('liveUrl', record.get('url'))
        record['liveUrl'] = record['url']
        record.setdefault('featured', False)
        record['private'] = record.get('accessType') == 'private' or record.get('private', False)
        if record['private'] and record['url']:
            raise ValueError('Private systems must not expose a live URL')
        for key in ('url', 'repositoryUrl'):
            if record.get(key):
                secure_url(record[key])
        cover = record.get('coverImage', record.get('images'))
        record['images'] = {lang: cover if isinstance(cover, str) else cover[lang] for lang in LOCALES}
        for image in record['images'].values():
            public_asset(image)
        record['coverImage'] = record['images']
        record.setdefault('srcset', {})
        record.setdefault('preview', record['images']['en'])
        public_asset(record['preview'])
        if record.get('platform') and record['platform'] not in {'web','desktop','mobile'}:
            raise ValueError('Unknown platform')
        record.setdefault('technologies', [])
        record.setdefault('screenshots', [])
        record.setdefault('videos', [])
        record['relatedProjects'] = [item for item in record.get('relatedProjects', []) if item in {r['id'] for _, r in selected}]
        record.pop('reviewNotes', None)
        record.pop('evidence', None)
    if sum(bool(r.get('featured')) for _, r in selected) > 1:
        raise ValueError('Select at most one featured project')

    for lang in LOCALES:
        data[lang]['projects'] = [data[lang]['projects'][i] for i, _ in selected]
    data['profile']['projects'] = [r for _, r in selected]
    for index, (original_index, record) in enumerate(selected):
        for lang in LOCALES:
            copy = data[lang]['projects'][index]
            for modern, legacy in [('shortDescription','description'), ('businessProblem','problem'), ('myRole','role')]:
                if copy.get(modern):
                    copy[legacy] = copy[modern]
            for field in ('title', 'category', 'description', 'alt'):
                if not copy.get(field):
                    raise ValueError(f'{record["slug"]}: missing {lang} {field}')
            copy.setdefault('keyFeatures', [])
            copy.setdefault('modules', [])
            copy.setdefault('media', [])
            copy.setdefault('videos', [])
            copy.setdefault('seoMetadata', {})
        for field in ('keyFeatures', 'modules'):
            if len(data['en']['projects'][index][field]) != len(data['ar']['projects'][index][field]):
                raise ValueError(f'{record["slug"]}: {field} translations must be paired')
            for lang in LOCALES:
                for item in data[lang]['projects'][index][field]:
                    if not item.get('title') or not item.get('text'):
                        raise ValueError(f'{record["slug"]}: populated {field} needs a title and description')
        # Media and localized captions are sorted/filtered together, avoiding
        # mismatched copy references when records are hidden or reordered.
        for field, copy_field in [('screenshots', 'media'), ('videos', 'videos')]:
            media = [(j, item) for j, item in enumerate(record[field]) if item.get('approved', False)]
            media.sort(key=lambda pair: pair[1].get('displayOrder', pair[0]))
            for lang in LOCALES:
                captions = data[lang]['projects'][index][copy_field]
                data[lang]['projects'][index][copy_field] = [captions[j] for j, _ in media]
            record[field] = [item for _, item in media]
            for j, item in enumerate(record[field]):
                for key in ('src', 'thumbnail', 'poster'):
                    if item.get(key):
                        if field == 'videos' and key == 'src' and item[key].startswith('https://'):
                            secure_url(item[key])
                        else:
                            public_asset(item[key])
                if not item.get('src') or (field == 'videos' and not item.get('poster')):
                    raise ValueError('Approved media requires a source; video also requires a poster')
                for track in item.get('captions', []):
                    public_asset(track['src'])
                    if track['lang'] not in LOCALES:
                        raise ValueError('Unknown video caption language')
                item['altKey'] = f'projects.{index}.{copy_field}.{j}.alt'
                for lang in LOCALES:
                    caption = data[lang]['projects'][index][copy_field][j]
                    if not all(caption.get(key) for key in ('title', 'caption', 'alt')):
                        raise ValueError('Media needs a localized title, caption and alt text')
    # Testimonials are opt-in and require both evidence and permission.
    data['profile']['testimonials'] = [r for r in data['profile'].get('testimonials', [])
                                       if r.get('verified') and r.get('consent')
                                       and r.get('name') and all(r.get('quote', {}).get(lang) for lang in LOCALES)]
    return data


def runtime_content(data):
    keys = ['name', 'wordmark', 'title', 'seo', 'nav', 'hero', 'work', 'projects',
            'services', 'stack', 'about', 'process', 'contact', 'footer', 'projectUI', 'career']
    result = {lang: {key: data[lang][key] for key in keys if key in data[lang]} for lang in LOCALES}
    result['profile'] = {key: value for key, value in data['profile'].items()
                         if key not in ['experience', 'architecture', 'drafts']}
    return result

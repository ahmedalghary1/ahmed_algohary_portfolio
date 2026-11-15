"""Publication and media regression checks, independent of browser QA."""
from copy import deepcopy
import json
from pathlib import Path
import unittest
from project_data import prepare_public_data, runtime_content
from render_media import gallery_markup, videos_markup

SOURCE = json.loads((Path(__file__).resolve().parent.parent / 'data/portfolio.json').read_text(encoding='utf-8'))


class PublicationTests(unittest.TestCase):
    def test_hidden_incomplete_record_never_enters_public_payload(self):
        data = deepcopy(SOURCE)
        data['profile']['projects'].append({'id': 'secret-draft', 'published': False})
        for lang in ('en', 'ar'):
            data[lang]['projects'].append({'title': 'CONFIDENTIAL DRAFT'})
        public = prepare_public_data(data)
        self.assertNotIn('CONFIDENTIAL', json.dumps(runtime_content(public)))
        self.assertEqual(len(public['profile']['projects']), 5)

    def test_order_and_hidden_records_keep_translations_and_alt_keys_aligned(self):
        data = deepcopy(SOURCE)
        data['profile']['projects'][0]['published'] = False
        data['profile']['projects'][-1]['featured'] = True
        result = prepare_public_data(data)
        self.assertEqual(result['profile']['projects'][0]['id'], 'ahmed-gamal')
        for lang in ('en', 'ar'):
            self.assertEqual(result[lang]['projects'][0]['title'], SOURCE[lang]['projects'][-1]['title'])
        self.assertEqual(result['profile']['projects'][0]['screenshots'][0]['altKey'], 'projects.0.media.0.alt')

    def test_unapproved_media_and_captions_are_excluded_together(self):
        data = deepcopy(SOURCE)
        data['profile']['projects'][0]['screenshots'][0]['approved'] = False
        result = prepare_public_data(data)
        self.assertEqual(result['profile']['projects'][0]['screenshots'], [])
        self.assertEqual(result['ar']['projects'][0]['media'], [])

    def test_empty_optional_media_and_features_are_valid(self):
        data = deepcopy(SOURCE)
        for lang in ('en', 'ar'):
            data[lang]['projects'][0]['keyFeatures'] = []
            data[lang]['projects'][0]['modules'] = []
        data['profile']['projects'][0]['screenshots'] = []
        data['profile']['projects'][0]['videos'] = []
        self.assertEqual(prepare_public_data(data)['profile']['projects'][0]['videos'], [])

    def test_unsafe_urls_paths_and_duplicate_routes_are_rejected(self):
        for mutate in [
            lambda d: d['profile']['projects'][1].update(liveUrl='javascript:alert(1)'),
            lambda d: d['profile']['projects'][0].update(coverImage='assets/../../.env'),
            lambda d: d['profile']['projects'][1].update(slug='garment-factory'),
            lambda d: d['profile']['projects'][0].update(liveUrl='https://private.example'),
        ]:
            data = deepcopy(SOURCE); mutate(data)
            with self.assertRaises(ValueError):
                prepare_public_data(data)

    def test_testimonials_require_permission_and_bilingual_evidence(self):
        data = deepcopy(SOURCE)
        data['profile']['testimonials'] = [{'name': 'Unapproved', 'quote': {'en': 'x', 'ar': 'x'}, 'verified': True}]
        self.assertEqual(prepare_public_data(data)['profile']['testimonials'], [])

    def test_modern_copy_aliases_and_minimal_cover_without_srcset(self):
        data = deepcopy(SOURCE)
        data['profile']['projects'][0].pop('srcset')
        for lang in ('en','ar'):
            data[lang]['projects'][0]['shortDescription'] = 'A confirmed short description'
        result = prepare_public_data(data)
        self.assertEqual(result['en']['projects'][0]['description'], 'A confirmed short description')
        self.assertEqual(result['profile']['projects'][0]['srcset'], {})

    def test_optional_media_templates_and_safe_native_video(self):
        from html import escape
        def copy(key, tag='span', cls='', attrs=''):
            return f'<{tag}>{escape(key)}</{tag}>'
        self.assertEqual(gallery_markup({'screenshots':[]},0,copy,'en',{}), '')
        self.assertEqual(videos_markup({'videos':[]},0,copy,'en',{}), '')
        video = {'src':'assets/videos/test-only.webm', 'poster':'assets/images/projects/rocks-ev-1600.webp',
                 'type':'video/webm', 'captions':[{'src':'assets/videos/test-only.en.vtt','lang':'en'}]}
        html = videos_markup({'videos':[video]},0,copy,'en',{'videos':[{'title':'Demo <test>'}]})
        self.assertIn('preload="none"',html)
        self.assertIn('controls playsinline',html)
        self.assertIn('kind="captions"',html)
        self.assertIn('Demo &lt;test&gt;',html)
        self.assertNotIn('autoplay',html)


if __name__ == '__main__':
    unittest.main()

"""Publishing regressions for missing pages, canonical URLs, and exclusions."""
from html import escape
from pathlib import Path
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from sitemap import ORIGIN, audit_sitemap, inventory, render_sitemap


class SitemapTests(unittest.TestCase):
    def setUp(self):
        (ROOT / '.cache').mkdir(exist_ok=True)
        self.temporary = tempfile.TemporaryDirectory(prefix='sitemap-test-', dir=ROOT / '.cache')
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.page('index.html', ORIGIN + '/')

    def page(self, name, canonical, extra=''):
        file = self.root / name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(f'<!doctype html><head><link href="{escape(canonical, quote=True)}" '
                        f'rel="canonical">{extra}</head><body>A useful page.</body>', encoding='utf-8')

    def write_sitemap(self):
        file = self.root / 'sitemap.xml'
        file.write_text(render_sitemap(self.root), encoding='utf-8')
        return file

    def test_new_games_guides_and_nested_pages_are_discovered(self):
        for name in ['new-game.html', 'guides/rules.html', 'topics/index.html']:
            route = name.removesuffix('index.html') if name.endswith('/index.html') else name
            self.page(name, ORIGIN + '/' + route)
        self.write_sitemap()
        self.assertEqual(audit_sitemap(self.root)['sitemapURLs'], 4)

    def test_redirects_noindex_and_maintenance_are_excluded(self):
        self.page('old.html', ORIGIN + '/new.html', "<META CONTENT='0;url=/new.html' HTTP-EQUIV='REFRESH'>")
        self.page('profile.html', ORIGIN + '/profile.html', "<meta content='FOLLOW, NOINDEX' name='ROBOTS'>")
        self.page('private.html', ORIGIN + '/private.html', "<meta name='googlebot' content='none'>")
        self.page('docs/internal.html', ORIGIN + '/docs/internal.html')
        self.write_sitemap()
        report = audit_sitemap(self.root)
        self.assertEqual(report['sitemapURLs'], 1)
        self.assertEqual(report['excluded'], {'redirects': 1, 'noindex': 2})

    def test_missing_new_page_fails(self):
        self.write_sitemap()
        self.page('new-game.html', ORIGIN + '/new-game.html')
        with self.assertRaisesRegex(ValueError, 'missing canonical pages'):
            audit_sitemap(self.root)

    def test_noindex_added_after_generation_fails(self):
        self.page('game.html', ORIGIN + '/game.html')
        self.write_sitemap()
        self.page('game.html', ORIGIN + '/game.html', "<meta name='robots' content='noindex'>")
        with self.assertRaisesRegex(ValueError, 'nonindexable URLs'):
            audit_sitemap(self.root)

    def test_wrong_canonical_and_query_variants_fail(self):
        for canonical in [ORIGIN + '/other.html', ORIGIN + '/game.html?mode=x',
                          ORIGIN + '/game.html#play', 'https://example.org/game.html']:
            with self.subTest(canonical=canonical):
                self.page('game.html', canonical)
                with self.assertRaisesRegex(ValueError, 'canonical'):
                    inventory(self.root)

    def test_duplicate_entries_fail(self):
        file = self.write_sitemap()
        source = file.read_text(encoding='utf-8')
        source = source.replace('</urlset>', f'<url><loc>{ORIGIN}/</loc></url></urlset>')
        file.write_text(source, encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'duplicate URLs'):
            audit_sitemap(self.root)

    def test_xml_and_namespace_are_validated(self):
        file = self.write_sitemap()
        file.write_text('<urlset>', encoding='utf-8')
        with self.assertRaises(ET.ParseError):
            audit_sitemap(self.root)
        file.write_text('<urlset/>', encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'namespace'):
            audit_sitemap(self.root)

    def test_build_is_deterministic(self):
        self.page('z.html', ORIGIN + '/z.html')
        self.page('a.html', ORIGIN + '/a.html')
        first = render_sitemap(self.root)
        self.assertEqual(first, render_sitemap(self.root))
        self.assertLess(first.index(ORIGIN + '/</loc>'), first.index(ORIGIN + '/a.html'))


if __name__ == '__main__':
    unittest.main()

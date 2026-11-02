"""Generate and audit the sitemap from the published HTML metadata."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote
import argparse
import json
import os
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://thequizrealm.com'
NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9'
# Maintenance directories excluded from GitHub Pages in _config.yml.
EXCLUDED = {'.git', 'node_modules', 'site', 'tools', 'tests', 'docs', '.cache',
            'test-results', 'playwright-report'}


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonicals = []
        self.noindex = False
        self.redirect = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and 'canonical' in (attrs.get('rel') or '').lower().split():
            self.canonicals.append(attrs.get('href', ''))
        if tag == 'meta':
            if (attrs.get('name') or '').lower() in {'robots', 'googlebot'}:
                directives = (attrs.get('content') or '').lower().replace(',', ' ').split()
                self.noindex |= bool({'noindex', 'none'} & set(directives))
            self.redirect |= (attrs.get('http-equiv') or '').lower() == 'refresh'


def inventory(root=ROOT):
    """Require each eligible page to declare its own public canonical URL."""
    urls = []
    excluded = {'redirects': 0, 'noindex': 0}
    for directory, folders, files in os.walk(root):
        folders[:] = sorted(name for name in folders
                            if name not in EXCLUDED and not name.startswith('.'))
        for name in sorted(files):
            if not name.endswith('.html'):
                continue
            file = Path(directory) / name
            metadata = Metadata()
            metadata.feed(file.read_text(encoding='utf-8-sig'))
            if metadata.redirect:
                excluded['redirects'] += 1
                continue
            if metadata.noindex:
                excluded['noindex'] += 1
                continue
            route = file.relative_to(root).as_posix()
            if name == 'index.html':
                route = route[:-len('index.html')]
            expected = ORIGIN + '/' + quote(route, safe='/')
            if metadata.canonicals != [expected]:
                raise ValueError(f'{file.relative_to(root)}: expected exactly one '
                                 f'canonical {expected}, got {metadata.canonicals}')
            urls.append(expected)
    return sorted(urls), excluded


def render_sitemap(root=ROOT):
    urls, _ = inventory(root)
    ET.register_namespace('', NAMESPACE)
    tree = ET.Element(f'{{{NAMESPACE}}}urlset')
    for url in urls:
        entry = ET.SubElement(tree, f'{{{NAMESPACE}}}url')
        ET.SubElement(entry, f'{{{NAMESPACE}}}loc').text = url
    ET.indent(tree, space='  ')
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(tree, encoding='unicode') + '\n'


def audit_sitemap(root=ROOT):
    expected, excluded = inventory(root)
    tree = ET.parse(root / 'sitemap.xml').getroot()
    if tree.tag != f'{{{NAMESPACE}}}urlset':
        raise ValueError('sitemap.xml: invalid urlset namespace')
    urls = []
    for entry in tree:
        if entry.tag != f'{{{NAMESPACE}}}url':
            raise ValueError('sitemap.xml: unexpected element in urlset')
        locations = entry.findall(f'{{{NAMESPACE}}}loc')
        if len(locations) != 1 or not locations[0].text:
            raise ValueError('sitemap.xml: each URL needs exactly one nonempty loc')
        urls.append(locations[0].text)
    if len(urls) != len(set(urls)):
        raise ValueError('sitemap.xml: duplicate URLs')
    missing = sorted(set(expected) - set(urls))
    unexpected = sorted(set(urls) - set(expected))
    if missing or unexpected:
        raise ValueError(f'sitemap.xml: missing canonical pages {missing}; '
                         f'unexpected or nonindexable URLs {unexpected}')
    return {'sitemapURLs': len(urls), 'missingPages': 0,
            'unexpectedURLs': 0, 'excluded': excluded}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='check the committed sitemap')
    args = parser.parse_args()
    try:
        if args.check:
            print(json.dumps(audit_sitemap()))
        else:
            print(render_sitemap(), end='')
    except (ValueError, ET.ParseError) as error:
        parser.exit(1, str(error) + '\n')

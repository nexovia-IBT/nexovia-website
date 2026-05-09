import html
import os
import re
import shutil
import unicodedata
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

YEAR = 2026
POSTS = [
    'https://nexovia.pro/blog/k-beauty-aftercare',
    'https://nexovia.pro/blog/aftercare-mistakes-ruin-procedure-results',
    'https://nexovia.pro/blog/pdrn-in-skincare',
    'https://nexovia.pro/blog/plant-exosomes-skincare',
    'https://nexovia.pro/blog/what-to-put-on-face-after-microneedling',
    'https://nexovia.pro/blog/when-can-i-use-retinol-after-microneedling-laser',
    'https://nexovia.pro/blog/skin-feels-tight-after-procedure',
    'https://nexovia.pro/blog/standardized-aftercare-protocols-clinics',
    'https://nexovia.pro/blog/post-procedure-skincare-routine',
    'https://nexovia.pro/blog/how-long-does-redness-last-after-microneedling',
    'https://nexovia.pro/blog/rf-microneedling-vs-traditional-microneedling-recovery',
    'https://nexovia.pro/blog/laser-skin-resurfacing-aftercare',
    'https://nexovia.pro/blog/chemical-peel-aftercare',
    'https://nexovia.pro/blog/ipl-aftercare',
    'https://nexovia.pro/blog/can-i-wear-makeup-after-microneedling',
    'https://nexovia.pro/blog/how-to-reduce-redness-after-laser-treatment',
    'https://nexovia.pro/blog/preventing-hyperpigmentation-after-aesthetic-procedures',
    'https://nexovia.pro/blog/nad-plus-for-skin',
    'https://nexovia.pro/blog/peptides-for-skin-barrier-repair',
    'https://nexovia.pro/blog/microneedling-aftercare-day-by-day',
    'https://nexovia.pro/blog/what-ingredients-to-avoid-after-laser-treatment-a-complete-checklist',
    'https://nexovia.pro/blog/can-i-exercise-after-a-chemical-peel-a-timeline-for-returning-to-the-gym',
    'https://nexovia.pro/blog/microneedling-for-acne-scars-aftercare-tips-to-maximize-scar-improvement',
    'https://nexovia.pro/blog/sun-exposure-after-aesthetic-procedures-why-spf-is-non-negotiable',
    'https://nexovia.pro/blog/how-to-calm-swelling-after-rf-microneedling-whats-normal-and-whats-not',
    'https://nexovia.pro/blog/can-i-use-vitamin-c-after-microneedling-timing-types-and-safety',
    'https://nexovia.pro/blog/how-to-keep-skin-hydrated-after-laser-resurfacing-without-clogging-pores',
    'https://nexovia.pro/blog/07tu3lf9zx6xx7vh6c8m2gbdujl5nd',
    'https://nexovia.pro/blog/exosomes-vs-growth-factors-understanding-the-new-generation-of-skin-recovery',
]

MONTHS = {m: i for i, m in enumerate(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 1)}
TRANSLATE = str.maketrans({
    '\u2018': "'", '\u2019': "'", '\u201c': '"', '\u201d': '"', '\u2013': '-', '\u2014': '-',
    '\u2026': '...', '\u00a0': ' ', '\u00b7': '*', '\u00ae': '', '\u2122': '', '\u2082': '2',
})

def ascii_text(value):
    value = html.unescape(value or '')
    value = value.translate(TRANSLATE)
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    return value

def clean_text(value):
    value = ascii_text(value)
    value = re.sub(r'\s+', ' ', value).strip()
    return value

def clean_inline(value):
    value = ascii_text(value)
    value = re.sub(r'\s+', ' ', value).strip()
    return value

def strip_tags(value):
    value = re.sub(r'<[^>]+>', '', value)
    return clean_text(value)

def slug_from_url(url):
    return urllib.parse.urlparse(url).path.rstrip('/').split('/')[-1]

def yaml_string(value):
    value = clean_text(value).replace('\\', '\\\\').replace('"', '\\"')
    return f'"{value}"'

def date_from_label(label):
    label = clean_text(label)
    parts = label.split()
    if len(parts) >= 2 and parts[0][:3] in MONTHS:
        day = int(re.sub(r'\D', '', parts[1]) or '1')
        return f'{YEAR}-{MONTHS[parts[0][:3]]:02d}-{day:02d}'
    return f'{YEAR}-01-01'

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode('utf-8', 'replace')

def localize_href(href):
    href = html.unescape(href or '').strip()
    if not href or href.startswith('#') or href.startswith('mailto:') or href.startswith('tel:'):
        return href
    parsed = urllib.parse.urlparse(href)
    if parsed.netloc == 'nexovia.pro':
        path = parsed.path or '/'
        return path + (('?' + parsed.query) if parsed.query else '') + (('#' + parsed.fragment) if parsed.fragment else '')
    return href

def download_image(url, slug, index):
    if not url:
        return '/images/blog/placeholder.jpg'
    clean = url.split('?')[0]
    ext = os.path.splitext(urllib.parse.urlparse(clean).path)[1].lower() or '.webp'
    if ext not in ('.jpg', '.jpeg', '.png', '.webp'):
        ext = '.webp'
    suffix = '' if index == 1 else f'-{index}'
    out_dir = Path('public/images/blog')
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f'{slug}{suffix}{ext}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as resp, open(out_path, 'wb') as f:
            shutil.copyfileobj(resp, f)
        return f'/images/blog/{slug}{suffix}{ext}'
    except Exception:
        return '/images/blog/placeholder.jpg'

def extract_meta(html_text, name):
    name_pattern = re.escape(name)
    pattern = rf'<meta[^>]+(?:name|property)=([\"\']){name_pattern}\1[^>]+content=([\"\'])(.*?)\2'
    match = re.search(pattern, html_text, re.I | re.S)
    if match:
        return clean_text(match.group(3))
    pattern = rf'<meta[^>]+content=([\"\'])(.*?)\1[^>]+(?:name|property)=([\"\']){name_pattern}\3'
    match = re.search(pattern, html_text, re.I | re.S)
    return clean_text(match.group(2)) if match else ''

class StructuredArticleParser(HTMLParser):
    def __init__(self, slug):
        super().__init__(convert_charrefs=True)
        self.slug = slug
        self.in_article = False
        self.in_content = False
        self.article_depth = 0
        self.content_depth = 0
        self.skip_depth = 0
        self.title = ''
        self.date = ''
        self.current = None
        self.blocks = []
        self.list_stack = []
        self.seen_images = set()
        self.image_count = 0
        self.featured_image = '/images/blog/placeholder.jpg'

    def start_current(self, tag):
        if self.current:
            self.flush_current()
        self.current = {'tag': tag, 'parts': []}

    def add_text(self, text):
        if not self.current:
            return
        text = clean_inline(text)
        if not text:
            return
        parts = self.current['parts']
        escaped = html.escape(text)
        if parts:
            previous = parts[-1]
            if not previous.endswith((' ', '>', '/', '\n')) and not escaped[:1] in ',.;:?!)]}':
                parts.append(' ')
        parts.append(escaped)

    def add_inline_start(self, tag, attrs):
        if not self.current:
            return
        if tag == 'a':
            href = localize_href(dict(attrs).get('href', ''))
            if href:
                self.current['parts'].append(f'<a href="{html.escape(href, quote=True)}">')
        elif tag in ('strong', 'b'):
            self.current['parts'].append('<strong>')
        elif tag in ('em', 'i'):
            self.current['parts'].append('<em>')
        elif tag == 'br':
            self.current['parts'].append('<br />')

    def add_inline_end(self, tag):
        if not self.current:
            return
        if tag == 'a':
            self.current['parts'].append('</a>')
        elif tag in ('strong', 'b'):
            self.current['parts'].append('</strong>')
        elif tag in ('em', 'i'):
            self.current['parts'].append('</em>')

    def flush_current(self):
        if not self.current:
            return
        tag = self.current['tag']
        inner = ''.join(self.current['parts'])
        inner = re.sub(r'\s+', ' ', inner).strip()
        inner = re.sub(r'\s+([,.;:?!])', r'\1', inner)
        text = strip_tags(inner)
        if text and text not in {'Discover Your Skin Recovery Score', 'Written By Suleyman Aygun'}:
            if tag == 'title' and not self.title:
                self.title = text
            elif tag in ('p', 'h2', 'h3', 'h4', 'blockquote', 'li'):
                self.blocks.append(f'<{tag}>{inner}</{tag}>')
        self.current = None

    def add_image(self, attrs):
        raw_url = attrs.get('data-src') or attrs.get('data-image') or attrs.get('src') or ''
        if not raw_url or raw_url in self.seen_images:
            return
        self.seen_images.add(raw_url)
        self.image_count += 1
        local = download_image(raw_url, self.slug, self.image_count)
        if self.image_count == 1:
            self.featured_image = local
        alt = clean_text(attrs.get('alt', '')) or self.title or 'Nexovia article image'
        self.flush_current()
        self.blocks.append(f'<figure><img src="{html.escape(local, quote=True)}" alt="{html.escape(alt, quote=True)}" /></figure>')

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        klass = attrs_dict.get('class', '')
        if tag in ('script', 'style'):
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag == 'article' and 'h-entry' in klass:
            self.in_article = True
            self.article_depth = 1
            return
        if self.in_article and tag != 'article':
            self.article_depth += 1
        if self.in_article and tag == 'div' and 'blog-item-content' in klass and 'e-content' in klass:
            self.in_content = True
            self.content_depth = 1
            return
        if self.in_article and not self.in_content:
            if tag == 'h1':
                self.start_current('title')
            elif tag == 'time' and not self.date:
                self.date = attrs_dict.get('datetime', '')
            return
        if not self.in_content:
            return
        if tag == 'div':
            self.content_depth += 1
            return
        if tag in ('p', 'h2', 'h3', 'h4', 'blockquote'):
            self.start_current(tag)
            return
        if tag in ('ul', 'ol'):
            self.flush_current()
            self.blocks.append(f'<{tag}>')
            self.list_stack.append(tag)
            return
        if tag == 'li':
            self.start_current('li')
            return
        if tag == 'img':
            self.add_image(attrs_dict)
            return
        if tag in ('a', 'strong', 'b', 'em', 'i', 'br'):
            self.add_inline_start(tag, attrs)

    def handle_endtag(self, tag):
        if self.skip_depth and tag in ('script', 'style'):
            self.skip_depth -= 1
            return
        if self.skip_depth:
            return
        if self.current and tag in ('a', 'strong', 'b', 'em', 'i'):
            self.add_inline_end(tag)
            return
        if self.current and ((self.current['tag'] == tag) or (self.current['tag'] == 'title' and tag == 'h1')):
            self.flush_current()
        if self.in_content:
            if tag in ('ul', 'ol') and self.list_stack:
                self.flush_current()
                expected = self.list_stack.pop()
                self.blocks.append(f'</{expected}>')
            if tag == 'div':
                self.content_depth -= 1
                if self.content_depth <= 0:
                    self.flush_current()
                    self.in_content = False
        if self.in_article:
            self.article_depth -= 1
            if tag == 'article' or self.article_depth <= 0:
                self.flush_current()
                self.in_article = False

    def handle_data(self, data):
        if self.skip_depth:
            return
        self.add_text(data)

    def close(self):
        self.flush_current()
        super().close()

def normalize_blocks(blocks):
    cleaned = []
    previous = None
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        if block == previous:
            continue
        previous = block
        cleaned.append(block)
    return cleaned

def normalize_html_content(content):
    def repair_list(match):
        tag = match.group(1)
        inner = match.group(2).strip()
        if '<li>' in inner:
            return f'<{tag}>\n{inner}\n</{tag}>'
        if re.search(r'<h[2-4][^>]*>', inner):
            return inner
        paragraph_items = re.findall(r'<p>(.*?)</p>', inner, flags=re.S)
        remainder = re.sub(r'<p>.*?</p>', '', inner, flags=re.S).strip()
        if paragraph_items and not remainder:
            items = '\n'.join(f'<li>{item.strip()}</li>' for item in paragraph_items if strip_tags(item))
            return f'<{tag}>\n{items}\n</{tag}>' if items else ''
        return inner

    previous = None
    while previous != content:
        previous = content
        content = re.sub(r'<(ul|ol)>\s*(.*?)\s*</\1>', repair_list, content, flags=re.S)
    content = re.sub(r'([A-Za-z0-9.,;:!?])<a ', r'\1 <a ', content)
    content = re.sub(r'</a>([A-Za-z0-9])', r'</a> \1', content)
    content = re.sub(r'</strong>([A-Za-z0-9])', r'</strong> \1', content)
    content = re.sub(r'\s+([,.;:?!])', r'\1', content)
    return content.strip() + '\n'
posts_dir = Path('content/posts')
posts_dir.mkdir(parents=True, exist_ok=True)
for old in posts_dir.glob('*.md*'):
    old.unlink()

results = []
for order, url in enumerate(POSTS, 1):
    slug = slug_from_url(url)
    raw = fetch(url)
    parser = StructuredArticleParser(slug)
    parser.feed(raw)
    parser.close()
    if not parser.title:
        raise RuntimeError(f'No title for {url}')
    blocks = normalize_blocks(parser.blocks)
    paragraph_texts = [strip_tags(block) for block in blocks if block.startswith('<p>')]
    excerpt = paragraph_texts[0] if paragraph_texts else extract_meta(raw, 'description')
    if len(excerpt) > 180:
        excerpt = excerpt[:177].rsplit(' ', 1)[0] + '...'
    meta = extract_meta(raw, 'description') or excerpt
    words = sum(len(re.findall(r'\w+', strip_tags(block))) for block in blocks)
    read_time = max(2, round(words / 200))
    frontmatter = [
        '---',
        f'title: {yaml_string(parser.title)}',
        f'slug: {yaml_string(slug)}',
        f'excerpt: {yaml_string(excerpt)}',
        f'date: {yaml_string(date_from_label(parser.date))}',
        f'image: {yaml_string(parser.featured_image)}',
        f'focusKeyword: {yaml_string(parser.title.lower())}',
        f'metaDescription: {yaml_string(meta)}',
        f'readTime: {read_time}',
        f'order: {order}',
        'format: "html"',
        '---',
        '',
    ]
    content = normalize_html_content('\n\n'.join(blocks))
    (posts_dir / f'{slug}.md').write_text('\n'.join(frontmatter) + content, encoding='utf-8')
    headings = sum(1 for block in blocks if block.startswith('<h2') or block.startswith('<h3'))
    links = sum(block.count('<a ') for block in blocks)
    results.append((order, slug, len(blocks), headings, links, parser.featured_image))

print(f'imported {len(results)} posts with semantic HTML')
for order, slug, block_count, heading_count, link_count, image in results:
    print(f'{order:02d} {slug} | {block_count} blocks | {heading_count} headings | {link_count} links | {image}')
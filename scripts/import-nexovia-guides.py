import html
import os
import re
import shutil
import unicodedata
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

GUIDES = [
    {
        'url': 'https://nexovia.pro/post-procedure-skincare-guide',
        'href': '/post-procedure-skincare-guide',
        'slug': 'post-procedure-skincare-guide',
        'card_title': 'Post-Procedure Skincare Guide',
        'tag': 'Complete Guide',
        'image_name': 'post-procedure-guide',
        'eyebrow': 'Complete Guide',
    },
    {
        'url': 'https://nexovia.pro/microneedling-aftercare',
        'href': '/microneedling-aftercare',
        'slug': 'microneedling-aftercare',
        'card_title': 'Microneedling Aftercare',
        'tag': 'Complete Guide',
        'image_name': 'microneedling-guide',
        'eyebrow': 'Complete Guide',
    },
    {
        'url': 'https://nexovia.pro/laser-treatment-aftercare',
        'href': '/laser-treatment-aftercare',
        'slug': 'laser-treatment-aftercare',
        'card_title': 'Laser Treatment Aftercare',
        'tag': 'Complete Guide',
        'image_name': 'laser-guide',
        'eyebrow': 'Complete Guide',
    },
]

TRANSLATE = str.maketrans({
    '\u2018': "'", '\u2019': "'", '\u201c': '"', '\u201d': '"', '\u2013': '-', '\u2014': '-',
    '\u2026': '...', '\u00a0': ' ', '\u00b7': '*', '\u00ae': '', '\u2122': '', '\u2082': '2',
})
VOID_TAGS = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}


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


def yaml_string(value):
    value = clean_text(value).replace('\\', '\\\\').replace('"', '\\"')
    return f'"{value}"'


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return resp.read().decode('utf-8', 'replace')


def extract_meta(html_text, name):
    name_pattern = re.escape(name)
    pattern = rf'<meta[^>]+(?:name|property|itemprop)=(["\']){name_pattern}\1[^>]+content=(["\'])(.*?)\2'
    match = re.search(pattern, html_text, re.I | re.S)
    if match:
        return clean_text(match.group(3))
    pattern = rf'<meta[^>]+content=(["\'])(.*?)\1[^>]+(?:name|property|itemprop)=(["\']){name_pattern}\3'
    match = re.search(pattern, html_text, re.I | re.S)
    return clean_text(match.group(2)) if match else ''


def extract_title(html_text):
    match = re.search(r'<title>(.*?)</title>', html_text, re.I | re.S)
    return clean_text(match.group(1)) if match else ''


def localize_href(href):
    href = html.unescape(href or '').strip()
    if not href or href.startswith('#') or href.startswith('mailto:') or href.startswith('tel:'):
        return href
    parsed = urllib.parse.urlparse(href)
    if parsed.netloc == 'nexovia.pro':
        path = parsed.path or '/'
        return path + (('?' + parsed.query) if parsed.query else '') + (('#' + parsed.fragment) if parsed.fragment else '')
    return href


def image_extension(url):
    clean = url.split('?')[0]
    ext = os.path.splitext(urllib.parse.urlparse(clean).path)[1].lower() or '.jpg'
    if ext not in ('.jpg', '.jpeg', '.png', '.webp'):
        ext = '.jpg'
    return ext


def download_image(url, image_name, index):
    if not url:
        return '/images/guides/placeholder.jpg'
    ext = image_extension(url)
    suffix = '' if index == 1 else f'-{index}'
    out_dir = Path('public/images/guides')
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f'{image_name}{suffix}{ext}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=45) as resp, open(out_path, 'wb') as f:
            shutil.copyfileobj(resp, f)
        return f'/images/guides/{image_name}{suffix}{ext}'
    except Exception:
        return '/images/guides/placeholder.jpg'


class StructuredGuideParser(HTMLParser):
    def __init__(self, image_name):
        super().__init__(convert_charrefs=True)
        self.image_name = image_name
        self.in_sections = False
        self.in_text = False
        self.text_depth = 0
        self.skip_depth = 0
        self.current = None
        self.blocks = []
        self.title = ''
        self.seen_images = set()
        self.image_count = 0
        self.featured_image = '/images/guides/placeholder.jpg'

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
        escaped = html.escape(text)
        parts = self.current['parts']
        if parts:
            previous = parts[-1]
            if not previous.endswith((' ', '>', '/', '\n')) and escaped[:1] not in ',.;:?!)]}':
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
        if text and text not in {'Discover Your Skin Recovery Score'}:
            if tag == 'h1' and not self.title:
                self.title = text
            elif tag in ('p', 'h2', 'h3', 'h4', 'blockquote', 'li'):
                self.blocks.append(f'<{tag}>{inner}</{tag}>')
        self.current = None

    def add_image(self, attrs):
        raw_url = attrs.get('data-src') or attrs.get('data-image') or attrs.get('src') or ''
        if not raw_url:
            return
        key = raw_url.split('?')[0]
        if key in self.seen_images:
            return
        self.seen_images.add(key)
        self.image_count += 1
        local = download_image(raw_url, self.image_name, self.image_count)
        alt = clean_text(attrs.get('alt', '')) or self.title or 'Nexovia recovery guide image'
        self.flush_current()
        if self.image_count == 1:
            self.featured_image = local
            return
        self.blocks.append(f'<figure><img src="{html.escape(local, quote=True)}" alt="{html.escape(alt, quote=True)}" /></figure>')

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        klass = attrs_dict.get('class', '')
        if tag in ('script', 'style'):
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag == 'article' and 'sections' in klass:
            self.in_sections = True
            return
        if not self.in_sections:
            return
        if tag == 'div' and 'sqs-html-content' in klass:
            self.in_text = True
            self.text_depth = 1
            return
        if tag == 'img':
            self.add_image(attrs_dict)
            return
        if not self.in_text:
            return
        if tag not in VOID_TAGS:
            self.text_depth += 1
        if tag in ('p', 'h1', 'h2', 'h3', 'h4', 'blockquote'):
            self.start_current(tag)
            return
        if tag in ('ul', 'ol'):
            self.flush_current()
            self.blocks.append(f'<{tag}>')
            return
        if tag == 'li':
            self.start_current('li')
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
        if self.current and self.current['tag'] == tag:
            self.flush_current()
        if self.in_text:
            if tag in ('ul', 'ol'):
                self.flush_current()
                self.blocks.append(f'</{tag}>')
            if tag not in VOID_TAGS:
                self.text_depth -= 1
                if self.text_depth <= 0:
                    self.flush_current()
                    self.in_text = False
        if self.in_sections and tag == 'article':
            self.flush_current()
            self.in_sections = False

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
    content = re.sub(r'([A-Za-z0-9.,;:!?])<(strong|em)>', r'\1 <\2>', content)
    content = re.sub(r'</a>([A-Za-z0-9])', r'</a> \1', content)
    content = re.sub(r'</(strong|em)>([A-Za-z0-9])', r'</\1> \2', content)
    content = re.sub(r'\s+([,.;:?!])', r'\1', content)
    return content.strip() + '\n'

def extract_accordion_blocks(raw):
    blocks = []
    for item_match in re.finditer(r'<li class="accordion-item">(.*?)</li>', raw, flags=re.S):
        item = item_match.group(1)
        title_match = re.search(r'class="accordion-item__title"[^>]*>(.*?)</span>', item, flags=re.S)
        question = strip_tags(title_match.group(1)) if title_match else ''
        answers = [strip_tags(answer) for answer in re.findall(r'<p[^>]*>(.*?)</p>', item, flags=re.S)]
        answers = [answer for answer in answers if answer]
        if not question or not answers:
            continue
        blocks.append(f'<h3>{html.escape(question)}</h3>')
        for answer in answers:
            blocks.append(f'<p>{html.escape(answer)}</p>')
    return blocks


def merge_accordion_blocks(blocks, accordion_blocks):
    if not accordion_blocks:
        return blocks
    faq_index = next((index for index, block in enumerate(blocks) if strip_tags(block).lower() == 'frequently asked questions'), None)
    if faq_index is None:
        return blocks + ['<h2><strong>Frequently Asked Questions</strong></h2>'] + accordion_blocks
    return blocks[:faq_index + 1] + accordion_blocks + blocks[faq_index + 1:]

out_dir = Path('content/guides')
out_dir.mkdir(parents=True, exist_ok=True)
for old in out_dir.glob('*.md'):
    old.unlink()

results = []
for guide in GUIDES:
    raw = fetch(guide['url'])
    parser = StructuredGuideParser(guide['image_name'])
    parser.feed(raw)
    parser.close()
    blocks = normalize_blocks(parser.blocks)
    blocks = merge_accordion_blocks(blocks, extract_accordion_blocks(raw))
    page_title = parser.title or guide['card_title']
    meta_title = extract_title(raw) or f'{page_title} - Nexovia'
    meta_description = extract_meta(raw, 'description')
    paragraphs = [strip_tags(block) for block in blocks if block.startswith('<p>')]
    excerpt = meta_description or (paragraphs[0] if paragraphs else '')
    if len(excerpt) > 185:
        excerpt = excerpt[:182].rsplit(' ', 1)[0] + '...'
    content = normalize_html_content('\n\n'.join(blocks))
    frontmatter = [
        '---',
        f'title: {yaml_string(guide["card_title"])}',
        f'pageTitle: {yaml_string(page_title)}',
        f'excerpt: {yaml_string(excerpt)}',
        f'href: {yaml_string(guide["href"])}',
        f'image: {yaml_string(parser.featured_image)}',
        f'tag: {yaml_string(guide["tag"])}',
        f'eyebrow: {yaml_string(guide["eyebrow"])}',
        f'metaTitle: {yaml_string(meta_title)}',
        f'metaDescription: {yaml_string(meta_description or excerpt)}',
        'format: "html"',
        '---',
        '',
    ]
    (out_dir / f'{guide["slug"]}.md').write_text('\n'.join(frontmatter) + content, encoding='utf-8')
    headings = sum(1 for block in blocks if block.startswith('<h2') or block.startswith('<h3'))
    images = content.count('<figure>') + 1
    links = content.count('<a ')
    results.append((guide['slug'], len(blocks), headings, images, links, parser.featured_image, meta_title))

print(f'imported {len(results)} guides with semantic HTML')
for slug, block_count, heading_count, image_count, link_count, image, meta_title in results:
    print(f'{slug} | {block_count} blocks | {heading_count} headings | {image_count} images | {link_count} links | {image} | {meta_title}')
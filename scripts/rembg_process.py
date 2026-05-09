from rembg import remove
from PIL import Image
import io, os, sys

ORIGINALS = 'public/products/originals'
OUTPUT    = 'public/products'

FILES = [
    'Nexovia_wo_background.png',
    'Nex_front.png',
    'Nex_front 2.png',
    'Nex_side_1.png',
    'Nex_side_2.png',
    'Nex_Back_1.png',
    'Nex_Back_2.png',
]

for filename in FILES:
    src = os.path.join(ORIGINALS, filename)
    dst = os.path.join(OUTPUT, filename)

    if not os.path.exists(src):
        print(f'SKIP (not found): {filename}')
        continue

    print(f'Processing: {filename} ...', end=' ', flush=True)
    with open(src, 'rb') as f:
        img_bytes = f.read()

    result_bytes = remove(img_bytes)
    img = Image.open(io.BytesIO(result_bytes)).convert('RGBA')
    img.save(dst, 'PNG')

    mode = img.mode
    print(f'done  ({img.size[0]}x{img.size[1]}, {mode})')

print('\nAll done.')

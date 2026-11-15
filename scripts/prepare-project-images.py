"""Prepare optimized public previews from the owner's original screenshots.

The private factory preview is sanitized before resizing. Originals in projects/
are retained locally and are never included in the deployment archive.
Requires Pillow; run from the repository root.
"""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path('assets/images/projects')
OUT.mkdir(parents=True, exist_ok=True)
names = ['ahmed-gamal', 'rocks-ev', 'garment-factory', 'bonyan', 'ahmed-nabil']
for number, name in enumerate(names, 1):
    image = Image.open(f'projects/{number}.png').convert('RGB')
    if name == 'garment-factory':
        draw = ImageDraw.Draw(image)
        # Account identifier, operational/financial values, and stock item name.
        regions = [
            (1385, 90, 1645, 126, '#2345bb'),
            (215, 650, 320, 679, '#ffffff'),
            (688, 650, 728, 679, '#ffffff'),
            (1102, 650, 1137, 679, '#ffffff'),
            (1480, 650, 1540, 679, '#ffffff'),
            (615, 788, 735, 819, '#ffffff'),
            (960, 788, 1133, 819, '#ffffff'),
            (1407, 788, 1540, 819, '#ffffff'),
            (1470, 945, 1610, 981, '#f0f5fa'),
            (102, 945, 225, 981, '#f0f5fa'),
        ]
        for left, top, right, bottom, color in regions:
            draw.rectangle((left, top, right, bottom), fill=color)
            # Solid replacement marks cannot be reversed to recover data.
            draw.rounded_rectangle((left + 8, top + 12, right - 8, top + 17), radius=2, fill='#99a9bb')
    for width in [800, 1600, image.width]:
        resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
        resized.save(OUT / f'{name}-{width}.webp', quality=88, method=6)
    print(f'Prepared {name}')

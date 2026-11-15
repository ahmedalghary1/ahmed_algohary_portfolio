"""Encode the owner's original portrait for responsive display, without retouching.

Requires Pillow. Run from the repository root after replacing image.png.
"""
from pathlib import Path
from PIL import Image, ImageOps

image = ImageOps.exif_transpose(Image.open('image.png')).convert('RGB')
for width in [480, 640, 896, image.width]:
    output = Path(f'assets/images/ahmed-portrait-{width}.webp')
    resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
    resized.save(output, quality=90, method=6)
    print(f'Prepared {output}')

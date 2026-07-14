"""Astronaut cutout from solid-black source: soft key + edge cleanup + @2x/@3x."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(
    r"C:\Users\Администратор\.cursor\projects\c-Users-Desktop-portfolio\assets"
    r"\c__Users_______________AppData_Roaming_Cursor_User_workspaceStorage_3a03ffc161e1d6070e59ddc038db6582_images_695515bf3c311030e7ee298e798f105e-25b4eb69-0d7d-4209-ba70-e366a4ea43bb.png"
)
OUT = ROOT / "images" / "hero-astronaut-full.png"
OUT2 = ROOT / "images" / "hero-astronaut-full@2x.png"
OUT3 = ROOT / "images" / "hero-astronaut-full@3x.png"


def black_key_rgba(img: Image.Image) -> Image.Image:
    rgb = np.array(img.convert("RGB"), dtype=np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = np.maximum(np.maximum(r, g), b)

    # soft matte from pure black background
    alpha = np.clip((lum - 12.0) / 38.0 * 255.0, 0, 255)

    # suppress colored spill on semi-transparent edge pixels
    edge = (alpha > 0) & (alpha < 250)
    max_rb = np.maximum(r, b)
    g_spill = np.clip(g - max_rb, 0, 80)
    g[edge] = np.clip(g[edge] - g_spill[edge] * 0.85, 0, 255)

    # un-premultiply fringe to remove dark halos
    for _ in range(2):
        soft = (alpha > 0) & (alpha < 255)
        t = np.clip(alpha[soft][..., None] / 255.0, 0.1, 1.0)
        rgb[soft] = np.clip(rgb[soft] / t, 0, 255)

    rgba = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha, 0, 255)]).astype(np.uint8)
    result = Image.fromarray(rgba, mode="RGBA")

    # keep largest connected component
    a = np.array(result.split()[3])
    mask = a > 64
    h, w = a.shape
    visited = np.zeros_like(mask, dtype=bool)
    best: list[tuple[int, int]] = []
    for sy in range(h):
        for sx in range(w):
            if not mask[sy, sx] or visited[sy, sx]:
                continue
            stack = [(sy, sx)]
            visited[sy, sx] = True
            coords: list[tuple[int, int]] = []
            while stack:
                y, x = stack.pop()
                coords.append((y, x))
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        stack.append((ny, nx))
            if len(coords) > len(best):
                best = coords

    clean = np.zeros_like(a)
    for y, x in best:
        clean[y, x] = a[y, x]

    a_img = Image.fromarray(clean, mode="L")
    a_img = a_img.filter(ImageFilter.MinFilter(3))
    a_img = a_img.filter(ImageFilter.MaxFilter(3))
    a_img = a_img.filter(ImageFilter.GaussianBlur(radius=0.55))

    result.putalpha(a_img)
    bbox = result.getbbox()
    return result.crop(bbox) if bbox else result


def upscale(img: Image.Image, scale: int) -> Image.Image:
    up = img.resize((img.width * scale, img.height * scale), Image.Resampling.LANCZOS)
    return up.filter(ImageFilter.UnsharpMask(radius=0.5, percent=110, threshold=2))


def main() -> None:
    cut = black_key_rgba(Image.open(SRC))
    cut.save(OUT, format="PNG", compress_level=1)
    upscale(cut, 2).save(OUT2, format="PNG", compress_level=1)
    upscale(cut, 3).save(OUT3, format="PNG", compress_level=1)
    print("saved", cut.size)


if __name__ == "__main__":
    main()

"""High-quality astronaut cutout: rembg + alpha cleanup + sharpened @2x/@3x."""
from __future__ import annotations

import io
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(
    r"C:\Users\Администратор\.cursor\projects\c-Users-Desktop-portfolio\assets"
    r"\c__Users_______________AppData_Roaming_Cursor_User_workspaceStorage_3a03ffc161e1d6070e59ddc038db6582_images_695515bf3c311030e7ee298e798f105e-25b4eb69-0d97-4238-82e3-2fe9c50a0127.png"
)
OUT = ROOT / "images" / "hero-astronaut-full.png"
OUT2 = ROOT / "images" / "hero-astronaut-full@2x.png"
OUT3 = ROOT / "images" / "hero-astronaut-full@3x.png"

MODELS = ("bria-rmbg", "birefnet-general", "u2net")


def load_source() -> Image.Image:
    img = Image.open(SRC)
    if img.mode != "RGB":
        img = img.convert("RGB")
    return img


def matting(src_bytes: bytes) -> Image.Image:
    last_err: Exception | None = None
    for name in MODELS:
        try:
            session = new_session(name)
            raw = remove(
                src_bytes,
                session=session,
                alpha_matting=True,
                alpha_matting_foreground_threshold=270,
                alpha_matting_background_threshold=8,
                alpha_matting_erode_size=12,
            )
            return Image.open(io.BytesIO(raw)).convert("RGBA")
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            print(f"model {name} failed: {exc}")
    if last_err:
        raise last_err
    raise RuntimeError("no model worked")


def refine_alpha(img: Image.Image) -> Image.Image:
    arr = np.array(img, dtype=np.float32)
    rgb = arr[..., :3]
    alpha = arr[..., 3]

    # drop noise
    alpha[alpha < 18] = 0

    # remove tiny islands
    mask = alpha > 128
    h, w = alpha.shape
    visited = np.zeros_like(mask, dtype=bool)
    best = None
    best_area = 0
    for sy in range(h):
        for sx in range(w):
            if not mask[sy, sx] or visited[sy, sx]:
                continue
            stack = [(sy, sx)]
            visited[sy, sx] = True
            coords = []
            while stack:
                y, x = stack.pop()
                coords.append((y, x))
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        stack.append((ny, nx))
            if len(coords) > best_area:
                best_area = len(coords)
                best = coords
    clean = np.zeros_like(alpha)
    if best:
        for y, x in best:
            clean[y, x] = alpha[y, x]
    alpha = clean

    # smooth jagged alpha edge
    a_img = Image.fromarray(np.clip(alpha, 0, 255).astype(np.uint8), mode="L")
    a_img = a_img.filter(ImageFilter.MinFilter(3))
    a_img = a_img.filter(ImageFilter.MaxFilter(3))
    a_img = a_img.filter(ImageFilter.GaussianBlur(radius=0.65))
    alpha = np.array(a_img, dtype=np.float32)

    # defringe semi-transparent edge pixels (remove dark bg bleed)
    edge = (alpha > 0) & (alpha < 252)
    for _ in range(2):
        t = alpha[edge][..., None] / 255.0
        t = np.clip(t, 0.08, 1.0)
        rgb[edge] = np.clip(rgb[edge] / t, 0, 255)

    out = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha, 0, 255)]).astype(np.uint8)
    result = Image.fromarray(out, mode="RGBA")
    bbox = result.getbbox()
    return result.crop(bbox) if bbox else result


def upscale(img: Image.Image, scale: int) -> Image.Image:
    up = img.resize((img.width * scale, img.height * scale), Image.Resampling.LANCZOS)
    return up.filter(ImageFilter.UnsharpMask(radius=0.55, percent=108, threshold=2))


def main() -> None:
    src = load_source()
    buf = io.BytesIO()
    src.save(buf, format="PNG")
    cut = refine_alpha(matting(buf.getvalue()))
    cut.save(OUT, format="PNG", compress_level=1)
    upscale(cut, 2).save(OUT2, format="PNG", compress_level=1)
    upscale(cut, 3).save(OUT3, format="PNG", compress_level=1)
    print("saved", cut.size, OUT2.name, OUT3.name)


if __name__ == "__main__":
    main()

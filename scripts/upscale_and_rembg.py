from PIL import Image
from rembg import remove
import os

input_path = r"C:\Users\Администратор\.gemini\antigravity\brain\d7de9f68-cadc-4d26-9dd9-ebea42f13139\cosmic_tree_isolated_v2_1785411378085.jpg"
output_path = r"c:\Users\Администратор\Desktop\проэкты\portfolio\images\cosmic-tree-4k-transparent.png"

print("Loading original image...")
img = Image.open(input_path)

# Target 4K resolution (3840x2160)
print(f"Original size: {img.size}")
target_size = (3840, 2160)

print(f"Upscaling to {target_size}...")
img_4k = img.resize(target_size, Image.Resampling.LANCZOS)

print("Removing background for transparency (this might take a moment on 4K image)...")
# Using alpha matting for better edges on glowing trees
out_4k = remove(img_4k, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10, alpha_matting_erode_size=5)

print(f"Saving transparent 4K image to {output_path}...")
out_4k.save(output_path)
print("Done!")

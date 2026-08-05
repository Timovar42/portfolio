from PIL import Image

input_path = r"c:\Users\Администратор\Desktop\проэкты\portfolio\images\cosmic-tree-4k-transparent.png"
output_path = r"c:\Users\Администратор\Desktop\проэкты\portfolio\images\cosmic-tree-4k-white.jpg"

print("Loading transparent 4K image...")
img = Image.open(input_path).convert("RGBA")

print("Creating pure white background...")
white_bg = Image.new("RGBA", img.size, (255, 255, 255, 255))

print("Compositing tree over white background...")
white_bg.paste(img, (0, 0), img)

print(f"Saving to {output_path}...")
# Convert to RGB to drop alpha channel and save as high-quality JPG
white_bg.convert("RGB").save(output_path, quality=100)
print("Done!")

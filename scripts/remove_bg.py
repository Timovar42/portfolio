import sys
import subprocess

def install_and_import(package):
    try:
        __import__(package)
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

install_and_import("rembg")
install_and_import("Pillow")

from rembg import remove
from PIL import Image

input_path = r"C:\Users\Администратор\.gemini\antigravity\brain\d7de9f68-cadc-4d26-9dd9-ebea42f13139\cosmic_tree_isolated_v2_1785411378085.jpg"
output_path = r"c:\Users\Администратор\Desktop\проэкты\portfolio\images\cosmic-tree-transparent.png"

print("Loading image...")
input_img = Image.open(input_path)

print("Removing background...")
output_img = remove(input_img)

print(f"Saving to {output_path}...")
output_img.save(output_path)
print("Done!")

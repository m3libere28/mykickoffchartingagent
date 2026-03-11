from PIL import Image, ImageDraw

raw_path = "/Users/helbertasprilla/.gemini/antigravity/brain/0558751e-8a7c-4928-bb90-e03c309d7813/kickoff_icon_raw_1773191661599.png"
out_path = "/Users/helbertasprilla/.gemini/antigravity/brain/0558751e-8a7c-4928-bb90-e03c309d7813/kickoff_icon_transparent.png"

img = Image.open(raw_path).convert("RGBA")

# For a perfectly shaped macOS icon, the squircle radius is typically 22.5% of the side length
radius = int(img.width * 0.225)

# Create an anti-aliased mask
mask = Image.new("L", img.size, 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle((0, 0, img.width, img.height), radius=radius, fill=255)

# Apply the mask to make the sharp black corners completely transparent
img.putalpha(mask)
img.save(out_path, "PNG")

print("Squircle transparency applied successfully.")

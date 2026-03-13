from PIL import Image, ImageDraw

raw_path = "/Users/helbertasprilla/.gemini/antigravity/brain/0558751e-8a7c-4928-bb90-e03c309d7813/kickoff_icon_raw_1773191661599.png"
out_path = "/Users/helbertasprilla/.gemini/antigravity/brain/0558751e-8a7c-4928-bb90-e03c309d7813/kickoff_icon_large.png"

img = Image.open(raw_path).convert("RGBA")

# The user mentioned the outer border was too large.
# We will tightly crop the center of the image to zoom in on the graphic,
# removing 20% of the padding from every side.
width, height = img.size
crop_pad = int(width * 0.18)

# Crop box: (left, upper, right, lower)
box = (crop_pad, crop_pad, width - crop_pad, height - crop_pad)
cropped = img.crop(box)

# Scale it back up to full size (512x512)
cropped = cropped.resize((width, height), Image.Resampling.LANCZOS)

# Create the Apple Squircle transparency mask
radius = int(width * 0.20)  # Slightly sharper corners
mask = Image.new("L", (width, height), 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle((0, 0, width, height), radius=radius, fill=255)

# Apply mask explicitly over the zoomed image
cropped.putalpha(mask)
cropped.save(out_path, "PNG")

print("Cropped background padding successfully.")

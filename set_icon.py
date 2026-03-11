import Cocoa
import sys

if len(sys.argv) < 3:
    print("Usage: python3 set_icon.py <path_to_image> <path_to_app>")
    sys.exit(1)

icon_path = sys.argv[1]
app_path = sys.argv[2]

image = Cocoa.NSImage.alloc().initWithContentsOfFile_(icon_path)
success = Cocoa.NSWorkspace.sharedWorkspace().setIcon_forFile_options_(image, app_path, 0)

if success:
    print("Icon applied successfully.")
else:
    print("Failed to apply icon.")
    sys.exit(1)

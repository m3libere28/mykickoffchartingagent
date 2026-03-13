use framework "Foundation"
use framework "AppKit"

set imgPath to "/Users/helbertasprilla/.gemini/antigravity/brain/0558751e-8a7c-4928-bb90-e03c309d7813/kickoff_icon_large.png"
set appPath to "/Users/helbertasprilla/Desktop/Kickoff.app"

set imageData to current application's NSImage's alloc()'s initWithContentsOfFile:imgPath
current application's NSWorkspace's sharedWorkspace()'s setIcon:imageData forFile:appPath options:0

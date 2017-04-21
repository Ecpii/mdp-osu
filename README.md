# mdp-osu

Another Markdown Previewer (tailored for osu!wiki)

## Usage

1. Fork the [osu-wiki](github.com/ppy/osu-wiki) repo (and clone)
2. Download the lastest mdp-osu [release](https://github.com/MegaApplePi/mdp-osu/releases)
3. Extract everything from the `.zip`
4. Open `mdp-osu.exe`
5. Upload your markdown
6. check layout to ensure it is correct
7. check the "Potential Errors" box
   - this is quite buggy but will do for most mistakes
   - some of these "errors" can ignored (such as the `.png` errors when the image obviously has transparency)

## Features

- osu! styles of the new [osu!wiki](https://new.ppy.sh/wiki/)
- Article to Article Links (should work)
- Images from root directory (should work)
- horrible styling
- potential error box (right side)
  - failed image checks
  - image width checks (must be =< 720px)
  - `.png` checks (you may need to ignore if transparency)
  - internal file linking checks
- "uncached" images mode (broken image button on left)
- auto reload (1s interval)
  - not recommended while using "uncached" images mode; may cause page to flicker/jump
- edit using default program button (pencil button on right)
- top page button

## Menu Buttons Explaination

| Name                  | Icon                             | Action/Notes                                                                |
|-----------------------|:--------------------------------:|-----------------------------------------------------------------------------|
| Refresh               | ![](docs/refresh.png)            | Reload the current article.                                                 |
| Auto-Refresh          | ![](docs/autorenew.png)          | Auto-Reload the current article every second.                               |
| Disable Image Caching | ![](docs/broken_image.png)       | Disables\* the image cache. (Not recommended while Auto-Refresh is enabled) |
| Upload                | ![](docs/file_upload.png)        | Opens file upload propmt.                                                   |
| _(file path)_         | (located in the middle of menu)  | Opens the file explorer to current file. This appears when file is opened.  |
| Top of Page           | ![](docs/vertical_align_top.png) | Bring current scroll position to top.                                       |
| Edit                  | ![](docs/edit.png)               | Open current article using the default program.                             |

\*Disable Image Caching does not actually disable image caching, rather this appends a random value to the end of the url to allow reloading of an image

## External Sources

- [nw.js](https://github.com/nwjs/nw.js) - Web Application Container
- [Web2Executable](https://github.com/jyapayne/Web2Executable) - Project Compiler
- [Showdown](https://github.com/showdownjs/showdown) - the JS for `*markdown*` to `<html/>`
- [jQuery](https://github.com/jquery/jquery) - event handling and reparsing
- [Material Design icons](https://github.com/google/material-design-icons/) - icons

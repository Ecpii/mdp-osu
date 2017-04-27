# mdp-osu

Another Markdown Previewer (tailored for osu!wiki)

## Usage and Notes

Usage:

1. Fork the [osu-wiki](https://github.com/ppy/osu-wiki) repo (and clone)
2. Download the lastest mdp-osu [release](https://github.com/MegaApplePi/mdp-osu/releases)
3. Extract
4. Open `mdp-osu.exe`
5. Upload your markdown
6. check layout to ensure it is correct
7. check the "Potential Errors" box
   - this is quite buggy but will do for most mistakes
   - some of these "errors" can ignored (such as the `.png` errors when the image obviously has transparency)
   - see [#Potential Errors Explaination](#potential-errors-explaination) for more details

Notes:

- If you want to open a link, you will need to middle click the link.
  - This is to prevent mpd-osu page from changing (if this happens somehow, you must close and reopen the app).

## Features

- almostly all osu! styles of the new [osu!wiki](https://new.ppy.sh/wiki/)
  - almostly all ~~stolen~~ taken from osu!wiki for pretesting purposes
- Images from root directory (should work)
- potential errors box for some [ASG](https://new.ppy.sh/wiki/Article_Style_Guide) stuff (right side)

## Menu Buttons Explaination

| Name                  | Icon                             | Action/Notes                                                                                           |
|-----------------------|:--------------------------------:|--------------------------------------------------------------------------------------------------------|
| Refresh               | ![](docs/refresh.png)            | Reload the current article.                                                                            |
| Auto-Refresh          | ![](docs/autorenew.png)          | Auto-Reload the current article every 5 seconds. (Not recommended if external links are heavily used.) |
| Disable Image Caching | ![](docs/broken_image.png)       | Disables\* the image cache. (Not recommended while Auto-Refresh is enabled.)                           |
| Upload                | ![](docs/file_upload.png)        | Opens file upload propmt.                                                                              |
| _(file path)_         | (located in the middle of menu)  | Opens the file explorer to current file.                                                               |
| Top of Page           | ![](docs/vertical_align_top.png) | Bring current scroll position to top.                                                                  |
| Edit                  | ![](docs/edit.png)               | Open current article using the default program.                                                        |

\*Disable Image Caching does not actually disable image caching, rather this appends a random value to the end of the url to allow reloading of an image

## Potential Errors Explaination

- *Markdown*
  - **Headings**: multiple level 1 headings and any level 6 headings checks
    - if an error is listed here: adjust the headings
  - **Tables**: lists and images inside tables checks
    - if an error is listed here: reconsider your table/list use
- *Links*
  - **http**: listed links are using `http`
    - if an error is listed here: change the protocal to `https`, unless the site doesn't use `https`
  - **Internal File Links**: direct links within the repo
    - internal file links do not work
    - if an error is listed here: remove it (and delete the media file if applicable)
  - **404**: these links do not exist
    - if an error is listed here: fix it or remove it
  - **405**: the page cannot be obtained because the HEAD request was blocked
    - if an error is listed here:
      - you *could* ignore these
      - otherwise, you will need to test the link with your web broswer and decide on what to do from there
        - you could also middle click the link to manually see if it works
  - **503**: these links did not respond to our HEAD request
    - if an error is listed here:
      - ignore if it is an `osu.ppy.sh` link (`osu.ppy.sh` appears to reject most HEAD requests since some articles contains a lot of them)
      - otherwise, you will need to test the link with your web broswer and decide on what to do from there
        - you could also middle click the link to manually see if it works
- *Images*
  - **Broken**: Cannot load these images
    - if an error is listed here: fix it or remove it
  - **.png**: images in `.png` format
    - if an error is listed here:
      - ignore if transparency/alpha channel is used
      - otherwise, convert to `.jpg`
  - **Too Wide**: image is wider than article width
    - article width is 720px, any images wider than this are too big
    - if an error is listed here: downscale the image

## Known Bugs

- [ ] links using `<` + _url_ + `>` may display a number after the link (this appears to be a [Showdown](https://github.com/showdownjs/showdown) bug)

## External Sources

- [Electron](http://electron.atom.io/) - Web Application Container
- [Showdown](https://github.com/showdownjs/showdown) - the JS for `*markdown_` to `<html/>`
- [jQuery](https://github.com/jquery/jquery) - event handling and reparsing
- [Material Design icons](https://github.com/google/material-design-icons/) - icons

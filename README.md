# mdp-osu

[![Maintenance Not Intended](unmaintained.png)](http://unmaintained.tech/)

Another Markdown Previewer (tailored for osu!wiki).

## Features

- A markdown parser by [Showdown](https://github.com/showdownjs/showdown)

## Usage

1. Fork the [osu-wiki](https://github.com/ppy/osu-wiki) repo (and clone)
2. Download the lastest `mdp-osu` [release](https://github.com/MegaApplePi/mdp-osu/releases/latest)
3. Extract
4. Open `mdp-osu.exe`
5. Drag-and-Drop your Markdown file (`.md`)
6. Inspect layout to ensure it is correct
7. Inspect the errors
   - see [#Errors](#errors) for more details

## Errors

- Markdown
  - Headings
    - `Title (heading level 1) is missing!`: The article doesn't have a level 1 heading (the title)
    - `Use of level 6 heading`: Level 6 headings are used when they are not allowed.
  - Tables
    - _(placeholder)_
  - HTML
    - `Use of HTML tags`: An HTML tag is used when they are not allowed.
- Images
  - Wide
    - `File: {name}'s width ({width}px) is wider than max article width (680px)!`: The image is wider than the article's max width (680px).
  - PNG
    - `File: {name} has no transparency!`: The file has no transparent pixels.
    - Please convert image to `.jpg`.
    - `mdp-osu` will now inspects the image for transparency (rather than throw errors when it sees a `.png` file).
- Links
  - Internal
    - `Invalid internal link`: The link seems to go to nowhere (this also checks with the `redirect.yaml` file).
  - HTTP Failed
    - `Failed to load: {link}`: The link failed to load for an unknown reason.
    - Check your internet connection.
  - HTTP 403/500/503/504
    - HTTP error codes
    - `osu.ppy.sh` will HTTP 403, you can ignore this.
  - HTTP 404
    - The external link leads to nowhere.
- English
  - First Person
    - `Use of first person`: The word `I` was found.
  - Contractions
    - `Use of contractions`: A contraction was found.
  - Game Modes
    - `Use of old game mode names`: Old game mode names (`Taiko`, `Catch the Beat`, and/or `Mania`) were found.
  - MediaWiki
    - `MediaWiki keywords found`: Found certain MediaWiki keyswords (`fig:`, `"wikilink"`).

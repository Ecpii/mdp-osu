# mdp-osu

[![Maintenance Not Intended](unmaintained.png)](http://unmaintained.tech/)

Another Markdown Previewer (tailored for osu!wiki).

## Features

- A markdown parser by [Showdown](https://github.com/showdownjs/showdown)
- osu!wiki styles
- Proper root directory linking

## Usage

1. Fork the [osu-wiki repo](https://github.com/ppy/osu-wiki) (and clone)
2. Download the [lastest `mdp-osu` release](https://github.com/MegaApplePi/mdp-osu/releases/latest)
3. Extract
4. Open `mdp-osu.exe` or `mdp-osu.app`
   - if on MacOS, you may/will need to bypass GateKeeper
5. Drag-and-Drop your Markdown file (`.md`)
6. Inspect layout to ensure it is correct
   - note: Showdown bugs may derp the preview (see [#Known Bugs](#known-bugs))
7. Inspect the errors
   - see [#Errors](#errors) for more details

### Keyboard Shortcuts

- `F12` = open the devtools, if need be
- `F5` = reload mdp-osu
- `Ctrl` + `R` = reload article

## Errors

### Markdown

- Headings
  - _Warnings about headings._
    - `Title (heading level 1) is missing!`: The article doesn't have a level 1 heading (the title)
    - `Use of level 6 heading`: Level 6 headings are used when they are not allowed.
- HTML
  - _List of HTML tags that were found._
  - This is somewhat accurate.

### Images

- Wide
  - _List of files wider than 680px._
  - downscale them
- PNG
  - _List of files with no transparent pixels._
  - Convert the image to `.jpg` (with compression: 80).
  - Note: `mdp-osu` will now inspects the image for transparency (instead of "throw errors when it sees a `.png` file").

### Links

- Internal
  - _The internal link seems to go to nowhere (this also checks with the `redirect.yaml` file)._
- HTTP Failed
  - _List of links link failed to load for an unknown reason._
  - Check your internet connection.
- HTTP 404
  - _List of external links that leads to nowhere._
- HTTP Misc
  - _List of miscellanous HTTP errors while HEAD testing._

### English

- First Person
  - _List of `I`s that were found._
- Contractions
  - _List of contractions that were found._
- Game Modes
  - _List of old game mode names (`Standard`, `Taiko`, `Catch the Beat`, and/or `Mania`) that were found._
- MediaWiki
  - _List of MediaWiki keywords (`fig:` and `"wikilink"`) that were found._

## Known Bugs

- Lists underneath a table (with 1 empty line in between) can collide and can become malformed.
- Bullet lists using two bullets (<https://github.com/showdownjs/showdown/issues/367>)
  - and everything at [showdown/issues/bugs](https://github.com/showdownjs/showdown/issues?q=is%3Aissue+is%3Aopen+label%3ABug)
  - and everything at [showdown/milestone/9](https://github.com/showdownjs/showdown/milestone/9)
- Anything else at [issues/bugs](https://github.com/MegaApplePi/mdp-osu/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

Until I find or make a better Markdown parser, we're stuck with Showdown's bugs. ¯\\\_(ツ)\_/¯

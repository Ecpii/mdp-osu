# mdp-osu

Another Markdown Previewer (tailored for osu!wiki)

## Usage

1. Fork the [osu-wiki](github.com/ppy/osu-wiki) repo (and clone)
2. Download the lastest mdp-osu [release](https://github.com/MegaApplePi/mdp-osu/releases)
3. Extract everything from the `.zip`
4. Open `mdp-osu.exe`
5. (follow on screen instructions)

## Features

- osu! styles of the new [osu!wiki](https://new.ppy.sh/wiki/)
- Article to Article Links should work
- Images from root directory should work
- horrible styling
- potential error box (right side), to check some things before continuing
  - image width check (must be =< 720px) checks
  - `.png` checks (you may need to ignore if transparency)
  - internal file linking checks

## External Sources

- [nw.js](https://github.com/nwjs/nw.js) - Web Application Container
- [Web2Executable](https://github.com/jyapayne/Web2Executable) - Project Compiler
- [Showdown](https://github.com/showdownjs/showdown) - the JS for `*markdown*` to `<html/>`
- [jQuery](https://github.com/jquery/jquery) - event handling and reparsing
- [Material Design icons](https://github.com/google/material-design-icons/) - icons

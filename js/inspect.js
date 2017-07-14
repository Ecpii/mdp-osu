let htmlTags = Object.solidify([
  "html",
  "base", "head", "link", "meta", "style", "title",
  "address", "article", "aside", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "nav", "section",
  "blockquote", "dd", "div", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre", "ul",
  "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "rp", "rt", "rtc", "ruby", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr",
  "area", "audio", "img", "map", "track", "video",
  "embed", "object", "param", "source",
  "canvas", "noscript", "script",
  "del", "ins",
  "caption", "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
  "button", "datalist", "fieldset", "form", "input", "label", "legend", "meter", "optgroup", "option", "output", "progress", "select", "textarea",
  "details", "dialog", "menu", "menuitem", "summary",
  "content", "element", "shadow", "slot", "template",
  "acronym", "applet", "basefont", "big", "blink", "center", "command", "content", "dir", "element", "font", "frame", "frameset", "isindex", "keygen", "listing", "marquee", "multicol", "nextid", "noembed", "plaintext", "spacer", "strike", "tt", "xmp",
  "iframe"
]);
function inspect(lines){
  lines = lines.split("\n");

  let h1exists = false;
  for( let i = 0; i < lines.length; i++ ){
    let line_number = i + 1;
    if( /^######\s/.test(lines[i]) )
    {
      $('.errors > .lists > .list[data-item="markdown"] > .group[data-item="headings"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>Use of level 6 heading (line: " + line_number + ")</li>");
    }
    else if( /^#\s/.test(lines[i]) || (lines[i + 1] && /^=+$/.test(lines[i + 1].trim())) )
    {
      if( h1exists ){
        $('.errors > .lists > .list[data-item="markdown"] > .group[data-item="headings"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>Extra level 1 heading (line: " + line_number + ")</li>");
      }
      h1exists = true;
    }
    if( /<([A-z][A-z0-9]*)\b[^>]*>|<\/([A-z][A-z0-9]*)\b[^>]*>/g.test(lines[i]) ){
      let matches = lines[i].match(/<([A-z][A-z0-9]*)\b[^>]*>|<\/([A-z][A-z0-9]*)\b[^>]*>/g);
      for( let j = 0; j < matches.length; j++ ){
        let tag = matches[j].replace(/^<\/?/, "").replace(/\/?>$/, "");
        if( htmlTags.includes(tag.toLowerCase()) ){
          $('.errors > .lists > .list[data-item="markdown"] > .group[data-item="html"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>HTML tag: <code>" + matches[j].replace(/^</, "&lt;").replace(/>$/, "&gt;") + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
    if( /\bi\b/ig.test(lines[i]) ){
      let matches = lines[i].match(/\bi\b/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          $('.errors > .lists > .list[data-item="asg"] > .group[data-item="first-person"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li><code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
    if( /(\w)+(n't|'ve|'d|'ll|'m|'re)|it's/ig.test(lines[i]) ){
      let matches = lines[i].match(/(\w)+(n't|'ve|'d|'ll|'m|'re)|it's/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          $('.errors > .lists > .list[data-item="asg"] > .group[data-item="contractions"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li><code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
    /* jshint ignore:start */
    if( /\b(?<!osu!)(Standard)\b/ig.test(lines[i]) ){
      let matches = lines[i].match(/\b(?<!osu!)(Standard)\b/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          $('.errors > .lists > .list[data-item="asg"] > .group[data-item="game-modes"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>Use osu!:<code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
    if( /\b(?<!osu!)(Taiko)\b/ig.test(lines[i]) ){
      let matches = lines[i].match(/\b(?<!osu!)(Taiko)\b/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          $('.errors > .lists > .list[data-item="asg"] > .group[data-item="game-modes"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>Use osu!taiko:<code>" + matches[j] + "</code> (line:" + line_number + ")</li>")
        }
      }
    }
    if( /\b(?<!osu!)(Catch\sthe\sBeat|ctb)\b/ig.test(lines[i]) ){
      let matches = lines[i].match(/\b(?<!osu!)(Catch\sthe\sBeat|ctb)\b/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          $('.errors > .lists > .list[data-item="asg"] > .group[data-item="game-modes"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>Use osu!catch:<code>" + matches[j] + "</code> (line:" + line_number + ")</li>")
        }
      }
    }
    if( /\b(?<!osu!)(Mania)\b/ig.test(lines[i]) ){
      let matches = lines[i].match(/\b(?<!osu!)(Mania)\b/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          $('.errors > .lists > .list[data-item="asg"] > .group[data-item="game-modes"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>Use osu!mania:<code>" + matches[j] + "</code> (line:" + line_number + ")</li>")
        }
      }
    }
    /* jshint ignore:end */
    if( /fig\:|\"wikilink\"/ig.test(lines[i]) ){
      let matches = lines[i].match(/fig\:|\"wikilink\"/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          $('.errors > .lists > .list[data-item="asg"] > .group[data-item="mediawiki"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>MediaWiki keyword: <code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
    if( /(beat)?mappers?/ig.test(lines[i]) ){
      let matches = lines[i].match(/(beat)?mappers?/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          $('.errors > .lists > .list[data-item="asg"] > .group[data-item="terminology"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>Replace with creator(s): <code>" + matches[j] + "</code> (line:" + line_number + ")</li>")
        }
      }
    }
    if( /\bmaps?\b/ig.test(lines[i]) ){
      let matches = lines[i].match(/\bmaps?\b/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          $('.errors > .lists > .list[data-item="asg"] > .group[data-item="terminology"] > ul')[0].insertAdjacentHTML('beforeEnd', "<li>Replace with beatmap(s): <code>" + matches[j] + "</code> (line:" + line_number + ")</li>")
        }
      }
    }
  }
  if( !h1exists ){
    $('.errors > .lists > .list[data-item="markdown"] > .group[data-item="headings"] > ul')[0].insertAdjacentHTML('afterBegin', "<li>Title (heading level 1) is missing!</li>");
  }
  return;
}
function imageTransCheck(){
  let _img = $('.osu-wiki > .markdown img');
  let ctx = $('.menu > canvas');
  if( ctx.getContext ){
    ctx = ctx.getContext('2d');
    (function check(imageNumber){
      if( imageNumber < _img.length ){
        let src = _img[imageNumber].getAttribute('src');
        if( !/^(https?|mailto)\:/i.test(src) ){
          let image = new Image();
          let name = src.substring(src.lastIndexOf("/"), src.length).replace(/\//, "").replace(/\?t\=\d+/, "");
          image.addEventListener('load', function(){
            if( this.width > 680 ){
              $('.errors > .lists > .list[data-item="images"] > .group[data-item="wide"] > ul')[0].insertAdjacentHTML('afterBegin', "<li><code>" + name + "</code> (" + this.width + "px)</li>");
            }
            if( /png/i.test(src.split(".").pop()) ){
              ctx.clearRect(0, 0, ctx.width, ctx.height);
              $('.menu > canvas')[0].width = this.width;
              $('.menu > canvas')[0].height = this.height;
              ctx.drawImage(image, 0, 0);

              let imageData = ctx.getImageData(0, 0, $('.menu > canvas')[0].width, $('.menu > canvas')[0].height).data;

              let isTransparent = false;
              for (var i = 0, n = imageData.length; i < n; i += 4) {
                if( imageData[i] === 0 && imageData[i + 1] === 0 && imageData[i + 2] === 0 && imageData[i + 3] === 0 ){
                  isTransparent = true;
                  break;
                }
              }

              if( !isTransparent ){
                $('.errors > .lists > .list[data-item="images"] > .group[data-item="png"] > ul')[0].insertAdjacentHTML('afterBegin', "<li><code>" + name + "</code></li>");
              }
            }
            check(imageNumber + 1);
          });
          image.src = src;
        }
      }
    })(0);
  }
  return;
}

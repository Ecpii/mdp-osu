/* globals document, window, Image, FileReader, MutationObserver, XMLHttpRequest */
/* globals nodeRequire */
(function(){
  'use strict';

  (function(){
    Object.defineProperty(Object.prototype, 'solidify',{
      'value':function(obj){
        let propNames = Object.getOwnPropertyNames(obj);
        propNames.forEach(function(name){
          let prop = obj[name];
          if( typeof prop === 'object' && prop !== null ){
            Object.solidify(prop);
          }
        });
        return Object.freeze(obj);
      },
      'enumerable': false
    });

    document.addEventListener('keydown', function(e){
      if( e.key === "F12" ){
        nodeRequire('electron').remote.getCurrentWindow().toggleDevTools();
      }
    });
  })();

  /* -- node -- */
  const {app, shell} = nodeRequire('electron');
  const fs = nodeRequire('fs');
  const $ = nodeRequire('sizzle');
  const showdown = nodeRequire('showdown');
  const markdown = new showdown.Converter({
    'tables': true,
    'disableForced4SpacesIndentedSublists': true,
    'openLinksInNewWindow': true
  });
  const yaml = nodeRequire('js-yaml');
  let redirect;

  /* -- check for update -- */
  void(function(){
    let pjson = nodeRequire('./package.json');
    let version = 'v' + pjson.version;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/repos/MegaApplePi/mdp-osu/releases');
    xhr.addEventListener('load', function(){
      let response = this.response;
      if( version !== response[0].tag_name){
        error("A new version of mdp-osu has been released! <download>Download</download>");
        let _download = $('snackbar > text > download')[0];
        _download.onclick = function(){
          shell.openExternal('https://github.com/MegaApplePi/mdp-osu/releases/latest');
        };
      }
    });
    xhr.responseType = 'json';
    xhr.send();
  })();

  /* -- DOM tree -- */
  const _body = Object.solidify({
    '$menu': $('body > menu')[0],
    '_menu':{
      '$container[left]': $('body > menu > container[left]')[0],
      '_container[left]':{
        '$icon[reload]': $('body > menu > container[left] > icon[reload]')[0],
        '$icon[autorenew]': $('body > menu > container[left] > icon[autorenew]')[0],
        '$icon[upload]': $('body > menu > container[left] > icon[upload]')[0]
      },
      '$path': $('body > menu > path')[0],
      '_path':{
        '$icon[file-tree]': $('body > menu > path > icon[file-tree]')[0],
        '$text': $('body > menu > path > text')[0]
      },
      '$container[right]': $('body > menu > container[right]')[0],
      '_container[right]':{
        '$icon[chevron-double-up]': $('body > menu > container[right] > icon[chevron-double-up]')[0],
        '$icon[open-in-new]': $('body > menu > container[right] > icon[open-in-new]')[0],
        '$icon[alert-outline]': $('body > menu > container[right] > icon[alert-outline]')[0]
      },
      '$input': $('body > menu > input')[0],
      '$canvas': $('body > menu > canvas')[0]
    },
    '$osu-wiki': $('body > osu-wiki')[0],
    '_osu-wiki':{
      '$heading': $('body > osu-wiki > heading')[0],
      '_heading':{
        '$article-title': $('body > osu-wiki > heading > article-title')[0],
        '_article-title':{
          '$h2': $('body > osu-wiki > heading > article-title > h2')[0],
          '$h1': $('body > osu-wiki > heading > article-title > h1')[0],
        },
      },
      '$markdown': $('body > osu-wiki > markdown')[0]
    },
    '$errors': $('body > errors')[0],
    '_errors':{
      '$tabs': $('body > errors > tabs')[0],
      '_tabs':{
        '$tab[markdown]': $('body > errors > tabs > tab[item="markdown"]')[0],
        '_tab[markdown]':{
          '$icon': $('body > errors > tabs > tab[item="markdown"] > icon')[0],
          '$text': $('body > errors > tabs > tab[item="markdown"] > text')[0],
          '$count': $('body > errors > tabs > tab[item="markdown"] > count')[0]
        },
        '$tab[images]': $('body > errors > tabs > tab[item="images"]')[0],
        '_tab[images]':{
          '$icon': $('body > errors > tabs > tab[item="images"] > icon')[0],
          '$text': $('body > errors > tabs > tab[item="images"] > text')[0],
          '$count': $('body > errors > tabs > tab[item="images"] > count')[0]
        },
        '$tab[links]': $('body > errors > tabs > tab[item="links"]')[0],
        '_tab[links]':{
          '$icon': $('body > errors > tabs > tab[item="links"] > icon')[0],
          '$text': $('body > errors > tabs > tab[item="links"] > text')[0],
          '$count': $('body > errors > tabs > tab[item="links"] > count')[0]
        },
        '$tab[asg]': $('body > errors > tabs > tab[item="asg"]')[0],
        '_tab[asg]':{
          '$icon': $('body > errors > tabs > tab[item="asg"] > icon')[0],
          '$text': $('body > errors > tabs > tab[item="asg"] > text')[0],
          '$count': $('body > errors > tabs > tab[item="asg"] > count')[0]
        }
      },
      '$lists': $('body > errors > lists')[0],
      '_lists':{
        '$list[markdown]': $('body > errors > lists > list[item="markdown"]')[0],
        '_list[markdown]':{
          '$group[headings]': $('body > errors > lists > list[item="markdown"] > group[item="headings"]')[0],
          '_group[headings]':{
            '$heading': $('body > errors > lists > list[item="markdown"] > group[item="headings"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="markdown"] > group[item="headings"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="markdown"] > group[item="headings"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="markdown"] > group[item="headings"] > ul')[0]
          },
          '$group[tables]': $('body > errors > lists > list[item="markdown"] > group[item="tables"]')[0],
          '_group[tables]':{
            '$heading': $('body > errors > lists > list[item="markdown"] > group[item="tables"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="markdown"] > group[item="tables"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="markdown"] > group[item="tables"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="markdown"] > group[item="tables"] > ul')[0]
          },
          '$group[html]': $('body > errors > lists > list[item="markdown"] > group[item="html"]')[0],
          '_group[html]':{
            '$heading': $('body > errors > lists > list[item="markdown"] > group[item="html"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="markdown"] > group[item="html"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="markdown"] > group[item="html"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="markdown"] > group[item="html"] > ul')[0]
          }
        },
        '$list[images]': $('body > errors > lists > list[item="images"]')[0],
        '_list[images]':{
          '$group[png]': $('body > errors > lists > list[item="images"] > group[item="png"]')[0],
          '_group[png]':{
            '$heading': $('body > errors > lists > list[item="images"] > group[item="png"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="images"] > group[item="png"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="images"] > group[item="png"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="images"] > group[item="png"] > ul')[0]
          },
          '$group[errored]': $('body > errors > lists > list[item="images"] > group[item="errored"]')[0],
          '_group[errored]':{
            '$heading': $('body > errors > lists > list[item="images"] > group[item="errored"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="images"] > group[item="errored"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="images"] > group[item="errored"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="images"] > group[item="errored"] > ul')[0]
          },
          '$group[wide]': $('body > errors > lists > list[item="images"] > group[item="wide"]')[0],
          '_group[wide]':{
            '$heading': $('body > errors > lists > list[item="images"] > group[item="wide"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="images"] > group[item="wide"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="images"] > group[item="wide"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="images"] > group[item="wide"] > ul')[0]
          }
        },
        '$list[links]': $('body > errors > lists > list[item="links"]')[0],
        '_list[links]':{
          '$group[internal]': $('body > errors > lists > list[item="links"] > group[item="internal"]')[0],
          '_group[internal]':{
            '$heading': $('body > errors > lists > list[item="links"] > group[item="internal"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="links"] > group[item="internal"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="links"] > group[item="internal"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="links"] > group[item="internal"] > ul')[0]
          },
          '$group[httpfailed]': $('body > errors > lists > list[item="links"] > group[item="httpfailed"]')[0],
          '_group[httpfailed]':{
            '$heading': $('body > errors > lists > list[item="links"] > group[item="httpfailed"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="links"] > group[item="httpfailed"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="links"] > group[item="httpfailed"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="links"] > group[item="httpfailed"] > ul')[0]
          },
          '$group[http404]': $('body > errors > lists > list[item="links"] > group[item="http404"]')[0],
          '_group[http404]':{
            '$heading': $('body > errors > lists > list[item="links"] > group[item="http404"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="links"] > group[item="http404"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="links"] > group[item="http404"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="links"] > group[item="http404"] > ul')[0]
          },
          '$group[httpmisc]': $('body > errors > lists > list[item="links"] > group[item="httpmisc"]')[0],
          '_group[httpmisc]':{
            '$heading': $('body > errors > lists > list[item="links"] > group[item="httpmisc"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="links"] > group[item="httpmisc"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="links"] > group[item="httpmisc"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="links"] > group[item="httpmisc"] > ul')[0]
          },
        },
        '$list[asg]': $('body > errors > lists > list[item="asg"]')[0],
        '_list[asg]':{
          '$group[first-person]': $('body > errors > lists > list[item="asg"] > group[item="first-person"]')[0],
          '_group[first-person]':{
            '$heading': $('body > errors > lists > list[item="asg"] > group[item="first-person"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="asg"] > group[item="first-person"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="asg"] > group[item="first-person"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="asg"] > group[item="first-person"] > ul')[0]
          },
          '$group[contractions]': $('body > errors > lists > list[item="asg"] > group[item="contractions"]')[0],
          '_group[contractions]':{
            '$heading': $('body > errors > lists > list[item="asg"] > group[item="contractions"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="asg"] > group[item="contractions"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="asg"] > group[item="contractions"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="asg"] > group[item="contractions"] > ul')[0]
          },
          '$group[game-modes]': $('body > errors > lists > list[item="asg"] > group[item="game-modes"]')[0],
          '_group[game-modes]':{
            '$heading': $('body > errors > lists > list[item="asg"] > group[item="game-modes"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="asg"] > group[item="game-modes"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="asg"] > group[item="game-modes"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="asg"] > group[item="game-modes"] > ul')[0]
          },
          '$group[mediawiki]': $('body > errors > lists > list[item="asg"] > group[item="mediawiki"]')[0],
          '_group[mediawiki]':{
            '$heading': $('body > errors > lists > list[item="asg"] > group[item="mediawiki"] > heading')[0],
            '_heading':{
              '$icon': $('body > errors > lists > list[item="asg"] > group[item="mediawiki"] > heading > icon')[0],
              '$count': $('body > errors > lists > list[item="asg"] > group[item="mediawiki"] > heading > count')[0]
            },
            '$ul': $('body > errors > lists > list[item="asg"] > group[item="mediawiki"] > ul')[0]
          }
        }
      }
    },
    '$snackbar': $('body > snackbar')[0],
    '_snackbar':{
      '$text': $('body > snackbar > text')[0],
      '$icon[close]': $('body > snackbar > icon[close]')[0]
    }
  });

  /* -- path -- */
  const path = Object.seal({
    'fragments': [],
    'display': null,// ~\osu-wiki\wiki\...\en.md
    'locale': null,// en.md
    'root': null,// C:\\...\osu-wiki\
    'folder': null,// C:\\...\osu-wiki\wiki\...\
    'file': null// C:\\...\osu-wiki\wiki\...\en.md
  });

  /* -- fix -- */
  const fix = Object.solidify({
    'img':function(){
      let _img = $('osu-wiki > markdown img');
      for( let i = 0; i < _img.length; i++ ){
        let src = _img[i].getAttribute('src');
        if( /^(https?|mailto)\:/.test(src) ){
          continue;
        }
        if( /^(?:\.?\.\/|[a-zA-Z0-9_])/.test(src) )
        {
          src = path.folder + src;
        }
        else if( /^(?:\/)/.test(src) )
        {
          src = path.root + src;
        }
        _img[i].setAttribute('src', src);

        if( _img[i].hasAttribute('title') && _img[i].parentElement.tagName === 'P' && _img[i].parentElement.children.length === 1 ){
          _img[i].parentElement.setAttribute('class', 'figure');
          let em = '<em>' + _img[i].getAttribute('title') + '</em>';
          _img[i].parentElement.insertAdjacentHTML('beforeEnd', em);
        }
      }
      return;
    },
    'a':function(){
      let _a = $('osu-wiki > markdown a');
      for( let i = 0; i < _a.length; i++ ){
        let href = _a[i].getAttribute('href');
        let new_href;
        if( /^mailto\:/.test(href) ){
          continue;
        }else if( /^https?\:/.test(href) )
        {
          let xhr = new XMLHttpRequest();
          /* jshint ignore:start */
          xhr.addEventListener('load', function(){
            let status = this.status;
            if( status === 404 ){
              _body._errors._lists["_list[links]"]["_group[http" + status + "]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + href + "</code></li>");
            }else if( status !== 200 ){
              _body._errors._lists["_list[links]"]["_group[httpmisc]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + href + "</code> (" + status + ")</li>");
            }
          });
          xhr.addEventListener('error', function(){
            let status = this.status;
            _body._errors._lists["_list[links]"]["_group[httpfailed]"].$ul.insertAdjacentHTML('beforeEnd', "<li>Failed to load: <code>" + href + "</code> (" + status + ")</li>");
          });
          /* jshint ignore:end */
          xhr.open('HEAD', href);
          xhr.send();
          continue;
        }
        else if( /^(?:\.?\.\/|[a-zA-Z0-9_])/.test(href) )
        {
          //console.log('fold', href);
          new_href = path.folder + href + "/" + path.locale;
        }
        else if( /^(?:\/)/.test(href) )
        {
          //console.log('root', href);
          new_href = path.root + href + "/" + path.locale;
        }
        if( !fs.existsSync(new_href) ){
          let key_original = href;
          let key = href.replace(/^\/wiki\//, "").replace(/#.*/, "").toLowerCase();
          if( redirect && redirect[key] ){
            new_href = path.root + "/wiki/" + redirect[key];
          }else{
            _body._errors._lists["_list[links]"]["_group[internal]"].$ul.insertAdjacentHTML('beforeEnd', "<li>Invalid internal link (<code>" + key_original + "</code>)</li>");
          }
        }
        _a[i].setAttribute('href', new_href);
      }
      return;
    }
  });

  /* -- inspect -- */
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
        _body._errors._lists["_list[markdown]"]["_group[headings]"].$ul.insertAdjacentHTML('beforeEnd', "<li>Use of level 6 heading (line: " + line_number + ")</li>");
      }
      else if( /^#\s/.test(lines[i]) || (lines[i + 1] && /^=+$/.test(lines[i + 1].trim())) )
      {
        if( h1exists ){
          _body._errors._lists["_list[markdown]"]["_group[headings]"].$ul.insertAdjacentHTML('beforeEnd', "<li>Extra level 1 heading (line: " + line_number + ")</li>");
        }
        h1exists = true;
      }
      if( /<([A-z][A-z0-9]*)\b[^>]*>|<\/([A-z][A-z0-9]*)\b[^>]*>/g.test(lines[i]) ){
        let matches = lines[i].match(/<([A-z][A-z0-9]*)\b[^>]*>|<\/([A-z][A-z0-9]*)\b[^>]*>/g);
        for( let j = 0; j < matches.length; j++ ){
          let tag = matches[j].replace(/^<\/?/, "").replace(/\/?>$/, "");
          if( htmlTags.includes(tag.toLowerCase()) ){
            _body._errors._lists["_list[markdown]"]["_group[html]"].$ul.insertAdjacentHTML('beforeEnd', "<li>HTML tag: <code>" + matches[j].replace(/^</, "&lt;").replace(/>$/, "&gt;") + "</code> (line: " + line_number + ")</li>");
          }
        }
      }
      if( /\bi\b/ig.test(lines[i]) ){
        let matches = lines[i].match(/\bi\b/ig);
        if( matches ){
          for( let j = 0; j < matches.length; j++ ){
            _body._errors._lists["_list[asg]"]["_group[first-person]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
          }
        }
      }
      if( /(\w)+(n't|'ve|'d|'ll|'m|'re)|it's/ig.test(lines[i]) ){
        let matches = lines[i].match(/(\w)+(n't|'ve|'d|'ll|'m|'re)|it's/ig);
        if( matches ){
          for( let j = 0; j < matches.length; j++ ){
            _body._errors._lists["_list[asg]"]["_group[contractions]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
          }
        }
      }
      /* jshint ignore:start */
      if( /\b(?<!osu!)(Standard|Taiko|Catch\sthe\sBeat|ctb|Mania)\b/ig.test(lines[i]) ){
        let matches = lines[i].match(/\b(?<!osu!)(Standard|Taiko|Catch\sthe\sBeat|ctb|Mania)\b/ig);
        if( matches ){
          for( let j = 0; j < matches.length; j++ ){
            _body._errors._lists["_list[asg]"]["_group[game-modes]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
          }
        }
      }
      /* jshint ignore:end */
      if( /fig\:|\"wikilink\"/ig.test(lines[i]) ){
        let matches = lines[i].match(/fig\:|\"wikilink\"/ig);
        if( matches ){
          for( let j = 0; j < matches.length; j++ ){
            _body._errors._lists["_list[asg]"]["_group[mediawiki]"].$ul.insertAdjacentHTML('beforeEnd', "<li>MediaWiki keyword: <code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
          }
        }
      }
    }
    if( !h1exists ){
      _body._errors._lists["_list[markdown]"]["_group[headings]"].$ul.insertAdjacentHTML('afterBegin', "<li>Title (heading level 1) is missing!</li>");
    }
    return;
  }

  function imageTransCheck(){
    let _img = $('osu-wiki > markdown img');
    let image = new Image();
    let ctx = _body._menu.$canvas;
    if( ctx.getContext ){
      ctx = ctx.getContext('2d');
      (function check(imageNumber){
        if( imageNumber < _img.length ){
          let src = _img[imageNumber].getAttribute('src');
          if( !/^(https?|mailto)\:/i.test(src) ){
            let name = src.substring(src.lastIndexOf("/"), src.length).replace("/", "");
            if( /png/i.test(src.split(".").pop()) ){
              image.onload = function(){
                ctx.clearRect(0, 0, ctx.width, ctx.height);
                _body._menu.$canvas.width = this.width;
                _body._menu.$canvas.height = this.height;
                ctx.drawImage(image, 0, 0);

                if( this.width > 680 ){
                  _body._errors._lists["_list[images]"]["_group[wide]"].$ul.insertAdjacentHTML('afterBegin', "<li>File: <code>" + name + "</code>'s width (" + this.width + "px) is wider than max article width (680px)!</li>");
                }
                let imageData = ctx.getImageData(0, 0, _body._menu.$canvas.width, _body._menu.$canvas.height).data;

                let isTransparent = false;
                for (var i = 0, n = imageData.length; i < n; i += 4) {
                  if( imageData[i] === 0 && imageData[i + 1] === 0 && imageData[i + 2] === 0 && imageData[i + 3] === 0 ){
                    isTransparent = true;
                    break;
                  }
                }

                if( !isTransparent ){
                  _body._errors._lists["_list[images]"]["_group[png]"].$ul.insertAdjacentHTML('afterBegin', "<li>File: <code>" + name + "</code> has no transparency!</li>");
                }
                check(imageNumber + 1);
              };
              image.src = src;
            }
          }
        }
      })(0);
    }
    return;
  }

  /* -- FileReader -- */
  const FR = new FileReader();
  FR.addEventListener('load', function(){
    let lines = this.result;
    while( _body["_osu-wiki"].$markdown.firstChild ){
      _body["_osu-wiki"].$markdown.removeChild(_body["_osu-wiki"].$markdown.firstChild);
    }
    _body["_osu-wiki"].$markdown.insertAdjacentHTML('afterbegin', markdown.makeHtml(lines));

    if( $('markdown > h1').length > 0 && $('markdown > h1')[0].textContent ){
      _body["_osu-wiki"]._heading["_article-title"].$h1.textContent = $('markdown > h1')[0].textContent;
      _body["_osu-wiki"].$markdown.removeChild($('markdown > h1')[0]);
    }else{
      _body["_osu-wiki"]._heading["_article-title"].$h1.textContent = path.fragments[path.fragments.length - 2].replace(/_/g, " ");
    }
    let start = path.fragments.indexOf("wiki");
    let end = path.fragments.indexOf(path.fragments[path.fragments.length - 2]);
    if( (end - start) > 1 ){
      // TOFIX wrong behavior
      // if no h1, use first heading that appears
      _body["_osu-wiki"]._heading["_article-title"].$h2.textContent = path.fragments[path.fragments.length - 3].replace(/_/g, " ");
    }

    fix.img();
    fix.a();
    inspect(lines);
    imageTransCheck();
  });

  /* -- event listeners -- */
  (function(){
    let autorenew_timer;
    _body._menu["$container[left]"].addEventListener('click', function(e){
      if( e.target.tagName === 'ICON' ){
        if( e.target.hasAttribute('reload') )
        {
          let files = _body._menu.$input.files;
          if( files.length > 0 ){
            parseFile(files);
          }
        }
        else if( e.target.hasAttribute('autorenew') )
        {
          if( e.target.hasAttribute('enabled') ){
            e.target.removeAttribute('enabled');
            window.clearInterval(autorenew_timer);
          }else{
            e.target.setAttribute('enabled', '');
            autorenew_timer = window.setInterval(function(){
              _body._menu["_container[left]"]["$icon[reload]"].click();
            }, 5000);
          }
        }
        else if( e.target.hasAttribute('upload') )
        {
          _body._menu.$input.value = "";
          _body._menu.$input.click();
        }
      }
    });
    _body._menu.$path.addEventListener('click', function(){
      if( path.file ){
        shell.showItemInFolder(path.file);
      }
    });
    _body._menu["$container[right]"].addEventListener('click', function(e){
      if( e.target.tagName === 'ICON' ){
        if( e.target.hasAttribute('chevron-double-up') )
        {
          _body["$osu-wiki"].scrollTop = 0;
        }
        else if( e.target.hasAttribute('open-in-new') )
        {
          if( path.file ){
            shell.openItem(path.file);
          }
        }
        else if( e.target.hasAttribute('alert-outline') )
        {
          if( _body.$errors.hasAttribute('sleep') ){
            _body.$errors.removeAttribute('sleep');
            _body._menu["_container[right]"]["$icon[alert-outline]"].setAttribute('enabled', '');
          }else{
            _body.$errors.setAttribute('sleep', '');
            _body._menu["_container[right]"]["$icon[alert-outline]"].removeAttribute('enabled');
          }
        }
      }
    });

    const tabs = Object.solidify({
      'markdown':function(){
        _body._errors._tabs["$tab[markdown]"].setAttribute('enabled', '');
        _body._errors._lists["$list[markdown]"].removeAttribute('sleep');
      },
      'images':function(){
        _body._errors._tabs["$tab[images]"].setAttribute('enabled', '');
        _body._errors._lists["$list[images]"].removeAttribute('sleep');
      },
      'links':function(){
        _body._errors._tabs["$tab[links]"].setAttribute('enabled', '');
        _body._errors._lists["$list[links]"].removeAttribute('sleep');
      },
      'asg':function(){
        _body._errors._tabs["$tab[asg]"].setAttribute('enabled', '');
        _body._errors._lists["$list[asg]"].removeAttribute('sleep');
      }
    });
    _body._errors.$tabs.addEventListener('click', function(e){
      if( e.target.tagName === 'TAB' ){
        if( tabs[e.target.getAttribute('item')]){
          _body._errors._tabs["$tab[markdown]"].removeAttribute('enabled');
          _body._errors._tabs["$tab[images]"].removeAttribute('enabled');
          _body._errors._tabs["$tab[links]"].removeAttribute('enabled');
          _body._errors._tabs["$tab[asg]"].removeAttribute('enabled');
          _body._errors._lists["$list[markdown]"].setAttribute('sleep', '');
          _body._errors._lists["$list[images]"].setAttribute('sleep', '');
          _body._errors._lists["$list[links]"].setAttribute('sleep', '');
          _body._errors._lists["$list[asg]"].setAttribute('sleep', '');
          tabs[e.target.getAttribute('item')]();
        }
      }
    });

    const lists = Object.solidify({
      'headings':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[markdown]"]["_group[headings]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[markdown]"]["_group[headings]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[markdown]"]["$group[headings]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[markdown]"]["_group[headings]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[markdown]"]["_group[headings]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[markdown]"]["$group[headings]"].setAttribute('collapsed', '');
        }
      },
      'tables':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[markdown]"]["_group[tables]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[markdown]"]["_group[tables]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[markdown]"]["$group[tables]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[markdown]"]["_group[tables]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[markdown]"]["_group[tables]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[markdown]"]["$group[tables]"].setAttribute('collapsed', '');
        }
      },
      'html':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[markdown]"]["_group[html]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[markdown]"]["_group[html]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[markdown]"]["$group[html]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[markdown]"]["_group[html]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[markdown]"]["_group[html]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[markdown]"]["$group[html]"].setAttribute('collapsed', '');
        }
      },
      'png':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[images]"]["_group[png]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[images]"]["_group[png]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[images]"]["$group[png]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[images]"]["_group[png]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[images]"]["_group[png]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[images]"]["$group[png]"].setAttribute('collapsed', '');
        }
      },
      'errored':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[images]"]["_group[errored]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[images]"]["_group[errored]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[images]"]["$group[errored]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[images]"]["_group[errored]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[images]"]["_group[errored]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[images]"]["$group[errored]"].setAttribute('collapsed', '');
        }
      },
      'wide':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[images]"]["_group[wide]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[images]"]["_group[wide]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[images]"]["$group[wide]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[images]"]["_group[wide]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[images]"]["_group[wide]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[images]"]["$group[wide]"].setAttribute('collapsed', '');
        }
      },
      'internal':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[links]"]["_group[internal]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[links]"]["_group[internal]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[links]"]["$group[internal]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[links]"]["_group[internal]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[links]"]["_group[internal]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[links]"]["$group[internal]"].setAttribute('collapsed', '');
        }
      },
      'httpfailed':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[links]"]["_group[httpfailed]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[links]"]["_group[httpfailed]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[links]"]["$group[httpfailed]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[links]"]["_group[httpfailed]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[links]"]["_group[httpfailed]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[links]"]["$group[httpfailed]"].setAttribute('collapsed', '');
        }
      },
      'http404':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[links]"]["_group[http404]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[links]"]["_group[http404]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[links]"]["$group[http404]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[links]"]["_group[http404]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[links]"]["_group[http404]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[links]"]["$group[http404]"].setAttribute('collapsed', '');
        }
      },
      'httpmisc':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[links]"]["_group[httpmisc]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[links]"]["_group[httpmisc]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[links]"]["$group[httpmisc]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[links]"]["_group[httpmisc]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[links]"]["_group[httpmisc]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[links]"]["$group[httpmisc]"].setAttribute('collapsed', '');
        }
      },
      'first-person':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[asg]"]["_group[first-person]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[asg]"]["_group[first-person]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[asg]"]["$group[first-person]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[asg]"]["_group[first-person]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[asg]"]["_group[first-person]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[asg]"]["$group[first-person]"].setAttribute('collapsed', '');
        }
      },
      'contractions':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[asg]"]["_group[contractions]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[asg]"]["_group[contractions]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[asg]"]["$group[contractions]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[asg]"]["_group[contractions]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[asg]"]["_group[contractions]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[asg]"]["$group[contractions]"].setAttribute('collapsed', '');
        }
      },
      'game-modes':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[asg]"]["_group[game-modes]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[asg]"]["_group[game-modes]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[asg]"]["$group[game-modes]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[asg]"]["_group[game-modes]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[asg]"]["_group[game-modes]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[asg]"]["$group[game-modes]"].setAttribute('collapsed', '');
        }
      },
      'mediawiki':function(e){
        if( e.target.parentElement.hasAttribute('collapsed') ){
          _body._errors._lists["_list[asg]"]["_group[mediawiki]"]._heading.$icon.removeAttribute('menu-down', '');
          _body._errors._lists["_list[asg]"]["_group[mediawiki]"]._heading.$icon.setAttribute('menu-up', '');
          _body._errors._lists["_list[asg]"]["$group[mediawiki]"].removeAttribute('collapsed', '');
        }else{
          _body._errors._lists["_list[asg]"]["_group[mediawiki]"]._heading.$icon.setAttribute('menu-down', '');
          _body._errors._lists["_list[asg]"]["_group[mediawiki]"]._heading.$icon.removeAttribute('menu-up', '');
          _body._errors._lists["_list[asg]"]["$group[mediawiki]"].setAttribute('collapsed', '');
        }
      }
    });
    _body._errors.$lists.addEventListener('click', function(e){
      if( e.target.tagName === 'HEADING' ){
        if( e.target.parentElement.tagName === 'GROUP' ){
          if( lists[e.target.parentElement.getAttribute('item')] ){
            lists[e.target.parentElement.getAttribute('item')](e);
          }
        }
      }
    });

    _body._menu.$input.addEventListener('change', function(){
      let files = this.files;
      parseFile(files);
    });

    _body._snackbar["$icon[close]"].addEventListener('click', function(){
      _body.$snackbar.setAttribute('sleep', '');
    });

    window.addEventListener('dragover', function(e){
      e.preventDefault();
      return false;
    });
    window.addEventListener('drop', function(e){
      e.preventDefault();

      let files = e.dataTransfer.files;
      _body._menu.$input.files = files;

      return false;
    });
  })();

  let errorCounts = Object.seal({
    'headings': 0,
    'tables': 0,
    'html': 0,

    'error': 0,
    'png': 0,
    'wide': 0,

    'internal': 0,
    'httpfailed': 0,
    'http404': 0,
    'httpmisc': 0,

    'first-person': 0,
    'contractions': 0,
    'game-modes': 0,
    'mediawiki': 0
  });
  /* MutationObserver */
  let observer = new MutationObserver(function(e){
    e.forEach(function(f){
      let headingName = f.target.parentElement.getAttribute('item');
      errorCounts[headingName] = parseInt(f.target.parentElement.getElementsByTagName('count')[0].textContent) + f.addedNodes.length - f.removedNodes.length;
      let tabName = f.target.parentElement.parentElement.getAttribute('item');
      if( tabName === 'markdown' ){
        _body._errors._tabs["_tab[" + tabName + "]"].$count.textContent = errorCounts.headings + errorCounts.tables + errorCounts.html;
      }else if( tabName === 'images' ){
        _body._errors._tabs["_tab[" + tabName + "]"].$count.textContent = errorCounts.error + errorCounts.png + errorCounts.wide;
      }else if( tabName === 'links' ){
        _body._errors._tabs["_tab[" + tabName + "]"].$count.textContent = errorCounts.internal + errorCounts.httpfailed + errorCounts.http404 + errorCounts.httpmisc;
      }else if( tabName === 'asg' ){
        _body._errors._tabs["_tab[" + tabName + "]"].$count.textContent = errorCounts['first-person'] + errorCounts.contractions + errorCounts['game-modes'] + errorCounts.mediawiki;
      }
      f.target.parentElement.getElementsByTagName('count')[0].textContent = errorCounts[headingName];
    });
  });

  observer.observe(_body._errors._lists["_list[markdown]"]["_group[headings]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[markdown]"]["_group[tables]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[markdown]"]["_group[html]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[images]"]["_group[wide]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[images]"]["_group[png]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[links]"]["_group[internal]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[links]"]["_group[httpfailed]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[links]"]["_group[http404]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[links]"]["_group[httpmisc]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[asg]"]["_group[first-person]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[asg]"]["_group[contractions]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[asg]"]["_group[game-modes]"].$ul, { 'childList': true });
  observer.observe(_body._errors._lists["_list[asg]"]["_group[mediawiki]"].$ul, { 'childList': true });

  /* -- functions -- */
  function error(message){
    while( _body._snackbar.$text.firstChild ){
      _body._snackbar.$text.removeChild(_body._snackbar.$text.firstChild);
    }
    _body._snackbar.$text.insertAdjacentHTML('beforeEnd', message);

    _body.$snackbar.removeAttribute('sleep');
  }

  function parseFile(files){
    if( !_body.$snackbar.hasAttribute('sleep') ){
      _body.$snackbar.setAttribute('sleep', '');
    }
    if( files.length > 1 ){
      error("More than one file uploaded! Assuming first file.");
    }else if( files.length === 0 ){
      error("No files uploaded!");
      return;
    }
    let file = files[0];
    if( file.name.split(".").pop() !== "md" ){
      error("File is not <code>.md</code> extension!");
      return;
    }

    _body._menu._path.$text.textContent = "";

    while( _body._snackbar.$text.firstChild ){
      _body._snackbar.$text.removeChild(_body._snackbar.$text.firstChild);
    }
    _body["_osu-wiki"]._heading["_article-title"].$h1.textContent = "";
    _body["_osu-wiki"]._heading["_article-title"].$h2.textContent = "";

    path.fragments = file.path.split("\\");//TODO use path.fragments and get rid of the other keys
    path.file = file.path.split("\\").join("/");
    path.display = "~" + path.file.substring(path.file.indexOf("/osu-wiki/"), path.file.length);
    path.folder = path.file.substring(0, Number(path.file.lastIndexOf("/")) + 1);
    path.locale = path.file.substring(Number(path.file.lastIndexOf("/")) + 1, path.file.length);
    path.root = path.file.substring(0, path.file.lastIndexOf("/wiki/"));

    try{
      redirect = yaml.safeLoad(fs.readFileSync(path.root + '/wiki/redirect.yaml', 'utf8'));
    }catch(e){
      error("An error occured while reading the <code>redirect.yaml</code> file.");
    }

    let lists = _body._errors.$lists.children;
    for( let i = 0; i < lists.length; i++ ){
      let list = lists[i].children;
      for( let j = 0; j < list.length; j++ ){
        let ul = list[j].children[1];
        while( ul.firstChild ){
          ul.removeChild(ul.firstChild);
        }
      }
    }

    _body._menu._path.$text.textContent = path.display;
    if( _body._menu._path.$text.offsetWidth > _body._menu.$path.offsetWidth - _body._menu._path["$icon[file-tree]"].offsetWidth - parseInt(window.getComputedStyle(_body._menu._path.$text, null).getPropertyValue('padding-left')) ){
      _body._menu._path.$text.classList.add('scroll');
    }else{
      _body._menu._path.$text.classList.remove('scroll');
    }

    FR.readAsText(file);
  }
})();

const fix = Object.solidify({
  'img':function(){
    let _img = $('osu-wiki > markdown img');
    for( let i = 0; i < _img.length; i++ ){
      let src_original = _img[i].getAttribute('src');
      let src = src_original;
      if( /^(https?|mailto)\:/.test(src) ){
        continue;
      }
      if( /^(?:\.?\.\/|[a-zA-Z0-9_])/.test(src) )
      {
        src = path.folder + src + "?t=" + Date.now();
      }
      else if( /^(?:\/)/.test(src) )
      {
        src = path.root + src + "?t=" + Date.now();
      }
      _img[i].setAttribute('src', src);
      /* jshint ignore:start */
      _img[i].addEventListener('error', function(e){
        _body._errors._lists["_list[images]"]["_group[errored]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + src_original + "</code></li>");
      });
      /* jshint ignore:end */

      let parentChildren = _img[i].parentElement.children;
      let hasOnlyImg = true;
      for( let j = 0; j < parentChildren.length; j++ ){
        if(parentChildren[j].tagName !== "IMG"){
          hasOnlyImg = false;
          break;
        }
      }
      //console.log(.every(function(element, index, array){ return element.tagName === "IMG"; }));
      if( _img[i].hasAttribute('title') && _img[i].parentElement.tagName === 'P' && _img[i].parentElement.children.length === 1 ){
        _img[i].parentElement.setAttribute('class', 'figure');
        let em = '<em>' + _img[i].getAttribute('title') + '</em>';
        _img[i].parentElement.insertAdjacentHTML('beforeEnd', em);
      }else if( _img[i].parentElement.tagName === 'P' && hasOnlyImg ){
        _img[i].parentElement.setAttribute('class', 'figure');
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
          _body._errors._lists["_list[links]"]["_group[httpfailed]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + href + "</code> (" + status + ")</li>");
        });
        /* jshint ignore:end */
        xhr.open('HEAD', href);
        xhr.send();
        continue;
      }
      else if( /^(?:\.?\.\/|[a-zA-Z0-9_])/.test(href) )
      {
        //console.log('fold', href);
        new_href = path.folder + href + "/" + path.file;
      }
      else if( /^(?:\/)/.test(href) )
      {
        //console.log('root', href);
        new_href = path.root + href + "/" + path.file;
      }
      if( !fs.existsSync(new_href) ){
        let key_original = href;
        let key = href.replace(/^\/wiki\//, "").replace(/#.*/, "").toLowerCase();
        if( redirect && redirect[key] ){
          new_href = path.root + "/wiki/" + redirect[key];
        }else{
          _body._errors._lists["_list[links]"]["_group[internal]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + key_original + "</code></li>");
        }
      }
      _a[i].setAttribute('href', new_href);
    }
    return;
  }
});

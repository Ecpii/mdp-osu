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

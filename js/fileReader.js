const FR = new FileReader();
FR.addEventListener('load', function(){
  let lines = this.result;
  while( $('.osu-wiki > .markdown')[0].firstChild ){
    $('.osu-wiki > .markdown')[0].removeChild($('.osu-wiki > .markdown')[0].firstChild);
  }
  $('.osu-wiki > .markdown')[0].insertAdjacentHTML('afterbegin', markdown.makeHtml(lines));

  if( $('.osu-wiki > .heading > .article-title > h1').length > 0 && $('.osu-wiki > .heading > .article-title > h1')[0].textContent ){
    $('.osu-wiki > .heading > .article-title > h1')[0].textContent = $('.osu-wiki > .heading > .article-title > h1')[0].textContent;
    $('.osu-wiki > .markdown')[0].removeChild($('.osu-wiki > .heading > .article-title > h1')[0]);
  }else{
    // TOFIX wrong behavior
    // if no h1, use first heading that appears
    $('.osu-wiki > .heading > .article-title > h1')[0].textContent = path.fragments[path.fragments.length - 2].replace(/_/g, " ");
  }
  let start = path.fragments.indexOf("wiki");
  let end = path.fragments.indexOf(path.fragments[path.fragments.length - 2]);
  if( (end - start) > 1 ){
    $('.osu-wiki > .heading > .article-title > h2').textContent = path.fragments[path.fragments.length - 3].replace(/_/g, " ");
  }

  fix.img();
  fix.a();
  inspect(lines);
  imageTransCheck();
});

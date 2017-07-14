function error(message){
  let $text = $('.snackbar > .text')[0];
  while( $text.firstChild ){
    $text.removeChild($text.firstChild);
  }
  $text.insertAdjacentHTML('beforeEnd', message);

  $('.snackbar')[0].setAttribute('data-active', "");
}

let redirect;
function parseFile(files, reload = false){
  if( $('.snackbar')[0].hasAttribute('data-active') ){
    $('.snackbar')[0].removeAttribute('data-active');
  }

  if( files.length > 1 ){
    error("More than one file uploaded! Assuming first file.");
  }else if( files.length === 0 ){
    error("No files uploaded!");
    return false;
  }

  let file = files[0];
  if( file.name.split(".").pop() !== "md" ){
    error("File is not <code>.md</code> extension!");
    return false;
  }

  $('.path > .text')[0].textContent = "";

  $('.osu-wiki > .heading > .article-title > h1')[0].textContent = "";
  $('.osu-wiki > .heading > .article-title > h2')[0].textContent = "";

  path.fragments = file.path.split("\\");
  path.directory = path.fragments.join("/");
  if( path.fragments[path.fragments.indexOf("wiki") - 1] ){
    path.display = "~/" + path.fragments.slice(path.fragments.indexOf(path.fragments[path.fragments.indexOf("wiki") - 1]), path.fragments.length).join('/');
  }else{
    path.display = path.fragments.join("/");
  }
  path.folder = path.fragments.slice(0, path.fragments.length - 1).join('/') + "/";
  path.file = path.fragments[path.fragments.length - 1].split(".").shift();
  path.locale = path.fragments[path.fragments.length - 1];
  path.root = path.fragments.slice(0, path.fragments.indexOf(path.fragments[path.fragments.indexOf("wiki")])).join('/') + "/";

  try{
    redirect = yaml.safeLoad(fs.readFileSync(path.root + 'wiki/redirect.yaml', 'utf8'));
  }catch(e){
    console.error(e);
    error("An error occured while reading the <code>redirect.yaml</code> file.");
  }

  let lists = $('.errors .lists .list .group ul');
  for( let i = 0; i < lists.length; i++ ){
    while( lists[i].firstChild ){
      lists[i].removeChild(lists[i].firstChild);
    }
  }

  $('.menu > .path > .text')[0].textContent = path.display;
  if( $('.menu > .path > .text')[0].offsetWidth > $('.menu > .path')[0].offsetWidth - $('.menu > .path > x-icon[data-ico="file-tree"]').offsetWidth - parseInt(window.getComputedStyle($('.menu > .path > .text')[0], null).getPropertyValue('padding-left')) ){
    $('.menu > .path > .text')[0].classList.add('scroll');
  }else{
    $('.menu > .path > .text')[0].classList.remove('scroll');
  }

  if( !reload ){
    $('.menu > .container.right > x-icon[data-ico="chevron-double-up"]')[0].click();
  }
  FR.readAsText(file);
}

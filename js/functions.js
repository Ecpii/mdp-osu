/* -- functions -- */
function error(message){
  while( _body._snackbar.$text.firstChild ){
    _body._snackbar.$text.removeChild(_body._snackbar.$text.firstChild);
  }
  _body._snackbar.$text.insertAdjacentHTML('beforeEnd', message);

  _body.$snackbar.removeAttribute('sleep');
}
function parseFile(files, reload = false){
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

  if( !reload ){
    _body._menu["_container[right]"]["$icon[chevron-double-up]"].click();
  }
  FR.readAsText(file);
}
})();

let autorenew_timer;
_body._menu["$container[left]"].addEventListener('click', function(e){
  if( e.target.tagName === 'ICON' ){
    if( e.target.hasAttribute('reload') )
    {
      let files = _body._menu.$input.files;
      if( files.length > 0 ){
        parseFile(files, true);
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
  if( path.directory ){
    shell.showItemInFolder(path.directory);
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
      if( path.directory ){
        shell.openItem(path.directory);
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
    else if( e.target.hasAttribute('settings') )
    {
      if( _body.$settings.hasAttribute('sleep') ){
        _body.$settings.removeAttribute('sleep');
        _body._menu["_container[right]"]["$icon[settings]"].setAttribute('enabled', '');
      }else{
        _body.$settings.setAttribute('sleep', '');
        _body._menu["_container[right]"]["$icon[settings]"].removeAttribute('enabled');
        _body._settings["_group[theme]"]._bodying.$dropdown.setAttribute('sleep', '');
        _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.removeAttribute('menu-up');
        _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.setAttribute('menu-down', '');
      }
    }
  }
});

_body.$settings.addEventListener('click', function(e){
  let target = e.target;
  if( target.tagName === "SELECTED" )
  {
    if( _body._settings["_group[theme]"]._bodying.$dropdown.hasAttribute('sleep') ){
      _body._settings["_group[theme]"]._bodying.$dropdown.removeAttribute('sleep');
      _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.removeAttribute('menu-down');
      _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.setAttribute('menu-up', '');
    }else{
      _body._settings["_group[theme]"]._bodying.$dropdown.setAttribute('sleep', '');
      _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.removeAttribute('menu-up');
      _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.setAttribute('menu-down', '');
    }
  }
  else if( target.tagName === "ITEM" )
  {
    _body._settings["_group[theme]"]._bodying.$dropdown.setAttribute('sleep', '');
    _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.removeAttribute('menu-up');
    _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.setAttribute('menu-down', '');
    setTheme(target.getAttribute('value'));
  }
  else
  {
    _body._settings["_group[theme]"]._bodying.$dropdown.setAttribute('sleep', '');
    _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.removeAttribute('menu-up');
    _body._settings["_group[theme]"]._bodying._dropdown._selected.$icon.setAttribute('menu-down', '');
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

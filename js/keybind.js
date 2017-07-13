let map ={};
document.addEventListener('keydown', function(e){
  let {key} = e;
  map[key] = true;
  if( map.Control && map.r )
  {
    _body._menu["_container[left]"]["$icon[reload]"].click();
  }
  else if( key === "Tab" )
  {
    e.preventDefault();
    return false;
  }
  else if( key === "F5" )
  {
    nodeRequire('electron').remote.getCurrentWindow().reload();
    return false;
  }
  else if( key === "F12" )
  {
    nodeRequire('electron').remote.getCurrentWindow().toggleDevTools();
    return false;
  }
});
document.addEventListener('keyup', function(e){
  let {key} = e;
  if( map[key] ){
    delete map[key];
  }
});

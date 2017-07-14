let map ={};
document.addEventListener('keydown', function(e){
  let {key} = e;
  map[key] = true;
  if( map.Control && map.r )
  {
    $('.menu > .container.left > x-icon[data-ico="reload"]')[0].click();
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

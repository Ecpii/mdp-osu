window.addEventListener('dragover', function(e){
  e.preventDefault();
  return false;
});
window.addEventListener('drop', function(e){
  e.preventDefault();

  let files = e.dataTransfer.files;
  $('.menu > input')[0].files = files;

  return false;
});

let autorenew_timer;
$('.menu > .container.left')[0].addEventListener('click', function(e){
  if( e.target.tagName === 'X-ICON' ){
    if( e.target.hasAttribute('data-ico') ){
      let ico = e.target.getAttribute('data-ico');
      if( ico === 'reload' )
      {
        let files = $('.menu > input')[0].files;
        if( files.length > 0 ){
          parseFile(files, true);
        }
      }
      else if( ico === 'autorenew' )
      {
        if( e.target.hasAttribute('data-enabled')){
          e.target.removeAttribute('data-enabled');
          window.clearInterval(autorenew_timer);
        }else{
          e.target.setAttribute('data-enabled', '');
          autorenew_timer = window.setInterval(function(){
            $('.menu > .container.left > x-icon[data-ico="reload"]')[0].click();
          }, 5000);
        }
      }
      else if( ico === 'upload' )
      {
        $('.menu > input')[0].value = null;
        $('.menu > input')[0].click();
      }
    }
  }
});
$('.menu > .path')[0].addEventListener('click', function(){
  if( path.directory ){
    shell.showItemInFolder(path.directory);
  }
});
$('.menu > .container.right')[0].addEventListener('click', function(e){
  if( e.target.tagName === 'X-ICON' ){
    if( e.target.hasAttribute('data-ico') ){
      let ico = e.target.getAttribute('data-ico');
      if( ico === 'chevron-double-up' )
      {
        $('.osu-wiki')[0].scrollTop = 0;
      }
      else if( ico === 'open-in-new' )
      {
        if( path.directory ){
          shell.openItem(path.directory);
        }
      }
      else if( ico === 'alert-outline' )
      {
        if( $('.errors')[0].hasAttribute('data-active') ){
          $('.errors')[0].removeAttribute('data-active');
          $('.menu > .container.right > x-icon[data-ico="alert-outline"]')[0].removeAttribute('data-enabled');
        }else{
          $('.errors')[0].setAttribute('data-active', '');
          $('.menu > .container.right > x-icon[data-ico="alert-outline"]')[0].setAttribute('data-enabled', '');
        }
      }
      else if( ico === 'settings' )
      {
        if( $('.settings')[0].hasAttribute('data-active') ){
          $('.settings')[0].removeAttribute('data-active');
          $('.settings')[0].setAttribute('data-enabled', '');
          $('.menu > .container.right > x-icon[data-ico="settings"]')[0].removeAttribute('data-enabled');
        }else{
          $('.settings')[0].setAttribute('data-active', '');
          $('.settings')[0].removeAttribute('data-enabled');
          $('.menu > .container.right > x-icon[data-ico="settings"]')[0].setAttribute('data-enabled', '');
        }
        isDropDownOpen(true);
      }
    }
  }
});

function isDropDownOpen(bool){
  if( bool ){
    $('.settings > .group[data-item="theme"] > .bodying > x-dropdown')[0].removeAttribute('data-active');
    $('.settings > .group[data-item="theme"] > .bodying > x-dropdown > x-selected > x-icon')[0].setAttribute('data-ico', 'menu-down');
  }else{
    $('.settings > .group[data-item="theme"] > .bodying > x-dropdown')[0].setAttribute('data-active', '');
    $('.settings > .group[data-item="theme"] > .bodying > x-dropdown > x-selected > x-icon')[0].setAttribute('data-ico', 'menu-up');
  }
}
$('.settings')[0].addEventListener('click', function(e){
  let target = e.target;
  if( target.tagName === "X-SELECTED" )
  {
    if( $('.settings > .group[data-item="theme"] > .bodying > x-dropdown')[0].hasAttribute('data-active') ){
      isDropDownOpen(true);
    }else{
      isDropDownOpen(false);
    }
  }
  else if( target.tagName === "X-ITEM" )
  {
    isDropDownOpen(true);
    setTheme(target.getAttribute('data-value'));
  }
  else
  {
    isDropDownOpen(true);
  }
});

$('.errors')[0].addEventListener('click', function(e){
  if( e.target.classList.contains('tab') ){
    $('.errors .tabs .tab[data-enabled]').forEach(function(element){
      element.removeAttribute('data-enabled');
    });
    e.target.setAttribute('data-enabled', "");
    $('.errors > .lists > .list[data-active]').forEach(function(element){
      element.removeAttribute('data-active');
    });
    $('.errors > .lists > .list[data-item=' + e.target.getAttribute('data-item') + ']')[0].setAttribute('data-active', "");
  }

  if( e.target.classList.contains('heading') && e.target.parentElement.classList.contains('group') ){
    let $icon = $('.errors > .lists > .list[data-item=' + e.target.parentElement.parentElement.getAttribute('data-item') + '] > .group[data-item=' + e.target.parentElement.getAttribute('data-item') + '] > .heading > x-icon')[0];

    if( e.target.parentElement.hasAttribute('data-collapsed') ){
      e.target.parentElement.removeAttribute('data-collapsed');
      $icon.setAttribute('data-ico', "menu-up");
    }else{
      e.target.parentElement.setAttribute('data-collapsed', "");
      $icon.setAttribute('data-ico', "menu-down");
    }
  }
});

$('.menu > input')[0].addEventListener('change', function(){
  let files = this.files;
  parseFile(files);
});

$('.snackbar x-icon[data-ico="close"]')[0].addEventListener('click', function(){
  $('.snackbar')[0].removeAttribute('data-active');
});

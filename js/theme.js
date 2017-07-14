const validThemeColours = ["red", "pink", "purple", "deepPurple", "indigo", "blue", "lightBlue", "cyan", "teal", "green", "lightGreen", "lime", "yellow", "amber", "orange", "deepOrange", "brown", "blueGrey"];
function setTheme(colour){
  if( !validThemeColours.includes(colour) ){
    colour = "deepPurple";
  }
  $('.menu')[0].setAttribute('data-theme', colour);
  $('.errors')[0].setAttribute('data-theme', colour);
  $('.snackbar')[0].setAttribute('data-theme', colour);
  $('.settings x-dropdown').forEach(function(e){
    e.setAttribute('theme', colour);
  });

  $('.settings > .group[data-item="theme"] > .bodying > x-dropdown > x-options > x-item[data-selected]')[0].removeAttribute('data-selected');
  $('.settings > .group[data-item="theme"] > .bodying > x-dropdown > x-options > x-item[data-value="' + colour + '"]')[0].setAttribute('data-selected', '');
  $('.settings > .group[data-item="theme"] > .bodying > x-dropdown > x-selected > .text')[0].textContent = $('.settings > .group[data-item="theme"] > .bodying > x-dropdown > x-options > x-item[data-value="' + colour + '"]')[0].textContent;
  localStorage.setItem('theme', colour);
}
(function(){
  let ls_theme = localStorage.getItem('theme');
  if( ls_theme === null || ls_theme === undefined ){
    ls_theme = "deepPurple";
  }
  setTheme(ls_theme);
})();

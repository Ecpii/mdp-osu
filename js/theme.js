const validThemeColours = ["red", "pink", "purple", "deepPurple", "indigo", "blue", "lightBlue", "cyan", "teal", "green", "lightGreen", "lime", "yellow", "amber", "orange", "deepOrange", "brown", "blueGrey"];
function setTheme(colour){
  if( !validThemeColours.includes(colour) ){
    colour = "deepPurple";
  }
  _body.$menu.setAttribute('theme', colour);
  _body.$errors.setAttribute('theme', colour);
  _body.$snackbar.setAttribute('theme', colour);
  $('settings dropdown').forEach(function(e){
    e.setAttribute('theme', colour);
  });

  $('body > settings > group[item="theme"] > bodying > dropdown > options > item[selected]')[0].removeAttribute('selected');
  $('body > settings > group[item="theme"] > bodying > dropdown > options > item[value="' + colour + '"]')[0].setAttribute('selected', '');
  _body._settings["_group[theme]"]._bodying._dropdown._selected.$text.textContent = $('body > settings > group[item="theme"] > bodying > dropdown > options > item[value="' + colour + '"]')[0].textContent;
  localStorage.setItem('theme', colour);
}
(function(){
  let ls_theme = localStorage.getItem('theme');
  if( ls_theme === null || ls_theme === undefined ){
    ls_theme = "deepPurple";
  }
  setTheme(ls_theme);
})();

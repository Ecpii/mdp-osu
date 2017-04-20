/* jshint undef: true, unused: true */
/* globals require, showdown, $, window, FileReader, XMLHttpRequest */
(function(){
 'use strict';

 let toMarkdown;

 const gui = require('nw.gui');

 const _FR = new FileReader();
 const $container_article = $('repo > container');
 const $article = $('article');
 const $upload = $('upload');
 const $input = $('input');
 const $history_button = $('icon[button="history"]');
 const $upload_button = $('icon[button="file_upload"]');
 const $refresh_button = $('icon[button="refresh"]');
 const $autorenew_button = $('icon[button="autorenew"]');
 const $error_button = $('icon[button="error_outline"]');
 const $top_button = $('icon[button="vertical_align_top"]');
 const $path = $('menu > container > text');

 const $links_list = $('#_links');
 const $images_listBroken = $('#_imageBroken');
 const $images_listPng = $('#_imagePng');
 const $images_listWide = $('#_imageWide');

 let thisfile;
 let path;
 let directory;
 let working;
 let locale;

 let history =[];
 let errors ={
  "images":[],
  "links":[]
 };

 _FR.onload = function(){

  history.push(thisfile);

  $upload.toggle(false);
  $article.toggle(true);
  let _lines = this.result;

  //TODO check new.ppy.sh to see how it handles section links with /
  // C:\Users\megaapple_pi\repo\osu-wiki\wiki\List_of_Guides
  showdown.setFlavor("github");
  toMarkdown = new showdown.Converter({
   "prefixHeaderId": false
  });

  let _html = toMarkdown.makeHtml(_lines);

  $path.empty().append(path);
  $article.empty();

  $article.append(_html);

  errors ={
   "images":[],
   "links":[]
  };
  $links_list.empty();
  $images_listBroken.empty();
  $images_listPng.empty();
  $images_listWide.empty();

  //TODO history
  for( let i = 0; i < $('img').length; i++ ){
   let _target = $($('img')[i]);
   let src = _target.attr("src");
   if( /^\.\/|^\.\\/ig.test(src) ){
    _target.prop("src", directory + "\\" + src.substring(2, src.length));
   }else if( /\\|\//g.test(src) ){
    _target.prop("src", working + "\\" + src);
   }else{
    _target.prop("src", directory + "\\" + src);
   }
  }

  $('img')
   .on("load", function(e){
   if( e.target.naturalWidth > $article.outerWidth() ){
    let _li = $('<li/>').append($(e.target).prop("src").substring($(e.target).prop("src").lastIndexOf("/wiki/"), $(e.target).prop("src").length));
    $images_listWide.append(_li);
   }
   if( $(e.target).prop("src").split('.').pop() === "png" ){
    let _li = $('<li/>').append($(e.target).prop("src").substring($(e.target).prop("src").lastIndexOf("/wiki/"), $(e.target).prop("src").length));
    $images_listPng.append(_li);
   }
  })
   .on("error", function(e){
   let _li = $('<li/>').append($(e.target).prop("src"));
   $images_listBroken.append(_li);
  })
  ;

  for( let i = 0; i < $('a').length; i++ ){
   let _target = $($('a')[i]);
   let href = _target.attr("href");
   if( /^\.\/|^\.\\/ig.test(href) ){
    href = href.substring(2, href.length);
   }
   if( /^http/ig.test(href) ){
    exLinks(_target);
   }
   else if( /^mailto/ig.test(href) ){
    exLinks(_target);
   }
   else if( /^\\|^\//g.test(href) ){
    if( /\.(md|jpg|png|webp|bmp|pdf|mp3|ogg|wav|mp4|webm|avi)\/?/ig.test(href) ){
     errors.links.push(href);
     _target.prop("href", directory + "\\" + _target.attr("href"));
     exLinks(_target);
    }else{
     _target.prop("href", working + "\\" + _target.attr("href") + locale);
     inLinks(_target, true);
    }
   }
   else if( /^\.(\\|\/)/ig ){
    if( /\.(md|jpg|png|webp|bmp|pdf|mp3|ogg|wav|mp4|webm|avi)\/?/ig.test(href) ){
     let _li = $('<li/>').append(href);
     $links_list.append(_li);
     _target.prop("href", directory + "\\" + _target.attr("href"));
     exLinks(_target);
    }else{
     _target.prop("href", directory + "\\" + _target.attr("href").substring(_target.attr("href").lastIndexOf("./"), _target.attr("href").length) + locale);
     inLinks(_target, false);
    }
   }
   else{
    if( /\.(md|jpg|png|webp|bmp|pdf|mp3|ogg|wav|mp4|webm|avi)\/?/ig.test(href) ){
     let _li = $('<li/>').append(href);
     $links_list.append(_li);
     _target.prop("href", directory + "\\" + _target.attr("href"));
     exLinks(_target);
    }else{
     _target.prop("href", directory + "\\" + _target.attr("href") + locale);
     inLinks(_target, false);
    }
   }
   //TOFIX section links will fail this (adds \en.md when it shouldn't)
  }
 };

 function exLinks(target){
  target.on("click", function(e){
   e.preventDefault();
  });
 }
 function inLinks(target, isRoot){
  if( isRoot ){
   target.on("click", function(e){
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
     if( this.readyState === 4 && this.status === 0 ){
      thisfile = target.attr("href");
      path = "~" + target.attr("href").substring(target.attr("href").lastIndexOf("\\osu-wiki"), target.attr("href").length);
      directory = target.attr("href").substring(0, target.attr("href").lastIndexOf("\\"));
      locale = target.attr("href").substring(target.attr("href").lastIndexOf("\\"), target.attr("href").length);
      _FR.readAsText(this.response);
     }
    };
    xhr.open('GET', target.attr("href"));
    xhr.responseType = 'blob';
    xhr.send();
   });
  }else{
   target.on("click", function(e){
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
     if( this.readyState === 4 && this.status === 0 ){
      thisfile = target.attr("href");
      path = "~" + target.attr("href").substring(target.attr("href").lastIndexOf("\\osu-wiki"), target.attr("href").length);
      directory = target.attr("href").substring(0, target.attr("href").lastIndexOf("\\"));
      locale = target.attr("href").substring(target.attr("href").lastIndexOf("\\"), target.attr("href").length);
      _FR.readAsText(this.response);
     }
    };
    xhr.open('GET', target.attr("href"));
    xhr.responseType = 'blob';
    xhr.send();
   });
  }
 }

 $input.on("change", function(e){
  let _target = e.target;
  let _files = _target.files;
  if( _files.length > 0 ){
   //TOFIX this file check sometimes doesn't do anything
   //console.log(_files[0].name.split('.').pop(), /markdown|mdown|mkdn|md|mkd|mdwn|mdtxt|mdtext|text|rmd/ig.test(_files[0].name.split('.').pop()));
   if( /markdown|mdown|mkdn|md|mkd|mdwn|mdtxt|mdtext|text|rmd/ig.test(_files[0].name.split('.').pop()) ){
    // directory = from folder
    // working = from root
    thisfile = _files[0].path;
    path = "~" + _files[0].path.substring(_files[0].path.lastIndexOf("\\osu-wiki"), _files[0].path.length);
    directory = _files[0].path.substring(0, _files[0].path.lastIndexOf("\\"));
    working = _files[0].path.substring(0, _files[0].path.lastIndexOf("\\wiki"));
    locale = _files[0].path.substring(_files[0].path.lastIndexOf("\\"), _files[0].path.length);

    _FR.readAsText(_files[0]);
   }
  }
 });

 $upload_button.on('click', function(){
  $input.click();
 });

 $refresh_button.on('click', function(){
  if( thisfile !== undefined ){
   let xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function(){
    if( this.readyState === 4 && this.status === 0 ){
     _FR.readAsText(this.response);
    }
   };
   xhr.open('GET', thisfile);
   xhr.responseType = 'blob';
   xhr.send();
  }
 });

 let isAutorenew = false, timerAutorenew;
 $autorenew_button.on("click", function(){
  if( thisfile !== undefined ){
   if( isAutorenew ){
    $autorenew_button.removeAttr("enabled");
    isAutorenew = false;
    window.clearInterval(timerAutorenew);
   }else{
    $autorenew_button.attr("enabled", "");
    isAutorenew = true;
    timerAutorenew = window.setInterval(function(){
     $refresh_button.trigger("click");
    }, 1000);
   }
  }
 });

 window.ondragover = function(e) { e.preventDefault(); return false; };
 window.ondrop = function(e) { e.preventDefault(); return false; };
 $input[0].ondrop = function(e){
  e.preventDefault();

  let file = e.dataTransfer.files[0];
  _FR.readAsText(file);

  return false;
 };
 $path.on("click", function(){
  let location = thisfile.replace(/\//ig, "\\").replace(/\\\\/ig, "\\");
  console.log(location);
  gui.Shell.showItemInFolder(location);
 });

 let isError = false;
 $error_button.on("click", function(){
  if( isError ){
   $error_button.removeAttr("enabled");
   //TODO send signal to close window
   isError = false;
  }else{
   $error_button.attr("enabled", "");
   gui.Window.open("errors.html", {
    "width": 400,
    "height": 400,
    "min_width": 400,
    "max_width": 400,
    //"frame": false
   });
   isError = true;
  }
 });

 let isHistory = false;
 $history_button.on("click", function(){
  if( isHistory ){
   $history_button.removeAttr("enabled");
   isHistory = false;
  }else{
   $history_button.attr("enabled", "");
   isHistory = true;
  }
 });

 $top_button.on("click", function(){
  $container_article.scrollTop(0);
 });
})();

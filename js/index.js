/* jshint undef: true, unused: true */
/* globals require, showdown, $, window, FileReader, XMLHttpRequest, Image */
(function(){
 'use strict';

 const nw_gui = require('nw.gui');
 const $refresh = $('icon[button="refresh"]');
 const $autorenew = $('icon[button="autorenew"]');
 const $broken_image = $('icon[button="broken_image"]');
 const $file_upload = $('icon[button="file_upload"]');
 const $vertical_align_top = $('icon[button="vertical_align_top"]');
 const $edit = $('icon[button="edit"]');
 const $path = $('path');

 showdown.setFlavor("github");
 let toMarkdown;

 const _FileReader = new FileReader();
 const $container = $('repo > container');
 const $upload = $('upload');
 const $input = $('input');
 const $article = $('article');

 const $tabs = $('tabs > tab');

 const $error_headers = $('errors > content > h3');
 const $error_mdHeadings = $('#_mdHeadings');
 const $error_mdHeadings_count = $('[ul="_mdHeadings"] > count');
 const $error_mdTables = $('#_mdTables');
 const $error_mdTables_count = $('[ul="_mdTables"] > count');
 const $error_mdHtml = $('#_mdHtml');
 const $error_mdHtml_count = $('[ul="_mdHtml"] > count');
 const $error_linksInternal = $('#_linksInternal');
 const $error_linksInternal_count = $('[ul="_linksInternal"] > count');
 const $error_linksHttp = $('#_linksHttp');
 const $error_linksHttp_count = $('[ul="_linksHttp"] > count');
 const $error_linksDead404 = $('#_linksDead404');
 const $error_linksDead404_count = $('[ul="_linksDead404"] > count');
 const $error_linksDead503 = $('#_linksDead503');
 const $error_linksDead503_count = $('[ul="_linksDead503"] > count');
 const $error_imagesBroken = $('#_imagesBroken');
 const $error_imagesBroken_count = $('[ul="_imagesBroken"] > count');
 const $error_imagesPng = $('#_imagesPng');
 const $error_imagesPng_count = $('[ul="_imagesPng"] > count');
 const $error_imagesWide = $('#_imagesWide');
 const $error_imagesWide_count = $('[ul="_imagesWide"] > count');

 const $content_markdown = $('#_markdown');
 const $content_links = $('#_links');
 const $content_images = $('#_images');

 const $tab_markdown_count = $('[item="markdown"] > count');
 const $tab_links_count = $('[item="links"] > count');
 const $tab_images_count = $('[item="images"] > count');

 const paths = Object.seal({
  "directory": null,// C:\\...\osu-wiki\wiki\...
  "locale": null,// en.md
  "path": null,// ~\osu-wiki\wiki\...\en.md
  "root": null,// C:\\...\osu-wiki\
  "working": null// C:\\...\osu-wiki\wiki\...\en.md
 });

 let history =[];
 let historyIndex = -1;

 let randomImageNumber = "?t=" + Math.random();

 function numberMax(number){
  return (number > 99) ? "99+" : number;
 }
 function linkHeadRequest(href){
  $.ajax({
   "type": "HEAD",
   "url": href,
   "error":function(e){
    if( e.status === 404 || e.status === 0 ){
     let _li = $('<li/>').append(href);
     $error_linksDead404.append(_li);
     $error_linksDead404_count.empty().append(numberMax($error_linksDead404.children("li").length));
     $tab_links_count.empty().append(numberMax($error_linksInternal.children("li").length + $error_linksHttp.children("li").length + $error_linksDead404.children("li").length + $error_linksDead503.children("li").length));
    }else if( e.status === 503 ){
     let _li = $('<li/>').append(href);
     $error_linksDead503.append(_li);
     $error_linksDead503_count.empty().append(numberMax($error_linksDead503.children("li").length));
     $tab_links_count.empty().append(numberMax($error_linksInternal.children("li").length + $error_linksHttp.children("li").length + $error_linksDead404.children("li").length + $error_linksDead503.children("li").length));
    }
   }
  });
 }
 function imageHeadRequest(src){
  let image = new Image();
  $.ajax({
   "type": "GET",
   "url": src,
   "error":function(e){
    if( e.status === 404 || e.status === 0 ){
     let _li = $('<li/>').append(src);
     $error_imagesBroken.append(_li);
     $error_imagesBroken_count.empty().append(numberMax($error_imagesBroken.children("li").length));
     $tab_images_count.empty().append(numberMax($error_imagesBroken.children("li").length + $error_imagesPng.children("li").length + $error_imagesWide.children("li").length));
    }
   },
   "success":function(){
    image.src = src + (isBrokenImageEnabled ? randomImageNumber : "" );
    image.onload = function(){
     if( image.width > 720 ){
      let _li = $('<li/>').append(src);
      $error_imagesWide.append(_li);
      $error_imagesWide_count.empty().append(numberMax($error_imagesWide.children("li").length));
      $tab_images_count.empty().append(numberMax($error_imagesBroken.children("li").length + $error_imagesPng.children("li").length + $error_imagesWide.children("li").length));
     }
    };
   }
  });
 }

 function ordinal(i){
  let j = i % 10,
      k = i % 100;
  if(j === 1 && k !== 11){ return i + "st"; }
  else if(j === 2 && k !== 12){ return i + "nd"; }
  else if(j === 3 && k !== 13){ return i + "rd"; }
  else{ return i + "th"; }
 }

 function headingsCheck(){
  let $h1 = $('article h1');
  if( $h1.length < 1 ){
   let _li = $('<li/>').append("Article needs a lv 1 header!");
   $error_mdHeadings.append(_li);
  }
  if( $h1.length > 1 ){
   for( let i = 1; i < $h1.length; i++ ){
    let _i1 = $("<i/>").append($($h1[0]).text());
    let _i2 = $("<i/>").append($($h1[i]).text());
    let _li = $('<li/>').append(_i2).append(" (random lv 1 header) exists when ").append(_i1).append(" (the title lv 1 header) exists");
    $error_mdHeadings.append(_li);
   }
  }
  let $h6 = $('article h6');
  if( $h6.length > 0 ){
   for( let i = 0; i < $h6.length; i++ ){
    let _i = $("<i/>").append($($h6[i]).text());
    let _li = $('<li/>').append(_i).append(" (lv 6 header) should not use a lv 6 header!");
    $error_mdHeadings.append(_li);
   }
  }
 }
 function tablesCheck(){
  let $table = $('table');
  for( let i = 0; i < $table.length; i++ ){
   let $li = $($table[i]).find("li");
   if( $li.length > 0 ){
    let _li = $('<li/>').append(ordinal(i + 1) + " table contains a list!");
    $error_mdTables.append(_li);
   }
  }
 }
 function htmlCheck(){
  //TODO check for non-markdown html tags
 }
 function linksCheck(){
  let $a = $('article a');
  for( let i = 0; i < $a.length; i++ ){
   let href = $($a[i]).attr("href");
   if( /^http:/ig.test(href) ){
    let _li = $('<li/>').append(href);
    $error_linksHttp.append(_li);
   }
   if( /^http/ig.test(href) ){ //is it a url?
    linkHeadRequest(href);
   }
   else if( !/^(\/|#)/ig.test((href.substring(href.lastIndexOf("/"), href.length)).split(".").pop()) ){ // is it direct link?
    if( /\./ig.test(href) ){
     let _li = $('<li/>').append(href);
     $error_linksInternal.append(_li);
    }else{
     let _href = paths.directory + href + "/" + paths.locale;
     $($a[i]).attr("href", _href);
     linkHeadRequest(_href);
    }
   }
   else if( /#/ig.test(href) ){ // is it section link?
    let _section = href.substring(href.lastIndexOf("/"), href.length);
    if( /^\//ig.test(_section) ){
     if( /^(\/|\\)/ig.test(href) ){ // is it root link?
      let _href = paths.root + href.substring(0, Number(href.lastIndexOf("/"))) + "/" + paths.locale + _section.replace(/^\//, "");
      $($a[i]).attr("href", _href);
      linkHeadRequest(_href);
     }
     else if( /^(\.\/|\.\\|[a-zA-Z0-9_])/ig.test(href) ){ // is it folder link?
      let _href = paths.directory + href.substring(0, href.lastIndexOf("/")) + "/" + paths.locale + _section.replace(/^\//, "");
      $($a[i]).attr("href", _href);
      linkHeadRequest(_href);
     }else{ // otherwise, it's just a section link within this pages
      let _href = paths.working + _section;
      $($a[i]).attr("href", _href);
      linkHeadRequest(_href);
     }
    }else{
     if( /^(\/|\\)/ig.test(href) ){ // is it root link?
      let _href = paths.root + href + "/" + paths.locale + _section;
      $($a[i]).attr("href", _href);
      linkHeadRequest(_href);
     }
     else if( /^(\.\/|\.\\|[a-zA-Z0-9_])/ig.test(href) ){ // is it folder link?
      let _href = paths.directory + href + "/" + paths.locale + _section;
      $($a[i]).attr("href", _href);
      linkHeadRequest(_href);
     }else{ // otherwise, it's just a section link within this pages
      let _href = paths.working + _section;
      $($a[i]).attr("href", _href);
      linkHeadRequest(_href);
     }
    }
   }
   else if( /^(\/|\\)/ig.test(href) ){ // is it root link?
    // NOTE because Windows (keeps acting like an ass and) uses "\" (the same character for escaping in JS),
    // I cannot rearrange the path properly (change all "/" to "\") since JS keeps escaping before I can operate
    // because of this, I will leave the path alone here (but will handle it somewhere else)
    let _href = paths.root + href + "/" + paths.locale;
    $($a[i]).attr("href", _href);
    linkHeadRequest(_href);
   }
   else if( /^(\.\/|\.\\|[a-zA-Z0-9_])/ig.test(href) ){ // is it folder link?
    let _href = paths.directory + href + "/" + paths.locale;
    $($a[i]).attr("href", _href);
    linkHeadRequest(_href);
   }else{
    console.log("all tests failed", href);
   }
  }
 }
 function imageCheck(){
  let $img = $('article img');
  for( let i = 0; i < $img.length; i++ ){
   let src = $($img[i]).attr("src");
   if( src.split('.').pop() === "png" ){
    let _li = $('<li/>').append(src/*.substring(src.lastIndexOf("/wiki/"), src.lastIndexOf("?t"))*/);
    $error_imagesPng.append(_li);
   }
   if( /^http/ig.test(src) ){
    //imageHeadRequest(src);
    // TODO know if linking external images is ok or not
   }
   else if( /^(\/|\\)/ig.test(src) ){
    let _src = paths.root + src + (isBrokenImageEnabled ? randomImageNumber : "");
    $($img[i]).attr("src", _src);
    imageHeadRequest(_src);
   }
   else if( /^(\.\/|\.\\|[a-zA-Z0-9_])/ig.test(src) ){
    let _src = paths.directory + src.replace(/^(\/|\\)/, "") + (isBrokenImageEnabled ? randomImageNumber : "");
    $($img[i]).attr("src", _src);
    imageHeadRequest(_src);
   }
  }
 }

 function errorChecks(){
  $error_mdHeadings.empty();
  $error_mdTables.empty();
  $error_mdHtml.empty();
  $error_linksHttp.empty();
  $error_linksInternal.empty();
  $error_linksDead404.empty();
  $error_linksDead503.empty();
  $error_imagesBroken.empty();
  $error_imagesPng.empty();
  $error_imagesWide.empty();

  $error_linksDead404_count.empty().append("0");
  $error_linksDead503_count.empty().append("0");

  headingsCheck();
  tablesCheck();
  htmlCheck();
  linksCheck();// this checks for http, internal, 404 (and 503)
  imageCheck();// this checks for broken, .png, and too wide

  $error_mdHeadings_count.empty().append(numberMax($error_mdHeadings.children("li").length));
  $error_mdTables_count.empty().append(numberMax($error_mdTables.children("li").length));
  $error_mdHtml_count.empty().append(numberMax($error_mdHtml.children("li").length));
  $error_linksInternal_count.empty().append(numberMax($error_linksInternal.children("li").length));
  $error_linksHttp_count.empty().append(numberMax($error_linksHttp.children("li").length));
  $error_imagesBroken_count.empty().append(numberMax($error_imagesBroken.children("li").length));
  $error_imagesPng_count.empty().append(numberMax($error_imagesPng.children("li").length));
  $error_imagesWide_count.empty().append(numberMax($error_imagesWide.children("li").length));

  $tab_markdown_count.empty().append(numberMax($error_mdHeadings.children("li").length + $error_mdTables.children("li").length + $error_mdHtml.children("li").length));
  $tab_links_count.empty().append(numberMax($error_linksInternal.children("li").length + $error_linksHttp.children("li").length));
  $tab_images_count.empty().append(numberMax($error_imagesBroken.children("li").length + $error_imagesPng.children("li").length + $error_imagesWide.children("li").length));
 }

 _FileReader.onload = function(){
  toMarkdown = new showdown.Converter({
   "prefixHeaderId": false
  });

  let _html = toMarkdown.makeHtml(this.result);
  $article.empty().append(_html).toggle(true);
  $upload.toggle(false);

  errorChecks();
 };

 function request(file_path, refresh = false){
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
   if( this.readyState === 4 && this.status === 0 ){
    if( refresh ){
     history.push(file_path);
     historyIndex++;
    }
    paths.directory = file_path.substring(0, Number(file_path.lastIndexOf("\\")) + 1);
    paths.locale = file_path.substring(Number(file_path.lastIndexOf("\\")) + 1, file_path.length);
    paths.path = "~" + file_path.substring(file_path.indexOf("\\osu-wiki\\"), file_path.length);
    paths.root = file_path.substring(0, file_path.lastIndexOf("\\wiki\\"));
    paths.working = file_path;
    $path.empty().append(paths.path);
    _FileReader.readAsText(this.response);
   }
  };
  xhr.open('GET', file_path);
  xhr.responseType = 'blob';
  xhr.send();
 }

 function parseFile(file){
  let file_name = file.name;
  let file_path = file.path;
  if( /\.md$/.test(file_name) ){
   paths.directory = file_path.substring(0, Number(file_path.lastIndexOf("\\")) + 1);
   paths.locale = file_path.substring(Number(file_path.lastIndexOf("\\")) + 1, file_path.length);
   paths.path = "~" + file_path.substring(file_path.indexOf("\\osu-wiki\\"), file_path.length);
   paths.root = file_path.substring(0, file_path.lastIndexOf("\\wiki\\"));
   paths.working = file_path;
   $path.empty().append(paths.path);

   _FileReader.readAsText(file);
  }
 }
 let isBrokenImageEnabled = false;
 (function(){
  window.ondragover = function(e){ e.preventDefault(); return false; };
  window.ondrop = function(e){
   e.preventDefault();

   let file = e.dataTransfer.files[0];
   parseFile(file);

   return false;
  };
  $input.on('change', function(){
   if( this.files.length > 0 ){
    let file = this.files[0];
    parseFile(file);
   }
  });
  $refresh.on('click', function(){
   if( paths.working ){
    randomImageNumber = "?t=" + Math.random();
    request(paths.working, true);
   }
  });
  let isAutorenewEnabled = false, autorenewTimer;
  $autorenew.on('click', function(){
   if( paths.working ){
    if( isAutorenewEnabled ){
     $autorenew.removeAttr("enabled");
     isAutorenewEnabled = false;
     window.clearInterval(autorenewTimer);
    }else{
     $autorenew.attr("enabled", "");
     isAutorenewEnabled = true;
     $refresh.trigger('click');
     autorenewTimer = window.setInterval(function(){
      $refresh.trigger('click');
     }, 5000);
    }
   }
  });
  $broken_image.on('click', function(){
   if( paths.working ){
    if( isBrokenImageEnabled ){
     $broken_image.removeAttr("enabled");
     isBrokenImageEnabled = false;
    }else{
     $broken_image.attr("enabled", "");
     isBrokenImageEnabled = true;
     $refresh.trigger('click');
    }
   }
  });
  $file_upload.on('click', function(){
   $input.trigger("click");
  });
  $path.on('click', function(){
   if( paths.working ){
    nw_gui.Shell.showItemInFolder(paths.working);
   }
  });
  $vertical_align_top.on('click', function(){
   $container.scrollTop(0);
  });
  $edit.on('click', function(){
   if( paths.working ){
    nw_gui.Shell.openItem(paths.working);
   }
  });
  $tabs.on('click', function(e){
   let _target = e.target;
   let $target = $(_target);
   $tabs.removeAttr("enabled");
   $target.attr("enabled", "");
   $('#' + $target.attr("item")).toggle(true);
   if( $target.attr("item") === "markdown" ){
    $content_markdown.toggle(true);
    $content_links.toggle(false);
    $content_images.toggle(false);
   }else if( $target.attr("item") === "links" ){
    $content_markdown.toggle(false);
    $content_links.toggle(true);
    $content_images.toggle(false);
   }else if( $target.attr("item") === "images" ){
    $content_markdown.toggle(false);
    $content_links.toggle(false);
    $content_images.toggle(true);
   }
  });
  $error_headers.on('click', function(e){
   let _target = e.target;
   let $target = $(_target);
   if( $target.find('icon').text() === "expand_more" ){
    $target.find('icon').text("expand_less");
    $('#' + $target.attr('ul')).attr("collapsed", "");
   }else{
    $target.find('icon').text("expand_more");
    $('#' + $target.attr('ul')).removeAttr("collapsed");
   }
  });
  $('article').on('click', 'a', function(e){
   e.preventDefault();
   return false;
  });
 })();
})();

/* jshint undef: true, unused: true */
/* globals require, showdown, $, window, FileReader, XMLHttpRequest */
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

 const _FileReader = new FileReader();
 const $container = $('repo > container');
 const $upload = $('upload');
 const $input = $('input');
 const $article = $('article');

 const paths = Object.seal({
  "directory": null,// C:\\...\osu-wiki\wiki\
  "locale": null,// en.md
  "path": null,// ~\osu-wiki\...\en.md
  "root": null,// ~\osu-wiki\
  "working": null// C:\\...\osu-wiki\wiki\...\en.md
 });

 _FileReader.onload = function(){
  toMarkdown = new showdown.Converter({
   "prefixHeaderId": false
  });

  let _html = toMarkdown.makeHtml(this.result);
  $article.append(_html);

 };

 (function(){
  $input.on('change', function(){
   if( this.files.length > 0 ){
    let file = this.files[0];
    let file_path = file.path;
    if( /\.md$/.test(file.name) ){
     // C:\\...\osu-wiki\wiki\
     paths.directory = file_path.substring(0, Number(file_path.lastIndexOf("\\")) + 1);
     // en.md
     paths.locale = file_path.substring(Number(file_path.lastIndexOf("\\")) + 1, file_path.length);
     // \osu-wiki\wiki\...\en.md
     paths.path = "~" + file_path.substring(file_path.indexOf("\\osu-wiki\\"), file_path.length);
     // ~\osu-wiki\
     paths.root = file_path.substring(0, file_path.lastIndexOf("\\wiki\\"));
     // C:\\...\osu-wiki\wiki\...\
     paths.working = file_path;

     console.log(paths);
     
     $path.empty().append(paths.path);
    }

   }
  });
  $refresh.on('click', function(){

  });
  $autorenew.on('click', function(){

  });
  $broken_image.on('click', function(){

  });
  $file_upload.on('click', function(){
   $input.trigger("click");
  });
  $path.on('click', function(){

  });
  $vertical_align_top.on('click', function(){
   $container.scrollTop(0);
  });
  $edit.on('click', function(){

  });

 })();
})();

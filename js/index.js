/* jshint undef: true, unused: true */
/* globals document, nodeRequire, showdown, $, window, FileReader, XMLHttpRequest, Image */
(function(){
  'use strict';

  const {shell} = nodeRequire('electron');
  //const yaml = nodeRequire('js-yaml');
  //const {clipboard} = nodeRequire('electron');

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
  const $error_linksDead405 = $('#_linksDead405');
  const $error_linksDead405_count = $('[ul="_linksDead405"] > count');
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

  //let history =[];
  //let historyIndex = -1;

  let randomImageNumber = "?t=" + Math.random();

  function numberMax(number){
    return (number > 99) ? "99+" : number;
  }
  function linkHeadRequest(href){
    $.ajax({
      "type": "HEAD",
      "url": href,
      "error":function(e){
        if( e.status === 404 || e.status === 0 )
        {
          let _close = $('<icon/>').append("close");
          let _li = $('<li/>').append(_close).append(href);
          $error_linksDead404.append(_li);
          $error_linksDead404_count.empty().append(numberMax($error_linksDead404.children("li").length));
          $tab_links_count.empty().append(numberMax($error_linksInternal.children("li").length + $error_linksHttp.children("li").length + $error_linksDead404.children("li").length + $error_linksDead503.children("li").length));
        }else if( e.status === 405 )
        {
          let _close = $('<icon/>').append("close");
          let _li = $('<li/>').append(_close).append(href);
          $error_linksDead405.append(_li);
          $error_linksDead405_count.empty().append(numberMax($error_linksDead405.children("li").length));
          $tab_links_count.empty().append(numberMax($error_linksInternal.children("li").length + $error_linksHttp.children("li").length + $error_linksDead404.children("li").length + $error_linksDead503.children("li").length));
        }else if( e.status === 503 )
        {
          let _close = $('<icon/>').append("close");
          let _li = $('<li/>').append(_close).append(href);
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
        if( e.status === 404 || e.status === 0 )
        {
          let _close = $('<icon/>').append("close");
          let _li = $('<li/>').append(_close).append(src);
          $error_imagesBroken.append(_li);
          $error_imagesBroken_count.empty().append(numberMax($error_imagesBroken.children("li").length));
          $tab_images_count.empty().append(numberMax($error_imagesBroken.children("li").length + $error_imagesPng.children("li").length + $error_imagesWide.children("li").length));
        }
      },
      "success":function(){
        image.src = src + (isBrokenImageEnabled ? randomImageNumber : "" );
        image.onload = function(){
          if( image.width > 680 )
          {
            let _close = $('<icon/>').append("close");
            let _li = $('<li/>').append(_close).append(src);
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
    if(j === 1 && k !== 11)
    { return i + "st"; }
    else if(j === 2 && k !== 12)
    { return i + "nd"; }
    else if(j === 3 && k !== 13)
    { return i + "rd"; }
    else{ return i + "th"; }
  }

  function headingsCheck(){
    let $h1 = $('article h1');
    let $h2 = $('article h2');
    let $h3 = $('article h3');
    let $h4 = $('article h4');
    let $h5 = $('article h5');
    let $h6 = $('article h6');
    if( $h1.length < 1 )
    {
      let _close = $('<icon/>').append("close");
      let _li = $('<li/>').append(_close).append("Article needs a lv 1 header!");
      $error_mdHeadings.append(_li);
    }
    else if( $h1.length > 1 )
    {
      for( let i = 1; i < $h1.length; i++ )
      {
        let _close = $("<icon/>").append("close");
        let _i1 = $("<i/>").append($($h1[0]).text());
        let _i2 = $("<i/>").append($($h1[i]).text());
        let _li = $('<li/>').append(_close).append(_i2).append(" (random lv 1 header) exists when ").append(_i1).append(" (the title lv 1 header) exists.");
        $error_mdHeadings.append(_li);
      }
    }
    if( $h1.children().length > 0 )
    {
      for( let i = 0; i < $h1.children().length; i++ )
      {
        let _close = $("<icon/>").append("close");
        let _i = $("<i/>").append($($h1[i]).text());
        let _li = $('<li/>').append(_close).append(_i).append(" (lv 1 header) contains style.");
        $error_mdHeadings.append(_li);
      }
    }
    if( $h2.children().length > 0 )
    {
      for( let i = 0; i < $h2.children().length; i++ )
      {
        let _close = $("<icon/>").append("close");
        let _i = $("<i/>").append($($h2[i]).text());
        let _li = $('<li/>').append(_close).append(_i).append(" (lv 2 header) contains style.");
        $error_mdHeadings.append(_li);
      }
    }
    if( $h3.children().length > 0 )
    {
      for( let i = 0; i < $h3.children().length; i++ )
      {
        let _close = $("<icon/>").append("close");
        let _i = $("<i/>").append($($h3[i]).text());
        let _li = $('<li/>').append(_close).append(_i).append(" (lv 3 header) contains style.");
        $error_mdHeadings.append(_li);
      }
    }
    if( $h4.children().length > 0 )
    {
      for( let i = 0; i < $h4.children().length; i++ )
      {
        let _close = $("<icon/>").append("close");
        let _i = $("<i/>").append($($h4[i]).text());
        let _li = $('<li/>').append(_close).append(_i).append(" (lv 4 header) contains style.");
        $error_mdHeadings.append(_li);
      }
    }
    if( $h5.children().length > 0 )
    {
      for( let i = 0; i < $h5.children().length; i++ )
      {
        let _close = $("<icon/>").append("close");
        let _i = $("<i/>").append($($h5[i]).text());
        let _li = $('<li/>').append(_close).append(_i).append(" (lv 5 header) contains style.");
        $error_mdHeadings.append(_li);
      }
    }
    if( $h6.length > 0 )
    {
      for( let i = 0; i < $h6.length; i++ )
      {
        let _close = $("<icon/>").append("close");
        let _i = $("<i/>").append($($h6[i]).text());
        let _li = $('<li/>').append(_close).append(_i).append(" (lv 6 header) should not use a lv 6 header!");
        $error_mdHeadings.append(_li);
      }
    }
  }
  function tablesCheck(){
    let $table = $('table');
    for( let i = 0; i < $table.length; i++ )
    {
      let $li = $($table[i]).find("li");
      if( $li.length > 0 )
      {
        let _close = $("<icon/>").append("close");
        let _li = $('<li/>').append(_close).append(ordinal(i + 1) + " table contains a list!");
        $error_mdTables.append(_li);
      }
    }
  }
  function htmlCheck(){
    //TODO check for non-markdown html tags
    //IDEA manually read the file to see if tags are present?
    //IDEA use .children() to see if invaild tags are used? // it may miss those who use <strike/> and <em/> tags
  }
  function linksCheck(){
    let $a = $('article a');
    for( let i = 0; i < $a.length; i++ )
    {
      let href = $($a[i]).attr("href");
      if( /^http:/ig.test(href) )
      {
        let _close = $("<icon/>").append("close");
        let _li = $('<li/>').append(_close).append(href);
        $error_linksHttp.append(_li);
      }
      if( /^http/ig.test(href) )
      { //is it a url?
        linkHeadRequest(href);
      }
      else if( !/^(\/|#)/ig.test((href.substring(href.lastIndexOf("/"), href.length)).split(".").pop()) )
      { // is it direct link?
        if( /\./ig.test(href) )
        {
          let _close = $("<icon/>").append("close");
          let _li = $('<li/>').append(_close).append(href);
          $error_linksInternal.append(_li);
        }else{
          let _href = paths.directory + href + "/" + paths.locale;
          $($a[i]).attr("href", _href);
          linkHeadRequest(_href);
        }
      }
      else if( /#/ig.test(href) )
      { // is it section link?
        let _section = href.substring(href.lastIndexOf("/"), href.length);
        if( /^\//ig.test(_section) )
        {
          if( /^(\/|\\)/ig.test(href) )
          { // is it root link?
            let _href = paths.root + href.substring(0, Number(href.lastIndexOf("/"))) + "/" + paths.locale + _section.replace(/^\//, "");
            $($a[i]).attr("href", _href);
            linkHeadRequest(_href);
          }
          else if( /^(\.\/|\.\\|[a-zA-Z0-9_])/ig.test(href) )
          { // is it folder link?
            let _href = paths.directory + href.substring(0, href.lastIndexOf("/")) + "/" + paths.locale + _section.replace(/^\//, "");
            $($a[i]).attr("href", _href);
            linkHeadRequest(_href);
          }else{ // otherwise, it's just a section link within this pages
            let _href = paths.working + _section;
            $($a[i]).attr("href", _href);
            linkHeadRequest(_href);
          }
        }else{
          if( /^(\/|\\)/ig.test(href) )
          { // is it root link?
            let _href = paths.root + href + "/" + paths.locale + _section;
            $($a[i]).attr("href", _href);
            linkHeadRequest(_href);
          }
          else if( /^(\.\/|\.\\|[a-zA-Z0-9_])/ig.test(href) )
          { // is it folder link?
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
      else if( /^(\/|\\)/ig.test(href) )
      { // is it root link?
        // NOTE because Windows (keeps acting like an ass and) uses "\" (the same character for escaping in JS),
        // I cannot rearrange the path properly (change all "/" to "\") since JS keeps escaping before I can operate
        // because of this, I will leave the path alone here (but will handle it somewhere else)
        let _href = paths.root + href + '/' + paths.locale;
        $($a[i]).attr('href', _href);
        linkHeadRequest(_href);
      }
      else if( /^(\.\/|\.\\|[a-zA-Z0-9_])/ig.test(href) )
      { // is it folder link?
        let _href = paths.directory + href + '/' + paths.locale;
        $($a[i]).attr('href', _href);
        linkHeadRequest(_href);
      }else{
        //console.log("all tests failed", href);
      }
    }
  }
  function imageCheck(){
    let $img = $('article img');
    for( let i = 0; i < $img.length; i++ )
    {
      if( $img[i].parentElement.tagName === 'P' && $img[i].parentElement.children.length === 1 && $img[i].hasAttribute('title') ){
        let $em = $('<em/>').append($img[i].getAttribute('title'));
        $($img[i].parentElement)
          .addClass('figure')
          .append($em)
        ;
      }

      let src = $($img[i]).attr('src');
      if( src.split('.').pop() === 'png' )
      {
        let _close = $("<icon/>").append("close");
        let _li = $('<li/>').append(_close).append(src/*.substring(src.lastIndexOf("/wiki/"), src.lastIndexOf("?t"))*/);
        $error_imagesPng.append(_li);
      }
      if( /^http/ig.test(src) )
      {
        //imageHeadRequest(src);
        // TODO know if linking external images is ok or not
      }
      else if( /^(\/|\\)/ig.test(src) )
      {
        let _src = paths.root + src + (isBrokenImageEnabled ? randomImageNumber : "");
        $($img[i]).attr("src", _src);
        imageHeadRequest(_src);
      }
      else if( /^(\.\/|\.\\|[a-zA-Z0-9_])/ig.test(src) )
      {
        let _src = paths.directory + src.replace(/^(\/|\\)/, "") + (isBrokenImageEnabled ? randomImageNumber : "");
        $($img[i]).attr("src", _src);
        imageHeadRequest(_src);
      }
    }
  }
  function errorCounts(){
    $error_mdHeadings_count.empty().append(numberMax($error_mdHeadings.children("li").length));
    $error_mdTables_count.empty().append(numberMax($error_mdTables.children("li").length));
    $error_mdHtml_count.empty().append(numberMax($error_mdHtml.children("li").length));
    $error_linksInternal_count.empty().append(numberMax($error_linksInternal.children("li").length));
    $error_linksHttp_count.empty().append(numberMax($error_linksHttp.children("li").length));
    $error_imagesBroken_count.empty().append(numberMax($error_imagesBroken.children("li").length));
    $error_imagesPng_count.empty().append(numberMax($error_imagesPng.children("li").length));
    $error_imagesWide_count.empty().append(numberMax($error_imagesWide.children("li").length));

    $tab_markdown_count.empty().append(numberMax($error_mdHeadings.children("li").length + $error_mdTables.children("li").length + $error_mdHtml.children("li").length));
    $tab_links_count.empty().append(numberMax($error_linksHttp.children("li").length) + $error_linksInternal.children("li").length + $error_linksDead404.children("li").length + $error_linksDead405.children("li").length + $error_linksDead503.children("li").length);
    $tab_images_count.empty().append(numberMax($error_imagesBroken.children("li").length + $error_imagesPng.children("li").length + $error_imagesWide.children("li").length));
  }
  function errorChecks(){
    $error_mdHeadings.empty();
    $error_mdTables.empty();
    $error_mdHtml.empty();
    $error_linksHttp.empty();
    $error_linksInternal.empty();
    $error_linksDead404.empty();
    $error_linksDead405.empty();
    $error_linksDead503.empty();
    $error_imagesBroken.empty();
    $error_imagesPng.empty();
    $error_imagesWide.empty();

    $error_linksDead404_count.empty().append("0");
    $error_linksDead405_count.empty().append("0");
    $error_linksDead503_count.empty().append("0");

    headingsCheck();
    tablesCheck();
    htmlCheck();
    linksCheck();// this checks for http, internal, 404 (and 503)
    imageCheck();// this checks for broken, .png, and too wide

    errorCounts();
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
      if( this.readyState === 4 && this.status === 200 )
      {
        if( refresh )
        {
        }
        paths.directory = file_path.substring(0, Number(file_path.lastIndexOf("/")) + 1);
        paths.locale = file_path.substring(Number(file_path.lastIndexOf("/")) + 1, file_path.length);
        paths.path = "~" + file_path.substring(file_path.indexOf("/osu-wiki/"), file_path.length);
        paths.root = file_path.substring(0, file_path.lastIndexOf("/wiki/"));
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
    let file_path = file.path.split("\\").join("/");
    if( /\.md$/.test(file_name) )
    {
      paths.directory = file_path.substring(0, Number(file_path.lastIndexOf("/")) + 1);
      paths.locale = file_path.substring(Number(file_path.lastIndexOf("/")) + 1, file_path.length);
      paths.path = "~" + file_path.substring(file_path.indexOf("/osu-wiki/"), file_path.length);
      paths.root = file_path.substring(0, file_path.lastIndexOf("/wiki/"));
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
      if( this.files.length > 0 )
      {
        let file = this.files[0];
        parseFile(file);
      }
    });
    $refresh.on('click', function(){
      if( paths.working )
      {
        randomImageNumber = "?t=" + Math.random();
        request(paths.working, true);
      }
    });
    let isAutorenewEnabled = false, autorenewTimer;
    $autorenew.on('click', function(){
      if( paths.working )
      {
        if( isAutorenewEnabled )
        {
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
      if( paths.working )
      {
        if( isBrokenImageEnabled )
        {
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
      if( paths.working )
      {
        shell.showItemInFolder(paths.working);
      }
    });
    $vertical_align_top.on('click', function(){
      $container.scrollTop(0);
    });
    $edit.on('click', function(){
      if( paths.working )
      {
        shell.openItem(paths.working);
      }
    });
    $tabs.on('click', function(e){
      let _target = e.target;
      let $target = $(_target);
      $tabs.removeAttr("enabled");
      $target.attr("enabled", "");
      $('#' + $target.attr("item")).toggle(true);
      if( $target.attr("item") === "markdown" )
      {
        $content_markdown.toggle(true);
        $content_links.toggle(false);
        $content_images.toggle(false);
      }else if( $target.attr("item") === "links" )
      {
        $content_markdown.toggle(false);
        $content_links.toggle(true);
        $content_images.toggle(false);
      }else if( $target.attr("item") === "images" )
      {
        $content_markdown.toggle(false);
        $content_links.toggle(false);
        $content_images.toggle(true);
      }
    });
    $error_headers.on('click', function(e){
      let _target = e.target;
      let $target = $(_target);
      if( $target.find('icon').text() === "expand_more" )
      {
        $target.find('icon').text("expand_less");
        $('#' + $target.attr('ul')).attr("collapsed", "");
      }else{
        $target.find('icon').text("expand_more");
        $('#' + $target.attr('ul')).removeAttr("collapsed");
      }
    });
    $article.on('click', 'a', function(e){
      e.preventDefault();
      return false;
    });
    $('ul').on('click', 'li', function(e){
      if( e.target.tagName === "LI" ){
        let selection, range;
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(this);
        selection.removeAllRanges();
        selection.addRange(range);
        //clipboard.writeText(window.getSelection().toString());
      }else if( e.target.tagName === "ICON" ){
        $(e.target.parentElement).remove();
        errorCounts();
      }
    });
  })();
})();

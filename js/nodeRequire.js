const {app, shell} = nodeRequire('electron');
const fs = nodeRequire('fs');
const $ = nodeRequire('sizzle');
const showdown = nodeRequire('showdown');
const markdown = new showdown.Converter({
  'tables': true,
  'disableForced4SpacesIndentedSublists': true,
  'openLinksInNewWindow': true
});
const yaml = nodeRequire('js-yaml');
let redirect;
const localStorage = window.localStorage;

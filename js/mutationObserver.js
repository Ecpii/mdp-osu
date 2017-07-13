let errorCounts = Object.seal({
  'headings': 0,
  'tables': 0,
  'html': 0,

  'error': 0,
  'png': 0,
  'wide': 0,

  'internal': 0,
  'httpfailed': 0,
  'http404': 0,
  'httpmisc': 0,

  'first-person': 0,
  'contractions': 0,
  'game-modes': 0,
  'mediawiki': 0
});

let observer = new MutationObserver(function(e){
  e.forEach(function(f){
    let headingName = f.target.parentElement.getAttribute('item');
    errorCounts[headingName] = parseInt(f.target.parentElement.getElementsByTagName('count')[0].textContent) + f.addedNodes.length - f.removedNodes.length;
    let tabName = f.target.parentElement.parentElement.getAttribute('item');
    if( tabName === 'markdown' ){
      _body._errors._tabs["_tab[" + tabName + "]"].$count.textContent = errorCounts.headings + errorCounts.tables + errorCounts.html;
    }else if( tabName === 'images' ){
      _body._errors._tabs["_tab[" + tabName + "]"].$count.textContent = errorCounts.error + errorCounts.png + errorCounts.wide;
    }else if( tabName === 'links' ){
      _body._errors._tabs["_tab[" + tabName + "]"].$count.textContent = errorCounts.internal + errorCounts.httpfailed + errorCounts.http404 + errorCounts.httpmisc;
    }else if( tabName === 'asg' ){
      _body._errors._tabs["_tab[" + tabName + "]"].$count.textContent = errorCounts['first-person'] + errorCounts.contractions + errorCounts['game-modes'] + errorCounts.mediawiki;
    }
    f.target.parentElement.getElementsByTagName('count')[0].textContent = errorCounts[headingName];
  });
});

observer.observe(_body._errors._lists["_list[markdown]"]["_group[headings]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[markdown]"]["_group[tables]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[markdown]"]["_group[html]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[images]"]["_group[wide]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[images]"]["_group[png]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[links]"]["_group[internal]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[links]"]["_group[httpfailed]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[links]"]["_group[http404]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[links]"]["_group[httpmisc]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[asg]"]["_group[first-person]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[asg]"]["_group[contractions]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[asg]"]["_group[game-modes]"].$ul, { 'childList': true });
observer.observe(_body._errors._lists["_list[asg]"]["_group[mediawiki]"].$ul, { 'childList': true });

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
    let headingName = f.target.parentElement.getAttribute('data-item');
    errorCounts[headingName] = parseInt(f.target.parentElement.getElementsByClassName('count')[0].textContent) + f.addedNodes.length - f.removedNodes.length;
    let tabName = f.target.parentElement.parentElement.getAttribute('data-item');
    if( tabName === 'markdown' ){
      $('.errors > .tabs > .tab[data-item="' + tabName + '"] > .count')[0].textContent = errorCounts.headings + errorCounts.tables + errorCounts.html;
    }else if( tabName === 'images' ){
      $('.errors > .tabs > .tab[data-item="' + tabName + '"] > .count')[0].textContent = errorCounts.error + errorCounts.png + errorCounts.wide;
    }else if( tabName === 'links' ){
      $('.errors > .tabs > .tab[data-item="' + tabName + '"] > .count')[0].textContent = errorCounts.internal + errorCounts.httpfailed + errorCounts.http404 + errorCounts.httpmisc;
    }else if( tabName === 'asg' ){
      $('.errors > .tabs > .tab[data-item="' + tabName + '"] > .count')[0].textContent = errorCounts['first-person'] + errorCounts.contractions + errorCounts['game-modes'] + errorCounts.mediawiki;
    }
    f.target.parentElement.getElementsByClassName('count')[0].textContent = errorCounts[headingName];
  });
});

$('.list .group > ul').forEach(function(e){
  observer.observe(e, {'childList': true});
});

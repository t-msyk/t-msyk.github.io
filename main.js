// Copyright (c) 2020 tMasayuki. All rights reserved.

var _GET = (function () {
  var vars = {}; 
  var param = location.search.substring(1).split('&');
  for(var i = 0; i < param.length; i++) {
    var keySearch = param[i].search(/=/);
    var key = '';
    if ( keySearch != -1) key = param[i].slice(0, keySearch);
    var val = param[i].slice(param[i].indexOf('=', 0) + 1);
    if ( key != '') vars[key] = decodeURI(val);
  } 
  return vars; 
})();

function get2url () {
  var get_param_string='';
  for ( var key in _GET ) {
    if ( get_param_string === '' ) {
      get_param_string += '?' + key + '=' + _GET[key];
    } else {
      get_param_string += '&' + key + '=' + _GET[key];
    }
  }
  // TODO which is better ?
  //window.history.pushState(null, null, get_param_string);
  if ( !get_param_string ) {
    get_param_string = "?"
  }
  window.history.replaceState(null, null, encodeURI(get_param_string));
}

function copy_url () {
  var  obj = document.createElement('textarea');
  document.body.appendChild(obj);
  obj.innerHTML = location.href;
  obj.readonly = true;
  obj.select();
  document.execCommand('Copy');
  document.body.removeChild(obj);
}


document.addEventListener('DOMContentLoaded', () => {
    // スムーズスクロール
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ページ読み込み時の簡易アニメーション
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = `${index * 0.1}s`;

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
});

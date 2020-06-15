function notice_unsupported_browser () {
  var agent = window.navigator.userAgent.toLowerCase();
  var notice = document.getElementById('notice_unsupported_browser');
  if ( !notice ) {
    var main = document.getElementsByTagName('main')[0];
    notice = document.createElement('div');
    notice.id = 'notice_unsupported_browser';
    main.insertBefore(notice,main.children[0]);
  }
  notice.style.color = "red";
  notice.style.fontWeight = 700;
  var browser="unknown";
  // The order is important
  if ( false ) {
  } else if ( agent.indexOf('edge') !== -1 ) {
    browser = "Edge";
  } else if ( agent.indexOf('opera') !== -1 ) {
    browser = "Opera";
  } else if ( agent.indexOf('msie') !== -1 ) {
    browser = "IE";
  } else if ( agent.indexOf('trident') !== -1 ) {
    browser = "IE";
  } else if ( agent.indexOf('chrome') !== -1 ) {
    browser = "Chrome";
  } else if ( agent.indexOf('safari') !== -1 ) {
    browser = "Safari";
  } else if ( agent.indexOf('firefox') !== -1 ) {
    browser = "Firefox";
  } else if ( agent.indexOf() !== -1 ) {
  }
  if ( browser === 'edge' || browser === 'IE' || browser ==='Opera' ) {
    notice.innerHTML = browser + " is unsupported browser.<br>" 
                     + "Sometimes layouts broken.<br>";
  }
  if ( browser === 'unknown' ) {
    notice.innerHTML = "You use unknown browser.<br>" 
                     + "Sometimes layouts broken.<br>";
  }
}

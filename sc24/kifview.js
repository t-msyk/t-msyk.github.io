var obj;
function onload () {
  var xhr = new XMLHttpRequest();
  obj = document.createElement('textarea');
  obj.style.width='100%';
  obj.style.height='80%';
  document.body.appendChild(obj);
  xhr.responseType = "blob"
  xhr.open('GET', _GET['kif'], true);
  xhr.onload = function () {
    var freader = new FileReader();
    freader.onloadend = function(e){
       if(freader.error) {
         document.body.innerHTML = "error to read " + _GET['kif'];
         return;
       }
       document.body.innerHTML = freader.result.replace(/\n/g,'<br>');
       console.log(freader.result);
    };
    freader.readAsText(xhr.response, 'shift-jis');
  }
  xhr.send();
}

function copy_kif () {
}


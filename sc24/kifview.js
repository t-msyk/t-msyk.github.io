function onload () {
  var file_path_list= _GET['kif'].split('/');
  document.getElementById("title").innerHTML = file_path_list[file_path_list.length-1];
  var xhr = new XMLHttpRequest();
  xhr.responseType = "blob"
  xhr.open('GET', _GET['kif'], true);
  xhr.onload = function () {
    var freader = new FileReader();
    freader.onloadend = function(e){
       if(freader.error) {
         document.body.innerHTML = "error to read " + _GET['kif'];
         return;
       }
       document.getElementById('kif').innerHTML = freader.result.replace(/\n/g,'<br>');
       console.log(freader.result);
    };
    freader.readAsText(xhr.response, 'shift-jis');
  }
  xhr.send();
}

function copy_kif () {
  var  obj = document.createElement('textarea');
  document.body.appendChild(obj);
  obj.innerHTML = document.getElementById('kif').innerHTML.replace(/<br>/g,'\n');
  obj.readonly = true;
  obj.select();
  document.execCommand('Copy');
  document.body.removeChild(obj);
}

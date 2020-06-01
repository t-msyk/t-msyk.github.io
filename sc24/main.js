// Copyright (c) 2020 tMasayuki. All rights reserved.

function dummy () {
}

function onload () {
  var kif_table = document.getElementById("kif_table");
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'kif_table.csv', true);
  xhr.onload = function () {
    kif_table.innerHTML = xhr.responseText;
    load_kif_table();
  }
  xhr.send();
}


function load_kif_table() {
  var main_table=document.getElementById("main_table");
  main_table.innerHTML='<tr><td>日時</td><td>棋戦</td><td>先手</td><td>先手レート</td><td>後手</td><td>後手レート</td><td>勝敗</td><td>手数</td><td>先手戦形</td><td>後手戦形</td><td>棋譜</td><td>再生</td></tr>\n';
  var kif_table=document.getElementById("kif_table");
  var text = kif_table.value.replace(/\r\n|\r/g,"\n");
  var lines = text.split('\n');
  var tbody_html=""
  for ( var i=0; i<lines.length; ++i ) {
    if ( !lines[i] ) {
      continue;
    }
    //    0,    1,    2,          3,    4,          5,    6,    7,        8         9,                10
    // 日時, 棋戦, 先手, 先手レート, 後手, 後手レート, 勝敗, 手数, 先手戦形, 後手戦形, http://url/to/kif
    //console.log ("" + lines[i]);
    var tmp = lines[i].split(',');
    tbody_html += "<tr>"
    for ( var j=0; j<=9; ++j ) {
      tbody_html += "<td>" + tmp[j] + "</td>";
    }
    tbody_html += "<td><a href='" + tmp[10] + "'>棋譜</a></td>"
    var file_path_list= tmp[10].split('/');
    var kif_file = file_path_list[file_path_list.length-1];
    var sfen_file = kif_file.substring(0,kif_file.lastIndexOf('.')) + '.sfen'
    // ../kif-narabe/?kifu=../sc24/sfen/2020-05-18-18-27-03-3685219-be5e0c0d84e6654475f8aa0bd2998957-toyo.sfen
    tbody_html += "<td><a href='../kif-narabe/?kifu=../sc24/sfen/" + sfen_file + "'>再生</a></td>"
    tbody_html += "</tr>\n";
  }
  main_table.innerHTML += tbody_html;
}

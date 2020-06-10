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

function generate_tbody ( date, kisen, sente, senteR, gote, goteR, result, tempo, sente_form, gote_form, path_to_kif ) {
  var file_path_list= path_to_kif.split('/');
  var kif_file = file_path_list[file_path_list.length-1];
  var sfen_file = kif_file.substring(0,kif_file.lastIndexOf('.')) + '.sfen'
  var uri = "../kif-narabe/?kifu=../sc24/sfen/" + sfen_file + "&sente=" + sente + "(" + senteR + ")" + "&gote=" + gote + "(" + goteR + ")";
  return "<tr>"
        + "<td>" + date.replace(/(.*)-(.*)-(.*)-(.*)-(.*)-(.*)/,'$1/$2/$3 $4:$5:$6') + "</td>"
        + "<td>" + kisen + "</td>"
        + "<td class='" + ( result === '先手勝ち' ? "winner" : "loser" ) +  "'>" + sente + "(" + senteR + ")</td>"
        + "<td class='" + ( result === '後手勝ち' ? "winner" : "loser" ) +  "'>" + gote  + "(" + goteR  + ")</td>"
        + "<td>" + result + "(" + tempo + "手)</td>"
        + "<td>" + sente_form + "</td>"
        + "<td>" + gote_form  + "</td>"
        + "<td><a href='kif/" + kif_file + "'>棋譜</a></td>"
        + "<td><a href='" + encodeURI(uri) + "'>再生</a></td>"
        + "</tr>\n";
}

function search() {
  load_kif_table();
}

function reset_search () {
  document.getElementById('date_start').value = "1990-01-01";
  document.getElementById('date_end').value   = "9999-12-31";
  var ksn = document.getElementById('kisen').getElementsByTagName('input');
  for ( var i=0; i<ksn.length; ++i ) {
    ksn[i].checked = true;
  }
  document.getElementById('player1_sente').checked = true;
  document.getElementById('player1_any'  ).checked = false;
  document.getElementById('player1_name' ).value = "";
  document.getElementById('player1R_min' ).value = 0;
  document.getElementById('player1R_min' ).value = 9999;
  document.getElementById('player2_gote' ).checked = true;
  document.getElementById('player2_any'  ).checked = false;
  document.getElementById('player2_name' ).value = "";
  document.getElementById('player2R_min' ).value = 0;
  document.getElementById('player2R_min' ).value = 9999;
  var rslt = document.getElementById('result').getElementsByTagName('input');
  for ( var i=0; i<rslt.length; ++i ) {
    rslt[i].checked = true;
  }
  document.getElementById('tempo_end_min').value = 0;
  document.getElementById('tempo_end_max').value = 9999;
  document.getElementById('form1_sente').checked   = true;
  document.getElementById('form1_player1').checked = false;
  document.getElementById('form1').value           = "";
  document.getElementById('form2_gote').checked    = true;
  document.getElementById('form2_player2').checked = false;
  document.getElementById('form2').value           = "";
  search();
}

function filter_date ( date ) {
  // date
  var dt = new Date(date.replace(/(.*)-(.*)-(.*)-(.*)-(.*)-(.*)/,'$1/$2/$3 $4:$5:$6'));
  var dt_start = new Date(document.getElementById("date_start").value ? document.getElementById("date_start").value : "1900-01-01");
  var dt_end   = new Date(document.getElementById("date_end").value   ? document.getElementById("date_end").value   : "9999-12-31");
  if ( dt_start <= dt.getTime() && dt <= dt_end ) {
    return true;
  }
  return false;
}

function filter_kisen ( kisen ) {
  // kisen
  var ksn = document.getElementById('kisen').getElementsByTagName('input');
  var re="hoge"
  for ( var i=0; i<ksn.length; ++i ) {
    if ( ksn[i].checked ) {
      re += "|" + ksn[i].value;
    }
  }
  if ( kisen.match(new RegExp(re)) ) { 
    return true;
  }
  return false;
}

function filter_result ( result ) {
  // result
  var rslt = document.getElementById('result').getElementsByTagName('input');
  var re="hoge"
  var re_all="hoge"
  for ( var i=0; i<rslt.length; ++i ) {
    re_all += "|" + rslt[i].value;
    if ( rslt[i].checked ) {
      re += "|" + rslt[i].value;
    }
  }
  if ( result.match(new RegExp(re)) || !result.match(new RegExp(re_all)) && document.getElementById('result_other').checked ) { 
    return true;
  }
  return false;
}

function filter_tempo ( tempo ) {
  var min = 0;
  var max = 9999;
  if ( document.getElementById('tempo_end_min').value ) {
    min = document.getElementById('tempo_end_min').value - 0; // String -> number
  }
  if ( document.getElementById('tempo_end_max').value ) {
    max = document.getElementById('tempo_end_max').value - 0; // String -> number
  }
  return min <= tempo && tempo <= max;
}

function filter_player1 ( sente, gote, senteR, goteR ) {
  var name = document.getElementById('player1_name').value;
  var re = new RegExp( name ? name : ".*" );
  var min = 0;
  var max = 9999;
  if ( document.getElementById('player1R_min').value ) {
    min = document.getElementById('player1R_min').value - 0; // String -> number
  }
  if ( document.getElementById('player1R_max').value ) {
    max = document.getElementById('player1R_max').value - 0; // String -> number
  }

  if ( document.getElementById('player1_sente').checked ) {
    return sente.match(re) && min <= senteR && senteR <= max;
  }
  if ( document.getElementById('player1_any').checked ) {
    return sente.match(re) && min <= senteR && senteR <= max
        || gote.match(re) && min <= goteR && goteR <= max;
  }
  return false;
}

function filter_player2 ( sente, gote, senteR, goteR ) {
  var name = document.getElementById('player2_name').value;
  var re = new RegExp( name ? name : ".*" );
  var min = 0;
  var max = 9999;
  if ( document.getElementById('player2R_min').value ) {
    min = document.getElementById('player2R_min').value - 0; // String -> number
  }
  if ( document.getElementById('player2R_max').value ) {
    max = document.getElementById('player2R_max').value - 0; // String -> number
  }

  if ( document.getElementById('player2_gote').checked ) {
    return sente.match(re) && min <= senteR && senteR <= max;
  }
  if ( document.getElementById('player2_any').checked ) {
    return sente.match(re) && min <= senteR && senteR <= max
        || gote.match(re) && min <= goteR && goteR <= max;
  }
  return false;
}

function filter_form1 ( sente, gote, sente_form, gote_form ) {
  var form = "";
  var form1 = document.getElementById('form1').value.replace(';','|');
  var re = new RegExp( form1 ? form1 : ".*" );
  if ( document.getElementById('form1_sente').checked ) {
    form = sente_form;
  }
  if ( document.getElementById('form1_player1').checked ) {
    var name = document.getElementById('player1_name').value;
    var r = new RegExp( name ? name : ".*" );
    if ( sente.match(r) ) {
      form = sente_form;
    }
    if ( gote.match(r) ) {
      form = gote_form;
    }
  }
  return form.match(re);
}

function filter_form2 ( sente, gote, sente_form, gote_form ) {
  var form = "";
  var form2 = document.getElementById('form2').value.replace(';','|');
  var re = new RegExp( form2 ? form1 : ".*" );
  if ( document.getElementById('form2_gote').checked ) {
    form = gote_form;
  }
  if ( document.getElementById('form2_player2').checked ) {
    var name = document.getElementById('player2_name').value;
    var r = new RegExp( name ? name : ".*" );
    if ( sente.match(r) ) {
      form = sente_form;
    }
    if ( gote.match(r) ) {
      form = gote_form;
    }
  }
  return form.match(re);
}


function filter ( date, kisen, sente, senteR, gote, goteR, result, tempo, sente_form, gote_form, path_to_kif ) {
  if ( !filter_date ( date ) ) {
    return false;
  }
  if ( !filter_kisen ( kisen ) ) {
    return false;
  }
  // TODO implement search-by-rate
  if ( !filter_player1 ( sente, gote, senteR, goteR ) ) {
    return false;
  }
  if ( !filter_player2 ( sente, gote, senteR, goteR ) ) {
    return false;
  }
  if ( !filter_result ( result ) ) {
    return false;
  }
  if ( !filter_tempo ( tempo ) ) {
    return false;
  }
  if ( !filter_form1 ( sente, gote, sente_form, gote_form ) ) {
    return false;
  }
  // TODO form1
  // TODO form2
  return true;
}

function load_kif_table() {
  var main_table=document.getElementById("main_table");
  var thead_html = '<tr><td>日時</td><td>棋戦</td><td>先手(レート)</td><td>後手(レート)</td><td>勝敗(手数)</td><td>先手戦形</td><td>後手戦形</td><td>棋譜</td><td>再生</td></tr>\n';
  main_table.innerHTML= thead_html;
  var kif_table=document.getElementById("kif_table");
  var text = kif_table.value.replace(/\r\n|\r/g,"\n");
  var lines = text.split('\n');
  var tbody_html = ""
  var start = 0;
  var end = lines.length;
  var recently = document.getElementById('recently');
  if ( _GET['recently'] ) {
    recently.checked = ( _GET['recently'].toString().toLowerCase() === 'true' );
  }
  var count = 0;
  for ( var i=0; i<lines.length; ++i ) {
    if ( !lines[i] 
       || recently.checked && ( count > 30 )
    ) {
      continue;
    }
    //    0,    1,    2,          3,    4,          5,    6,    7,        8         9,                10
    // 日時, 棋戦, 先手, 先手レート, 後手, 後手レート, 勝敗, 手数, 先手戦形, 後手戦形, http://url/to/kif
    var tmp = lines[i].split(',');
    if ( !filter(tmp[0],tmp[1],tmp[2],tmp[3],tmp[4],tmp[5],tmp[6],tmp[7],tmp[8],tmp[9],tmp[10]) ) {
      continue;
    }
    tbody_html += generate_tbody(tmp[0],tmp[1],tmp[2],tmp[3],tmp[4],tmp[5],tmp[6],tmp[7],tmp[8],tmp[9],tmp[10]);
    count++;
  }
  main_table.innerHTML += tbody_html;
}

function recently() {
  _GET['recently'] = "" + document.getElementById('recently').checked;
  get2url();
  load_kif_table();
}



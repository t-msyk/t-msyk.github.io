// Copyright (c) 2020 tMasayuki. All rights reserved.

function dummy () {
}

function onload () {
  notice_unsupported_browser();
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
  var kif_id = kif_file.substring(0,kif_file.lastIndexOf('.'))
  var uri = "kifplay.html?kif_id=" + kif_id;
  return "<tr>"
        + "<td>" + date.replace(/(.*)-(.*)-(.*)-(.*)-(.*)-(.*)/,'$1/$2/$3 $4:$5:$6') + "</td>"
        + "<td>" + kisen + "</td>"
        + "<td class='" + ( result === '先手勝ち' ? "winner" : "loser" ) +  "' onclick='set_username(\"" + sente + "\")'>" + sente + "(" + senteR + ")</td>"
        + "<td class='" + ( result === '後手勝ち' ? "winner" : "loser" ) +  "' onclick='set_username(\"" + gote  + "\")'>" + gote  + "(" + goteR  + ")</td>"
        + "<td>" + result + "(" + tempo + "手)</td>"
        + "<td>" + sente_form + "</td>"
        + "<td>" + gote_form  + "</td>"
        + "<td><a href='kifview.html?kif=kif/" + kif_file + "'>棋譜</a></td>"
        + "<td><a href='" + encodeURI(uri) + "'>再生</a></td>"
        + "</tr>\n";
}

function search() {
  load_kif_table();
}

function reset_search () {
  document.getElementById('username').value = "";
  delete _GET['username'];
  document.getElementById('form').value     = "";
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
  document.getElementById('player1R_max' ).value = 9999;
  document.getElementById('player2_gote' ).checked = true;
  document.getElementById('player2_any'  ).checked = false;
  document.getElementById('player2_name' ).value = "";
  document.getElementById('player2R_min' ).value = 0;
  document.getElementById('player2R_max' ).value = 9999;
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
  get2url();
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

function download_kif ( kif_url ) {
  var kif_url_list = kif_url.toString().split('/');
  var kif_file = kif_url_list[kif_url_list.length - 1];
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.download = kif_file;
  a.href = kif_url;
  a.click();
  document.body.removeChild(a);
}

function download_kif_all () {
  var tr_list=document.getElementById("main_table").getElementsByTagName('tr');
  var yes = window.confirm((tr_list.length-1) + "kif file will be downloaded.\nAre you sure continue?");
  if ( !yes ) return;
  var download_interval = 2000;
  var i = 1;
  var id = setInterval( function () {
  var kif = tr_list[i++].getElementsByTagName('td')[7].innerHTML.match(/kifview.html\?kif=(.*\.kif)/)[1];
    download_kif(kif);
    if ( i >= tr_list.length ) {
      clearInterval(id);
    }
  },download_interval);
}

function filter_kisen ( kisen ) {
  // kisen
  var ksn = document.getElementById('kisen').getElementsByTagName('input');
  var re="hoge"
  for ( var i=0; i<ksn.length; ++i ) {
    if ( ksn[i].checked ) {
      re += "|R対局\\\(" + ksn[i].value + '\\\)';
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

function filter_username_form ( sente, gote, sente_form, gote_form ) {
  var name = document.getElementById('username').value;
  var form = document.getElementById('form').value;
  //var re_name = new RegExp( name ? "^" + name +"$" : ".*" );
  var vs = false;
  if ( form.match(/^vs/) ) {
    vs = true;
    var tmp = form.replace(/^vs/,"");
    form = tmp;
  }
  var re_form = new RegExp( form ? "^" + form +";" + "|;" + form + ";" : ".*" );
  if ( form === 'その他' ) re_form = new RegExp ( "^$" );
  var ret=false;
  if ( sente.indexOf(name) >= 0 ) {
    ret = ret || (vs ? gote_form.match(re_form)  : sente_form.match(re_form) );
  }
  if ( gote.indexOf(name) >= 0 ) {
    ret = ret || (vs ? sente_form.match(re_form) : gote_form.match(re_form) );
  }
  return ret;
}

function set_form ( form ) {
  document.getElementById('form').value = form;
  formatin();
}

function set_kisen ( kisen ) {
  var ksn = document.getElementById('kisen').getElementsByTagName('input');
  if ( kisen ) {
    for ( var i=0; i<ksn.length; ++i ) {
      ksn[i].checked = ('R対局(' + ksn[i].value + ')' === kisen);
    }
  } else {
    for ( var i=0; i<ksn.length; ++i ) {
      ksn[i].checked = true;
    }
  }
  load_kif_table();
}

function set_username ( uname ) {
  document.getElementById('username').value = uname;
  username();
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
  // TODO implement search-by-rate
  return filter_username_form ( sente, gote, sente_form, gote_form ) 
      && filter_date ( date )
      && filter_kisen ( kisen )
      &&filter_player1 ( sente, gote, senteR, goteR )
      &&filter_player2 ( sente, gote, senteR, goteR )
      &&filter_result ( result )
      &&filter_tempo ( tempo )
      &&filter_form1 ( sente, gote, sente_form, gote_form )
      &&filter_form2 ( sente, gote, sente_form, gote_form );
}

function take_form_stat ( userstat, turn, form, result ) {
  userstat['合計'][turn][result] += 1;
  var form_list = form.toString().split(';');
  if ( !form ) form_list = ['その他'];
  for ( var j=0; j<form_list.length; ++j ) {
    if ( !form_list[j] ) continue;
    if ( !userstat[form_list[j]] ) {
      userstat[form_list[j]] = {先手:{win:0,lose:0},後手:{win:0,lose:0}};
    }
    userstat[form_list[j]][turn][result] += 1;
  }
}

function take_statistics ( user, date, kisen, sente, senteR, gote, goteR, result, tempo, sente_form, gote_form, path_to_kif ) {
  var player = [ sente,      gote     ];
  var form   = [ sente_form, gote_form];
  var turn   = [ "先手",     "後手"   ];
  var h=(date.split('-')[3]-0) + "時";
  for ( i=0; i<2; ++i ) {
    if ( player[i].indexOf(user.name) < 0 ) continue;
    if ( !result.match(/勝ち/) ) continue;
    var user_result = result.indexOf( turn[i] + "勝ち" ) !== -1 ? 'win' : 'lose';
    take_form_stat(user.statistics.myform,turn[i],form[i  ],user_result);
    take_form_stat(user.statistics.vsform,turn[i],form[1-i],user_result);
    if ( !user.statistics.kisen[kisen] ) {
      user.statistics.kisen[kisen] = {先手:{win:0,lose:0},後手:{win:0,lose:0}};
    }
    user.statistics.kisen[kisen][turn[i]][user_result] +=1;
    user.statistics.kisen['合計'][turn[i]][user_result] +=1;
    user.statistics.time[h][turn[i]][user_result] += 1;
    user.statistics.time['合計'][turn[i]][user_result] += 1;
    today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    date_diff = Math.floor(( Date.now() - new Date(date.replace(/(.*)-(.*)-(.*)-(.*)-(.*)-(.*)/,'$1/$2/$3')).getTime() ) / 86400000);
    if ( date_diff <= user.statistics.date.length ) {
      user.statistics.date[date_diff] += 1;
    }
  }
}


function create_date_table ( date_stat ) {
  var wday  = new Date().getDay();
  var table = document.createElement('table');
  var border_style = 'thin solid white';
  table.style.border = border_style;
  for ( var i=0; i<7; ++i ) {
    var tr = document.createElement('tr');
    tr.style.border = border_style;
    for ( var j=0; j<52; ++j ) {
      var td = document.createElement('td');
      td.style.border = border_style;
      td.style.width  = '8px'
      td.style.height = '8px'
      tr.appendChild(td);
      var r=255;
      var g=255;
      var b=255;
      if ( i <= wday || j !== 51 ) {
        var gray_base = 240;
        var ratio = gray_base / (_GET['username'] ? 5 : 20 ); 
        var cnt =  date_stat[(51-j)*7+(wday-i)];
        r = b = Math.floor( gray_base - ratio   * cnt );
        g =     Math.floor( gray_base - ratio/2 * cnt );
        if ( r < 0 ) { r = 0; }
        if ( g < 0 ) { g = 0; }
        if ( b < 0 ) { b = 0; }
        if ( cnt === 0 ) { r = g = b = gray_base; }
      }
      td.style.backgroundColor = "rgb("+ r + "," + g + "," + b + ")";
    }
    table.appendChild(tr);
  }
  return table;
}

function generate_color ( win, lose ) {
  var w = win  - 0;
  var l = lose - 0;
  var rate = w  / ( w + l );
  var r = 1.0;
  var g = 1.0;
  var b = 1.0;
  if ( w > l ) {
    //r = 1 - ( rate - 0.5 );
    //g = 1 - ( rate - 0.5 );
  } else {
    g = 1.0 - ( 0.5 - rate );
    b = 1.0 - ( 0.5 - rate );
  }
  if ( w + l === 0 ) {
    r = g = b = 1.0;
  }
  return "rgb(" + Math.floor(r*255) + "," + Math.floor(g*255) +"," + Math.floor(b*255) + ")";
}

function create_hist_table ( time_stat ) {
  var table = document.createElement('table');
  var border_style = 'thin solid black';
  table.style.border = border_style;
  // thead
  var tr = document.createElement('tr');
  tr.style.border = border_style;
  for ( var txt of ['対局開始時刻','先手(勝/敗)','後手(勝/敗)','合計(勝/敗)'] ) {
    var td = document.createElement('td');
    td.textContent = txt;
    td.style.border = border_style;
    tr.appendChild(td);
  }
  table.appendChild(tr);
  // tbody
  var form_array = [];
  for ( var i = 0; i<24; ++i ) {
    form_array.push(i+"時");
  }
  form_array.push("合計");
  for ( var i=0; i<form_array.length; ++i ) {
    var form = form_array[i];
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    tr.style.border = border_style;
    td.style.border = border_style;
    td.textContent = form;
    tr.appendChild(td);
    var sente_win  = time_stat[form]['先手'].win;
    var sente_lose = time_stat[form]['先手'].lose;
    var gote_win   = time_stat[form]['後手'].win;
    var gote_lose  = time_stat[form]['後手'].lose;
    var win  = sente_win  + gote_win;
    var lose = sente_lose + gote_lose;
    tr.style.backgroundColor = generate_color(win,lose);
    for ( var rslt of 
      [
        [ sente_win , sente_lose],
        [ gote_win  , gote_lose ],
        [ win       , lose      ]
      ]
    ) {
      var td = document.createElement('td');
      td.textContent = rslt[0] + "/" + rslt[1];
      td.style.border = border_style;
      td.style.backgroundColor = generate_color(rslt[0],rslt[1]);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function create_kisen_table ( kisen_stat ) {
  var table = document.createElement('table');
  var border_style = 'thin solid black';
  table.style.border = border_style;
  // thead
  var tr = document.createElement('tr');
  tr.style.border = border_style;
  for ( var txt of ['棋戦','先手(勝/敗)','後手(勝/敗)','合計(勝/敗)'] ) {
    var td = document.createElement('td');
    td.textContent = txt;
    td.style.border = border_style;
    tr.appendChild(td);
  }
  table.appendChild(tr);
  // tbody
  var kisen_array = [];
  for ( var kisen in kisen_stat ) {
    kisen_array.push(kisen);
  }
  // total is last row
  for ( var i=0; i<kisen_array.length; ++i ) {
    if ( kisen_array[i] === '合計' ) {
      kisen_array[i] = kisen_array[kisen_array.length-1];
      kisen_array[kisen_array.length-1] = '合計';
    }
  }
  // sort kisen
  for ( var i=0; i<kisen_array.length - 1; ++i ) {
    var kisen = kisen_array[i];
    var score_min = + kisen_stat[kisen]['先手'].win
                    - kisen_stat[kisen]['先手'].lose
                    + kisen_stat[kisen]['後手'].win
                    - kisen_stat[kisen]['後手'].lose;
    var min_idx = i;
    for ( var j=i+1; j<kisen_array.length - 2; ++j ) {
       var score = + kisen_stat[kisen_array[j]]['先手'].win
                   - kisen_stat[kisen_array[j]]['先手'].lose
                   + kisen_stat[kisen_array[j]]['後手'].win
                   - kisen_stat[kisen_array[j]]['後手'].lose;
      if ( score_min > score ) {
        score_min = score;
        min_idx = j;
      }
    }
    var tmp = kisen_array[i];
    kisen_array[i] = kisen_array[min_idx];
    kisen_array[min_idx] = tmp;
  }
  // add tr
  for ( var i=0; i<kisen_array.length; ++i ) {
    var kisen = kisen_array[i];
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    tr.style.border = border_style;
    td.textContent = kisen;
    td.style.border = border_style;
    if ( kisen === '合計' ) {
      td.onclick=function () { set_kisen(''); }
    } else {
      td.onclick=function () { set_kisen(this.innerHTML); }
    }
    tr.appendChild(td);
    var sente_win  = kisen_stat[kisen]['先手'].win;
    var sente_lose = kisen_stat[kisen]['先手'].lose;
    var gote_win   = kisen_stat[kisen]['後手'].win;
    var gote_lose  = kisen_stat[kisen]['後手'].lose;
    var win  = sente_win  + gote_win;
    var lose = sente_lose + gote_lose;
    tr.style.backgroundColor = generate_color(win,lose);
    for ( var rslt of 
      [
        [ sente_win , sente_lose],
        [ gote_win  , gote_lose ],
        [ win       , lose      ]
      ]
    ) {
      var td = document.createElement('td');
      td.textContent = "" + rslt[0] + "/" + rslt[1];
      td.style.border = border_style;
      td.style.backgroundColor = generate_color(rslt[0],rslt[1]);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function create_form_table ( form_stat, form_prefix ) {
  var table = document.createElement('table');
  var border_style = 'thin solid black';
  table.style.border = border_style;
  // thead
  var tr = document.createElement('tr');
  tr.style.border = border_style;
  for ( var txt of ['戦形','先手(勝/敗)','後手(勝/敗)','合計(勝/敗)'] ) {
    var td = document.createElement('td');
    td.textContent = txt;
    td.style.border = border_style;
    tr.appendChild(td);
  }
  table.appendChild(tr);
  // tbody
  var form_array = [];
  for ( var form in form_stat ) {
    form_array.push(form);
  }
  // total is last row
  for ( var i=0; i<form_array.length; ++i ) {
    if ( form_array[i] === '合計' ) {
      form_array[i] = form_array[form_array.length-1];
      form_array[form_array.length-1] = '合計';
    }
  }
  // other is 2nd-last row
  for ( var i=0; i<form_array.length; ++i ) {
    if ( form_array[i] === 'その他' ) {
      form_array[i] = form_array[form_array.length-2];
      form_array[form_array.length-2] = 'その他';
    }
  }
  // sort form
  for ( var i=0; i<form_array.length - 2; ++i ) {
    var form = form_array[i];
    var score_min = + form_stat[form]['先手'].win
                    - form_stat[form]['先手'].lose
                    + form_stat[form]['後手'].win
                    - form_stat[form]['後手'].lose;
    var min_idx = i;
    for ( var j=i+1; j<form_array.length - 2; ++j ) {
       var score = + form_stat[form_array[j]]['先手'].win
                   - form_stat[form_array[j]]['先手'].lose
                   + form_stat[form_array[j]]['後手'].win
                   - form_stat[form_array[j]]['後手'].lose;
      if ( score_min > score ) {
        score_min = score;
        min_idx = j;
      }
    }
    var tmp = form_array[i];
    form_array[i] = form_array[min_idx];
    form_array[min_idx] = tmp;
  }
  // add tr
  for ( var i=0; i<form_array.length; ++i ) {
    var form = form_array[i];
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    tr.style.border = border_style;
    td.textContent = form_prefix + form;
    td.style.border = border_style;
    if ( form === '合計' ) {
      td.onclick=function () { set_form(''); }
    } else {
      td.onclick=function () { set_form(this.innerHTML); }
    }
    tr.appendChild(td);
    var sente_win  = form_stat[form]['先手'].win;
    var sente_lose = form_stat[form]['先手'].lose;
    var gote_win   = form_stat[form]['後手'].win;
    var gote_lose  = form_stat[form]['後手'].lose;
    var win  = sente_win  + gote_win;
    var lose = sente_lose + gote_lose;
    tr.style.backgroundColor = generate_color(win,lose);
    for ( var rslt of 
      [
        [ sente_win , sente_lose],
        [ gote_win  , gote_lose ],
        [ win       , lose      ]
      ]
    ) {
      var td = document.createElement('td');
      td.textContent = "" + rslt[0] + "/" + rslt[1];
      td.style.border = border_style;
      td.style.backgroundColor = generate_color(rslt[0],rslt[1]);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function draw_table ( id, table ) {
  document.getElementById(id).innerHTML = "";
  document.getElementById(id).appendChild(table);
}

function draw_statistics ( user ) {
  document.getElementById("statistics_title").innerHTML 
    = ( user.name ? user.name + "さん" : "全ユーザ" ) + "の集計";
  draw_table("statistics_table"   ,create_form_table(user.statistics.myform,""  ));
  draw_table("vs_statistics_table",create_form_table(user.statistics.vsform,"vs"));
  draw_table("time_histgram",create_hist_table(user.statistics.time));
  draw_table("date_table",create_date_table(user.statistics.date));
  draw_table("kisen_table",create_kisen_table(user.statistics.kisen));
}

function draw_time_histgram ( time_stat ) {
  var canvas = document.getElementById('hist_canvas');
  var offset={x:10,y:10};
  var size = {w:20,h:3};
  var max_cnt = 0;
  for ( var i=0; i<24; ++i ) {
    var cnt_w = time_stat[i+"時"]["先手"].win - 0
              + time_stat[i+"時"]["後手"].win - 0;
    var cnt_l = time_stat[i+"時"]["先手"].lose - 0
              + time_stat[i+"時"]["後手"].lose - 0;
    if ( max_cnt < cnt_w + cnt_l ) {
      max_cnt = cnt_w + cnt_l
    }
  }
  canvas.width=2*offset.x + size.w*24 + 3;
  canvas.height=2*offset.y + max_cnt*size.h;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect( 0,0, canvas.width, canvas.height );
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'gray';
  ctx.fillRect( offset.x, offset.y , size.w*24+3, max_cnt*size.h );
  for ( var i=0; i<24; ++i ) {
    var cnt_w = time_stat[i+"時"]["先手"].win - 0
              + time_stat[i+"時"]["後手"].win - 0;
    var cnt_l = time_stat[i+"時"]["先手"].lose - 0
              + time_stat[i+"時"]["後手"].lose - 0;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'blue';
    ctx.fillRect( offset.x + size.w*i + Math.floor(i/6), offset.y + size.h*(max_cnt-cnt_w-cnt_l), size.w, cnt_w*10 );
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect( offset.x + size.w*i + Math.floor(i/6), offset.y + size.h*(max_cnt-cnt_l), size.w, cnt_l*10 );
  }
  // draw lines
  for ( var i=5; i<max_cnt; i+=5 ) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect( offset.x , offset.y + size.h*(max_cnt-i), 24*size.w + 3, 1 );
  }
  for ( var i=10; i<max_cnt; i+=10 ) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect( offset.x , offset.y + size.h*(max_cnt-i), 24*size.w + 3, 2 );
  }
  for ( var i=6; i<24; i+=6 ) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect( offset.x + size.w*i + Math.floor(i/6)-1, offset.y, 1, size.h*max_cnt );
  }
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
  var user = { 
    name   : '',
    statistics : {
      myform :{ 合計:{先手:{win:0,lose:0},後手:{win:0,lose:0}},
                その他:{先手:{win:0,lose:0},後手:{win:0,lose:0}}},
      vsform :{ 合計:{先手:{win:0,lose:0},後手:{win:0,lose:0}},
                その他:{先手:{win:0,lose:0},後手:{win:0,lose:0}}},
      kisen :{ 合計:{先手:{win:0,lose:0},後手:{win:0,lose:0}}},
      time : { 合計:{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '0時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '1時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '2時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '3時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '4時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '5時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '6時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '7時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '8時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
              '9時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '10時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '11時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '12時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '13時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '14時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '15時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '16時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '17時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '18時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '19時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '20時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '21時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '22時':{先手:{win:0,lose:0},後手:{win:0,lose:0}},
             '23時':{先手:{win:0,lose:0},後手:{win:0,lose:0}}
      },
      date : []
    }
  };
  user.statistics.date.length = 512;
  for ( var i=0; i<user.statistics.date.length; ++i ) {
    user.statistics.date[i] = 0;
  }
  if ( _GET['recently'] ) {
    recently.checked = ( _GET['recently'].toString().toLowerCase() === 'true' );
  }
  if ( _GET['username'] ) {
    document.getElementById('username').value = _GET['username'];
  }
  user['name'] = document.getElementById('username').value;
  var count = 0;
  for ( var i=0; i<lines.length; ++i ) {
    if ( !lines[i] ) {
      continue;
    }
    if ( recently.checked && ( count >= 30 )) {
      break;
    }
    //    0,    1,    2,          3,    4,          5,    6,    7,        8         9,                10
    // 日時, 棋戦, 先手, 先手レート, 後手, 後手レート, 勝敗, 手数, 先手戦形, 後手戦形, http://url/to/kif
    var tmp = lines[i].split(',');
    if ( !filter(tmp[0],tmp[1],tmp[2],tmp[3],tmp[4],tmp[5],tmp[6],tmp[7],tmp[8],tmp[9],tmp[10]) ) {
      continue;
    }
    var h=(tmp[0].split('-')[3]-0) + "時";
    take_statistics(user   ,tmp[0],tmp[1],tmp[2],tmp[3],tmp[4],tmp[5],tmp[6],tmp[7],tmp[8],tmp[9],tmp[10]);
    tbody_html += generate_tbody(tmp[0],tmp[1],tmp[2],tmp[3],tmp[4],tmp[5],tmp[6],tmp[7],tmp[8],tmp[9],tmp[10]);
    count++;
  }
  main_table.innerHTML += tbody_html;
  draw_statistics( user );
  draw_time_histgram ( user.statistics.time ) ;
}

function recently() {
  _GET['recently'] = "" + document.getElementById('recently').checked;
  get2url();
  load_kif_table();
}

function username() {
  _GET['username'] = "" + document.getElementById('username').value;
  if ( !_GET['username'] ) {
    delete _GET['username'];
  }
  get2url();
  load_kif_table();
}

function formatin() {
  load_kif_table();
}


// Copyright (c) 2020 tMasayuki. All rights reserved.
var sfen_list = [];
var tag_list = [];
var evaluation_value_list = [];
var recommended_move_list = [];
function dummy () {
}

function onload () {
  if ( _GET['kifu'] ) {
    var Kifu = document.getElementById("Kifu");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', _GET['kifu'], true);
    xhr.onload = function () {
      Kifu.innerHTML = xhr.responseText;
      load_sfen();
    }
    xhr.send();
  } else {
    load_sfen();
  }
}


function printGetParameters () {
  for ( var key in _GET ) {
    console.log ( "" + key + " : " + _GET[key] );
  }
}
function go_to_start () {
  document.getElementById("Kifu_list").value = 0;
  draw();
}
function prev () {
  var v = document.getElementById("Kifu_list").value - 1;
  document.getElementById("Kifu_list").value = v < 0 ? 0 : v;
  draw();
}
function next () {
  var v = document.getElementById("Kifu_list").value - 0 + 1;
  document.getElementById("Kifu_list").value = 
    v > sfen_list.length - 1 ? sfen_list.length - 1 : v;
  draw();
}
function go_to_end () {
  document.getElementById("Kifu_list").value = sfen_list.length - 1;
  draw();
}
function go_at ( tempo ) {
  if ( tempo < 0 ) tempo = 0;
  if ( tempo > sfen_list.length -1 ) tempo = sfen_list.length -1;
  document.getElementById("Kifu_list").value = tempo;
  draw();
}

function reversal () {
  draw();
}

function draw () {
  var selected = document.getElementById("Kifu_list").value;
  var reversal = document.getElementById("reversal").checked;
  var get_param_string = '';
  draw_sfen(sfen_list[selected]);
  _GET['tempo'] = selected;
  _GET['reversal'] = "" + reversal;
  for ( var key in _GET ) {
    if ( get_param_string === '' ) {
      get_param_string += '?' + key + '=' + _GET[key];
    } else {
      get_param_string += '&' + key + '=' + _GET[key];
    }
  }
  // TODO which is better ?
  //window.history.pushState(null, null, get_param_string);
  window.history.replaceState(null, null, get_param_string);
}

function draw_board ( board ) {
  var reversal = document.getElementById('reversal').checked;
  var extended_board = board.replace(/9/g,"_________")
                            .replace(/8/g,"________")
                            .replace(/7/g,"_______")
                            .replace(/6/g,"______")
                            .replace(/5/g,"_____")
                            .replace(/4/g,"____")
                            .replace(/3/g,"___")
                            .replace(/2/g,"__")
                            .replace(/1/g,"_");
  var board_array = extended_board.split('');
  var r=1, c=1;
  for ( var i = 0; i<board_array.length; ++i ) {
    var ch = board_array[i];
    var prefix = "";
    var target=document.getElementById( reversal ? "" + (10-r) + (10-c) : ""  + r + c );
    if ( ch === "/" ) {
      ++r;
      c=1;
      continue;
    }
    if ( ch === "+" ) {
      prefix = "+"
      ch = board_array[++i];
    }
    if ( ch === "_" ) {
      ch = "";
    }
    if ( ch.match(/[KRBGSNLP]/) ) {
      target.style.transform = reversal ? "rotate(180deg)" : "rotate(0deg)";
    }
    if ( ch.match(/[krbgsnlp]/) ) {
      target.style.transform = reversal ? "rotate(0deg)" : "rotate(180deg)";
    }
    target.innerHTML 
        = ( prefix + ch ) .replace(/k/,"K")
                          .replace(/r/,"R")
                          .replace(/b/,"B")
                          .replace(/g/,"G")
                          .replace(/s/,"S")
                          .replace(/n/,"N")
                          .replace(/l/,"L")
                          .replace(/p/,"P")
                          .replace(/K/,"玉")
                          .replace(/\+R/,"龍")
                          .replace(/R/,"飛")
                          .replace(/\+B/,"馬")
                          .replace(/B/,"角")
                          .replace(/G/,"金")
                          .replace(/\+S/,"全")
                          .replace(/S/,"銀")
                          .replace(/\+N/,"圭")
                          .replace(/N/,"桂")
                          .replace(/\+L/,"杏")
                          .replace(/L/,"香")
                          .replace(/\+P/,"と")
                          .replace(/P/,"歩")
    ++c;
  }
  //console.log(extended_board);
}

function draw_hand ( hand ) {
  var reversal = document.getElementById('reversal').checked;
  var whand=hand.replace(/(\d*K)*(\d*R)*(\d*B)*(\d*G)*(\d*S)*(\d*N)*(\d*L)*(\d*P)*/g,"")
      .replace(/(\d*)p/,'歩$1')
      .replace(/(\d*)l/,'香$1')
      .replace(/(\d*)n/,'桂$1')
      .replace(/(\d*)s/,'銀$1')
      .replace(/(\d*)g/,'金$1')
      .replace(/(\d*)b/,'角$1')
      .replace(/(\d*)r/,'飛$1')
      .replace(/(\d*)k/,'玉$1');
  var bhand=hand.replace(/(\d*k)*(\d*r)*(\d*b)*(\d*g)*(\d*s)*(\d*n)*(\d*l)*(\d*p)*/g,"")
      .replace(/(\d*)P/,'歩$1')
      .replace(/(\d*)L/,'香$1')
      .replace(/(\d*)N/,'桂$1')
      .replace(/(\d*)S/,'銀$1')
      .replace(/(\d*)G/,'金$1')
      .replace(/(\d*)B/,'角$1')
      .replace(/(\d*)R/,'飛$1')
      .replace(/(\d*)K/,'玉$1');
  var sente = "" 
  if ( _GET['sente'] ) sente=_GET['sente'] ;
  var gote  = "" 
  if ( _GET['gote']  ) gote=_GET['gote'] ;
  if ( reversal ) {
    document.getElementById("black_hand").innerHTML = "△" + gote  + ":" + whand;
    document.getElementById("white_hand").innerHTML = "▲" + sente + ":" + bhand;
  } else {
    document.getElementById("white_hand").innerHTML = "△" + gote  + ":" + whand;
    document.getElementById("black_hand").innerHTML = "▲" + sente + ":" + bhand;
  }
}

function draw_sfen ( sfen ) {
  var tmp = sfen.split(' ');
  var board = tmp[0];
  var turn  = tmp[1];
  var hand  = tmp[2];
  var tempo = tmp[3];
  //console.log("board:"+board);
  draw_board(board);
  document.getElementById("turn").innerHTML = (turn==="b")?"先手番":"後手番";
  //console.log("hand :"+hand);
  draw_hand(hand);
  document.getElementById("tempo").innerHTML = ( tempo -1 ) + "手目";
}

function load_sfen() {
  var Kifu_list=document.getElementById("Kifu_list");
  Kifu_list.innerHTML='';
  var Kifu=document.getElementById("Kifu");
  var text = Kifu.value.replace(/\r\n|\r/g,"\n");
  var lines = text.split('\n');
  for ( var i=0; i<lines.length-1; ++i ) {
    if ( !lines[i] ) {
      continue;
    }
    var tmp = lines[i].split(',');
    var tag = tmp[0];
    var sfen = tmp[1];
    var evaluation_value = tmp[2];
    var recommended_move = tmp[3];
    //console.log("tag:"+tag);
    //console.log("sfen:"+sfen);
    Kifu_list.innerHTML += "<option value=\""+i+"\">"+tag+"</option>\n";
    sfen_list[i] = sfen;
    tag_list[i] = tag;
    evaluation_value_list[i] = evaluation_value;
    recommended_move_list[i] = recommended_move;
  }
  if ( _GET['reversal'] ) {
    document.getElementById('reversal').checked = ( _GET['reversal'].toString().toLowerCase() === 'true' );
  }
  if ( _GET['tempo'] ) {
    go_at(Number(_GET['tempo']));
  }
  draw();
  //console.log(Kifu.value);
}

function board_on_click ( obj,e ) {
  var targetRectangle = obj.getBoundingClientRect() ;
  var x = e.pageX - ( targetRectangle.left + window.pageXOffset );
  var w = targetRectangle.width;
  if ( 2 * x > w ) {
    // right half
    next();
  } else {
    // left half
    prev();
  }
}


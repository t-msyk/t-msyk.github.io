// Copyright (c) 2020 Masayuki Tamura. All rights reserved.
var sfen_list = [];
var tag_list = [];
function search () {
  search_word_list = document.getElementById("search").value.split(/\s+/);
  var form_list=document.getElementById("form_list");
  form_list.innerHTML = ""
  for ( var i=0; i<sfen_list.length; ++i ) {
    for ( var j=0; j<search_word_list.length; ++j ) {
      var search_word = search_word_list[j];
      // FIXME unsafe? need to escape?
      var regexp = new RegExp(".*" + search_word + ".*",'g');
      if ( tag_list[i].match(regexp) ) {
        form_list.innerHTML += "<option value=\""+i+"\">"+tag_list[i]+"</option>\n";
        continue;
      }
    }
  }
}
function draw () {
  var selected = document.getElementById("form_list").value;
  draw_sfen(sfen_list[selected]);
  console.log(selected);
}
function draw_board ( board ) {
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
      document.getElementById(""+r+c).style.transform="rotate(0deg)";
    }
    if ( ch.match(/[krbgsnlp]/) ) {
      document.getElementById(""+r+c).style.transform="rotate(180deg)";
    }
    document.getElementById(""+r+c).innerHTML 
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
  console.log(extended_board);
}
function draw_hand ( hand ) {
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
  document.getElementById("white_hand").innerHTML = "△"+whand;
  document.getElementById("black_hand").innerHTML = "▲"+bhand;
}
function draw_sfen ( sfen ) {
  var tmp = sfen.split(' ');
  var board = tmp[0];
  var turn  = tmp[1];
  var hand  = tmp[2];
  var tempo = tmp[3];
  console.log("board:"+board);
  draw_board(board);
  document.getElementById("turn").innerHTML = (turn==="b")?"先手番":"後手番";
  console.log("hand :"+hand);
  draw_hand(hand);
  document.getElementById("tempo").innerHTML = tempo + "手目";
}
function load_defform() {
  var form_list=document.getElementById("form_list");
  form_list.innerHTML='';
  var defform=document.getElementById("defform");
  var text = defform.value.replace(/\r\n|\r/g,"\n");
  var lines = text.split('\n');
  for ( var i=0; i<lines.length; ++i ) {
    if ( lines[i] == '' ) {
      continue;
    }
    var tmp = lines[i].split(',');
    var tag = tmp[0];
    var sfen = tmp[1];
    //console.log("tag:"+tag);
    //console.log("sfen:"+sfen);
    form_list.innerHTML += "<option value=\""+i+"\">"+tag+"</option>\n";
    sfen_list[i] = sfen;
    tag_list[i] = tag;
  }
  draw();
  //console.log(defform.value);
}

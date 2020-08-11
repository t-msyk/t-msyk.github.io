// Copyright (c) 2020 tMasayuki. All rights reserved.

var timer = null;
var time_limit     = 0;
var time_remaining = 0;
var score = 0;

function onload () {
  init_progress_bar();
}

function init_progress_bar () {
  var canvas = document.getElementById('progress_bar');
  canvas.width  = 128;
  canvas.height =  20;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'gray';
  ctx.fillRect( 0,0, canvas.width, canvas.height );
}

function draw_progress_bar ( ratio ) {
  init_progress_bar();
  var canvas = document.getElementById('progress_bar');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'orange';
  ctx.fillRect( 0, 0, canvas.width*ratio, canvas.height );
}

function startNewGame () {
  if ( timer ) gameOver();
  document.getElementById('score').innerHTML = 'Score : ' + (score=0);
  time_remaining = time_limit = 100;
  create_binary_sequence();
  startTimer();
}

function startTimer () {
  timer = setInterval ( function(){
    if ( time_remaining > 0 ) {
      time_remaining--;
      draw_progress_bar(time_remaining/time_limit);
    } else {
      gameOver();
    }
  },100 );
}

function stopTimer () {
  clearInterval(timer);
}

function gameOver () {
  document.getElementById('score').innterHTML = score;
  stopTimer();
  timer = null;
  OK = nop;
  NG = nop;
  document.getElementById('binary_sequence').innerHTML = 'Game Over';
}

function create_binary_sequence () {
  var bsq='';
  var isEven = true;
  if ( document.getElementById("Odd" ).checked ) isEven = false;
  if ( document.getElementById("Even").checked ) isEven = true;
  for ( var i=0; i<9; ++i ) {
    var rnd = Math.round ( Math.random() );
    if ( rnd === 1 ) isEven = !isEven;
    bsq += rnd;
  }
  document.getElementById('binary_sequence').innerHTML = bsq;
  if ( isEven ) {
    OK = correct;
    NG = wrong;
  } else {
    NG = correct;
    OK = wrong;
  }
}

function correct () {
  stopTimer();
  document.getElementById('score').innerHTML = 'Score : ' + ++score;
  time_limit = time_limit/2 + 10;
  time_remaining = time_limit;
  draw_progress_bar(time_remaining/time_limit);
  create_binary_sequence();
  startTimer();
}

function wrong () {
  gameOver();
}

function nop () {
}

var OK = nop;

var NG = nop;



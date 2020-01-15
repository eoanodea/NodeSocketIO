/*
 * --------------------
 * Author Name: Eoan O'Dea
 * Author Email: eoan@wspace.ie
 * Date Created: Wednesday January 15th 2020 4:11:47 pm
 * --------------------
 * Project Name: socket-click
 * Version: 1.0.0
 * --------------------
 * File Name: script.js
 * Last Modified: Wednesday January 15th 2020 4:17:59 pm
 * --------------------
 * Copyright (c) 2020 WebSpace
 * --------------------
 */

var x = 0;
var y = 0;
var dy = 5;
var dx = 5;
var WIDTH = 600;
var HEIGHT = 600;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

//store the x, y pos of all players
var players = {};

var socket = io.connect();

socket.on('connect', function() {
    document.getElementById('clientId').innerHTML = `Client ID: ${socket.id}`
})

socket.on('clientList', function(data) {
    document.getElementById('clientCount').innerHTML = `${data.length} Clients Connected`
})

socket.on('connect', function() {
    document.getElementById('clientId').innerHTML = `Client ID: ${socket.id}`
})

//update the position of all players
socket.on("allPlayers", function(newPlayers) {
  players = newPlayers;
});

//update the position of just one player
socket.on("playerUpdate", function(id, pos) {
  players[id] = pos;
});

//draw loop
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  //draw each player as a rectangle
  for (player in players) {
    ctx.beginPath();
    //draw this client as red, all others as blue
    if (player === socket.id) {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "blue";
    }
    ctx.rect(players[player].x, players[player].y, 50, 50);
    ctx.stroke();
    ctx.closePath();
  }
}

//handle key presses for movement
function keyPress(e) {
  switch (e.keyCode) {
    case 38: // Up arrow
      if (y - dy > 0) {
        y -= dy;
        socket.emit("moved", { x: x, y: y });
      }
      break;
    case 40: // Down arrow
      if (y + dy < HEIGHT) {
        y += dy;
        socket.emit("moved", { x: x, y: y });
      }
      break;
    case 37: // Left arrow
      if (x - dx > 0) {
        x -= dx;
        socket.emit("moved", { x: x, y: y });
      }
      break;
    case 39: // Right arrow
      if (x + dx < WIDTH) {
        x += dx;
        socket.emit("moved", { x: x, y: y });
      }
      break;
  }
  e.preventDefault();
}

window.addEventListener("keydown", keyPress, true);

//redraw the screen every 10 milliseconds
setInterval(draw, 10);

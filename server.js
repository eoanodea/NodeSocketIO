/*
 * --------------------
 * Author Name: Eoan O'Dea
 * Author Email: eoan@wspace.ie
 * Date Created: Wednesday January 15th 2020 2:41:36 pm
 * --------------------
 * Project Name: socket-click
 * Version: 1.0.0
 * --------------------
 * File Name: server.js
 * Last Modified: Wednesday January 15th 2020 4:14:59 pm
 * --------------------
 * Copyright (c) 2020 WebSpace
 * --------------------
 */

// import express and initilize server
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
//store the coordinates of all the clients (players)
var players = {};

app.use(express.static(__dirname + '/public'))

//Mount route
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/public/index.html')
})

//when a client connects
io.on('connection', function(client) {
 console.log('Client conneted')

    io.clients(function(error, clients) {
        if(error) throw error;

        io.emit('clientList', clients)
    })

    //when a new client connects place them at 0,0
	players[client.id] = {x: 0, y: 0};
	
	//send a message to all other clients updating them on this new player
	io.emit('allPlayers', players);
	console.log(players);
	
	//if any client moves, store their new x,y and notify all clients
	client.on('moved',function(pos){
		players[client.id] = {x: pos.x, y: pos.y};
		
		io.emit('playerUpdate', client.id, players[client.id]);
	});
	
	//if any client disconnects remove them and notify all clients
	client.on('disconnect', function(){
		delete players[client.id];
		io.emit('allPlayers', players);
	});
 
})

//start web server
server.listen(3000, function() {
    console.log('Server starting on port *:3000')
})

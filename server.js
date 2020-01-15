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
 * Last Modified: Wednesday January 15th 2020 4:06:06 pm
 * --------------------
 * Copyright (c) 2020 WebSpace
 * --------------------
 */

// import express and initilize server
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

//Amount of times the button has been clicked
var clickCount = 0

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
 
 client.on('clientClicked', function(id) {
    io.to(id).emit('youWereClicked')     
 })
})

//start web server
server.listen(3000, function() {
    console.log('Server starting on port *:3000')
})

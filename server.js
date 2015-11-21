//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, '')));
var messages = [];
var sockets = [];
var pendingSocket = null;

var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("COM28", {
  baudrate: 9600
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
    console.log('open');
  }
});

io.on('connection', function (socket) {
    // messages.forEach(function (data) {
    //   socket.emit('message', data);
    // });
    var registerNewClient = function(newSocket) {
      if(!pendingSocket) pendingSocket = newSocket;
      else {
        pendingSocket.pair = newSocket;
        newSocket.pair = pendingSocket;
        pendingSocket = null;

        newSocket.emit('pairIdentified', newSocket.pair.player);
        newSocket.pair.emit('pairIdentified', newSocket.player);        
      }
    }
    
    // var findPairedSocket = function(socket) {
    //   var i = 0;
    //   for(i = 0; i<socketPairs.length; i++) {
    //     if(socketPairs[i].length>=1 && socketPairs[i][0] == socket) break;
    //     if(socketPairs[i].length>=2 && socketPairs[i][1] == socket) break;
    //   }
      
    //   if(i<socketPairs.length) {
    //     if(socketPairs[i].length < 2) return null;
    //     if(socketPairs[i][0] == socket) return socketPairs[i][1];
    //     if(socketPairs[i][1] == socket) return socketPairs[i][0];
    //   }
    // }
    
    socket.player = {name: 'Almost there...', gender: 0};
    registerNewClient(socket);

    // var currentSocketPair = socketPairs[socketPairs.length-1];
    
    socket.on('disconnect', function () {
      //Find socket pair it belonged to
      console.log("Socket disconnect");
      if(pendingSocket == socket) pendingSocket = null;
      if(socket.pair) {
        socket.pair.emit("pairDisconnected");
        socket.pair.pair = null;
        socket.pair = null;
      }
      // var pairedSocket = findPairedSocket(socket);
      // if(pairedSocket) {
      //   pairedSocket.emit("pairDisconnected");
      // }
      
      // var i = 0;
      // for(i = 0; i<socketPairs.length; i++) {
      //   if(socketPairs[i].length>=1 && socketPairs[i][0] == socket) break;
      //   if(socketPairs[i].length>=2 && socketPairs[i][1] == socket) break;
      // }
      
      // if(i<socketPairs.length) {
      //   socketPairs.splice(i, 1);
      // }
      
      // var currentSocketPair = socketPairs[socketPairs.length-1];
      // registerNewClient(currentSocketPair, socket);
    });

    socket.on('triggerShot', function(){
      if(serialPort.isOpen()) serialPort.write("LET\n");
      console.log("Shooting");
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name, gender) {
      socket.player = {
        name: name,
        gender: gender
      };
      
      console.log("New identify : " + name);
      if(socket.pair) {
        socket.emit('pairIdentified', socket.pair.player);
        socket.pair.emit('pairIdentified', socket.player);
      }
    });
    
    socket.on('selectMovie', function(url) {
      socket.pair.emit("movieSelected", url);
    });
    
    socket.on('registerScore', function(score) {
      socket.pair.emit("scoreRegistered", score);
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

const fs = require('fs');
const chokidar = require('chokidar');

const ws_server = require('ws').Server;
const wss = new ws_server({clientTracking: true, port: 8002});

let srvr = {
    id:0,
    clients: []
};

wss.on('connection', function(ws){
    ws.id = srvr.id++;
    srvr.clients.push(ws);
    ws.on('close', function () {
        for(i in srvr.clients){ 
            if(srvr.clients[i].id == ws.id){
                srvr.clients.splice(i,1);
            }
        }
    });
});

let fsWait = false;

//SEND REFRESH COMMAND TO BROWSERS AS FILES IS CHANGED
chokidar.watch('/var/www/saiadocaixaoday/', {ignored: /(^|[\/\\])\../, ignoreInitial: true}).on('all', (event, path) => {
    for(i in srvr.clients){
        srvr.clients[i].send("refresh");
    }
});

/* 
//INSERT THIS CODE WHERE NEED TO RELOAD.  
//IT WILL RECEIVE MESSAGE EVERYTIME A FILE IS CHANGED AND REFRESH THE PAGE.
socket = new WebSocket("ws://localhost:8002/");
socket.onmessage = function (msg) {
    window.location.reload();
};
*/
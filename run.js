const fs = require('fs');
require('log-timestamp');

const ws_server = require('ws').Server;
const wss = new ws_server({clientTracking: true, port: 8002});

const watch_this = [
    '/var/www/website_urbi/',
    '/var/www/website_urbi/css/',
    '/var/www/website_urbi/js/',
    '/media/pasta_compartilhada/'
];

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
for(i in watch_this){
    fs.watch(watch_this[i], (event, filename) => {
        console.log(event);
        if (filename) {
            if (fsWait) return;
            fsWait = setTimeout(() => {
                fsWait = false;
            }, 100);
            console.log(filename+' file Changed');
            for(i in srvr.clients){
                srvr.clients[i].send("refresh");
            }
        }
    });
}


/* 
//INSERT THIS CODE WHERE NEED TO RELOAD.  
//IT WILL RECEIVE MESSAGE EVERYTIME A FILE IS CHANGED AND REFRESH THE PAGE.
socket = new WebSocket("ws://localhost:8002/");
socket.onmessage = function (msg) {
    window.location.reload();
};
*/
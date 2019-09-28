const fs = require('fs');
const chokidar = require('chokidar');

const ws_server = require('ws').Server;
const wss = new ws_server({clientTracking: true, port: 8002});

const watch_this = [
    '/var/www/website_urbi/',
    '/var/www/website_urbi/css/',
    '/var/www/website_urbi/js/'
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

//SEND REFRESH COMMAND TO BROWSERS AS FILES IS CHANGED
chokidar.watch('/var/www/website_urbi/', {depth: 1, ignored: /(^|[\/\\])\../, ignoreInitial: true}).on('all', (event, path) => {
    for(i in srvr.clients){
        srvr.clients[i].send("refresh");
    }
});


/*
Para sincronizar aquirvos vindo de uma pasta da rede, precisa montar/mapear (mount)
https://tecadmin.net/mounting-samba-share-on-ubuntu/
*/
/*
const sync = {
    orig_path: '/media/pasta_compartilhada/urbi/website_img/',
    dest_path: '/var/www/website_urbi/img/'
}

chokidar.watch(sync.orig_path, {ignored: /(^|[\/\\])\../, persistent: true, usePolling: true, ignoreInitial: true}).on('all', (event, path) => {
    console.log(event, path);
    let file = path.split(sync.orig_path);
    file = file[1];
    if(event=='unlink'){
        fs.unlink(sync.dest_path+file, (err)=>{
            if(err) throw err;
            console.log(file+' was deleted in destination folder');
        });
        
    }else{
        fs.copyFile(path,sync.dest_path+file, (err) => {
            if(err) throw err;
            console.log(file+' was copied to destination folder');
        });
    }
});

*/

/* 
//INSERT THIS CODE WHERE NEED TO RELOAD.  
//IT WILL RECEIVE MESSAGE EVERYTIME A FILE IS CHANGED AND REFRESH THE PAGE.
socket = new WebSocket("ws://localhost:8002/");
socket.onmessage = function (msg) {
    window.location.reload();
};
*/
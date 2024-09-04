const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const PORT = 2007;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let {log} = require('console')
var CLIENTS
app.use(express.static('publ'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/publ/index.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/publ/admin.html');
});

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        var data 
        data = JSON.parse(message.data);
        log('new message ',data)
        switch (true) {
            case (typeof data.set_key != 'undefined'):
                ws.id = data.set_key
                CLIENTS = ws
                log('set key : ', ws.id)
                break;
                default:
                if (CLIENTS) {
                    CLIENTS.send(data)
                log('send to : default')
                }else{log('no client : default')}
                break;
        }
    });

    ws.on('close', () => {
        if (CLIENTS && ws.id) {
            CLIENTS = undefined
        }
        log('delete : default')
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

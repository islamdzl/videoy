const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const PORT = 2007;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let {log} = require('console')
var CLIENTS = {}
app.use(express.static('publ'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/publ/index.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/publ/admin.html');
});

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        // log('new message ',data)
        switch (true) {
            case (typeof data.set_key != 'undefined'):
                ws.id = data.set_key
                CLIENTS[data.set_key] = ws
                log('set key : ', ws.id)
                break;
            case (typeof data.send_to != 'undefined'):
                if (CLIENTS[data.send_to.key]) {
                    CLIENTS[data.send_to.key].send(JSON.stringify({
                        data:data.send_to.data
                    }))
                log('send to : ', data.send_to.key )
                }else{log('no client : ',data.send_to.key)}
                break;
        
            default:
                break;
        }
    });

    ws.on('close', () => {
        if (CLIENTS[ws.id]) {
            delete CLIENTS[ws.id]
        }
        log('delete',ws.id)
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

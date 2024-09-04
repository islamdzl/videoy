const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const PORT = 2007;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
var ALL_CLIENTS = {}
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
        switch (true) {
            case (typeof data.send_to != 'undefined'):
                if (ALL_CLIENTS[data.send_to.key]) {
                    ALL_CLIENTS[data.send_to.key].send(JSON.stringify({
                        stream:data.send_to.stream
                    }))
                }
                break;
            case (typeof data.set_key != 'undefined'):
                ws.id = data.set_key
                ALL_CLIENTS[data.set_key] = ws 
            break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        delete ALL_CLIENTS[ws.id]
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

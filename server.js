const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const PORT = 2007;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Map();

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
        if (data.set_key) {
            clients.set(ws, data.set_key);
            console.log('Key set:', data.set_key);
        } else if (data.send_to) {
            const key = data.send_to.key;
            clients.forEach((value, client) => {
                if (value === key) {
                    client.send(JSON.stringify({ 
                        video: data.send_to.video,
                        audio: data.send_to.audio 
                    }));
                }
            });
        } else if (data.set_key) {
            clients.set(ws, data.set_key);
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

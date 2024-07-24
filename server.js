const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const PORT = 2007
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('client'));
app.get('/islam',(req,res)=>{
    console.log('New Client!')
    res.sendFile(__dirname + '//client/index.html')
})
wss.on('connection', (ws) => {
    console.log('A user connected');

    ws.on('message', (message) => {
        // إرسال البيانات الصوتية إلى جميع المستخدمين المتصلين
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

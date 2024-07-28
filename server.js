const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const PORT = 2007
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const map = new Map()
let size = 0
var clients = new Map()

app.use(express.static('publ'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '//publ//index.html')
})
app.get('/islam',(req,res)=>{
    res.sendFile(__dirname + '//publ//admin.html')
})
wss.on('connection', (ws) => {
    if (!ws.id) {
        size ++
        ws.id = size
        clients.set(size, ws)
    }
    console.log('A user connected');
    ws.on('message', (message) => {
        console.log('client ',ws.id) 
        let data = JSON.parse(message.toString('utf-8')) 
        // console.log(data)

        if (data.set_key) {//  <<< SET KEY
            SET_KEY(data)
        }else{
            if (data.send_to) {// <<< SED DATA
                SED_STREM(data)
            }
        }

    });
    //----------------------------------------------------------
    const SED_STREM = (data)=>{
        clients.forEach((client)=>{
            if (client.id === data.send_to.key) {
                client.send(JSON.stringify({
                    strem:data.send_to.strem
                }))
            }
        })
    }
    //----------------------------------------------------------
    const SET_KEY = async(data)=>{ 
        console.log(data.set_key)
        let edite_client = await clients.get(ws.id)
        edite_client.id = data.set_key
        clients.set(ws.id, edite_client)
    }
    //----------------------------------------------------------

    ws.on('close', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


/*
    * ISLAM DZL

    client >---------------------------------v
        let strem = navigater.mediaDevices.getUserMedia({audio:true})
        let mediarecorder = new Mediarecorder(strem)
        mediaRecord.ondataavailable = (evnt)=>{
            socket.send(JSON.stringify({
                key:"yor_key",
                strem:evnt.data
            }))
        }
        mediarecorder.start(100)
            
    admin >----------------------------------v
        let mediaSource = new MediaSource();
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', () => {
            sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs=vp8,opus');
            sourceBuffer.mode = 'sequence';
        }
        socket.onmessage = (event)=>{
        const videoblob = new Blob([event.data],{type:'video/webm'})
        const reader = new FileReader()
        reader.onload = ()=>{
            const arrayBuffer = reader.result;
            sourceBuffer.appendBuffer(arrayBuffer)
        }
        reader.readAsArrayBuffer(videoblob)
    }

----------> ADMIN <-------> WebSoket <-------------v
*** >>> on open() >v                               |
    "set_key":"this_yor_key"                       |     
___________________________________________________|


----------> CLIENT <------> WebSoket <-------------v
*** >>> send () >v                                 |
    send_to:{                                      | 
        strem: < MediaRecorder : audio >,          | 
        key:"this_yor_key"                         | 
    }                                              | 
___________________________________________________|

*/
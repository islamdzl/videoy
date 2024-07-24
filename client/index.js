const ws = new WebSocket('wss://sounder.onrender.com/');
const audioPlayer = document.getElementById('audioPlayer');
let mediaRecorder;
let mediaSource;
let sourceBuffer;

ws.onopen = () => {
    mediaSource = new MediaSource();
    audioPlayer.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
        sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs=opus');
        sourceBuffer.mode = 'sequence';
    });
};

ws.onmessage = (event) => {
    const audioBlob = new Blob([event.data], { type: 'audio/webm' });
    const reader = new FileReader();

    reader.onload = () => {
        const arrayBuffer = reader.result;
        sourceBuffer.appendBuffer(arrayBuffer);
    };

    reader.readAsArrayBuffer(audioBlob);
};

document.getElementById('start').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        ws.send(event.data);
        document.getElementById('start').className = 'T'
        document.getElementById('stop').className = 'F'
    };

    mediaRecorder.start(100); // تجميع البيانات كل 100 ملي ثانية
});

document.getElementById('stop').addEventListener('click', async() => {
    setTimeout(() => {
        document.getElementById('start').className = 'F'
        document.getElementById('stop').className = 'T'
    }, 500);
    await mediaRecorder.stop();
});
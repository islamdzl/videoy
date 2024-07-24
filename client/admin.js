const ws = new WebSocket('wss://sounder.onrender.com');
const audioPlayer = document.getElementById('audioPlayer');


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
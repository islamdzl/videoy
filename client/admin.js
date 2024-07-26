const video = document.getElementById('video');
let mediaSource;
let sourceBuffer;
const ws = new WebSocket('wss://sounder.onrender.com');

ws.onopen = () => {
    mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
        sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs=vp8,opus');
        sourceBuffer.mode = 'sequence';
    });
};
ws.onmessage = (event) => {
    const videoBlob = new Blob([event.data], { type: 'video/webm' });
    const reader = new FileReader();

    reader.onload = () => {
        const arrayBuffer = reader.result;
        sourceBuffer.appendBuffer(arrayBuffer);
    };

    reader.readAsArrayBuffer(videoBlob);
};

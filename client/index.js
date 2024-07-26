const ws = new WebSocket('wss://sounder.onrender.com');
let mediaRecorder;






document.getElementById('start').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        ws.send(event.data);
        document.getElementById('start').className = 'F';
        document.getElementById('stop').className = 'T';
    };

    mediaRecorder.start(100); // تجميع البيانات كل 100 ملي ثانية
});

document.getElementById('stop').addEventListener('click', async () => {
    await mediaRecorder.stop();
    document.getElementById('start').className = 'T';
    document.getElementById('stop').className = 'F';
});

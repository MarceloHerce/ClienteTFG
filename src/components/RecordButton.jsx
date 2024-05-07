import React, { useState } from 'react';

function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [combinedStream, setCombinedStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const combinedStream = new MediaStream();
      screenStream.getTracks().forEach(track => combinedStream.addTrack(track));
      cameraStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));

      const recorder = new MediaRecorder(combinedStream);
      recorder.ondataavailable = (e) => {
        setRecordedChunks((prev) => prev.concat(e.data));
      };
      recorder.start();
      setScreenStream(screenStream);
      setCameraStream(cameraStream);
      setCombinedStream(combinedStream);
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error('Error accessing screen:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      screenStream.getTracks().forEach(track => track.stop());
      cameraStream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
      setScreenStream(null);
      setCameraStream(null);
      setCombinedStream(null);
      setRecording(false);
      downloadRecording();
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    window.URL.revokeObjectURL(url);
    setRecordedChunks([]);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
}

export default ScreenRecorder;

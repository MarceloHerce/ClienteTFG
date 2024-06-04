import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';


function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [combinedStream, setCombinedStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const { jwt  } = useContext(AppContext);
  const token = jwt

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
    console.log(blob)
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    window.URL.revokeObjectURL(url);
    setRecordedChunks([]);
  };

  const uploadRecording = async () => {
    try {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
  
      const response = await fetch('http://localhost:8080/blob/uploadVideo', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + jwt,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload recording');
      }
  
      console.log('Recording uploaded successfully');
      setRecordedChunks([]);
    } catch (error) {
      console.error('Error uploading recording:', error);
    }
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

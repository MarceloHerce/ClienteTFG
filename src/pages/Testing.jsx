import React, { useState, useRef } from 'react';

const VideoRecorder = () => {
  const [localCamStream, setLocalCamStream] = useState(null);
  const [localScreenStream, setLocalScreenStream] = useState(null);
  const [localOverlayStream, setLocalOverlayStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [audioContext, setAudioContext] = useState(null);
  const [audioDestination, setAudioDestination] = useState(null);
  const [rafId, setRafId] = useState(null);

  const mediaWrapperDiv = useRef(null);
  const canvasElement = useRef(document.createElement('canvas'));
  const canvasCtx = canvasElement.current.getContext('2d');
  const encoderOptions = { mimeType: 'video/mp4; codecs=h264' };

  const camRef = useRef(null);
  const screenRef = useRef(null);

  const startWebcamFn = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { deviceId: { ideal: 'communications' } },
    });
    setLocalCamStream(stream);
    camRef.current = await attachToDOM('justWebcam', stream);
  };

  const startScreenShareFn = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    setLocalScreenStream(stream);
    screenRef.current = await attachToDOM('justScreenShare', stream);
  };

  const stopAllStreamsFn = () => {
    [
      ...(localCamStream ? localCamStream.getTracks() : []),
      ...(localScreenStream ? localScreenStream.getTracks() : []),
      ...(localOverlayStream ? localOverlayStream.getTracks() : []),
    ].forEach((track) => track.stop());
    setLocalCamStream(null);
    setLocalScreenStream(null);
    setLocalOverlayStream(null);
    cancelVideoFrame(rafId);
    if (mediaWrapperDiv.current) {
      mediaWrapperDiv.current.innerHTML = '';
    }
  };

  const makeComposite = () => {
    const cam = camRef.current;
    const screen = screenRef.current;

    if (cam && screen) {
      canvasCtx.save();
      canvasElement.current.width = screen.videoWidth;
      canvasElement.current.height = screen.videoHeight;
      canvasCtx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);
      canvasCtx.drawImage(screen, 0, 0, canvasElement.current.width, canvasElement.current.height);
      canvasCtx.drawImage(
        cam,
        0,
        Math.floor(canvasElement.current.height - canvasElement.current.height / 4),
        Math.floor(canvasElement.current.width / 4),
        Math.floor(canvasElement.current.height / 4)
      );
      const imageData = canvasCtx.getImageData(0, 0, canvasElement.current.width, canvasElement.current.height);
      canvasCtx.putImageData(imageData, 0, 0);
      canvasCtx.restore();
      setRafId(requestVideoFrame(makeComposite));
    }
  };

  const mergeStreamsFn = async () => {
    await makeComposite();
    const audioCtx = new AudioContext();
    const audioDest = audioCtx.createMediaStreamDestination();
    setAudioContext(audioCtx);
    setAudioDestination(audioDest);

    const fullVideoStream = canvasElement.current.captureStream();
    const existingAudioStreams = [
      ...(localCamStream ? localCamStream.getAudioTracks() : []),
      ...(localScreenStream ? localScreenStream.getAudioTracks() : []),
    ];

    const audioTracksArray = [
      audioCtx.createMediaStreamSource(new MediaStream([existingAudioStreams[0]])),
    ];
    if (existingAudioStreams.length > 1) {
      audioTracksArray.push(audioCtx.createMediaStreamSource(new MediaStream([existingAudioStreams[1]])));
    }
    audioTracksArray.forEach((track) => track.connect(audioDest));
    setAudioTracks(audioTracksArray);

    const overlayStream = new MediaStream([...fullVideoStream.getVideoTracks(), ...audioDest.stream.getTracks()]);
    setLocalOverlayStream(overlayStream);

    await attachToDOM('pipOverlayStream', overlayStream);

    const recorder = new MediaRecorder(overlayStream, encoderOptions);
    recorder.ondataavailable = handleDataAvailable;
    setMediaRecorder(recorder);
  };

  const startRecordingFn = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      document.getElementById('pipOverlayStream').style.border = '10px solid red';
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const download = () => {
    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'result.mp4';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stopRecordingFn = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const attachToDOM = (id, stream) => {
    return new Promise((resolve) => {
      const videoElem = document.createElement('video');
      videoElem.id = id;
      videoElem.width = 640;
      videoElem.height = 360;
      videoElem.autoplay = true;
      videoElem.playsInline = true;
      videoElem.srcObject = new MediaStream(stream.getTracks());
      videoElem.onloadedmetadata = () => {
        resolve(videoElem);
      };
      if (mediaWrapperDiv.current) {
        mediaWrapperDiv.current.appendChild(videoElem);
      }
    });
  };

  return (
    <div>
      <h2>Click on "Start Webcam" to get started.</h2>
      <div id="mediaWrapper" ref={mediaWrapperDiv}></div>
      <div id="buttonWrapper">
        <button onClick={startWebcamFn} title="Start Webcam">Start Webcam</button>
        <button onClick={startScreenShareFn} title="Start Screen Share">Start Screen Share</button>
        <button onClick={mergeStreamsFn} title="Merge Streams">Merge Streams</button>
        <button onClick={startRecordingFn} title="Record Resulting Stream">Record Resulting Stream</button>
        <button onClick={stopRecordingFn} title="Stop Recording and Download Resulting Stream">Stop Recording and Download Resulting Stream</button>
        <button onClick={stopAllStreamsFn} title="Stop All Streams">Stop All Streams</button>
      </div>
      <div id="helpText">
        <h1 id="recordingState"></h1>
        <h2 id="mutingStreams">
          Note: In a WebRTC setting, you wouldn't be hearing your own voice or the screen share audio via the "video" tag. The same has been simulated here by ensuring that all video tags have a "volume = 0". Removing this will create a loopback hell which you do not want.
          <br /><br />
          Another way to avoid this issue is to ensure that the video tags are created with ONLY video stream tracks using <em style={{ color: 'blue' }}>new MediaStream([ source.getVideoTracks() ])</em> during the srcObject assignment.
        </h2>
        <h1>
          Remember to send the correct stream (with both audio and video) to the rest of the peers though.
        </h1>
      </div>
    </div>
  );
};

export default VideoRecorder;

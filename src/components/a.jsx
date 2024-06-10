import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { jwtDecode } from 'jwt-decode';

const CHUNK_SIZE = parseInt(import.meta.env.VITE_APP_CHUNKSIZE, 10);
const apiUrl = import.meta.env.VITE_APP_USERAPI;

const Desesperao = () => {
  const [fileName, setFileName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const { jwt } = useContext(AppContext);

  const [recordedChunks, setRecordedChunks] = useState([]);
  const [chunkSizes, setChunkSizes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    if (!fileName) {
      alert('Please enter a file name before starting the recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });

      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
          setChunkSizes(prev => [...prev, event.data.size]);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting screen recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      mediaRecorderRef.current.onstop = () => {
        createVideoUrl();
        setIsRecording(false);
      };
    }
  };

  const createVideoUrl = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
    console.log('Video URL created:', url);
  };

  const getStorageName = async () => {
    try {
      const response = await fetch(`${apiUrl}/media/name`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        console.error("Error fetching storage name: " + response.statusText);
        return;
      }

      const storageName = await response.text();
      console.log("GetStorageName: " + storageName);
      return storageName;
    } catch (error) {
      console.error("Error fetching storage name: ", error);
    }
  };

  const uploadChunks = async () => {
    console.log("Lista de chunks");
    const blockList = [];
    const uniqueFileName = await getStorageName();

    for (let i = 0; i < recordedChunks.length; i++) {
      const chunk = recordedChunks[i];
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('fileName', uniqueFileName);
      formData.append('index', i);

      const response = await fetch(`${apiUrl}/upload/media/upload-chunk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        alert("Error uploading chunk: " + response.statusText);
        return;
      }
      console.log("Headers:");
      response.headers.forEach((value, name) => {
        console.log(`${name}: ${value}`);
      });
      console.log("End of headers");

      const storageFileName = response.headers.get('Filename');
      console.log(`Filename: ${storageFileName}`);

      const blockId = await response.text();
      blockList.push(blockId);
      console.log(`Block ID for chunk ${i}: ${blockId}`);
    }

    const commitFormData = new FormData();
    commitFormData.append('fileName', uniqueFileName);

    const decodedJwt = jwtDecode(jwt);
    const sub = decodedJwt.sub;
    const metadata = {
      sub: sub,
      fileName: fileName
    };
    commitFormData.append('metadata', JSON.stringify(metadata))
    commitFormData.append('blockList', JSON.stringify(blockList));

    const commitResponse = await fetch(`${apiUrl}/upload/media/commit-blocks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
      body: commitFormData,
    });

    if (!commitResponse.ok) {
      alert("Error committing blocks: " + commitResponse.statusText);
      return;
    }

    alert('File upload complete!');
  };

  useEffect(() => {
    if (videoUrl) {
      console.log("Preview URL:", videoUrl);
    }
  }, [videoUrl]);

  return (
    <div>
      <div>
        <label htmlFor="fileName">Enter file name:</label>
        <input
          id="fileName"
          type="text"
          placeholder="Enter file name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
      <button
        onClick={startRecording}
        disabled={!fileName || isRecording}
      >
        Start Recording
      </button>
      <button
        onClick={stopRecording}
        disabled={!isRecording}
      >
        Stop Recording
      </button>
      <button onClick={uploadChunks} disabled={recordedChunks.length === 0}>
        Upload Video
      </button>
      {videoUrl && (
        <div className='flex flex-col items-center bg-gray-800 shadow-md p-5 rounded-lg'>
          <h3>Video Preview</h3>
          <video controls src={videoUrl} width="640" height="480"></video>
        </div>
      )}
      <div>
        <h3>Chunk Sizes</h3>
        <ul>
          {chunkSizes.map((size, index) => (
            <li key={index}>Chunk {index}: {size} bytes</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Desesperao;

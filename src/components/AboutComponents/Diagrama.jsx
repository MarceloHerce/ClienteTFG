import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import {jwtDecode} from 'jwt-decode';
import { Loader } from '@react-three/drei';
import { TbLoader3 } from "react-icons/tb";

const apiUrl = import.meta.env.VITE_APP_USERAPI;
const CHUNK_SIZE =parseInt(import.meta.env.VITE_APP_CHUNKSIZE, 10);

const Desespera2 = () => {
  const [fileName, setFileName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const { jwt } = useContext(AppContext);

  const [recordedBlob, setRecordedBlob] = useState(null);
  const [chunkSizes, setChunkSizes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(null);
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

      const chunks = [];
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const completeBlob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(completeBlob);
        const url = URL.createObjectURL(completeBlob);
        setVideoUrl(url);
        setIsRecording(false);
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
    }
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
    console.log("Comienza la subida " +CHUNK_SIZE)
    if (!recordedBlob) {
      alert("No recorded blob available to upload.");
      return;
    }
    setUploading(true)
    const blockList = [];
    const uniqueFileName = await getStorageName();

    const chunkCount = Math.ceil(recordedBlob.size / CHUNK_SIZE);
    const chunks = [];
    for (let i = 0; i < chunkCount; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, recordedBlob.size);
      const chunk = recordedBlob.slice(start, end);
      chunks.push(chunk);
    }

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
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
      setUploading(null)
      alert("Error committing blocks: " + commitResponse.statusText);
      return;
    }
    setUploading(null)
    alert('File upload complete!');
  };

  useEffect(() => {
    if (videoUrl) {
      console.log("Preview URL:", videoUrl);
    }
  }, [videoUrl]);
  const downloadPreview = (() => {
    const link = document.createElement('a');
                link.href = videoUrl;
                link.download = `${fileName}.webm`; 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
  })

  return (
    <div className='flex flex-col items-center gap-8'>
        {uploading && <TbLoader3 className='animate-spin text-4xl text-teal-500'/>}
        <TbLoader3 className='animate-spin text-4xl text-teal-500'/>
      <div className='w-3/6'>
        <label htmlFor="fileName" className='text-left mb-1 text-lg'>Enter file name:</label>
        <input
          className='bg-white text-black rounded-sm'
          id="fileName"
          type="text"
          placeholder="Enter file name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
      <div className='flex gap-4 justify-center items-center'>
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
        <button onClick={uploadChunks} disabled={!recordedBlob}>
            Upload Video
        </button>
        {videoUrl && 
            <button
            onClick={() => downloadPreview()}
            className=''
            >
            Download Video
            </button>
        }
      </div>
      {videoUrl && (
        <div className='flex flex-col items-center bg-gray-800 shadow-md p-5 rounded-lg'>
          <h3>Video Preview</h3>
          <video controls src={videoUrl} width="640" height="480"></video>
        </div>
      )}
    </div>
  );
};

export default Desespera2;

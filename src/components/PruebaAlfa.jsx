import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import {jwtDecode} from 'jwt-decode';

const CHUNK_SIZE = 1024 * 1024 * 3; // 3MB
const apiUrl = import.meta.env.VITE_APP_USERAPI;
const Desesperao = () => {
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [chunkSizes, setChunkSizes] = useState([]);
  const [fileName, setFileName] = useState('');
  const [userFileName, setuserFileName] = useState('');
  const { jwt } = useContext(AppContext);
  const mediaRecorderRef = useRef(null);
  const bufferRef = useRef([]);
  const bufferSizeRef = useRef(0);

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

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          bufferRef.current.push(event.data);
          bufferSizeRef.current += event.data.size;

          while (bufferSizeRef.current >= CHUNK_SIZE) {
            let chunkSize = 0;
            const chunkParts = [];

            while (chunkSize < CHUNK_SIZE && bufferRef.current.length > 0) {
              const currentBlob = bufferRef.current[0];

              if (chunkSize + currentBlob.size <= CHUNK_SIZE) {
                chunkParts.push(currentBlob);
                chunkSize += currentBlob.size;
                bufferRef.current.shift();
              } else {
                const remainingSize = CHUNK_SIZE - chunkSize;
                chunkParts.push(currentBlob.slice(0, remainingSize));
                bufferRef.current[0] = currentBlob.slice(remainingSize);
                chunkSize = CHUNK_SIZE;
              }
            }

            const combinedBlob = new Blob(chunkParts, { type: 'video/webm' });
            setRecordedChunks(prev => [...prev, combinedBlob]);
            setChunkSizes(prev => [...prev, combinedBlob.size]);
            bufferSizeRef.current -= CHUNK_SIZE;
          }
        }
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error starting screen recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (bufferSizeRef.current > 0) {
        const combinedBlob = new Blob(bufferRef.current, { type: 'video/webm' });
        setRecordedChunks(prev => [...prev, combinedBlob]);
        setChunkSizes(prev => [...prev, combinedBlob.size]);

        // Reset buffer
        bufferRef.current = [];
        bufferSizeRef.current = 0;
      }
    }
  };

  const debugChunks = () => {
    recordedChunks.forEach((chunk, index) => {
      console.log(`Chunk ${index}: ${chunk.size} bytes`);
    });
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
  }

  const uploadChunks = async () => {
    if (!jwt) {
      alert("Please login firts");
      return;
    }
    console.log("Lista de chunks");
    debugChunks();
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
      console.log("Hearder:")
      response.headers.forEach((value, name) => {
        console.log(`${name}: ${value}`);
      });
      console.log("Fin headers")

      const storageFileName = response.headers.get('Filename');
      console.log(`Filename: ${storageFileName}`);

      const blockId = await response.text();
      blockList.push(blockId);
      console.log(`Block ID for chunk ${i}: ${blockId}`);
    }

    const commitFormData = new FormData();
    commitFormData.append('fileName', uniqueFileName);

    // Crear objeto de metadatos
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
        onClick={getStorageName}
      >Prueba</button>
      <button
        onClick={startRecording}
        disabled={!fileName || (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording')}
      >
        Start Recording
      </button>
      <button
        onClick={stopRecording}
        disabled={!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording'}
      >
        Stop Recording
      </button>
      <button onClick={uploadChunks} disabled={recordedChunks.length === 0}>
        Upload Video
      </button>
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


/* Funciona sin separar chunks en size
import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';

const Desesperao = () => {
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [fileName, setFileName] = useState('');
  const { jwt } = useContext(AppContext);
  const mediaRecorderRef = useRef(null);

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

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing display media.', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };
  const debugChunks = () => {
    recordedChunks.forEach((chunk, index) => {
      console.log(`Chunk ${index}: ${chunk.size} bytes`);
    });
  };

  const uploadChunks = async () => {
    if (!jwt) {
      alert("JWT is not available.");
      return;
    }
    console.log("Lista de chunks");
    debugChunks();
    const blockList = [];
    const uniqueFileName = `${fileName}_${Date.now()}.webm`;

    for (let i = 0; i < recordedChunks.length; i++) {
      const chunk = recordedChunks[i];
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('fileName', uniqueFileName);
      formData.append('index', i);

      const response = await fetch('http://localhost:8080/upload/media/upload-chunk', {
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

      const blockId = await response.text();
      blockList.push(blockId);
      console.log(`Block ID for chunk ${i}: ${blockId}`);
    }

    const commitFormData = new FormData();
    commitFormData.append('fileName', uniqueFileName);

    // Crear objeto de metadatos
    const decodedJwt = jwtDecode(jwt);
    const sub = decodedJwt.sub;
    const metadata = {
      sub: sub,
      fileName: uniqueFileName
    };
    commitFormData.append('metadata', JSON.stringify(metadata))
    commitFormData.append('blockList', JSON.stringify(blockList));

    const commitResponse = await fetch('http://localhost:8080/upload/media/commit-blocks', {
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
        disabled={!fileName || (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording')}
      >
        Start Recording
      </button>
      <button
        onClick={stopRecording}
        disabled={!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording'}
      >
        Stop Recording
      </button>
      <button onClick={uploadChunks} disabled={recordedChunks.length === 0}>
        Upload Video
      </button>
    </div>
  );
};

export default Desesperao;
*/

/* Funciona sin definir nombre
import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';

const Desesperao = () => {
  const [recordedChunks, setRecordedChunks] = useState([]);
  const { jwt } = useContext(AppContext);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing display media.', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const getBlockId = async (index) => {
    const response = await fetch(`http://localhost:8080/upload/media/generate-block-id?index=${index}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error generating block ID");
    }

    const blockId = await response.text();
    console.log(`Generated Block ID for chunk ${index}: ${blockId}`);
    return blockId;
  };

  const uploadChunks = async () => {
    if (!jwt) {
      alert("JWT is not available.");
      return;
    }

    const blockList = [];
    const fileName = `video_${Date.now()}.webm`;

    for (let i = 0; i < recordedChunks.length; i++) {
      const chunk = recordedChunks[i];
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('fileName', fileName);
      formData.append('index', i);

      const response = await fetch('http://localhost:8080/upload/media/upload-chunk', {
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

      const blockId = await response.text();
      blockList.push(blockId);
      console.log(`Block ID for chunk ${i}: ${blockId}`);
    }

    const commitFormData = new FormData();
    commitFormData.append('fileName', fileName);
    commitFormData.append('blockList', JSON.stringify(blockList));
    //commitFormData.append('metadata', JSON.stringify(metadata))

    const commitResponse = await fetch('http://localhost:8080/upload/media/commit-blocks', {
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

  return (
    <div>
      <button onClick={startRecording} disabled={mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording'}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording'}>
        Stop Recording
      </button>
      <button onClick={uploadChunks} disabled={recordedChunks.length === 0}>
        Upload Video
      </button>
    </div>
  );
};

export default Desesperao;
*/


/* Prueba con archivo .webm
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Desesperao = () => {
  const [chunks, setChunks] = useState([]);
  const { jwt } = useContext(AppContext);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const chunkSize = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    const chunksArray = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      chunksArray.push(chunk);
    }

    setChunks(chunksArray);
  };

  const getBlockId = async (index) => {
    const response = await fetch(`http://localhost:8080/api/blob/generate-block-id?index=${index}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error generating block ID");
    }

    const blockId = await response.text();
    console.log(`Generated Block ID for chunk ${index}: ${blockId}`);
    return blockId;
  };

  const uploadChunks = async () => {
    if (!jwt) {
        alert("JWT is not available.");
        return;
    }

    const blockList = [];
    const fileName = `video_${Date.now()}.webm`;

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        let blockId;

        try {
            blockId = await getBlockId(i);
        } catch (error) {
            alert(error.message);
            return;
        }

        blockList.push(blockId);
        console.log(`Block ID for chunk ${i}: ${blockId}`);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('fileName', fileName);
        formData.append('blockId', blockId);

        const response = await fetch('http://localhost:8080/api/blob/upload-chunk', {
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
    }

    const commitFormData = new FormData();
    commitFormData.append('fileName', fileName);
    commitFormData.append('blockList', JSON.stringify(blockList));

    const response = await fetch('http://localhost:8080/api/blob/commit-blocks', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
        body: commitFormData,
    });

    if (!response.ok) {
        alert("Error committing blocks: " + response.statusText);
        return;
    }

    alert('File upload complete!');
};

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={uploadChunks} disabled={chunks.length === 0}>
        Upload Video
      </button>
    </div>
  );
};

export default Desesperao;
*/

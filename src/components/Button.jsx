import React, { useState, useContext} from "react";
import { AppContext } from '../context/AppContext';
import "./css/RegisterForm.css"
import { jwtDecode } from "jwt-decode";

const apiUrl = import.meta.env.VITE_APP_USERAPI;

function CaptureScreen() {
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const { jwt  } = useContext(AppContext);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });
      setStream(mediaStream);
      setIsRecording(true);

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: "video/webm",
      });

      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setRecordedChunks(chunks);
      };

      recorder.start();

      setMediaRecorder(recorder);
    } catch (error) {
      //console.error("Error al acceder a los medios: ", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    console.log(blob)
    const a = document.createElement("a");
    a.href = url;
    a.download = "grabacion.webm";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyUrl = () => {
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl);
      alert("URL copiada al portapapeles");
    }
  };
  const uploadRecording = async () => {
    const token = jwt;
    console.log(token);
    const formData = new FormData();
    const filename = 'holaJoaquin.webm'; 
    recordedChunks.forEach(chunk => {
      formData.append("file", chunk, filename); 
    });
  
    try {
      const response = await fetch(`${apiUrl}/blob/uploadVideo`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + token
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
  
  
  const getvideo = async () => {
    try {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('file', holaCHU, 'recording.webm');
      const token = jwt;
      const response = await fetch(`${apiUrl}/blob/getVideo`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to get recording');
      }
  
      console.log('Recording get successfully');
      setRecordedChunks([]);
    } catch (error) {
      console.error('Error get recording:', error);
    }
  };
  
  const uploadRecordingChunks = async () => {
    const token = jwt;
    console.log(token);
    const filename = 'holaJoaquinChunks';
    const chunkSize = 1024 * 1024; // Tamaño del chunk en bytes (1 MB)
    let blockIds = [];
    let blockIdIndex = 0;
  
    // Función para subir un chunk
    const uploadChunk = async (chunk, blockId) => {
      const formData = new FormData();
      formData.append("fileName",filename)
      formData.append("chunk", chunk, filename);
      formData.append("blockId", blockId);
      console.log("Filename to be sent:", filename);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      const response = await fetch(`${apiUrl}/media/chunk`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + token
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload chunk');
      }
    };
  
    try {
      // Dividir el archivo en chunks y subir cada uno
      for (let i = 0; i < recordedChunks.length; i++) {
        const chunk = recordedChunks[i];
        const chunkCount = Math.ceil(chunk.size / chunkSize);
        for (let j = 0; j < chunkCount; j++) {
          const start = j * chunkSize;
          const end = Math.min(start + chunkSize, chunk.size);
          const chunkPart = chunk.slice(start, end);
          const blockId = blockIdIndex.toString().padStart(6, '0'); // Formatear el blockId
          const base64BlockId = btoa(blockId); // Convertir el blockId a Base64
          blockIds.push(base64BlockId);
          await uploadChunk(chunkPart, base64BlockId);
          blockIdIndex++;
        }
      }
  
      // Enviar los blockIds al endpoint de commit
      const commitResponse = await fetch(`${apiUrl}/media/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          fileName: filename,
          blockIds: blockIds
        }),
      });
  
      if (!commitResponse.ok) {
        throw new Error('Failed to commit blocks');
      }
  
      console.log('Recording uploaded successfully');
      setRecordedChunks([]);
    } catch (error) {
      console.error('Error uploading recording:', error);
    }
  };
/* Prueba 1
  const uploadRecordingPruebaBlock = async () => {
    const token = jwt;
    console.log('JWT Token:', token);
    const filename = 'holaJoaquin.webm';
    const blockSize = 256 * 1024; // Tamaño del bloque en bytes (256 KB por ejemplo)
    let blockIds = [];
    let blockIndex = 0;

    for (let i = 0; i < recordedChunks.length; i++) {
        const chunk = recordedChunks[i];
        const numBlocks = Math.ceil(chunk.size / blockSize);
        console.log(`Chunk ${i}: Size = ${chunk.size}, Number of blocks = ${numBlocks}`);

        for (let j = 0; j < numBlocks; j++) {
            const start = j * blockSize;
            const end = Math.min(start + blockSize, chunk.size);
            const blockBlob = chunk.slice(start, end);
            const blockId = btoa(`block-${blockIndex.toString().padStart(6, '0')}`); // Codificar en base64
            blockIds.push(blockId);

            const formData = new FormData();
            formData.append("filePart", blockBlob, filename);
            formData.append("blobName", filename);
            formData.append("blockId", blockId);

            console.log(`Uploading block ${blockId} with size ${blockBlob.size}`);

            try {
                const response = await fetch('http://localhost:8080/test/uploadBlock', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error(`Error uploading block ${blockId}: ${errorMessage}`);
                    throw new Error(`Failed to upload block ${blockId}`);
                } else {
                    console.log(`Block ${blockId} uploaded successfully`);
                }
            } catch (error) {
                console.error('Error uploading block:', error);
                return; // Si ocurre un error, detiene el proceso
            }

            blockIndex++;
        }
    }

    // Después de subir todos los bloques, llamar a commitBlocks
    await commitBlocks(filename, blockIds);
    setRecordedChunks([]);
};

const commitBlocks = async (blobName, blockIds) => {
    const token = jwt;

    const formData = new FormData();
    formData.append("blobName", blobName);
    blockIds.forEach(blockId => formData.append("blockIds", blockId));

    console.log('Committing blocks:', blockIds);

    try {
        const response = await fetch('http://localhost:8080/test/commitBlocks', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
            throw new Error('Failed to commit blocks');
        }

        const url = await response.text(); // Obtener la URL del blob como respuesta
        console.log('Recording uploaded and committed successfully, Blob URL:', url);
    } catch (error) {
        console.error('Error committing blocks:', error);
    }
};
*/

const uploadRecordingPruebaBlock = async () => {
  const token = jwt;  // Asegúrate de que jwt esté correctamente definido
  const filename = 'holaJoaquin.webm';
  const blockSize = 256 * 1024; // 256 KB
  let blockIds = [];
  let blockIndex = 0;

  for (let i = 0; i < recordedChunks.length; i++) {
      const chunk = recordedChunks[i];
      const numBlocks = Math.ceil(chunk.size / blockSize);
      console.log(`Chunk ${i}: Size = ${chunk.size}, Number of blocks = ${numBlocks}`);

      for (let j = 0; j < numBlocks; j++) {
          const start = j * blockSize;
          const end = Math.min(start + blockSize, chunk.size);
          const blockBlob = chunk.slice(start, end);
          const blockId = btoa(`block-${blockIndex.toString().padStart(6, '0')}`);
          blockIds.push(blockId);

          const formData = new FormData();
          formData.append("filePart", blockBlob, filename);
          formData.append("blobName", filename);
          formData.append("blockId", blockId);

          console.log(`Uploading block ${blockId} with size ${blockBlob.size}`);

          try {
              const response = await fetch('http://localhost:8080/api/blob/uploadBlock', {
                  method: 'POST',
                  body: formData,
                  headers: {
                      'Authorization': `Bearer ${token}`
                  },
              });

              if (!response.ok) {
                  const errorMessage = await response.text();
                  console.error(`Error uploading block ${blockId}: ${errorMessage}`);
                  throw new Error(`Failed to upload block ${blockId}`);
              } else {
                  console.log(`Block ${blockId} uploaded successfully`);
              }
          } catch (error) {
              console.error('Error uploading block:', error);
              return; // Si ocurre un error, se detiene el proceso
          }

          blockIndex++;
      }
  }

  // Después de subir todos los bloques, realizar commit
  await commitBlocks(filename, blockIds);
  setRecordedChunks([]);
};

const commitBlocks = async (blobName, blockIds) => {
  const token = jwt;

  const formData = new FormData();
  formData.append("blobName", blobName);
  blockIds.forEach(blockId => formData.append("blockIds", blockId));

  console.log('Committing blocks:', blockIds);

  try {
      const response = await fetch('http://localhost:8080/api/blob/commitBlocks', {
          method: 'POST',
          body: formData,
          headers: {
              'Authorization': `Bearer ${token}`
          },
      });

      if (!response.ok) {
          throw new Error('Failed to commit blocks');
      }

      const url = await response.text();
      console.log('Recording uploaded and committed successfully, Blob URL:', url);
  } catch (error) {
      console.error('Error committing blocks:', error);
  }
};


  return (
    <div className="a">
      <h1>Screen Recorder</h1>
      {videoUrl && (
        <div className="a">
          <video
            src={videoUrl}
            autoPlay
            controls
            style={{ maxWidth: "100%", marginBottom: "10px" }}
          ></video>
          <button onClick={copyUrl}>Compartir</button>
        </div>
      )}
      {!isRecording ? (
        <button onClick={startRecording}>Comenzar a Grabar</button>
      ) : (
        <button onClick={stopRecording}>Detener Grabación</button>
      )}
      {recordedChunks.length > 0 && (
        <>
          <button onClick={downloadRecording}>Descargar</button>
          <button onClick={uploadRecordingPruebaBlock}>Guardar en la nubea</button>
        </>
      )}
    </div>
  );
}

export default CaptureScreen;


/*Preview Funcional Audio y video pantalla
import React, { useState } from "react";

function CaptureScreen() {
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });
      setStream(mediaStream);
      setIsRecording(true);

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: "video/webm",
      });

      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setRecordedChunks(chunks);
      };

      recorder.start();

      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error al acceder a los medios: ", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grabacion.webm";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Screen Recorder</h1>
      {previewUrl && (
        <video
          src={previewUrl}
          autoPlay
          controls
          style={{ maxWidth: "100%", marginBottom: "10px" }}
        ></video>
      )}
      {!isRecording ? (
        <button onClick={startRecording}>Comenzar a Grabar</button>
      ) : (
        <button onClick={stopRecording}>Detener Grabación</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={downloadRecording}>Descargar</button>
      )}
    </div>
  );
}

export default CaptureScreen;
*/

/*import React, { useState } from "react";

function CaptureScreen() {
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });
      setStream(mediaStream);
      setIsRecording(true);

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: "video/webm",
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        console.log(blob);
        const url = URL.createObjectURL(blob);
        console.log(url);
        setPreviewUrl(url);
      };

      recorder.start();

      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error al acceder a los medios: ", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grabacion.webm";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Screen Recorder</h1>
      {previewUrl && (
        <video
          src={previewUrl}
          autoPlay
          controls
          style={{ maxWidth: "100%", marginBottom: "10px" }}
        ></video>
      )}
      {!isRecording ? (
        <button onClick={startRecording}>Comenzar a Grabar</button>
      ) : (
        <button onClick={stopRecording}>Detener Grabación</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={downloadRecording}>Descargar</button>
      )}
    </div>
  );
}

export default CaptureScreen;*/

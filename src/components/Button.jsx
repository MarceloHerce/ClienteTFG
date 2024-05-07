import React, { useState } from "react";

function CaptureScreen() {
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

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

  const copyUrl = () => {
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl);
      alert("URL copiada al portapapeles");
    }
  };

  return (
    <div>
      <h1>Screen Recorder</h1>
      {videoUrl && (
        <div>
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
        <button onClick={downloadRecording}>Descargar</button>
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

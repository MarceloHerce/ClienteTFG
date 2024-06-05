import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function VideoList() {
    const [videos, setVideos] = useState([]);
    const [metadata, setMetadata] = useState({});
    const { jwt } = useContext(AppContext);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await fetch('http://localhost:8080/get/media/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setVideos(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const handleLoadedMetadata = (index, event) => {
        const videoElement = event.target;
        setMetadata(prevMetadata => ({
            ...prevMetadata,
            [index]: {
                ...prevMetadata[index],
                duration: videoElement.duration,
                width: videoElement.videoWidth,
                height: videoElement.videoHeight,
            }
        }));
    };
    const generateShareableLink = (sasUrl, fileName) => {
        const baseUrl = `${window.location.origin}/video`;
        const queryParams = new URLSearchParams({ sasUrl, fileName });
        return `${baseUrl}?${queryParams.toString()}`;
    };
    const deleteBlob = async (storageFileName) => {
        try {
            const response = await fetch(`http://localhost:8080/blob?fileName=${storageFileName}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();
            console.log(data);
            try{
                setVideos(prevVideos => prevVideos.filter(video => video.storageFileName !== storageFileName));
            } catch (error){
                console.log(error)
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Videos</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                    <li key={index} className="flex flex-col items-center">
                        <h2 className="text-lg font-bold mb-2">{video.fileName}</h2> 
                        <video
                            width="auto"
                            height="auto"
                            controls
                            onLoadedMetadata={(event) => handleLoadedMetadata(index, event)}
                        >
                            <source src={video.sasUrl} type="video/webm" />
                            Your browser does not support the video tag.
                        </video>
                        <button
                                onClick={() => navigator.clipboard.writeText(generateShareableLink(video.sasUrl, video.fileName))}
                                className="mt-2 bg-teal-500 text-white py-1 px-4 rounded"
                            >
                            Copy Link
                        </button>
                        <p>{video.storageFileName}</p>
                        <button onClick={() => deleteBlob(video.storageFileName)}>Delete</button>
                        {metadata[index] && (
                            <div className="mt-2 text-center text-sm text-gray-600">
                                <p>Filename: {metadata[index].fileName}</p>
                                <p>Duration: {metadata[index].duration.toFixed(2)} seconds</p>
                                <p>Resolution: {metadata[index].width}x{metadata[index].height}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VideoList;

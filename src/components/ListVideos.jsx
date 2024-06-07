import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_APP_USERAPI;
function VideoList() {
    const [videos, setVideos] = useState([]);
    const [metadata, setMetadata] = useState({});
    const { jwt, setJwt } = useContext(AppContext);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const navigate = useNavigate();
    /*if (!jwt) {
        history.push('/home');
    }*/
    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await fetch(`${apiUrl}/get/media/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
            });
            if (!response.ok) {
                if (response.status === 403) {
                    localStorage.removeItem(jwt);
                    setJwt('');
                    alert('Your session has expired. Please log in again.');
                    navigate('/home');
                  } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
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
            const response = await fetch(`${apiUrl}/blob?fileName=${storageFileName}`, {
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

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Videos</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                    <li key={index} 
                        className={`flex flex-col items-center bg-gray-800 shadow-md p-5 rounded-lg cursor-pointer ${
                            expandedIndex === index ? 'sm:col-span-2 lg:col-span-2' : ''
                        }`}
                        onClick={() => toggleExpand(index)}
                    >
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
                        <div className='w-full flex justify-around items-center'>
                            <button
                                    onClick={() => navigator.clipboard.writeText(generateShareableLink(video.sasUrl, video.fileName))}
                                    className="mt-2 bg-teal-500 text-white py-1 px-4 rounded"
                                >
                                Copy Link
                            </button>
                            <button onClick={() => {e.stopPropagation(); deleteBlob(video.storageFileName);}} className="mt-2 bg-red-500 text-white py-1 px-4 rounded">Delete</button>
                        </div>
                        <p>{video.storageFileName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VideoList;

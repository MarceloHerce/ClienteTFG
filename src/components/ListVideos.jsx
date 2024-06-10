import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaCloudDownloadAlt } from "react-icons/fa";
import VideoModal from './VideoModal';

const apiUrl = import.meta.env.VITE_APP_USERAPI;
function VideoList() {
    const [videos, setVideos] = useState([]);
    const [metadata, setMetadata] = useState({});
    const { jwt, setJwt } = useContext(AppContext);
    const [modalVideo, setModalVideo] = useState(null);
    const navigate = useNavigate();

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
                    navigate('/');
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
    const handleDownload = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const generateShareableLink = (sasUrl, fileName) => {
        const baseUrl = `${apiUrl}/video`;
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
    const openModal = (video) => {
        if (window.innerWidth >= 640) {
            setModalVideo(video);
        }
    };

    const closeModal = () => {
        setModalVideo(null);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Videos</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                    <li key={index} 
                        className={`flex flex-col items-center bg-gray-800 shadow-md p-5 rounded-lg lg:cursor-pointer`}
                        onClick={() => openModal(video)}
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
                            <div className='flex gap-3'>
                                <button
                                        onClick={(e) => {e.stopPropagation(); navigator.clipboard.writeText(generateShareableLink(video.sasUrl, video.fileName))}}
                                        className="mt-2 bg-teal-500 text-white py-1 px-4 rounded hidden focus:outline-none"
                                    >
                                    Copy Link
                                </button>
                                <button 
                                    onClick={(e) => {e.stopPropagation(); handleDownload(video.sasUrl, `${video.fileName}.webm`)}} 
                                    className="mt-2 bg-teal-50 text-white py-1 px-4 rounded focus:outline-none"
                                    >
                                    <FaCloudDownloadAlt className='text-black text-lg'/>
                                </button>
                            </div>
                            <button onClick={(e) => {e.stopPropagation();  
                                if (window.confirm('Are you sure you want to delete this video?')) {
                                     deleteBlob(video.storageFileName);
                                }}} className="mt-2 bg-red-500 text-white py-1 px-4 rounded">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {modalVideo && <VideoModal video={modalVideo} isOpen={!!modalVideo} onClose={closeModal} className="sm:hidden"/>}
        </div>
    );
}

export default VideoList;

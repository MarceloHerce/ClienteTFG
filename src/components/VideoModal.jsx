import React from 'react'; 

const VideoModal = ({ video, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-gray-800 p-5 rounded-lg shadow-lg text-white flex flex-col items-center max-w-full">
                <h2 className="text-xl font-bold mb-4">{video.fileName}</h2>
                <video className="w-9/12 h-auto" controls autoPlay>
                    <source src={video.sasUrl} type="video/webm" />
                    Your browser does not support the video tag.
                </video>
                <button onClick={onClose} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default VideoModal;
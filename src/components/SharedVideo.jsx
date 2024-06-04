import React from 'react';
import { useLocation } from 'react-router-dom';

function VideoPlayerPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sasUrl = queryParams.get('sasUrl');
    const fileName = queryParams.get('fileName'); // Asumiendo que también estás pasando el nombre del archivo

    if (!sasUrl) {
        return <p>No video URL provided.</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{fileName || 'Video'}</h1>
            <video width="auto" height="auto" controls src={sasUrl}>
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default VideoPlayerPage;
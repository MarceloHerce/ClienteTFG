import React, { useState,useContext } from 'react';
import { AppContext } from '../context/AppContext';

const VideoPlayer = () => {
const { jwt  } = useContext(AppContext);
const token = jwt
    if(token!=""){
        const [videoUrl, setVideoUrl] = useState('');
        const getVideo = async () => {
            try {
            const response = await fetch('http://localhost:8080/blob/getVideo', {
                method: 'GET',
                headers: {
                'Authorization': 'Bearer '+token,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get recording');
            }

            const blob = await response.blob();
            const videoUrl = URL.createObjectURL(blob);
            setVideoUrl(videoUrl);
            } catch (error) {
            console.error('Error get recording:', error);
            }
        };

        return (
            <div>
            <button onClick={getVideo}>Get Video</button>
            {videoUrl && <video controls width="400" src={videoUrl} type="video/webm" />}
            </div>
        );      
    } else {
        return (
            <div>
              <button onClick={getVideo}>Get Video</button>
              <p>Firts login</p>
            </div>
          );
    }
};

export default VideoPlayer;

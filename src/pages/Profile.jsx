import React, { useContext, useEffect} from 'react';
import { AppContext } from '../context/AppContext';
import { jwtDecode } from "jwt-decode";
import VideoRecorder from "../components/VideoRecorder";
import VideoList from "../components/ListVideos";
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { jwt } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!jwt) {
          navigate('/');
        }
      }, [jwt, navigate]);
      
    return (
        <>
           <div className="mt-4">
            <VideoRecorder></VideoRecorder>
            <VideoList></VideoList>
           </div>
        </>
    )
}


export default Profile;
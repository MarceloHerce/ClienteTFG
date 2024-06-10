import Header from "../components/Header";
import App from "../App";
import Login from "../GoogleLogin";
import CaptureScreen from "../components/Button";
import RegisterForm from "../components/RegisterForm";
import VideoPlayer from "../components/PruebaGetVideo";
import BtnPrueba from "../components/PruebaPost";
import AboutUs from "./AboutUs";
import React, { useContext, useEffect} from 'react';
import { AppContext } from '../context/AppContext';
import { jwtDecode } from "jwt-decode";
import VideoRecorder from "../components/PruebaAlfa";
import VideoList from "../components/ListVideos";
import { useNavigate } from 'react-router-dom';
import Desespera2 from "../components/AboutComponents/Diagrama";

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
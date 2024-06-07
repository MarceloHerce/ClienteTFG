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
import Desesperao from "../components/PruebaAlfa";
import VideoList from "../components/ListVideos";
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { jwt } = useContext(AppContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!jwt) {
          navigate('/home');
        }
      }, [jwt, navigate]);
      
    console.log(jwt)
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const capitalizedSub = capitalizeFirstLetter(jwtDecode("eyJhbGciOiJIUzI1NiJ9.eyJjYW1wb1Byb3BpbyI6W3siYXV0aG9yaXR5IjoiVVNFUiJ9XSwic3ViIjoibWFyY2VsbyIsImlhdCI6MTcxNjMwODA2MSwiZXhwIjoxNzE2MzEwOTQxfQ.-Uy4a7ICxSKq_xAiSSowQfj13l0q0SADs-yLIOd1UCc").sub);
    return (
        <>
           <h2>Videos de {capitalizedSub}</h2>
           <div>
            <Desesperao></Desesperao>
            <VideoList></VideoList>
           </div>
        </>
    )
}


export default Profile;
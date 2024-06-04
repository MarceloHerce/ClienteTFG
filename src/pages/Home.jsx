import React, { useState } from 'react';
import Header from "../components/Header";
import App from "../App";
import LoginGoogle from "../GoogleLogin";
import CaptureScreen from "../components/Button";
import RegisterForm from "../components/RegisterForm";
import VideoPlayer from "../components/PruebaGetVideo";
import BtnPrueba from "../components/PruebaPost";
import AboutUs from "./AboutUs";
import HomeText from "../components/HomeText";
import LoginAndRegisterForm from '../components/LoginAndRegisterForm';

function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
    return (
        <>
            <HomeText openModal={openModal} />
            <VideoPlayer></VideoPlayer>
            <CaptureScreen></CaptureScreen>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-black p-6 rounded shadow-lg">
                  <div className="flex justify-end">
                    <button 
                      onClick={closeModal} 
                      className="p-2 text-teal-50 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                  <LoginAndRegisterForm onLoginSuccess={closeModal}/>
                </div>
              </div>
            )}
        </>
    )
}


export default Home;
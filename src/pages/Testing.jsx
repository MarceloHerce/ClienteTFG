import React, { useState, useRef, Suspense } from 'react';
import {Canvas} from "@react-three/fiber";
import { Environment, OrbitControls,  } from '@react-three/drei';
import Earth from "../../public/Earth";

const VideoRecorder = () => {
  return (
    <div className='w-auto h-96 pl-10 '>
      <Canvas >
      <ambientLight />
      <OrbitControls enableZoom={false} ></OrbitControls>
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      <Environment preset='sunset' />
    </Canvas>
    </div>
    
  );
};

export default VideoRecorder;

import React, { useState, useEffect, Suspense } from "react";
import {Canvas} from "@react-three/fiber";
import { Environment, OrbitControls,  } from '@react-three/drei';
import Earth from "../components/Earth";
import "../components/css/RegisterForm.css";
import Diagram from "../components/Diagram";
import diagramaDespliegue from "../assets/Diagrams/Diagrama_despliegue.png";
import diagramaCasodeuso1 from "../assets/Diagrams/DiagramaCasoDeUso_1.png";
import diagramaCasodeuso2 from "../assets/Diagrams/DiagramaCasoDeUso_2.png";
import diagramaCasodeusotabla1 from "../assets/Diagrams/DiagramaCasoDeUsoTabla_1.png";
import diagramaCasodeusotabla2 from "../assets/Diagrams/DiagramaCasoDeUsoTabla_2.png";
import diagramaCasodeusotabla3 from "../assets/Diagrams/DiagramaCasoDeUsoTabla_3.png";
import diagramaDeactividades1 from "../assets/Diagrams/DiagramaDeActividades_1.png";
import diagramaDeactividades2 from "../assets/Diagrams/DiagramaDeActividades_2.png";
import diagramaDeclases1 from "../assets/Diagrams/DiagramaDeClases_1.png";
import diagramaDecomponentes1 from "../assets/Diagrams/DiagramaDeComponentes_1.png";
import diagramaDecomponentes2 from "../assets/Diagrams/DiagramaDeComponentes_2.png";
import diagramaDesecuencia1 from "../assets/Diagrams/DiagramaDeSecuencia_1.png";
import diagramaEntidadrelacion from "../assets/Diagrams/DiagramaEntidadRelacion.png";


function AboutUs() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div className="w-full bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center md:flex-row md:justify-center md:col-span-3">
          <div className="flex flex-col items-start justify-center items-center h-full">
            <h1 className="text-4xl font-bold mb-4 text-teal-200 text-center">
              ScreenRecorder
            </h1>
            <p className="text-lg text-gray-600 text-teal-50">
              Marcelo Herce Sanz DAW
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center relative z-0">
            <div className='w-full h-96 pl-10 p-0 z-0 lg:w-1/2 '>
                <Canvas >
                  <ambientLight />
                  <OrbitControls enableZoom={false} ></OrbitControls>
                  <Suspense fallback={null}>
                    <Earth className="z-0"/>
                  </Suspense>
                  <Environment preset='sunset' />
                </Canvas>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-teal-200">
            Objetivos:
          </h2>
          <ul className="list-disc list-inside text-lg text-teal-50 mx-auto text-left  flex flex-col gap-3">
            <li>Trabajar con el formato Blob.</li>
            <li>Mejorar el desarrollo front-end mejorando la calidad del diseño.</li>
            <li>Trabajar con Azure.</li>
            <li>Implementar un despliegue basado en CI/CD.</li>
            <li>Profundizar el conocimiento de las herramientas de React.</li>
            <li>Trabajar con la documentación oficial.</li>
            <li>Implementar un diseño responsivo y mobile-first.</li>
            <li>Implementar autenticación y autorización.</li>
          </ul>
        </div>

        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-teal-200">Índice:</h2>
          <ul className="list-disc list-inside text-lg text-teal-50 mx-auto text-left flex flex-col gap-3 ">
            <a href="#casoDeUso"><li>Diagrama de casos de uso.</li></a>
            <a href="#clases"><li>Diagrama de clases.</li></a>
            <a href="#componentes"><li>Diagrama de componentes.</li></a>
            <a href="#entidadRelacion"><li>Diagrama de Entidad-Relación.</li></a>
            <a href="#actividades"><li>Diagrama de actividades.</li></a>
            <a href="#secuencia"><li>Diagrama de secuencia.</li></a>
            <a href="#despliegue"><li>Diagrama de despliegue.</li></a>
            <a href="#casoPrueba"><li>Casos de prueba.</li></a>
          </ul>
        </div>
      </div>

      <div id="casoDeUso" className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          Diagrama de casos de uso
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaCasodeuso1,diagramaCasodeuso2,diagramaCasodeusotabla1,diagramaCasodeusotabla2,diagramaCasodeusotabla3]}
          text={""}
        ></Diagram>
      </div>

      <div id="clases" className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          Diagrama de clases
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaDeclases1]}
          text={""}
        ></Diagram>
      </div>

      <div id="componentes" className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          Diagrama de componentes
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaEntidadrelacion]}
          text={""}
        ></Diagram>
      </div>

      <div id="entidadRelacion" className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          Diagrama de Entidad-Relación
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaDecomponentes1,diagramaDecomponentes2]}
          text={""}
        ></Diagram>
      </div>

      <div id="actividades" className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          Diagrama de actividades
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaDeactividades1,diagramaDeactividades2]}
          text={""}
        ></Diagram>
      </div>

      <div id="secuencia" className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          Diagrama de secuencia
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaDesecuencia1]}
          text={""}
        ></Diagram>
      </div>

      <div id="despliegue" className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          Diagrama de despliegue
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaDespliegue]}
          text={""}
        ></Diagram>
      </div>
      <div id="casoPrueba" className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          Casos de prueba
        </h2>
        <ol className="list-decimal list-inside text-lg text-teal-50 mx-auto">
          <li>Login con GoogleLogin</li>
          <li>Register y login propio</li>
          <li>Grabar pantalla</li>
        </ol>
      </div>

    </div>
  );
}

export default AboutUs;

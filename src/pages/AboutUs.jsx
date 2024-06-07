import React, { useState, useEffect } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import "../components/css/RegisterForm.css";
import LoginAndRegisterForm from "../components/LoginAndRegisterForm";
import Diagram from "../components/Diagram";
import diagramaComponentes1 from "../assets/Diagrams/diagrama_componentes_1.png";
import diagramaComponentes2 from "../assets/Diagrams/diagrama_componentes_2.png";
import diagramaActividades1 from "../assets/Diagrams/DiagramaDeActividades_1.png";
import diagramaActividades2 from "../assets/Diagrams/DiagramaDeActividades_2.png";
import diagramaDespliegue from "../assets/Diagrams/Diagrama_despliegue.png";

/*
    2) Documentación (Documento de texto / Web SPA / Notion / ...):
    - Portada o Landing page creativa y llamativa. En ella debe
    aparecer la denominación del ciclo (DAW), el título del
    proyecto y los nombres y apellidos del alumno.
    - Índice paginado (y con enlace a cada punto) o NavBar con
    un orden coherente de los elementos.
    - Diagrama de casos de uso.
    - Diagrama de clases.
    - Diagrama Entidad-Relación.
    - Diagrama de componentes.
    - Diagrama de actividades.
    - Diagrama de secuencia.
    - Diagrama de despliegue.
    - Casos de prueba.
*/
function AboutUs() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Section 1 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3">
          <h1 className="text-4xl font-bold mb-4 text-teal-200 text-center">
            ScreenRecorder
          </h1>
          <p className="text-lg text-gray-600 text-teal-50">
            Marcelo Herce Sanz DAW
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-teal-200">
            Objectives:
          </h2>
          <ul className="list-disc list-inside text-lg text-teal-50 mx-auto text-left">
            <li>Work with the Blob format.</li>
            <li>Improve front-end development by enhancing design quality.</li>
            <li>Work with Azure.</li>
            <li>Implement a CI/CD-based deployment.</li>
            <li>Deepen knowledge of React tools.</li>
            <li>Work with official documentation.</li>
            <li>Implement responsive and mobile-first design.</li>
            <li>Implement authentication and authorization.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-teal-200">Índice:</h2>
          <ul className="list-disc list-inside text-lg text-teal-50 mx-auto text-left">
            <li>Diagrama de casos de uso.</li>
            <li>Diagrama de clases.</li>
            <li>Diagrama de componentes.</li>
            <li>Diagrama de secuencia.</li>
            <li>Diagrama de despliegue.</li>
            <li>Casos de prueba.</li>
          </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          What you need to start?
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaComponentes1, diagramaComponentes2]}
          text={"This is a sample text for the diagram component."}
        ></Diagram>
      </div>

      <div className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          What you need to start?
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaActividades1, diagramaActividades2]}
          text={"This is a sample text for the diagram component."}
        ></Diagram>
      </div>

      <div className=" bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-3 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">
          What you need to start?
        </h2>
        <Diagram
          isOpen={isOpen}
          photos={[diagramaDespliegue]}
          text={"This is a sample text for the diagram component."}
        ></Diagram>
      </div>
    </div>
  );
}

export default AboutUs;

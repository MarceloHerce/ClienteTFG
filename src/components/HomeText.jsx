import React, { useContext } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { AppContext } from '../context/AppContext'; 
import { useNavigate } from 'react-router-dom';


function HomeText({ openModal }) {
  const { jwt } = useContext(AppContext);
  const navigate = useNavigate();

  const props = useSpring({
    from: { opacity: 1 },
    to: async (next) => {
      while (true) {
        await next({opacity: 0.7 });
        await next({opacity: 1 });
      }
    },
    config: { duration: 800 },
    reset: true,
    reverse: jwt === ''
  });

  const handleClick = () => {
    if (!jwt) {
      openModal();
    } else {
      navigate("/profile")
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md md:col-span-3">
          <h1 className="text-2xl font-bold mb-4 text-teal-200 text-center md:text-4xl">
            Graba la pantalla de tu ordenador y almacenala en la nube
          </h1>
          <p className="text-lg text-gray-600 text-teal-50">
            ¿Necesitas capturar la actividad de tu pantalla de manera rápida y fácil? Nuestra herramienta de grabación de pantalla para escritorio es la solución perfecta. Con solo unos pocos clics, puedes grabar todo lo que sucede en tu pantalla y almacenar los videos de manera segura en la nube.
          </p>
        </div>

        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-teal-200">
            Características clave:
          </h2>
          <ul className="list-disc list-inside text-lg text-teal-50 mx-auto text-left">
            <li>Grabación de alta calidad: Captura cada detalle en alta resolución.</li>
            <li>Almacenamiento seguro en la nube: Guarda tus videos de manera segura y accede a ellos desde cualquier lugar.</li>
            <li>Fácil de usar: Una interfaz intuitiva que no requiere conocimientos técnicos avanzados.</li>
            <li>Compartir con un clic: Comparte fácilmente tus grabaciones con colegas, amigos o clientes.</li>
            <li>Sin límites de tiempo: Graba tanto como necesites sin restricciones.</li>
          </ul>
        </div>

        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-teal-200">
            Como funciona:
          </h2>
          <ol className="list-decimal list-inside text-lg text-teal-50 mx-auto text-justify">
            <li><strong>Registrate:</strong> Entra en tu perfil y comienza a grabar.</li>
            <li><strong>Previsualización:</strong> Tras finalizar la grabación tendrás una previsualización.</li>
            <li><strong>Almacenamiento:</strong> Guarda tus videos directamente en la nube para acceder a ellos en cualquier momento y lugar.</li>
            <li><strong>Compártelo:</strong> Comparte tus grabaciones instantáneamente con cualquier persona.</li>
          </ol>
        </div>

        <div className=" bg-gray-800 text-white p-6 rounded-lg shadow-md md:col-span-3 text-center ">
          <h2 className="text-2xl font-semibold mb-4 text-teal-200">¿Qué necesitas para empezar?</h2>
          <p className='p-3'>
            Solo necesitas registrarte. <strong>¡Empieza ahora y descubre lo sencillo que es capturar y compartir tu pantalla!</strong>
          </p>
          <animated.button
            style={props}
            onClick={handleClick}
            className="bg-teal-500 text-white font-bold py-2 px-6 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:bg-teal-300 focus:ring-opacity-50"
          >
            {jwt === '' ? 'Iniciar sesión' : 'Grabar pantalla'}
          </animated.button>
        </div>

      </div>

    </div>
  );
}

export default HomeText;

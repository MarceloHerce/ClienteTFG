import React, { useState, useContext, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";
import ErrorPage from "../pages/Error";
import { Link } from "react-router-dom";
import "./router.css"

import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Profile from "../pages/Profile";
import VideoPlayerPage from "../components/SharedVideo";
import Logout from "../components/Logout";
import { AppContext } from '../context/AppContext';


function Root() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { jwt, setJwt} = useContext(AppContext);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 

  return (
    <>
      <header id="header" className="flex justify-between items-center w-full py-6 px-5 lg:px-64 bg-teal-700">
        <div className="headerBody z-20 flex gap-4 items-center ">
          
          <h1 className="font-semibold text-teal-50 text-lg "><Link to="/" className="text-teal-50 hover:text-teal-100 ">Screenrecorder</Link></h1>
          <div className="w-10">
            <svg  viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_5_445)">
            <path d="M127.711 477.547C-42.57 379.377 -42.57 132.622 127.711 34.453C297.992 -63.716 512 59.662 512 256C512 452.338 297.993 575.716 127.711 477.547ZM462.954 256C462.954 97.277 289.947 -2.46297 152.29 76.898C14.633 156.259 14.632 355.74 152.29 435.101C289.948 514.462 462.954 414.722 462.954 256ZM390.028 381.707L340.185 336.28L344.067 332.027L393.91 377.453L390.028 381.707ZM118.649 378.077L114.897 373.712L166.057 329.782L169.809 334.148L118.649 378.077ZM401.461 368.282L347.493 327.846L350.948 323.233L404.915 363.669L401.461 368.282ZM106.64 363.056L103.366 358.318L158.838 319.969L162.113 324.707L106.64 363.056ZM411.554 353.823L353.964 318.743L356.957 313.825L414.547 348.905L411.554 353.823ZM96.271 346.852L93.508 341.799L152.683 309.465L155.445 314.518L96.271 346.852ZM420.213 338.463L359.523 309.066L362.032 303.878L422.722 333.276L420.213 338.463ZM87.646 329.663L85.429 324.341L147.661 298.371L149.878 303.693L87.646 329.663ZM427.359 322.343L364.13 298.9L366.133 293.499L429.362 316.943L427.359 322.343ZM80.869 311.665L79.22 306.14L143.824 286.814L145.473 292.339L80.869 311.665ZM432.929 305.617L367.748 288.338L369.222 282.768L434.402 300.047L432.929 305.617ZM76.01 293.047L74.947 287.387L141.219 274.92L142.283 280.58L76.01 293.047ZM436.873 288.428L370.33 277.48L371.264 271.797L437.807 282.746L436.873 288.428ZM73.124 274.031L72.657 268.291L139.869 262.823L140.336 268.562L73.124 274.031ZM439.146 270.947L371.866 266.424L372.249 260.674L439.529 265.197L439.146 270.947ZM139.656 256.404L72.24 254.82L72.375 249.058L139.789 250.642L139.656 256.404ZM372.333 255.27L372.165 249.508L439.568 247.562L439.736 253.323L372.333 255.27ZM140.252 244.24L73.372 235.617L74.109 229.901L140.989 238.523L140.252 244.24ZM371.613 243.114L370.848 237.404L437.683 228.421L438.448 234.131L371.613 243.114ZM142.117 232.202L76.506 216.637L77.833 211.033L143.444 226.598L142.117 232.202ZM369.638 231.099L368.277 225.501L433.801 209.581L435.162 215.18L369.638 231.099ZM145.228 220.429L81.6 198.089L83.508 192.655L147.135 214.994L145.228 220.429ZM366.408 219.357L364.473 213.933L427.977 191.251L429.913 196.675L366.408 219.357ZM149.552 209.044L88.61 180.178L91.074 174.974L152.015 203.84L149.552 209.044ZM361.975 208.017L359.477 202.824L420.264 173.629L422.762 178.823L361.975 208.017ZM155.043 198.177L97.453 163.1L100.451 158.177L158.041 193.254L155.043 198.177ZM356.383 197.204L353.356 192.298L410.756 156.908L413.782 161.814L356.383 197.204ZM161.64 187.94L108.033 147.034L111.526 142.454L165.134 183.36L161.64 187.94ZM349.682 187.034L346.16 182.471L399.548 141.275L403.07 145.838L349.682 187.034ZM169.272 178.451L120.233 132.164L124.188 127.972L173.228 174.26L169.272 178.451ZM325.427 162.655L320.723 159.325L359.736 104.319L364.44 107.649L325.427 162.655ZM315.288 155.909L310.27 153.085L343.313 94.307L348.332 97.132L315.288 155.909ZM203.461 165.269C133.725 205.473 133.725 306.527 203.461 346.731C273.197 386.935 360.841 336.407 360.841 256C360.841 175.593 273.197 125.065 203.461 165.269ZM245.267 274.536C231.02 266.323 231.02 245.677 245.267 237.464C259.513 229.251 277.418 239.574 277.418 256C277.418 272.426 259.513 282.75 245.267 274.536ZM283.681 241.708C259.247 227.621 259.247 192.212 283.681 178.125C308.115 164.038 338.826 181.743 338.826 209.917C338.826 238.091 308.116 255.795 283.681 241.708Z" fill="#90E2D3"/>
            <path d="M311.561 312.561C304.207 319.934 295.469 325.782 285.848 329.767C276.227 333.751 265.914 335.796 255.5 335.781C211.715 335.781 176.219 300.285 176.219 256.5C176.219 212.715 211.715 177.219 255.5 177.219" stroke="black" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M334.781 234V284.322C334.782 284.97 334.612 285.606 334.289 286.167C333.965 286.728 333.5 287.194 332.939 287.518C332.378 287.842 331.742 288.013 331.095 288.013C330.447 288.013 329.811 287.843 329.25 287.519L300.937 271.176V283.603C300.937 285.559 300.16 287.435 298.777 288.818C297.394 290.201 295.518 290.978 293.562 290.978H217.438C215.482 290.978 213.606 290.201 212.223 288.818C210.84 287.435 210.063 285.559 210.063 283.603V229.397C210.063 227.441 210.84 225.565 212.223 224.182C213.606 222.799 215.482 222.022 217.438 222.022H263" stroke="black" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M255.5 267.562C261.61 267.562 266.562 262.61 266.562 256.5C266.562 250.39 261.61 245.438 255.5 245.438C249.39 245.438 244.438 250.39 244.438 256.5C244.438 262.61 249.39 267.562 255.5 267.562Z" fill="#57A39E" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_5_445">
            <rect width="512" height="512" fill="white"/>
            </clipPath>
            </defs>
            </svg>
          </div>  
        </div>
        <nav className={isMenuOpen ? "open" : ""}>
          <ul className="hidden md:flex items-center space-x-5">
            <li >
              <Link to="/" className="text-teal-50 hover:text-teal-100">Inicio</Link>
            </li>
            <li >
              <Link to="/aboutUs" className="text-teal-50 hover:text-teal-100">Sobre nosotros</Link>
            </li>
            {jwt && (
              <li >
              <Link to="/profile" className="text-teal-50 hover:text-teal-100">Perfil</Link>
              </li>
            )}
            {jwt && (
              <li >
                <Logout />
              </li>
            )}
          </ul>
          <button className="menu-toggle space-y-1 group bg-transparent border-0 md:hidden " onClick={toggleMenu}>
            <div className="w-6 h-1 bg-teal-50"></div>
            <div className="w-6 h-1 bg-teal-50"></div>
            <div className="w-6 h-1 bg-teal-50"></div>
            <ul className="bg-teal-700 w-screen pb-10 absolute -top-full group-focus:top-0 right-0 duration-150
            flex flex-col space-y-3 justify-end z-10">
              <button className="px-10 py-8 relative ml-auto bg-transparent border-0">
                <div className="w-6 h-1 rotate-45 absolute bg-teal-50"></div>
                <div className="w-6 h-1 -rotate-45 absolute bg-teal-50"></div>
              </button>
              <li className="flex justify-center w-full py-4 hover:bg-teal-600">
                <Link to="/" className="w-full text-teal-50 hover:text-teal-100">Home</Link>
              </li>
              <li className="flex justify-center w-full py-4 hover:bg-teal-600">
                <Link to="/aboutUs" className="w-full text-teal-50 hover:text-teal-100">Sobre nosotros</Link>
              </li>
              {jwt && (
                <li className="flex justify-center w-full py-4 hover:bg-teal-600">
                <Link to="/profile" className="w-full text-teal-50 hover:text-teal-100">Perfil</Link>
                </li>
              )}
              
              {jwt && (
                <li className="flex justify-center w-full py-4 hover:bg-teal-600">
                  <Logout />
                </li>
              )}
            </ul>
            
          </button>
        </nav>
      </header>
      <div id="detail">
          <Outlet />
      </div>
    </>
  );
  }

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children:[
        {
          path: "/",
          element: <Home />
        },
        {
            path: "/aboutUs",
            element: <AboutUs />
        },
        {
          path: "/profile",
          element: <Profile />
        },
        {
          path: "/video", 
          element: <VideoPlayerPage />,
        },

    ]
  },
]);

export default function AppRouter({ children }) {
  return (
    <RouterProvider router={router}>
      {children}
    </RouterProvider>
  );
}

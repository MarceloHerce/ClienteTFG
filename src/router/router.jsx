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
import TestScreenRecorder from "../pages/Testing";
import Logout from "../components/Logout";
import { AppContext } from '../context/AppContext';
import DarkLigthMode from "../components/DarkLigth";


function Root() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { jwt, setJwt} = useContext(AppContext);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 

  return (
    <>
      <header id="header" className="flex justify-between items-center w-full py-6 px-5 lg:px-64 bg-teal-700">
        <div className="headerBody">
          <h1 className="font-semibold text-teal-50 text-lg">ScreenRecorder</h1>
        </div>
        <nav className={isMenuOpen ? "open" : ""}>
          <ul className="hidden md:flex items-center space-x-5">
            <li >
              <Link to="/home" className="text-teal-50 hover:text-teal-100">Home</Link>
            </li>
            <li >
              <Link to="/aboutUs" className="text-teal-50 hover:text-teal-100">About Us</Link>
            </li>
            {jwt && (
              <li >
              <Link to="/profile" className="text-teal-50 hover:text-teal-100">Profile</Link>
              </li>
            )}
            <li >
              <Link to="/testing" className="text-teal-50 hover:text-teal-100">Test</Link>
            </li>
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
            flex flex-col space-y-3 justify-end">
              <button className="px-10 py-8 relative ml-auto bg-transparent border-0">
                <div className="w-6 h-1 rotate-45 absolute bg-teal-50"></div>
                <div className="w-6 h-1 -rotate-45 absolute bg-teal-50"></div>
              </button>
              <li className="flex justify-center w-full py-4 hover:bg-teal-600">
                <Link to="/home" className="w-full text-teal-50 hover:text-teal-100">Home</Link>
              </li>
              <li className="flex justify-center w-full py-4 hover:bg-teal-600">
                <Link to="/aboutUs" className="w-full text-teal-50 hover:text-teal-100">About Us</Link>
              </li>
              {jwt && (
                <li className="flex justify-center w-full py-4 hover:bg-teal-600">
                <Link to="/profile" className="w-full text-teal-50 hover:text-teal-100">Profile</Link>
                </li>
              )}
              <li className="flex justify-center w-full py-4 hover:bg-teal-600">
                <Link to="/testing" className="w-full text-teal-50 hover:text-teal-100">Test</Link>
              </li>
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
          path: "/home",
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
        {
          path: "/testing",
          element: <TestScreenRecorder />,
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

import React, { useState } from "react";
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


function Root() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 

  return (
    <>
      <header id="header">
        <div className="headerBody">
          <h1>ScreenRecorder</h1>
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
        </div>
        <nav className={isMenuOpen ? "open" : ""}>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/aboutUs">About Us</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/testing">Test</Link>
            </li>
          </ul>
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

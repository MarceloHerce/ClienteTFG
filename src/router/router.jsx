import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";
import ErrorPage from "../pages/Error";
import { Link } from "react-router-dom";


import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";

function Root() {
    return (
      <>
        <header id="header">
          <h1>ScreenRecorder</h1>
          <nav>
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
        }
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

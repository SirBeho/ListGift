import SideBar from "./SideBar";
import NavBar from "./NavBar";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthProvider";


/* axios.interceptors.request.use(
  (config) => {

    config.headers["Content-Type"] = "application/json";
    config.headers.Authorization = `Bearer ` + sessionStorage.getItem("myToken");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); */

//Layout (childen y user)
export default function Layout({ children  }) {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(sessionStorage.getItem("sidebarOpen") == "true");

  useEffect(() => {
    sessionStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

 

  return (
    <div className="flex h-full light-theme ">
       {/* <SideBar sidebarController={[sidebarOpen, setSidebarOpen]} user={user} /> */}
 
      <div className="flex flex-col w-full h-full min-h-screen justify-between bg-gray-200">
        <div className="">
           <NavBar sidebarController={[sidebarOpen, setSidebarOpen]} user={user} logout={logout} /> 

          {children}
        </div>
        <footer className="bg-white dark:bg-gray-700  text-center  flex justify-between py-2 px-5">
          <p className=""> Universidad BTC. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

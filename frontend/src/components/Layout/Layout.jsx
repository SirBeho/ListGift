import SideBar from "./SideBar";
import NavBar from "./NavBar";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const [sidebarOpen, setSidebarOpen] = useState(localStorage.getItem("sidebarOpen") === "true");

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);



  useEffect(() => {
    if (user == null) {
      navigate("/");

    }
  }, []);

  if (user == null) {
    return null;
  }

  return (

    <div className="flex h-full light-theme overflow-hidden  ">
      <SideBar sidebarController={[sidebarOpen, setSidebarOpen]} user={user} />

      <div className={`flex flex-col w-full h-full min-h-screen justify-between app-content ${sidebarOpen ? "ml-60" : "ml-14"} transition-all duration-300 ease-out`}>
        <div className="apsolute">
          <NavBar sidebarController={[sidebarOpen, setSidebarOpen]} user={user?.name} logout={logout} />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        </div>
        <footer className="bg-white dark:bg-gray-700  text-center  flex justify-between py-2 px-5">
          <p className=""> Universidad BTC. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>

  );
}

import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { motion } from "framer-motion";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import Footer from "./Footer";


export default function Layout() {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(localStorage.getItem("sidebarOpen") === "true");
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  // UX PRO: Cerrar el sidebar automáticamente en móvil al cambiar de ruta
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center">Cargando...</div>;

  return (
    <div className="flex h-screen light-theme overflow-hidden  dark:bg-gray-900">

      {/* SIDEBAR: Pasamos el estado */}
      {user &&
        <SideBar sidebarController={[sidebarOpen, setSidebarOpen]} />}

      {user && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm sm:hidden"
        />
      )}



      <div className={`flex flex-col w-full h-full min-h-screen justify-between
          ml-0 ${user && (sidebarOpen ? "sm:ml-60" : location.pathname == "/" ? "ml-0" : "sm:ml-14")} transition-all duration-300 ease-out`} >

        <div className='flex-1  flex-grow flex flex-col overflow-y-auto app-content overflow-x-hidden'>

          <NavBar sidebarController={[sidebarOpen, setSidebarOpen]} />

          <motion.div id="main-scroll-area"
            className={`flex-1  overflow-y-auto ${!user && location.pathname != "/" ? "mt-14" : ""}`}
            key={location.pathname}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}

          /* className="p-4" // Añadido padding para que no pegue al borde */

          >
            <Outlet />


            <Footer full={true} />

          </motion.div>
        </div>



      </div>
    </div >
  );
}
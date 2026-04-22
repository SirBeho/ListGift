import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from "react";
import { useRef } from "react";
import { useAuth } from "../providers/AuthProvider";
import { motion } from "framer-motion";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import Footer from "./Footer";

const visitedKeys = new Set();

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(localStorage.getItem("sidebarOpen") === "true");
  const location = useLocation();
  const navType = useNavigationType();



  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // 2. RESTAURAR (Lógica inteligente)
  useLayoutEffect(() => {
    if (visitedKeys.has(location.key)) {
      const savedPosition = sessionStorage.getItem(`scroll-${location.pathname}`);

      if (savedPosition) {

        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            behavior: "instant"
          });
        });
      }
    } else {
      window.scrollTo(0, 0);
      if (location.key !== "default") {
        visitedKeys.add(location.key);
      }
    }
  }, [location.key, navType]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen  light-theme   dark:bg-gray-900">

      {/* SIDEBAR: Pasamos el estado */}
      {user && (
        <aside className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}>
          <SideBar sidebarController={[sidebarOpen, setSidebarOpen]} />
        </aside>
      )}

      {user && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm sm:hidden"
        />
      )}


      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300  
          ${user ? (sidebarOpen ? "sm:ml-60" : location.pathname == "/" ? "ml-0" : "sm:ml-14") : "ml-0"}`}>

        <NavBar sidebarController={[sidebarOpen, setSidebarOpen]} />


        {/* SEMÁNTICA SEO: Usamos <main> y <article> */}
        <main className={`flex-1 ${user ? '' : 'pt-14'}`}>
          <motion.article
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.article>
        </main>

        <Footer full={true} />
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from '../service/Notifications'; // Ajusta si cambiaste la ruta
import {

  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";
import Alert from '../components/Alert';
import { useAuth } from "../providers/AuthProvider";
import Logo from "../components/Logo";

export default function Navbar({ sidebarController }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = sidebarController;
  const [menuOpen, setMenuOpen] = useState(false);
  const { subscribeUser } = useNotifications();
  const [apiRes, setApiRes] = useState(null);
  const location = useLocation();

  const handleSupcribe = async () => {
    const response = await subscribeUser();
    setApiRes(response);
  };

  // ---------------------------------------------------------
  // MODO PÚBLICO (No hay usuario logueado)
  // ---------------------------------------------------------
  if (!user) {
    return (
      <nav className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 h-16 bg-white shadow-sm border-b border-gray-100">
        {/* IZQUIERDA: Identidad de Marca (Rellena el espacio vacío) */}
        <Logo letra={true} />

        {/* DERECHA: Solo el botón de acción */}
        <div className="flex items-center">
          {/* Si estoy en login, muestro ir a registro, y viceversa */}

          <Link
            to="/login"
            className="px-5 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/50 transition-colors shadow-md shadow-indigo-200"
          >
            Iniciar Sesión
          </Link>

        </div>
      </nav>
    );
  }

  // ---------------------------------------------------------
  // MODO PRIVADO (Usuario Logueado - Tu código original optimizado)
  // ---------------------------------------------------------
  return (
    <nav className="sticky top-0 left-0 w-full z-40 flex justify-between px-4 h-14 bg-white dark:bg-gray-800 shadow-sm items-center border-b border-gray-200 dark:border-gray-700">
      <Alert apiRes={apiRes} variant="toast" onClose={() => setApiRes(null)} />

      {/* IZQUIERDA: Toggle Sidebar + Breadcrumbs/Logo */}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200"
        >
          <Bars3Icon strokeWidth={2} className="w-6 h-6" />
        </button>

        {/* Opcional: Mostrar dónde estás o el logo también aquí */}
        <Link to="/" className="flex items-center gap-2 hover:scale-105">
          {/* <h1 className="mr-2">HOME </h1> */}
          {/*   home solido */}
          <HomeIcon className="w-5 h-5" />
          <span>HOME</span>
        </Link>


      </div>

      {/* DERECHA: Menú de Usuario */}
      <div className="relative z-40">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200"
        >
          <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
            <img className="w-full h-full object-cover" src="https://i.pravatar.cc/300" alt="Avatar" />
          </div>
          <span className="hidden md:block font-semibold text-sm text-gray-700 dark:text-gray-200">
            {user?.name || user?.username || "Usuario"}
          </span>
          {/* Flechita pequeña */}
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <>
            {/* Backdrop invisible para cerrar al hacer clic fuera */}
            <div className="fixed inset-0 " onClick={() => setMenuOpen(false)}></div>

            <div className="absolute right-0  mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <UserCircleIcon className="w-5 h-5" />
                Mi Perfil
              </Link>

              <button
                onClick={() => { handleSupcribe(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                {/* Icono campana */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Activar Notificaciones
              </button>

              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  ListBulletIcon,
  LinkIcon,
  UserCircleIcon, PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../providers/AuthProvider";
import { ICON_MAP } from '../utils/iconLibrary';


export default function SideBar({ sidebarController }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = sidebarController;
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const sidebarRef = useRef(null);

  const handleSubmenuToggle = (e, submenuKey) => {
    e.preventDefault();
    setOpenSubmenu(openSubmenu === submenuKey ? null : submenuKey);
  };

  useEffect(() => {
    if (!sidebarOpen) {
      setOpenSubmenu(null);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) {
      setOpenSubmenu(null);
    }
  }, [sidebarOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full z-40  bg-indigo-700 border-indigo-500 border-e  w-52
      ${sidebarOpen ? "toggle translate-x-0 md:w-60" : "-translate-x-full md:translate-x-0 md:w-14"}
      transition-all duration-300 ease-out min-h-screen flex flex-col text-white shadow-xl`}

    >

      {/* Logo y Título */}
      <div className="flex items-center gap-2 h-14 px-3 py-2 border-indigo-500 border-b shrink-0">
        <div className="w-8 min-w-[2rem] h-8 rounded-full overflow-hidden bg-white/20">
          <img className="object-cover w-full h-full" src="../pictures/logo.jpg" alt="Logo" />
        </div>
        {/* En móvil siempre mostramos texto si está abierto (que es siempre que se ve) */}
        <span className={`text-lg font-semibold overflow-hidden whitespace-nowrap transition-opacity duration-300
           ${sidebarOpen ? "opacity-100 w-auto" : "md:opacity-0 md:w-0 opacity-100"}`}>
          List Gifts
        </span>
      </div>

      {/* Información del Usuario */}
      <div className="flex flex-col gap-1 px-3 py-4 border-b border-indigo-600 shrink-0">
        <div className="flex items-center gap-3">
          <UserCircleIcon className="w-8 h-8 text-indigo-200 min-w-[2rem]" />
          <div className={`transition-opacity duration-300   ${sidebarOpen ? "opacity-100 " : "md:opacity-0"}`}>
            <span className="font-semibold text-sm leading-tight whitespace-nowrap">{user.name}</span>
            <span className="text-xs text-indigo-300">{user.role?.name || "Usuario"}</span>
          </div>
        </div>
      </div>

      {/* Menú Principal */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="flex flex-col space-y-1">
          <li>
            <div className="relative rounded-md overflow-hidden">

              <div className={`w-full flex items-center justify-between rounded-md text-gray-100 `}>
                <Link to="/dashboard" className="flex-1 flex items-center hover:bg-indigo-500  rounded-l-md" >
                  <PresentationChartLineIcon className="w-5 h-5 m-2" />
                  <span className={`${sidebarOpen ? "opacity-100" : "opacity-0 hidden"} whitespace-nowrap`}>Dashboard</span>
                </Link>
              </div>


            </div>
          </li>

          <li>
            <div className="relative rounded-md overflow-hidden">

              <div className={`w-full flex items-center justify-between rounded-md text-gray-100 ${openSubmenu === "lists" ? "bg-indigo-600" : ""}`}>
                <Link to="/lists" className="flex-1 flex items-center hover:bg-indigo-500  rounded-l-md" >
                  <ListBulletIcon className="w-5 h-5 m-2" />
                  <span className={`${sidebarOpen ? "opacity-100" : "opacity-0 hidden"} whitespace-nowrap`}>Listas</span>
                </Link>
                <button onClick={(e) => { e.preventDefault(); handleSubmenuToggle(e, "lists"); }}
                  className={`border-l border-indigo-500/30 hover:bg-indigo-500  h-full flex items-center rounded-r-md ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
                  <ChevronDownIcon className={`w-10 h-9 px-2 transition-transform duration-300  ${openSubmenu === "lists" ? "rotate-180" : ""}`} />
                </button>
              </div>

              <ul className={`ml-2 mt-1 overflow-hidden interpolate transition-all    ${openSubmenu === "lists" ? "h-fit  " : "h-0 mt-0"}`} >
                {user.lists && user.lists.length > 0 ? (
                  user.lists.map((item) => {
                    const SelectedIcon = ICON_MAP[item.icon] || ICON_MAP['gift'];
                    return (
                      <li key={item.id} className="relative pl-3">
                        <Link to={`/lists/${item.id}`} className={`flex items-center py-2 px-4 rounded-md rounded-s-none text-gray-200 hover:bg-indigo-700 ${window.location.pathname === `/list/${item.id}` ? "bg-indigo-800" : ""} before-submenu-line`}>
                          <SelectedIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className={`${sidebarOpen ? "opacity-100" : "opacity-0  "} whitespace-nowrap`}> {item.name} </span>
                        </Link>
                      </li>
                    )
                  })
                ) : (
                  <li className="py-2 px-4 text-gray-200">
                    <span
                      className={`${sidebarOpen ? "opacity-100" : "opacity-0"
                        } whitespace-nowrap`}
                    >
                      No hay listas
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </li>



          {/* Aquí podrías añadir más elementos de menú */}
          <li>
            <Link
              to="/otra-seccion"
              className={`flex items-center py-2 px-3 rounded-md cursor-pointer text-gray-100 hover:bg-indigo-500`}
            >
              {/* <IconoParaOtraSeccion className="w-5 h-5 mr-2" /> */}
              <span
                className={`${sidebarOpen ? "opacity-100" : "opacity-0"
                  } whitespace-nowrap`}
              >
                Otra Sección
              </span>
            </Link>
          </li>
          {/* ... más elementos de menú ... */}
        </ul>
      </nav>
    </aside>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  ListBulletIcon,
  LinkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function SideBar({ sidebarController, user }) {
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
      className={`fixed top-0 left-0 h-full z-20 bg-indigo-700 border-indigo-500 border-e ${sidebarOpen ? "w-60 toggle" : "w-14 "
        } transition-width duration-300 ease-out min-h-screen flex flex-col`}
    >
      {/* Logo y Título */}
      <div
        className={`flex items-center gap-2 h-14 px-3 py-2 border-indigo-500 border-b`}
      >
        <div className="w-8 min-w-[2rem] h-8 rounded-full overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src="../pictures/logo.jpg"
            alt="Logo"
          />
        </div>
        <span
          className={`text-lg font-semibold  text-gray-100 overflow-hidden interpolate whitespace-nowrap ${sidebarOpen ? "w-fit" : "hidden w-0"}`}>
          List Gits
        </span>
      </div>

      {/* Información del Usuario */}
      <div
        className={`flex flex-col gap-1 px-3 py-3 border-indigo-500 border-b`}
      >
        <div className="flex items-center gap-2">
          <UserCircleIcon className={`w-6 h-6 text-gray-300`} />
          <span className={`font-semibold text-gray-100 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
            {user.name}
          </span>
        </div>
        <span className={`text-sm text-gray-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
          {sidebarOpen ? user.role.name :   user.role.name}
        </span>
      </div>

      {/* Menú Principal */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="flex flex-col space-y-1">
          {user.role_id === 1 && (
            <li>
              <div className="relative rounded-md overflow-hidden">
                <Link to={`/lists`} className={`w-full flex items-center justify-between  rounded-md cursor-pointer text-gray-100 hover:bg-indigo-500 ${openSubmenu === "lists" ? "bg-indigo-600" : ""}`} >
                  <div className="flex items-center ">
                    <ListBulletIcon className="w-5 h-5 m-2 " />
                    <span className={`${sidebarOpen ? "opacity-100" : "opacity-0"} whitespace-nowrap`}>
                      Listas
                    </span>
                  </div>
                  <ChevronDownIcon onClick={(e) => handleSubmenuToggle(e, "lists")} className={`w-14 h-9 px-4 transition-transform ${sidebarOpen ? "opacity-100" : "opacity-0"} ${openSubmenu === "lists" ? "rotate-180 " : ""}`}/>
                </Link>

                <ul className={`ml-2 mt-1 overflow-hidden interpolate transition-all    ${openSubmenu === "lists" ? "h-fit  " : "h-0 mt-0"}`} >
                  {user.lists && user.lists.length > 0 ? (
                    user.lists.map((item) => (
                      <li key={item.id} className="relative pl-6">
                        <Link to={`/lists/${item.id}`} className={`flex items-center py-2 px-4 rounded-md text-gray-200 hover:bg-indigo-700 ${window.location.pathname === `/list/${item.id}`? "bg-indigo-800": ""} before-submenu-line`}>
                          <LinkIcon className="w-4 h-4 mr-2" />
                          <span className={`${sidebarOpen ? "opacity-100" : "opacity-0" } whitespace-nowrap`}> {item.name} </span>
                        </Link>
                      </li>
                    ))
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
          )}

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

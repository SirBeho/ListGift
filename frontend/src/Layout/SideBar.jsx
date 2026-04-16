import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  ListBulletIcon,
  UserCircleIcon,
  PresentationChartLineIcon,
  PlusIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../providers/AuthProvider";
import { ICON_MAP } from '../utils/iconLibrary';
import Logo from "../components/Logo";

export default function SideBar({ sidebarController }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = sidebarController;
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const sidebarRef = useRef(null);
  const location = useLocation();

  console.log(user)

  const handleSubmenuToggle = (e, submenuKey) => {
    e.preventDefault();
    if (!sidebarOpen) setSidebarOpen(true); // Abrir sidebar si intentan abrir submenú estando colapsado
    setOpenSubmenu(openSubmenu === submenuKey ? null : submenuKey);
  };

  // Cerrar submenú si el sidebar se colapsa
  useEffect(() => {
    if (!sidebarOpen) setOpenSubmenu(null);
  }, [sidebarOpen]);

  // Clase para detectar ruta activa
  const isActive = (path) => location.pathname === path;

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full z-40 bg-white border-r border-slate-200 
      ${sidebarOpen ? "w-60" : location.pathname == "/" ? "w-0" : "w-0 sm:w-14"}
      transition-all duration-300 ease-in-out flex flex-col shadow-sm overflow-hidden`}
    >
      {/* 1. HEADER / LOGO */}



      <div className="flex items-center justify-center h-14 w-full border-b border-slate-50 shrink-0">
        <Logo letra={sidebarOpen} negativo />
      </div>


      {/* 2. USER PROFILE CARD */}
      <div className="p-3 mt-4 shrink-0">
        <div className={`flex items-center gap-3 rounded-2xl transition-colors
          ${sidebarOpen ? "bg-slate-50 border border-slate-100  p-2" : "bg-transparent border-none"}`}>
          <div className="relative shrink-0">
            {user.avatar ? (
              <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt={user.name} />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-slate-400" />
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className={`transition-opacity duration-300 overflow-hidden ${sidebarOpen ? "opacity-100" : "opacity-0 w-0"}`}>
            <p className="font-bold text-sm text-slate-800 truncate leading-none">{user.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">
              {user.role?.name || "Plan Free"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. NAVEGACIÓN PRINCIPAL */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-2">

          {/* DASHBOARD */}
          <NavItem
            to="/dashboard"
            icon={<PresentationChartLineIcon className="w-5 h-5" />}
            label="Dashboard"
            isOpen={sidebarOpen}
          />
          {/* LISTAS (CON SUBMENÚ) */}
          <li >
            <button
              onClick={(e) => handleSubmenuToggle(e, "lists")}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} p-2 rounded-xl transition-all group
                ${isActive('/lists') || openSubmenu === 'lists' ? "bg-pink-50 text-primary" : "text-slate-500 hover:bg-pink-50 hover:text-primary"}`}
            >
              <div className={`flex items-center  ${sidebarOpen ? '' : 'justify-center'}`} >
                <div className={`transition-transform duration-300 ${isActive('/lists') ? 'scale-105' : 'group-hover:scale-105'}`}>
                  <ListBulletIcon className="w-5 h-5" />
                </div>
                {sidebarOpen && (
                  <span className={`ml-3 font-medium transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
                    Mis Listas
                  </span>)}
              </div>
              {sidebarOpen && (
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${openSubmenu === "lists" ? "rotate-180" : ""}`} />
              )}
            </button>

            {/* SUBMENÚ ANIMADO */}
            <AnimatePresence>
              {openSubmenu === "lists" && sidebarOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-1 ml-4 border-l-2 border-slate-100 space-y-1 overflow-hidden"
                >
                  {user.lists?.map((item) => {
                    const SelectedIcon = ICON_MAP[item.icon] || ListBulletIcon;
                    return (
                      <li key={item.id}>
                        <Link
                          to={`/lists/${item.id}`}
                          className={`flex items-center py-2 px-4 rounded-r-xl text-sm transition-colors
                            ${isActive(`/lists/${item.id}`) ? "text-primary font-semibold" : "text-slate-500 hover:text-slate-800 hover:scale-x-105 hover:bg-slate-50"}`}
                        >
                          <SelectedIcon className="w-4 h-4 mr-2 opacity-70" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link to="/lists/new" className="flex items-center py-2 px-4 text-xs text-primary font-bold hover:text-orange-700">
                      <PlusIcon className="w-3 h-3 mr-2" />
                      Nueva Lista
                    </Link>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          {/* SEGUIDORES */}
          <NavItem
            to="/followers"
            icon={<UserGroupIcon className="w-5 h-5" />}
            label="Seguidores"
            isOpen={sidebarOpen}

          />

        </ul>
      </nav>



    </aside>
  );
}

// Sub-componente para los items del menú para no repetir código
function NavItem({ to, icon, label, isOpen }) {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center  ${isOpen ? '' : 'justify-center'} p-2 rounded-xl transition-all group
      text-slate-500   hover:shadow-sm hover:bg-pink-50 hover:text-primary`}
      >
        <div className={`transition-transform duration-300 group-hover:scale-105`}>
          {icon}
        </div>
        {isOpen && (
          <span className={`ml-3 font-medium transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}  whitespace-nowrap`}>
            {label}
          </span>)}
      </Link>
    </li>
  );
}
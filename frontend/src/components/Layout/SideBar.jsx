import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';


export default function SideBar({ sidebarController, user }) {
  const [sidebarOpen, setSidebarOpen] = sidebarController;
  const [datos, setDatos] = useState(null);
  const [open, setOpen] = useState(0);

  const handleOpen = (e, value) => {
    console.log("handleOpen llamado con valor:", value);

    e.preventDefault();
    //stop reloading


    setOpen(open === value ? 0 : value);
  };

  useEffect(() => {
    if (!sidebarOpen) {
      setOpen(0);
    }
  }, [sidebarOpen]);



  return (
    <aside id="slidebar" onClick={() => setSidebarOpen(true)} className={`fixed top-0 left-0 h-full z-20 dark:bg-red-500   bg-gray-sl text-gray-100 border-gray-100 border-e ${sidebarOpen ? "w-60 toggle" : "w-14 "} transform duration-300 ease-out min-h-screen flex flex-col`}>
      <div className="flex items-center gap-2 h-12 px-4 py-2 border-b-[0.1px] ">
        <div className="w-6 h-6 rounded-full overflow-hidden  ">
          <img className=" max-w-[253%] m-[-50%-75%]" src="../pictures/logo.jpg" alt="" />
        </div>
        <span className="link ">List Gits</span>
      </div>
      <div className="flex flex-col gap-2 p-4 border-b-[0.1px] link">
        <span className="">{user.role.name}</span>
        <span className="">{user.name}</span>
      </div>
      <ul className="flex flex-col p-4 gap-2">
        <li className=" link block text-center whitespace-nowrap "></li>
        {user.role_id == 1 ? (
          <div>
            <li className={`relative  rounded-md overflow-hidden `}>
              <Link to={'/lists'} className={` ${open == 55 ? "open" : ""} relative flex gap-2 items-center whitespace-nowrap py-2 pl-4 bg-gray-sl dark:bg-gray-700 transform duration-300 cursor-pointer`}> 
                <span className="h-5 w-5">
                  <img src="../svg/edit.svg" alt="" srcSet="" />
                </span>
                <span className="hidden">Listas</span>
                <img onClick={(e) => handleOpen(e, 55)} className={`absolute right-0 top-3 ${open == 55 ? "rotate-180" : ""} `} src="../svg/flecha.svg" alt="" srcSet="" />
              </Link>
            </li>
            <ul className={` ms-3 bg-gray-500 overflow-hidden submenu interpolate ${open == 55 ? "h-auto" : "h-0"}`}>

              {user.lists ? (
                user.lists.map((item) => (
                  <li key={item.id} className="hover:bg-white">
                    <Link to={`/list/${item.id}`} className="flex gap-2 items-center whitespace-nowrap py-2 bg-gray-sl dark:bg-gray-700 transform duration-300">
                      <div className="h-5 w-5">
                        <img src="../svg/link.svg" alt="" />
                      </div>
                      <span className="hidden">{item.name}h{item.icon}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <div className=" ">
                  <div className="flex ms-2 gap-2 items-center whitespace-nowrap py-2 bg-gray-sl ">
                    <span className="hidden ps-2">No listas</span>
                  </div>
                </div>
              )
              }
            </ul>
          </div>
        ) : (
          ""
        )}




      </ul>
    </aside>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SideBar({ sidebarController, user }) {
  const [sidebarOpen, setSidebarOpen] = sidebarController;
  const [datos, setDatos] = useState(null);
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  useEffect(() => {
    if (!sidebarOpen) {
      setOpen(0);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/rolpage")
      .then((response) => {
        const filteredData = response.data.filter((item) => item.enlaced_to == null && item.rol_id == user.rol_id);
        setDatos(filteredData);
      })
      .catch((error) => {
        const data = JSON.parse(error.request.response)["errors"] || JSON.parse(error.request.response);
        setMsj(data);
      });
  }, []);

  return (
    <aside id="slidebar" onClick={() => setSidebarOpen(true)} className={`  dark:bg-red-500   bg-gray-sl text-gray-100 border-gray-100 border-e ${sidebarOpen ? "w-60 toggle" : "w-14 "} transform duration-300 ease-out min-h-screen flex flex-col`}>
      <div className="flex items-center gap-2 h-12 px-4 py-2 border-b-[0.1px] ">
        <div className="w-6 h-6 rounded-full overflow-hidden  ">
          <img className=" max-w-[253%] m-[-50%-75%]" src="../pictures/logo.jpg" alt="" />
        </div>
        <span className="link ">Universidad</span>
      </div>
      <div className="flex flex-col gap-2 p-4 border-b-[0.1px] link">
        <span className="">{user.rol.name}</span>
        <span className="">{user.person.name + " " + user.person.lastname}</span>
      </div>
      <ul className="flex flex-col p-4 gap-2">
        <li className=" link block text-center whitespace-nowrap "></li>
        {user.rol_id == 1 ? (
          <div>
            <li onClick={() => handleOpen(55)} className={`hover:bg-white relative ${open == 55 ? "ps-2 bg-white" : ""}`}>
              <a className="flex gap-2 items-center whitespace-nowrap py-2 bg-gray-sl dark:bg-gray-700 transform duration-300 cursor-pointer">
                <div className="h-5 w-5">
                  <img src="../svg/edit.svg" alt="" srcSet="" />
                </div>
                <span className="hidden">Admin Settings</span>
                <img className={`absolute right-0 top-3 ${open == 55 ? "rotate-180" : ""} `} src="../svg/flecha.svg" alt="" srcSet="" />
              </a>
            </li>
            <ul className={` bg-gray-500 overflow-hidden submenu ${open == 55 ? "h-[calc(5*2.5rem)]" : "h-0"} `}>
              <li className="hover:bg-white  ">
                <a className="flex gap-2 items-center whitespace-nowrap py-2  bg-gray-sl dark:bg-gray-700 transform duration-300" href="./link">
                  <div className="h-5 w-5">
                    <img src="../svg/link.svg" alt="" srcSet="" />
                  </div>
                  <span className="hidden">Links</span>
                </a>
              </li>
              <li className="hover:bg-white ">
                <a className=" flex gap-2 items-center whitespace-nowrap py-2 bg-gray-sl dark:bg-gray-700  transform duration-300" href="./person">
                  <div className="h-5 w-5">
                    <img src="../svg/users.svg" alt="" srcSet="" />
                  </div>
                  <span className="hidden">Persons</span>
                </a>
              </li>
              <li className="hover:bg-white ">
                <a className=" flex gap-2 items-center whitespace-nowrap py-2 bg-gray-sl dark:bg-gray-700  transform duration-300" href="./user">
                  <div className="h-5 w-5">
                    <img src="../svg/myprofile.svg" alt="" srcSet="" />
                  </div>
                  <span className="hidden">Users</span>
                </a>
              </li>

              <li className=" hover:bg-white ">
                <a className="flex gap-2 items-center whitespace-nowrap py-2 bg-gray-sl dark:bg-gray-700 transform duration-300" href="./rol">
                  <div className="h-5 w-5">
                    <img src="../svg/permissions.svg" alt="" srcSet="" />
                  </div>
                  <span className="hidden">Rols</span>
                </a>
              </li>
              <li className="hover:bg-white ">
                <a className="flex gap-2 items-center whitespace-nowrap py-2 bg-gray-sl dark:bg-gray-700 transform duration-300" href="./log">
                  <div className="h-5 w-5">
                    <img src="../svg/nota.svg" alt="" srcSet="" />
                  </div>
                  <span className="hidden">Log</span>
                </a>
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}

        {datos ? (
          datos.map((item) => (
            <div key={item.id}>
              <li onClick={() => handleOpen(item.id)} className={`hover:bg-white relative ${open === item.id ? "ps-2 bg-white" : ""}`}>
                <a className="flex gap-2 items-center whitespace-nowrap py-2 bg-gray-sl dark:bg-gray-700 transform duration-300 cursor-pointer">
                  <div className="h-5 w-5">
                    
                    <img src="../svg/edit.svg" alt="" />
                  </div>
                  <span className="hidden">{item.name}</span>
                  <img className={`absolute right-0 top-3 ${open === item.id ? "rotate-180" : ""}`} src="../svg/flecha.svg" alt="" />
                </a>
              </li> 
              <ul className={` bg-gray-500 overflow-hidden submenu ${open == item.id ? `h-[calc(${item.linkeds.length}*2.5rem)]` : "h-0"} `}>
             
                {item.linkeds.length > 0 && Array.isArray(item.linkeds) ? (
                  item.linkeds
                    .filter((item_) => item_.rol_id === user.rol_id)
                    .map((item_) => (
                      <li key={item_.id} className="hover:bg-white">
                        <a className="flex gap-2 items-center whitespace-nowrap py-2 bg-gray-sl dark:bg-gray-700 transform duration-300" href={item_.page.url}>
                          <div className="h-5 w-5">
                            <img src="../svg/link.svg" alt="" />
                          </div>
                          <span className="hidden">{item_.name}h{item_.icon}</span>
                        </a>
                      </li>
                    ))
                ) : (
                  <div className=" ">
                    <div className="flex ms-2 gap-2 items-center whitespace-nowrap py-2 bg-gray-sl ">
                      <span className="hidden ps-2">No pages</span>
                    </div>
                  </div>
                )}
              </ul>
            </div>
          ))
        ) : (
          <div className="w-full"> ... </div>
        )}
      </ul>
    </aside>
  );
}

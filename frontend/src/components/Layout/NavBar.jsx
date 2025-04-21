import React, { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";

export default function Navbar({sidebarController,user}) {

  const [sidebarOpen, setSidebarOpen] = sidebarController;
  const [menuOpen, setMenuOpen] = useState(false);
  const navigatetoUrl = useNavigate();

  function logout(){

        axios.post("http://localhost:8000/api/auth/logout")
        .then((response) => {
            
         console.log(response.data)

        })
        .catch((error) => {
          const data = error.response?.data?.errors || error.response?.data || {"error": error["message"] };
          console.log(data);
        });
        navigatetoUrl("/");
  }

     
  return (
    <nav className="flex justify-between px-4 min-h-[3rem] bg-white dark:bg-gray-700 shadow-white border-white relative">
      <div className="flex gap-5 items-center">
        <img id="toggle" onClick={() => setSidebarOpen(!sidebarOpen)} className="cursor-pointer" src="./svg/bars.svg" alt="" srcSet="" />
        <a href="./dashboard" className="flex">
          <h1 className="mr-2">HOME </h1>
          <img src="./svg/home.svg" alt="" srcSet="" />
        </a>
      </div>
      <div id="control-menu" className="flex items-center gap-2 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="h-8 w-8 overflow-hidden rounded-lg">
          <img id="imagePreviewmenu" className="w-full h-full object-cover" src="./pictures/usuario.jpg" alt="" />
        </div>
        <span className="block font-semibold text-xs leading-snug">{user.person.name + " "+ user.person.lastname }</span>
        <div id="icon_menu" className={`block w-6 transform transition-transform duration-500 ${menuOpen ? "rotate-180" : ""}`}>
          <img src="./svg/arrow.svg" alt="logo" />
        </div>
      </div>
      <div id="menu" className={`z-10 border border-gray-BD rounded-xl  p-2 w-36 bg-white text-xs absolute top-12 right-[1%] overflow-hidden ${menuOpen ? "h-28 opacity-100" : "h-0 opacity-0"} transform duration-500 ease-in-out transition-all`}>
        <div className="border-b">
          <a href="./profile" className="flex items-center gap-2 p-2 mb-2 hover:bg-gray-200 dark:hover:bg-gray-500  rounded-xl cursor-pointer">
            <div className="w-6">
              <img src="./svg/profile.svg" alt="" />
            </div>
            <span>My Profile</span>
          </a>
        </div>
        <a onClick={logout} className="flex items-center gap-2 mt-2 p-2 hover:bg-gray-200 rounded-xl text-red-500 cursor-pointer">
          <div className="w-6">
            <img src="./svg/logout.svg" alt="" />
          </div>
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}

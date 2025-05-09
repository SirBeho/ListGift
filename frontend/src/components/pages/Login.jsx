import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Layout/AuthProvider";
import axios from "axios"; // Ya lo tienes, lo dejo por claridad

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth(); 
  const [msj, setMsj] = useState(JSON.parse(sessionStorage.getItem("msj")) || {});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    // Si hay un usuario logueado y la ruta es "/", redirige a /profile
    if (user ) {
        navigate('/profile');
    }
}, [navigate, user]);

  const handleInputChange = (event) => {
    setMsj({});
    const { name, value } = event.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData); 
    
    if (result.success) {
      setMsj({ msj: "Acceso Autorizado" });
      
    } else {
      
      const errorData = result.message ? { error: result.message } : { error: "Credenciales inválidas" };
      setMsj(errorData);
      setFormData((formData) => ({
        ...formData,
        ["password"]: "",
      }));
    }
  };

  useEffect(() => {
    if (Object.keys(msj).length > 0) {
      setTimeout(() => {
        setMsj({});
        console.log("borra msj");
        sessionStorage.removeItem("msj");
      }, 10000);
    }
  }, [msj]);

  return (
    <main className="h-full w-full bg-white">
      <div className="flex flex-col w-screen h-screen pt-6 px-6 gap-5 items-center">
        <div className="md:border md:rounded-xl md:w-[27rem] sm:px-8 sm:py-6 sm:mt-14">
          <div className="flex flex-col gap-4 ">
            <div>
              <img src="./svg/devcha.svg" alt="" />
            </div>
            <h3 className="text-lg font-semibold">join thousands of learners from around the world</h3>
            <p className="text-base">Master web development by making real-life projects. There are multiple paths for you to choose</p>
          </div>
          <form className="flex flex-col w-full gap-3 pt-5 sm:pt-3" method="post" onSubmit={handleSubmit}>
            <label className="flex flex-raw border rounded-md h-11 focus-within:border-2 px-2">
              <img src="./svg/users.svg" alt="" className="pe-2" />
              <input required type="text" name="username" placeholder="username" onChange={handleInputChange} className="border-none outline-none w-full" />
            </label>
            <label className="flex flex-raw border rounded-md h-11 focus-within:border-2 px-2">
              <img src="./svg/password.svg" alt="" className="pe-2" />
              <input required type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="border-none outline-none w-full" />
            </label>
            <h1>
              {Object.entries(msj).map(([clave, valor], index) => (
                <span key={index} className={`${clave == "msj" ? "text-green-600" : "text-red-400"} block text-center`}>
                  <strong>{valor}</strong>
                </span>
              ))}
            </h1>
            <input type="submit" defaultValue="Start coding now" className="bg-blue-600 font-semibold text-lg rounded-md text-white mt-4 sm:mt-2 h-11 cursor-pointer" />
          </form>
          <div className="flex flex-col items-center w-full gap-6 pt-3">
            <span className="text-[#828282] text-sm font-normal">or continue with these social profile</span>
            <div className="flex flex-row gap-2 justify-center">
              <a href="https://www.google.com/" className="border-zinc-500 border rounded-full p-2">
                <img src="./svg/google.svg" alt="" />
              </a>
              <a href="https://www.facebook.com" className="border-zinc-500 border rounded-full p-2">
                <img src="./svg/facebook.svg" alt="" />
              </a>
              <a href="https://www.twiter.com" className="border-zinc-500 border rounded-full p-2">
                <img src="./svg/twit.svg" alt="" />
              </a>
              <a href="https://github.com/myltonxdd/sistmlog_php" className="border-zinc-500 border rounded-full p-2">
                <img src="./svg/github.svg" alt="" />
              </a>
            </div>
            <span className="text-[#828282] text-sm font-normal ">
              Adready a member?
              <Link href="/login" className="text-blue-600">
                Login
              </Link>
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-between font-normal text-sm w-full text-[#BDBDBD] pt-10 sm:pt-0 sm:w-2/6">
          <div>Benjamin Tavarez</div>
          <div>devchallenges.io</div>
        </div>
      </div>
    </main>
  );
}

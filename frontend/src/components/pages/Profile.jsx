import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Layout/AuthProvider";
import { m, motion } from "framer-motion"; // Animaciones
import instance from './../Layout/axiosintance';
import { use } from "react";

export default function Profile() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [msj, setMsj] = useState(JSON.parse(sessionStorage.getItem("msj")) || {});
  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    setTimeout(() => {
      setMsj({});
      sessionStorage.removeItem("msj");
    }, 10000);
  }, [msj]);

  const handleInputChange = (event) => {
    setMsj({});
    const { name, value } = event.target;
   
    setFormData((formData) => ({
      ...formData,
      [name]: value
    }));
    };

  function Enviar(e) {
    console.log(user)
    console.log(formData)
    e.preventDefault();

    //comparar un objeto con otro para ver si hay cambios
    if (JSON.stringify(formData) === JSON.stringify(user)) {
      setMsj({ error: "No se ha editado nada" });
      return;
    }
    //usar ruta de .env
    instance.put(`/users/${user.id}`, formData)
      .then((response) => {

        console.log(response)
        setMsj(response.data || {});
        setIsEditing(false);
        if (response.data.status != 'success' ){
          setFormData(user);
        }
        
      })
      .catch((error) => {
       
        setMsj(JSON.parse(error.request.response).errors ||  [error.request.response])
      
      });
      console.log('fin')
  }


  return (
    <motion.main 
      className="h-full min-h-full flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-fit text-center m-5">
        <h1 className="text-4xl font-bold text-gray-800">Perfil Personal</h1>
        <h3 className="text-lg font-light my-4 text-gray-600">Información básica, como tu nombre y foto</h3>
      </div>

      <div className="w-full max-w-3xl border-2 p-8 rounded-xl shadow-lg bg-white">
        {Object.entries(msj).map(([clave, valor], index) => (
          <span key={index} className={`text-${clave === "msj" ? "green-600" : "red-400"} block text-center font-semibold`}>
            {valor}
          </span>
        ))}

        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-medium text-black">Perfil</h3>
            <p className="text-sm text-gray-500">Algunas de estas informaciones pueden ser públicas</p>
          </div>

          {!isEditing && (
            <motion.button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
              whileHover={{ scale: 1.1 }}
            >
              Editar
            </motion.button>
          )}
        </div>

        {/* Vista de los datos sin necesidad de editar */}
        {!isEditing ? (
          <div className="text-gray-700 text-lg">
            <div className="flex items-center border-t py-4 px-6">
              <h3 className="w-40 font-medium">Nombre</h3>
              <span className="text-gray-800">{formData?.name || "No disponible"}</span>
            </div>

            <div className="flex items-center border-t py-4 px-6">
              <h3 className="w-40 font-medium">Usuario</h3>
              <span className="text-gray-800">{formData?.username || "No disponible"}</span>
            </div>

            <div className="flex items-center border-t py-4 px-6">
              <h3 className="w-40 font-medium">Estado</h3>
              <span className="text-gray-800">{formData?.STATUS || "No disponible"}</span>
            </div>
          </div>
        ) : (
          <motion.form 
            className="flex flex-col text-sm text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={Enviar}
          >
            <label className="flex items-center border-t py-3 px-6">
              <h3 className="w-40 text-lg font-medium">Nombre</h3>
              <input value={formData?.name || ""} onChange={handleInputChange} type="text" name="name" className="border p-2 rounded-lg w-full" />
            </label>

            <label className="flex items-center border-t py-3 px-6">
              <h3 className="w-40 text-lg font-medium">Usuario</h3>
              <input value={formData?.username || ""} onChange={handleInputChange} type="text" name="username" className="border p-2 rounded-lg w-full" />
            </label>

            <label className="flex items-center border-t py-3 px-6">
              <h3 className="w-40 text-lg font-medium">Estado</h3>
              <input value={formData?.STATUS || ""} onChange={handleInputChange} type="text" name="STATUS" className="border p-2 rounded-lg w-full" />
            </label>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Guardar</button>
              <button onClick={() => {setIsEditing(false),  setFormData(user)}} type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Cancelar</button>
            </div>
          </motion.form>
        )}
      </div>
    </motion.main>
  );
}

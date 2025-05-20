import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Layout/AuthProvider";
import { motion } from "framer-motion"; // Animaciones

export default function Profile() {
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      update_by: prev.person_id,
    }));
  };

  function Enviar(e) {
    e.preventDefault();
    if (!formData.update_by) {
      setMsj({ error: "No se ha editado nada" });
      return;
    }

    axios
      .put(`http://localhost:8000/api/persons/${formData.person_id}`, formData)
      .then((response) => {
        setMsj(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        setMsj(JSON.parse(error.request.response).errors);
      });
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
              <button onClick={() => setIsEditing(false)} type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Cancelar</button>
            </div>
          </motion.form>
        )}
      </div>
    </motion.main>
  );
}

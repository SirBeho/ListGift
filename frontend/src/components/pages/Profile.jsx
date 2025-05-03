import React, { useState, useEffect } from "react";
import axios from "axios";
import { use } from "react";
import { useAuth } from "../Layout/AuthProvider";

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEdiding, setIsEdiding] = useState(false);
  const [msj, setMsj] = useState(JSON.parse(sessionStorage.getItem("msj")) || {});

  const [formData, setFormData] = useState(user || {});
/*
  useEffect(() => {
    validation
      .ValidationTokenPage()
      .then((data) => {
        data.update_by = null;
        setFormData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
*/

  useEffect(() => {
    setTimeout(() => {
      setMsj({});
      sessionStorage.removeItem("msj");
    }, 10000);
  }, [msj]);

  const handleInputChange = (event) => {
    setMsj({});
    const { name, value } = event.target;
    const nameParts = name.split(".");
    console.log(nameParts.length);

    if (nameParts.length === 1) {
      setFormData({
        ...formData,
        [name]: value,
        ["person"]: {
          ...formData["person"],
          ["update_by"]: formData.person_id,
        },
      });
    } else {
      setFormData({
        ...formData,
        [nameParts[0]]: {
          ...formData[nameParts[0]],
          [nameParts[1]]: value,
          ["update_by"]: formData.person_id,
        },
      });
    }
  };

  function Enviar(e) {
    e.preventDefault();
    if (!formData.person["update_by"]) {
      setMsj({ error: "No se ah editado nada" });
      return;
    }

    console.log(formData.person);
    axios
      .put("http://localhost:8000/api/persons/" + formData.person_id, formData.person)
      .then((response) => {
        console.log(response.data);
        setMsj(response.data);
        setIsEdiding(false);
      })
      .catch((error) => {
        const data = JSON.parse(error.request.response)["errors"] || JSON.parse(error.request.response);
        setMsj(data);
      });
  }

  return (
    <main className="h-full min-h-full flex flex-col items-center   ">
      <div className="w-fit text-center m-5 ">
        <h1 className="text-3xl">Personal info</h1>
        <h3 className="text-base font-light my-4">Basic info, like your name and photo</h3>
      </div>

      <div id="cuadro" className="w-full max-w-3xl border-2 pt-8 border-black rounded-xl text-gray-33 bg-white">
        {Object.entries(msj).map(([clave, valor], index) => (
          <span key={index} className={`text-${clave === "msj" ? "green-600" : "red-400"} block text-center`}>
            <strong>{valor}</strong>
          </span>
        ))}

        <div className="px-12 py-4 pt-6 relative flex flex-row justify-between items-center">
          <div>
            <h3 className="font-normal text-xl leading-snug text-black">Profile</h3>
            <p className="text-sm font-normal text-gray-500">Some info may be visible to others people</p>
          </div>

          <button onClick={() => setIsEdiding(true)} type="submit" className={`${isEdiding ? "hidden" : " flex"}   justify-center items-center w-24 h-8 border border-gray-500 rounded-xl text-gray-500`}>
            <span>Edit</span>
          </button>
        </div>
        {isEdiding ? (
          <form className="flex flex-col text-gray-BD text-sm leading-6" onSubmit={Enviar}>
            <lavel className="flex items-center justify-start border-t border-gray-BD p-4  px-12">
              <h3 className="w-52">NAME</h3>
              <input value={formData.name} onChange={handleInputChange} type="text" name="person.name" placeholder="Name" className="border p-2 h-10 rounded-md " />
            </lavel>

            <lavel className="flex items-center justify-start border-t border-gray-BD p-4    px-12">
              <h3 className="w-52">USERNAME</h3>
              <input value={formData.username} onChange={handleInputChange} type="text" name="person.username" placeholder="username" className="border p-2 h-10 rounded-md " />
            </lavel>

            <lavel className="flex items-center justify-start border-t border-gray-BD p-4   px-12">
              <h3 className="w-52">STATUS</h3>
              <input value={formData.STATUS} onChange={handleInputChange} type="text" name="person.STATUS" placeholder="STATUS" className="border p-2 h-10 rounded-md " />
            </lavel>

          
            <div className="flex items-center justify-center my-2 gap-3">
              <button type="submit" className={`"flex justify-center items-center w-24 h-8 border border-gray-500 rounded-xl text-gray-500 hover:bg-gray-400 hover:text-white`}>
                <span>Guardar</span>
              </button>

              <button onClick={() => setIsEdiding(false)} type="button" className={`"flex justify-center items-center w-24 h-8 border border-gray-500 rounded-xl text-gray-500 hover:bg-red-400 hover:text-white`}>
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        ) : (
          <form className="flex flex-col text-gray-BD text-sm leading-6">
            <div className="flex items-center justify-start border-t border-gray-BD p-6   px-12">
              <h3 className="w-52">NAME</h3>
              <h3 className="text-lg text-gray-33 whitespace-nowrap">{formData.name}</h3>
            </div>

            <div className="flex items-center justify-start border-t border-gray-BD p-6 px-12">
              <h3 className="w-52">USERNAME</h3>
              <h3 className="text-lg text-gray-33 whitespace-nowrap">{formData.username}</h3>
            </div>

            <div className="flex items-center justify-start border-t border-gray-BD p-6   px-12">
              <h3 className="w-52">STATUS</h3>
              <h3 className="text-lg text-gray-33 whitespace-nowrap">{formData.STATUS}</h3>
            </div>

          </form>
        )}
      </div>
    </main>
  );
}

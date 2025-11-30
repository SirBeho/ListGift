import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [msj, setMsj] = useState(JSON.parse(sessionStorage.getItem("msj")) || {});

  useEffect(() => {
    setTimeout(() => {
      setMsj({});
      sessionStorage.removeItem("msj");
    }, 10000);
  }, [msj]);

  return (
    <main className="h-full min-h-full flex flex-col bg-gray-200 p-4 ">
      {Object.entries(msj).map(([clave, valor], index) => (
        <span key={index} className={`text-${clave === "msj" ? "green-600" : "red-400"} block text-center`}>
          <strong>{valor}</strong>
        </span>
      ))}
      <div className="w-full flex justify-between my-4">
        <h1 className="text-2xl ">Dashboard</h1>
        <span className="text-sm text-blue-900 dark:text-blue-600">
          Home / <span className="text-gray-600 dark:text-gray-400">Dashboard</span>
        </span>
      </div>
      <div className="w-fit bg-white dark:bg-gray-700 p-2 rounded-md pe-4 shadow-md">
        Bienvenido
        <br /> Selecciona la acción que quieras realizar en las pestañas del menú de la izquierda.
      </div>
    </main>
  );
}

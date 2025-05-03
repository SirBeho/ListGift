import React, { createContext, useState, useEffect, useContext } from 'react';
//importar intancia
import instance from './axiosintance'; 


const ListContext = createContext(null);

export const ListProvider = ({ children }) => {
  
 
  const [listas, setListas] = useState(null);

  const LoadListas = async () => {
    try {
      const response = await instance.get('/users/lists');
      if (response.status === 200 && response.data.lists) {
        setListas(response.data.lists);
        return true; // Retorna las listas
      } else {
        setListas(null);
        return false; // Retorna null si no hay listas
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
      setListas(null);
      return false; // Retorna null si hay un error
    }
  };





 /*  if (loading) {
    // Puedes mostrar un indicador de carga aquí
    return <div>Cargando...</div>;
} */

  return (
    <ListContext.Provider value={{ listas, LoadListas }}>
      {children}
    </ListContext.Provider>
  );
};

export const useList = () => useContext(ListContext);
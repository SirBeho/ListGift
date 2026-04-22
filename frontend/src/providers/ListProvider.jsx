import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
//importar intancia
import instance from '../service/AxiosInstance';


const ListContext = createContext(null);

export const ListProvider = ({ children }) => {

  const [publicLists, setPublicLists] = useState(null);
  const [listas, setListas] = useState(null);

  const LoadListas = useCallback(async () => {
    try {
      await instance.get('/users/lists')
        .then((response) => {
          if (response.status === 200 && response.data.lists) {
            setListas(response.data.lists);
            return true; // Retorna las listas
          } else {
            setListas(null);
            return false; // Retorna null si no hay listas
          }
        })

    } catch (error) {
      console.error('Error fetching lists:');
      setListas(null);
      return false; // Retorna null si hay un error
    }
  }, []);

  const LoadPublicListas = useCallback(async () => {
    try {
      await instance.get('/pub/lists')
        .then((response) => {
          if (response.status === 200 && response.data.lists) {
            setPublicLists(response.data.lists);
            return true; // Retorna las listas
          } else {
            setPublicLists(null);
            return false; // Retorna null si no hay listas
          }
        })

    } catch (error) {
      console.error('Error fetching lists:', error);
      setPublicLists(null);
      return false; // Retorna null si hay un error
    }
  }, []);

  const clearUserData = () => {
    setListas(null);
    setPublicLists(null);
  };





  /*  if (loading) {
     // Puedes mostrar un indicador de carga aquí
     return <div>Cargando...</div>;
 } */

  return (
    <ListContext.Provider value={{ clearUserData, listas, LoadListas, publicLists, LoadPublicListas, }}>
      {children}
    </ListContext.Provider>
  );
};

export const useList = () => useContext(ListContext);
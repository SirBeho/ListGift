import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useList } from '../providers/ListProvider';
import Card from '../components/Card';

import { motion } from "framer-motion";
import instance from '../service/AxiosInstance';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import ModalCreateList from '../components/ModalCreateList'; // Ajusta la ruta
import Alert from '../components/Alert';



function ListaDeRegalos() {
  const { user } = useAuth();
  const { listas, LoadListas } = useList();
  const [error, setError] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [apiRes, setApiRes] = useState(null);

  useEffect(() => {
    if (!listas) {
      LoadListas();
    }
  }, []);

  const ListUser = useMemo(() => {
    // La operación de filtrado solo se ejecuta cuando 'listas' o 'user?.id' cambian.
    return listas?.filter((lista) => lista.user_id === user?.id) || [];
  }, [listas, user?.id]);

  if (error) {
    return (
      <main className="bg-gray-100 py-8">
        <div className="container mx-auto text-center text-red-500 shadow-md p-6 rounded-md">
          Error al cargar las listas: {error}
        </div>
      </main>
    );
  }


  return (
    <main>
      <Alert apiRes={apiRes} variant="toast" onClose={() => setApiRes(null)} />

      <div className=" relative    ">

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="absolute top-5 right-8 z-10 bg-primary hover:bg-blue-700 text-white p-2 rounded-full shadow-2xl flex items-center justify-center transition-colors border-4 border-white dark:border-gray-800"
        > Agregar Lista
          <PlusIcon className="h-5 w-5 ms-2" />
        </button>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-5">
          <div className="text-center mb-4 transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-3xl font-semibold text-primary">{user ? user.name : 'Usuario'}</h3>
            <p className="mt-1 text-gray-500">¡Mira tus listas de regalos!</p>
          </div>

          <div className="text-center mb-6">
            <h4 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-300 pb-2 inline-block">
              Mis Listas
            </h4>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
            {ListUser.length > 0 ? (
              ListUser?.filter((lista) => lista.user_id === user?.id)?.map((lista, index) => (
                <div key={lista.id} className={`card ${lista.id} card-enter `} style={{ animationDelay: `${index * 500}ms` }}>
                  <Card data={lista} />
                </div>
              ))) : (
              <div className="md:col-span-2 lg:col-span-3  text-center mt-2 p-10 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="h-8 w-8 text-blue-500" />
                </div>
                <h4 className="text-lg text-gray-600 font-medium">Aún no tienes listas.</h4>
                <p className="text-gray-400 mb-6">Comienza creando tu primera lista de deseos.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-primary hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold transition-colors"
                >
                  Crear lista ahora
                </button>
              </div>
            )}
          </div>

          {user?.id === 1 && (
            <div>
              <div className="text-center mb-6 mt-2">
                <h4 className="text-2xl font-semibold text-gray-700 border-b-2 border-green-300 pb-2 inline-block">
                  Todas las Listas
                </h4>
              </div>
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {listas?.length > 0 ? (
                  listas.map((lista, index) => (
                    <div key={lista.id} className={`card ${lista.id} card-enter `} style={{ animationDelay: `${index * 500}ms` }}>
                      <Card data={lista} litt />
                    </div>
                  ))) : (
                  <div className="md:col-span-2 lg:col-span-3 text-center mt-6 p-10 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PlusIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <h4 className="text-lg text-gray-600 font-medium">Aún no tienes listas.</h4>
                    <p className="text-gray-400 mb-6">Comienza creando tu primera lista de deseos.</p>
                    <button
                      onClick={() => navigate('/lists/create')}
                      className="bg-primary hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Crear lista ahora
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <ModalCreateList
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          refreshItems={LoadListas}
          setApiRes={setApiRes}
          apiRes={apiRes}
        />


      </div>
    </main>
  );
}

export default ListaDeRegalos;
import React, { useState, useEffect , useMemo} from 'react';
import { useAuth } from '../Layout/AuthProvider';
import { useList } from '../Layout/ListProvider';
import Card from '../Layout/Card';
import instance from '../Layout/axiosintance';



function ListaDeRegalos() {
  const { user } = useAuth();
  const { listas, LoadListas } = useList();
  const [error, setError] = useState(null);

 
  useEffect(() => {
    if (!listas) {
      LoadListas();
    }
  }, [ ]);

  const ListUser = useMemo(() => {
    // La operación de filtrado solo se ejecuta cuando 'listas' o 'user?.id' cambian.
    return listas?.filter((lista) => lista.user_id === user?.id) || [];
}, [listas, user?.id]);

  if (error) {
    return (
      <main className="app-content bg-gray-100 py-8">
        <div className="container mx-auto text-center text-red-500 shadow-md p-6 rounded-md">
          Error al cargar las listas: {error}
        </div>
      </main>
    );
  }

  if (!listas) {
    return (
      <main className="app-content bg-gray-100 py-8">
        <div className="container mx-auto text-center shadow-md p-6 rounded-md">
          <svg className="animate-spin h-6 w-6 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando listas...
        </div>
      </main>
    );
  } 

  return (
    <main className="app-content bg-gray-100 py-8">
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .card-enter {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 transform transition-transform duration-300 hover:scale-105">
          <h3 className="text-3xl font-semibold text-blue-600">{user ? user.name : 'Usuario'}</h3>
          <p className="mt-2 text-gray-500">¡Mira tus listas de regalos!</p>
        </div>

        <div className="text-center mb-6">
          <h4 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-300 pb-2 inline-block">
            Mis Listas
          </h4>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {ListUser.length >0 ?(
            listas?.filter((lista) => lista.user_id === user?.id)?.map((lista, index) => (
              <div key={lista.id} className={`card ${lista.id} card-enter `} style={{ animationDelay: `${index * 500}ms` }}>
                <Card data={lista} />
              </div>
            ))) : (
            <div className="md:col-span-2 lg:col-span-3 text-center mt-6 p-6 bg-white rounded-md shadow-md">
              <h4 className="text-lg text-gray-600">No hay listas disponibles. ¡Crea una!</h4>
              {/* Aquí podrías añadir un botón para crear una nueva lista */}
            </div>
          )}
        </div>

        {user?.id === 1 && (
          <div>
            <div className="text-center mb-6">
              <h4 className="text-2xl font-semibold text-gray-700 border-b-2 border-green-300 pb-2 inline-block">
                Todas las Listas
              </h4>
            </div>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {listas?.length > 0 ? (
                listas.map((lista, index) => (
                  <div key={lista.id} className={`card ${lista.id} card-enter `} style={{ animationDelay: `${index * 500}ms` }}>
                    <Card data={lista} litt={true} />
                </div>
                ))) : (
                <div className="md:col-span-3 lg:col-span-4 text-center mt-6 p-6 bg-white rounded-md shadow-md">
                  <h4 className="text-lg text-gray-600">No hay listas disponibles.</h4>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ListaDeRegalos;
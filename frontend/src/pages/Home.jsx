import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useList } from '../providers/ListProvider';
import Card from '../components/Card';

function Home() {
  const { user } = useAuth();
  const { publicLists: listas, LoadPublicListas: LoadListas } = useList();
  const [error, setError] = useState(null);

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
    <main className=" py-8 h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4 ">
        <div className="text-center mb-8 transform transition-transform duration-300 hover:scale-105">
          <h3 className="text-3xl font-semibold text-blue-600">Listas de Regalos</h3>
          <p className="mt-2 text-gray-500">¡Mira las
            listas de regalos!</p>
        </div>


        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {listas?.length > 0 ? (
            listas.map((lista, index) => (
              <div key={lista.id} className={`card ${lista.id} card-enter `} style={{ animationDelay: `${index * 500}ms` }}>
                <Card data={lista} litt />
              </div>
            ))) : (
            <div className="md:col-span-3 lg:col-span-4 text-center mt-6 p-6 bg-white rounded-md shadow-md">
              <h4 className="text-lg text-gray-600">No hay listas disponibles.</h4>
            </div>
          )}
        </div>


      </div>
    </main>
  );
}

export default Home;
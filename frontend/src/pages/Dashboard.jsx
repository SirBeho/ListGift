import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../providers/AuthProvider';
import { useList } from '../providers/ListProvider';
import { useTitle } from '../Hooks/useTitle';

// Componentes
import Card from '../components/Card';
import ModalCreateList from '../components/ModalCreateList';
import Alert from '../components/Alert';

// Iconos
import {
  PlusIcon,
  GiftIcon,
  ListBulletIcon,
  BellIcon
} from '@heroicons/react/24/outline';


const layoutVariants = {
  initial: {
    opacity: 0,
    y: 60,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 1.2 // Tu entrada lenta cinematográfica
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { type: "tween", ease: "easeOut", duration: 1.2 }
  }
};

const gridVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2,
    },
  },
};


export default function Dashboard() {
  useTitle('Dashboard');

  const { user } = useAuth();
  const { listas, LoadListas } = useList();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [apiRes, setApiRes] = useState(null);

  useEffect(() => {
    if (!listas) LoadListas();

  }, []);



  // Filtrado optimizado de las listas del usuario
  const misListas = useMemo(() => {
    return listas?.filter((lista) => lista.user_id === user?.id) || [];
  }, [listas, user?.id]);


  const statsData = useMemo(() => {
    // 1. Total de listas es simplemente el largo del array
    const totalListas = misListas?.length || 0;

    const regalosPendientes = misListas?.reduce((acc, lista) => {
      const pendientes = lista.items?.filter(gift => gift.status !== 2).length || 0;
      return acc + pendientes;
    }, 0) || 0;

    return { totalListas, regalosPendientes };
  }, [misListas]);

  // Indicadores Fijos (Placeholders profesionales)
  const stats = [
    { id: 1, label: 'Total listas', value: statsData.totalListas, icon: <ListBulletIcon className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
    { id: 2, label: 'Regalos activos', value: statsData.regalosPendientes, icon: <GiftIcon className="w-6 h-6" />, color: 'bg-pink-50 text-pink-600' },
    { id: 3, label: 'Notificaciones', value: 3, icon: <BellIcon className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
  ];

  // Variantes de Animación
  const containerVariants = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20, transition: { duration: 0.2, ease: "easeOut" } },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <Alert apiRes={apiRes} variant="toast" onClose={() => setApiRes(null)} />

      {/* 1. HEADER: BIENVENIDA */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            ¡Bienvenido de nuevo, {user?.name.split(' ')[0]}!
          </motion.h1>
          <p className="text-slate-500 mt-2 font-medium">
            Gestiona tus deseos y comparte la alegría con tus allegados.
          </p>
        </div>


      </header>

      {/* 2. STATS GRID (Indicadores Fijos) */}
      <motion.section
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5"
          >
            <div className={`p-4 rounded-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-4xl font-black text-slate-800 leading-none">{stat.value}</p>
              <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* 3. SECCIÓN: MIS LISTAS */}
      <section className="mb-12">

        <header className="relative mb-10 flex flex-col sm:items-center sm:flex-row  justify-between gap-4">
          <div >
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              Mis Listas
            </motion.h1>
          </div>

          <div className="hidden sm:block h-1 flex-1 bg-slate-500/50 rounded-full w-full"></div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="sm:absolute right-0 -top-10 flex items-center justify-center gap-2 bg-primary hover:scale-105 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-pink-200 transition-all"
          >
            <PlusIcon className="w-5 h-5 stroke-[3px]" />
            Nueva Lista
          </motion.button>
        </header>

        <div className='mb-5 flex flex-col md:flex-row justify-between gap-4 w-full m-8'>
        </div>
        <motion.div
          key={misListas.length > 0 ? "con-datos" : "vacio"}
          variants={gridVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {misListas.length > 0 ? (
            misListas.map((lista) => (
              <motion.div
                key={lista.id}
                layout
                variants={layoutVariants}
                transition={{ layout: { type: "spring", stiffness: 300, damping: 25 } }}
              >
                <Card data={lista} />
              </motion.div>
            ))
          ) : (
            <EmptyState onClick={() => setIsCreateModalOpen(true)} />
          )}
        </motion.div>


      </section>

      {/* 4. SECCIÓN ADMIN (Si aplica) */}
      {user?.id === 1 && listas?.length > 0 && (
        <section className="mt-16 pt-8 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-400 mb-8 uppercase tracking-widest text-center">
            Panel de Administración: Todas las Listas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-80 hover:opacity-100 transition-opacity">
            {listas.map((lista) => (
              <Card key={lista.id} data={lista} litt />
            ))}
          </div>
        </section>
      )}

      {/* MODAL */}
      <ModalCreateList
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        refreshItems={LoadListas}
        setApiRes={setApiRes}
        apiRes={apiRes}
      />
    </main>
  );
}

// Componente para estado vacío
function EmptyState({ onClick }) {
  return (
    <div className="col-span-full py-16 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <GiftIcon className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-lg font-bold text-slate-700">Aún no tienes listas</h3>
      <p className="text-slate-500 mb-6 max-w-xs">Organiza tus deseos creando tu primera lista de regalos hoy mismo.</p>
      <button
        onClick={onClick}
        className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-sm"
      >
        Crear mi primera lista
      </button>
    </div>
  );
}


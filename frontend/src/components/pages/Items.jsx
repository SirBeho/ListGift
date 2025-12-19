import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useList } from '../Layout/ListProvider';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../Layout/ModalItem';
import { Dialog, Transition } from "@headlessui/react";
import {
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  CurrencyDollarIcon,
  InboxStackIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  InformationCircleIcon, PlusIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { BeatLoader } from 'react-spinners';
import ModalItem from '../Layout/ModalItem';

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  exit: { opacity: 0 },
};

const itemVariants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 100, duration: 0.3 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2, ease: 'easeInOut' } },
  hover: { scale: 1.05, rotate: 2, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)', transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const buttonVariants = {
  hover: { scale: 1.1, backgroundColor: '#ec4899', boxShadow: '0px 7px 12px rgba(0,0,0,0.15)' },
  tap: { scale: 0.9 },
};

const emptyListVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 12, duration: 0.4 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const notFoundVariants = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 10, duration: 0.6 } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.4 } },
};

const progressBarVariants = {
  initial: { width: '0%' },
  animate: { width: '100%', transition: { duration: 4, ease: 'easeInOut' } },
};

const loadingContainerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.2 } },
};

const loadingItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
};


export default function Items() {
  const { listas, LoadListas, loading: loadingListas } = useList();
  const { id } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState(() => localStorage.getItem('giftListFilterCategory') || 'all');
  const [sortOption, setSortOption] = useState(() => localStorage.getItem('giftListSortOption') || 'default');
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (!listas && !loadingListas) {
      LoadListas();
    }
    const timer = setTimeout(() => {
      setLoadingItems(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [LoadListas, listas, loadingListas]);



  useEffect(() => {
    localStorage.setItem('giftListFilterCategory', filterCategory);
  }, [filterCategory]);

  useEffect(() => {
    localStorage.setItem('giftListSortOption', sortOption);
  }, [sortOption]);

  const ListUser = listas?.find((lista) => lista.id === parseInt(id));

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
    }).format(price);
  };


  useEffect(() => {
    if (!ListUser && id !== undefined) {
      timerRef.current = setTimeout(() => {
        navigate('/lists');
      }, 4000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [ListUser, id, navigate]);

  const openDetails = (item) => {
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (category) => {
    setFilterCategory(category);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  const filteredAndSortedItems = useCallback(() => {
    if (!ListUser?.items) {
      return [];
    }

    let items = [...ListUser.items];

    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all' && items.some(item => item.category)) {
      items = items.filter(item => item.category === filterCategory);
    }

    switch (sortOption) {
      case 'name-asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return items;
  }, [ListUser?.items, searchTerm, filterCategory, sortOption]);

  const itemsToRender = filteredAndSortedItems();

  if (loadingListas || loadingItems) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        <BeatLoader color="#ec4899" size={24} />
      </div>
    );
  }

  if (!ListUser && id !== undefined) {
    return (
      <motion.div
        variants={notFoundVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        <motion.div
          className="bg-white shadow-xl rounded-3xl max-w-md w-full p-10 text-center border-t-8 border-pink-500"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1, transition: { type: 'spring', damping: 10, stiffness: 100 } }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <motion.div className="mb-6" animate={{ rotate: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' } }}>
            <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-pink-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-pink-700 mb-5">¡Vaya! No encontramos la lista</h2>
          <p className="text-lg text-gray-700 mb-5">
            La lista de regalos que estás buscando no existe en este momento. Serás redirigido a tus listas en breve.
          </p>
          <motion.div
            variants={progressBarVariants}
            initial="initial"
            animate="animate"
            className="bg-pink-200 h-3 rounded-full mt-5 overflow-hidden"
          >
            <motion.div className="bg-pink-500 h-full rounded-full" />
          </motion.div>
          <motion.button
            onClick={() => {
              clearTimeout(timerRef.current);
              navigate('/lists');
            }}
            className="mt-8 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Volver a Mis Listas
          </motion.button>
          <p className="text-sm text-gray-500 mt-3">Redirigiendo en 4 segundos...</p>
        </motion.div>
      </motion.div>
    );
  }

 

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
    >
      {/* Encabezado de la Lista */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">


        <motion.div
          className="mb-8 rounded-xl shadow-lg overflow-hidden relative hover:shadow-xl transition-shadow duration-300 "
          style={{

            backgroundImage: `linear-gradient(135deg, ${ListUser.color1} 0%, ${ListUser.color2} 100%)`,
          }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
          whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
        >

          {ListUser?.status && (
            <motion.span className={`absolute top-3 right-3 inline-flex items-center h-fit text-xs font-semibold px-2.5 py-0.5 rounded shadow-sm ${ListUser.status.toLowerCase() === 'active' ? 'bg-green-300 text-white' :
              ListUser.status.toLowerCase() === 'en progreso' ? 'bg-yellow-300 text-gray-800' :
                ListUser.status.toLowerCase() === 'cerrado' ? 'bg-gray-300 text-white' :
                  'bg-blue-300 text-white'
              }`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.6 } }}
            >
              {ListUser.status}
            </motion.span>
          )}
          {/* Capa de superposición sutil con patrón */}
          <div className="absolute inset-0 bg-white opacity-10 bg-[url('/pictures/git.png')] bg-repeat-space mix-blend-overlay" style={{ backgroundSize: "auto 100%" }}></div>

          <div className="relative p-6 md:p-8 lg:p-10 flex items-center">

            {/* Imagen de Portada (Circular y Animada) */}
            {ListUser?.image && (
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden shadow-md border-2 border-white mr-6 cursor-pointer" // Añadí cursor-pointer para indicar interactividad
                initial={{ scale: 0.8, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 15, duration: 0.6 } }}
                whileHover={{
                  scale: 1.15,
                  borderRadius: '0.5rem',

                }}
              >
                <img
                  src={ListUser.image}
                  alt={`Avatar de ${ListUser?.name}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Información Principal */}
            <motion.div
              className="flex-grow" // Añadimos cursor-pointer
              whileHover={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)', // Ligeramente más oscuro al hover
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
            >
              <motion.h2 className="text-2xl md:text-3xl font-bold text-white "
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }}

              >
                {ListUser?.name}
              </motion.h2>
              <motion.p className="text-sm md:text-base text-white opacity-80"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' } }}
              >
                {ListUser?.description || 'Una lista de regalos especial.'}
              </motion.p>
              <div className="flex items-center mt-2 space-x-28 text-white text-xs">
                <motion.span className="inline-flex items-center  "
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.4 } }}
                >
                  <UserIcon className="h-4 w-4 mr-1" />{ListUser?.user?.name || 'Anfitrión'}
                </motion.span>
                {ListUser?.due_date && (
                  <motion.span className="inline-flex items-center "
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.5 } }}
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" />{new Date(ListUser.due_date).toLocaleDateString()}
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Botón de Acción (Animado y Flotante) */}
            <motion.button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-pink-500 font-semibold rounded-full shadow-lg p-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors duration-300"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.8 } }}
              onClick={() => { /* Acción del botón */ }}
            >
              <PlusIcon className="h-6 w-6" />
              <span className="sr-only">Añadir Regalo</span>
            </motion.button>
          </div>


        </motion.div>




        {/* Filtros y Búsqueda */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar regalos..."
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-pink-500 focus:border-pink-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Filtro por Categoría (Ejemplo si tus items tienen categoría) */}
          {ListUser?.items?.some(item => item.category) && (
            <div className="relative">
              <button className="inline-flex items-center py-2 px-4 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2" onClick={() => { /* Abrir menú de filtro */ }}>
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filtrar
              </button>
              {/* Aquí podrías implementar un menú desplegable para las categorías */}
            </div>
          )}







          {/* Ordenamiento */}
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="default">Ordenar por</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="price-asc">Precio (Menor a Mayor)</option>
              <option value="price-desc">Precio (Mayor a Menor)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ArrowsUpDownIcon className="h-5 w-5" />
            </div>
          </div>
        </div>

      </div>

      {/* Lista de Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {itemsToRender.length > 0 ? (
            itemsToRender.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl border border-gray-100 cursor-pointer"
                variants={itemVariants}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 100, duration: 0.3 } }}
                exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2, ease: 'easeInOut' } }}
                whileHover="hover"
                whileTap="tap"
                onClick={() => openDetails(item)} // Abrir detalles al hacer clic
              >
                <div className="relative h-60 overflow-hidden rounded-t-2xl">
                  <motion.img
                    src={`/pictures/rel.gif`}
                    alt={item.name}
                    className="w-full h-full object-cover block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  />
                </div>
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <motion.h3 className="text-xl font-semibold text-gray-900 mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                    >{item.name}</motion.h3>
                    <motion.p className="text-lg font-bold text-pink-600 mb-2 flex items-center"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                    >
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" /> {formatPrice(item.price)}
                    </motion.p>


                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={emptyListVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="col-span-1 sm:col-span-2 lg:col-span-3 text-center mt-10 p-8 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center border border-dashed border-gray-300"
            >
              <motion.div className="mb-5" animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.1, 1.1, 1.05, 1.05, 1], transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } }}>
                <InboxStackIcon className="h-14 w-14 text-gray-400" />
              </motion.div>
              <h4 className="text-xl text-gray-600 font-semibold mb-3">¡La lista está vacía!</h4>
              <p className="text-gray-500 text-sm">Es hora de empezar a agregar algunos regalos.</p>
              {/* Opcional: Botón para agregar items */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de Detalles del Item */}
      {selectedItem && (

<ModalItem show={selectedItem!= null} selectedItem={selectedItem}  onClose={closeDetails} color1={ListUser.color1} color2={ListUser.color2}  />
        
     
  )
}
    </motion.div >
  );
}
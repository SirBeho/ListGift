import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useList } from "../providers/ListProvider";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CurrencyDollarIcon,
  InboxStackIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  GiftIcon,
  ArrowsUpDownIcon,
  PlusIcon,
  PencilSquareIcon,
  ArrowRightIcon, // <--- IMPORTANTE: Icono para el botón de editar
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { BeatLoader } from "react-spinners";
import ModalItem from "../components/ModalItem";
import { useAuth } from "../providers/AuthProvider";
import confetti from "canvas-confetti";
import Alert from "../components/Alert";
import ModalManageItem from "../components/ModalManageItem"; // <--- CAMBIO: Importamos el componente unificado
import GiftCard from "../components/GiftCard";
//arrow.svg

// === VARIANTES ===
/* const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 1, delayChildren: 1 } },
  exit: { opacity: 0 },
}; */


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

const gridVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.4, // 👈 Ajusta este número para que sea "súper lenta"
    },
  },
};


const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.2,
    },
  },
};

// 2. VARIANTES DEL HIJO CON CUSTOM
const cardVariants = {
  initial: { opacity: 0, y: 50 },

  // Recibe el custom para cambiar estilo si está destacado
  animate: ({ isHighlighted }) => ({
    opacity: 1,
    y: 0,
    scale: isHighlighted ? 1.1 : 1,
    borderColor: isHighlighted ? "#ec4899" : "#e2e8f0",
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.8
    }
  }),
};


export default function List() {
  const { user, loading } = useAuth();
  const { listas, LoadListas, publicLists, LoadPublicListas } = useList();
  const { id } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory] = useState(() => localStorage.getItem('giftListFilterCategory') || 'all');
  const [sortOption, setSortOption] = useState(() => localStorage.getItem('giftListSortOption') || 'price-asc');
  const { search } = useLocation();
  const [highlightedId, setHighlightedId] = useState(19);
  const [apiRes, setApiRes] = useState(null);

  // --- NUEVOS ESTADOS PARA GESTIÓN DE ITEMS ---
  const [isOpen, setIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null); // Para saber si editamos o creamos
  const ListShow = [...(listas || []), ...(publicLists || [])].find((lista) => lista.id.toString() === id);

  const isOwner = ListShow?.user_id === user?.id || user?.id == 1; // Helper para saber si es dueño
  const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/uploads";

  const totalItems = ListShow?.items?.length || 0;
  const giftedItems = ListShow?.items?.filter(i => i.status === 2).length || 0;
  const progressPercent = totalItems > 0 ? (giftedItems / totalItems) * 100 : 0;

  //funcion para cargar lista publica y priva validando el user
  const RefresListas = useCallback(async () => {
    try {
      if (user) LoadListas();
      LoadPublicListas();
    }
    catch (error) {
      console.error("Error al cargar las listas:", error);
      setApiRes({ success: false, message: "Error al cargar las listas. Por favor, intenta de nuevo." });
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    RefresListas();
  }, [loading, RefresListas]);

  useEffect(() => {
    if (listas !== null && !ListShow && id !== undefined) {
      timerRef.current = setTimeout(() => navigate('/', { replace: true }), 4000);
    }
    return () => clearTimeout(timerRef.current);
  }, [listas, ListShow, id, navigate]);

  const handleSearch = (event) => setSearchTerm(event.target.value);
  const handleSort = (option) => setSortOption(option);

  // --- HANDLERS PARA ABRIR EL MODAL ---

  // Abrir modo CREAR
  const handleOpenCreate = () => {
    setItemToEdit(null); // Limpiamos para que el modal sepa que es nuevo
    setIsOpen(true);
  };

  // Abrir modo EDITAR
  const handleOpenEdit = (e, item) => {
    e.stopPropagation(); // ¡IMPORTANTE! Evita que se abra el modal de detalles al hacer click en editar
    setItemToEdit(item);
    setIsOpen(true);
  };

  const filteredAndSortedItems = useCallback(() => {
    if (!ListShow?.items) return [];

    let items = [...ListShow.items];

    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (sortOption) {
      case 'name-asc': items.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': items.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': items.sort((a, b) => a.price - b.price); break;
      case 'price-desc': items.sort((a, b) => b.price - a.price); break;
      default: break;
    }
    //agregar isOwner a cada item para usarlo en el modal de detalles
    return items.map(item => ({ ...item, isOwner }));

  }, [ListShow?.items, searchTerm, filterCategory, sortOption]);


  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = () => {

    setReplayKey((prev) => prev + 1);
  };


  // Highlight Effect
  useEffect(() => {
    if (ListShow?.items) {
      const params = new URLSearchParams(search);
      const highlight = params.get('highlight') || params.get('gifted');

      if (highlight) {
        const idToFind = parseInt(highlight);
        setHighlightedId(idToFind);

        const itemToOpen = ListShow.items.find(item => item.id === idToFind);

        if (itemToOpen) {
          setSelectedItem({ ...itemToOpen, isNewGift: true, isOwner });
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ec4899', '#8b5cf6', '#ffffff'] });
        }
      }
    }
  }, [ListShow?.items, search]);

  // Timer para apagar highlight al cerrar modal
  useEffect(() => {
    if (highlightedId && !selectedItem) {
      const element = document.getElementById(`item-${highlightedId}`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const stopBlinkingTimer = setTimeout(() => {
        setHighlightedId(null);
      }, 6000);
      return () => clearTimeout(stopBlinkingTimer);
    }
  }, [selectedItem, highlightedId]);


  const itemsToRender = filteredAndSortedItems();

  if (!listas && !publicLists) return <div className="flex justify-center items-center h-screen bg-gray-100"><BeatLoader color="#ec4899" size={24} /></div>


  if (!ListShow || id == undefined) {
    return (
      <motion.div variants={notFoundVariants} initial="initial" animate="animate" exit="exit" className="flex   flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100">
        <motion.div className="bg-white shadow-xl rounded-3xl max-w-md w-full p-10 text-center border-t-8 border-pink-500">
          <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-pink-600 mb-6" />
          <h2 className="text-3xl font-bold text-pink-700 mb-5">Lista no encontrada</h2>
          <motion.div variants={progressBarVariants} initial="initial" animate="animate" className="bg-pink-200 h-3 rounded-full mt-5 overflow-hidden"><motion.div className="bg-pink-500 h-full rounded-full" /></motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-slate-50">
      <Alert apiRes={apiRes} variant="toast" onClose={() => setApiRes(null)} />

      <ModalManageItem
        isOpen={isOpen}
        listId={id}
        onClose={() => setIsOpen(false)}
        setApiRes={setApiRes}
        refreshItems={RefresListas}
        apiRes={apiRes}
        itemToEdit={itemToEdit}
      />

      <motion.div className="max-w-7xl mx-auto p-4 sm:p-6" variants={containerVariants} initial="initial" animate="animate" exit="exit">

        {/* BOTÓN REGRESAR */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-slate-500 hover:text-pink-600 transition-colors font-medium text-sm "
        >

          <ArrowRightIcon className="h-4 w-4 mr-1 rotate-180 " />
          Volver a explorar
        </button>

        {/* Header Lista con Estadísticas */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
          <motion.div
            className="relative p-6 md:p-10 text-white"
            style={{ backgroundImage: `linear-gradient(135deg, ${ListShow.color1} 0%, ${ListShow.color2} 100%)` }}
          >
            {/* Decoración de fondo */}
            <div className="absolute inset-0 opacity-10 bg-[url('/pictures/git.png')] bg-repeat rotate-12 scale-150 pointer-events-none"></div>
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={ListShow.image ? `${VITE_STORAGE_URL}/${ListShow.image}` : `${VITE_STORAGE_URL}/pictures/git.png`}
                  className="w-28 h-28 rounded-3xl object-cover border-4 border-white/30 shadow-2xl"
                  alt=""
                />
                {isOwner && (
                  <div className="absolute -bottom-2 -right-2 bg-white text-pink-600 p-2 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <PencilSquareIcon className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="flex-grow text-center md:text-left">
                <h2 className="text-4xl font-black tracking-tight mb-2">{ListShow?.name}</h2>
                <p className="text-white/80 max-w-xl line-clamp-2">{ListShow?.description}</p>

                {/* BARRA DE PROGRESO */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex-grow h-2 bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{
                        duration: 1.5,      // 👈 Tiempo que tarda en llenarse (1.5s es el "sweet spot")
                        ease: "circOut",    // 👈 Empieza rápido y frena suavemente al final
                        delay: 0.5          // 👈 Espera a que la lista cargue antes de moverse
                      }}
                      className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">
                    {giftedItems}/{totalItems} CUMPLIDOS
                  </span>
                </div>
              </div>

              {isOwner && (
                <button
                  onClick={handleOpenCreate}
                  className="bg-white text-slate-900 px-6 py-4 rounded-2xl shadow-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 flex-shrink-0"
                >
                  <PlusIcon className="h-5 w-5 text-pink-500" />
                  Agregar Regalo
                </button>
              )}
            </div>
          </motion.div>

          {/* Filtros y Búsqueda */}
          <div className="p-4 sm:p-6 bg-white flex flex-col md:flex-row gap-4 border-t border-slate-100">
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="¿Qué regalo buscas?"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-none bg-slate-100 focus:ring-2 focus:ring-pink-500 transition-all"
                value={searchTerm}
                onChange={handleSearch}
              />


            </div>

            <select
              className="bg-slate-100 border-none rounded-xl py-3 px-4 font-bold text-slate-600 focus:ring-2 focus:ring-pink-500 cursor-pointer"
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="default">Ordenar por</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="price-asc">Más económico</option>
              <option value="price-desc">Más exclusivos</option>

            </select>


          </div>
        </div>

        <motion.div
          key={replayKey} // <--- IMPORTANTE: Cambia la KEY para reiniciar la animación
          variants={gridVariants}
          initial="initial"
          animate="animate"
          // Usamos Grid para que Framer calcule las posiciones más fácil
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {itemsToRender.map((item) => (
            <GiftCard
              key={item.id} // La KEY debe ser el ID real para que el 'layout' funcione
              item={item}
              isOwner={isOwner}
              highlightedId={highlightedId}
              handleOpenEdit={handleOpenEdit}
              setSelectedItem={setSelectedItem}
              VITE_STORAGE_URL={VITE_STORAGE_URL}
            />
          ))}
        </motion.div>

        {/* Mensaje vacío */}
        {itemsToRender.length === 0 && (
          <motion.div variants={emptyListVariants} className="py-20 text-center">
            <div className="bg-white inline-block p-10 rounded-3xl shadow-sm border border-slate-100">
              <InboxStackIcon className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h4 className="text-xl text-slate-400 font-bold">No encontramos regalos aquí</h4>
            </div>
          </motion.div>
        )}

        {selectedItem && (
          <ModalItem
            show={!!selectedItem}
            selectedItem={selectedItem}
            refreshItems={RefresListas}
            setApiRes={setApiRes}
            onClose={() => setSelectedItem(false)}
            color1={ListShow.color1}
            color2={ListShow.color2}
          />
        )}
      </motion.div>
    </div>
  );
}



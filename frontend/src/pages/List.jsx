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
  PencilSquareIcon, // <--- IMPORTANTE: Icono para el botón de editar
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { BeatLoader } from "react-spinners";
import ModalItem from "../components/ModalItem";
import { useAuth } from "../providers/AuthProvider";
import confetti from "canvas-confetti";
import Alert from "../components/Alert";
import ModalManageItem from "../components/ModalManageItem"; // <--- CAMBIO: Importamos el componente unificado
import { API_BASE_URL } from "../service/AxiosInstance";

// === VARIANTES ===
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  exit: { opacity: 0 },
};

const itemVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.9,
    borderColor: "rgba(0,0,0,0)",
    boxShadow: "0 0 0 rgba(0,0,0,0)"
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    borderColor: "rgba(0,0,0,0)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transition: { type: 'spring', damping: 15, stiffness: 100, duration: 0.3 }
  },
  highlight: {
    opacity: 1,
    y: 0,
    scale: 1.02,
    borderColor: ["#f3f4f6", "#ec4899", "#f3f4f6"],
    boxShadow: [
      "0px 0px 0px rgba(236, 72, 153, 0)",
      "0px 0px 20px rgba(236, 72, 153, 0.4)",
      "0px 0px 0px rgba(236, 72, 153, 0)"
    ],
    transition: {
      opacity: { duration: 0.3 },
      y: { type: "spring", stiffness: 100, damping: 20 },
      scale: { duration: 0.3 },
      borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
  hover: { scale: 1.03, rotate: 1, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)', transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
  }).format(price);
};

export default function List() {
  const { user } = useAuth();
  const { listas, LoadListas, publicLists, LoadPublicListas } = useList();
  const { id } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory] = useState(() => localStorage.getItem('giftListFilterCategory') || 'all');
  const [sortOption, setSortOption] = useState(() => localStorage.getItem('giftListSortOption') || 'default');
  const { search } = useLocation();
  const [highlightedId, setHighlightedId] = useState(null);
  const [apiRes, setApiRes] = useState(null);

  // --- NUEVOS ESTADOS PARA GESTIÓN DE ITEMS ---
  const [isOpen, setIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null); // Para saber si editamos o creamos
  const ListShow = [...(listas || []), ...(publicLists || [])].find((lista) => lista.id.toString() === id);

  const isOwner = ListShow?.user_id === user?.id || user?.id == 1; // Helper para saber si es dueño

  useEffect(() => {
    if (!listas) LoadListas();
    if (!publicLists) LoadPublicListas();
  }, [LoadListas, listas, publicLists, LoadPublicListas]);

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
      <motion.div variants={notFoundVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100">
        <motion.div className="bg-white shadow-xl rounded-3xl max-w-md w-full p-10 text-center border-t-8 border-pink-500">
          <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-pink-600 mb-6" />
          <h2 className="text-3xl font-bold text-pink-700 mb-5">Lista no encontrada</h2>
          <motion.div variants={progressBarVariants} initial="initial" animate="animate" className="bg-pink-200 h-3 rounded-full mt-5 overflow-hidden"><motion.div className="bg-pink-500 h-full rounded-full" /></motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div>
      <Alert apiRes={apiRes} variant="toast" onClose={() => setApiRes(null)} />

      {/* Componente Unificado para Crear/Editar */}
      <ModalManageItem
        isOpen={isOpen}
        listId={id}
        onClose={() => setIsOpen(false)}
        setApiRes={setApiRes}
        refreshItems={LoadListas}
        apiRes={apiRes}
        itemToEdit={itemToEdit} // Pasamos el item si estamos editando
      />

      <motion.div className="p-6 relative" variants={containerVariants} initial="initial" animate="animate" exit="exit" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>

        {/* Header Lista */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <motion.div className="mb-8 rounded-xl shadow-lg overflow-hidden relative hover:shadow-xl transition-shadow duration-300" style={{ backgroundImage: `linear-gradient(135deg, ${ListShow.color1} 0%, ${ListShow.color2} 100%)` }} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}>
            {ListShow?.status && (
              <motion.span className={`absolute top-3 right-3 inline-flex items-center h-fit text-xs font-semibold px-2.5 py-0.5 rounded shadow-sm ${ListShow.status.toLowerCase() === 'active' ? 'bg-green-300 text-white' : 'bg-blue-300 text-white'}`}>{ListShow.status}</motion.span>
            )}
            <div className="absolute inset-0 bg-white opacity-10 bg-[url('/pictures/git.png')] bg-repeat-space mix-blend-overlay" style={{ backgroundSize: "auto 100%" }}></div>

            <div className="relative p-6 md:p-8 lg:p-10 flex items-center">
              {ListShow?.image && <img src={ListShow.image ? `${API_BASE_URL}/uploads/${ListShow.image}` : `${API_BASE_URL}/pictures/git.png`} alt="" className="w-24 h-24 rounded-full border-2 border-white mr-6 object-cover shadow-md" />}
              <div className="flex-grow text-white">
                <h2 className="text-3xl font-bold">{ListShow?.name}</h2>
                <p className="opacity-90">{ListShow?.description}</p>
              </div>
              {/* BOTÓN FLOTANTE: ABRIR CREAR */}
              {isOwner && (
                <button onClick={handleOpenCreate} className="bg-white text-pink-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <PlusIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          </motion.div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Buscar regalos..." className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-pink-500 focus:border-pink-500" value={searchTerm} onChange={handleSearch} />
            </div>
            <div className="relative">
              <select className="block appearance-none w-full bg-white border border-gray-300 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500" value={sortOption} onChange={(e) => handleSort(e.target.value)}>
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio (Menor a Mayor)</option>
                <option value="price-desc">Precio (Mayor a Menor)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ArrowsUpDownIcon className="h-5 w-5" /></div>
            </div>
          </div>
        </div>

        {/* Grid de Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {itemsToRender.length > 0 ? (
              itemsToRender.map((item) => {
                const isGifted = item.status === 2;
                const isHighlighted = item.id === highlightedId;

                return (
                  <motion.div
                    key={item.id}
                    id={`item-${item.id}`}
                    variants={itemVariants}
                    initial="initial"
                    animate={isHighlighted ? "highlight" : "animate"}
                    exit="exit"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setSelectedItem(item)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 ${isHighlighted ? 'z-10' : ''} ${isGifted ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                    style={{ willChange: "transform, box-shadow, border-color" }}
                  >
                    {/* BOTÓN EDITAR (SOLO PARA EL DUEÑO) */}
                    {isOwner && !isGifted && (
                      <button
                        onClick={(e) => handleOpenEdit(e, item)}
                        className="absolute top-3 left-3 z-20 bg-white/90 text-indigo-600 p-1.5 rounded-full shadow-sm hover:bg-white hover:text-indigo-800 hover:scale-110 transition-all border border-indigo-100"
                        title="Editar regalo"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    )}

                    {isGifted && <div className="absolute top-3 right-3 z-20 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm"><CheckBadgeIcon className="h-4 w-4 mr-1" /> REGALADO</div>}
                    {isHighlighted && !isGifted && <div className="absolute top-3 right-3 z-20 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg animate-bounce"><GiftIcon className="h-4 w-4 mr-1" /> ¡AQUÍ!</div>}

                    <div className="relative h-60 overflow-hidden rounded-t-2xl">
                      <motion.img src={item.img_name ? `${API_BASE_URL}/uploads/${item.img_name}` : `${API_BASE_URL}/pictures/git.png`} alt={item.name} className={`w-full h-full object-cover block transition-all duration-500 ${isGifted ? 'grayscale-[80%] opacity-80' : ''}`} />
                      {isGifted && <div className="absolute inset-0 bg-green-900/10 mix-blend-multiply" />}
                    </div>

                    <div className="p-6 flex flex-col justify-between h-full relative">
                      <div>
                        <h3 className={`text-xl font-semibold mb-3 ${isGifted ? 'text-green-800 line-through' : 'text-gray-900'}`}>{item.name}</h3>
                        <p className={`text-lg font-bold mb-2 flex items-center ${isGifted ? 'text-green-600' : 'text-pink-600'}`}>
                          <CurrencyDollarIcon className="h-5 w-5 mr-2" /> {formatPrice(item.price)}
                        </p>
                      </div>
                      {isGifted && item.donante_nombre && <p className="text-xs text-green-600 font-medium mt-2">Regalado por {item.donante_nombre}</p>}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div variants={emptyListVariants} initial="initial" animate="animate" exit="exit" className="col-span-full text-center p-8 bg-white rounded-2xl shadow-md border border-dashed border-gray-300">
                <InboxStackIcon className="h-14 w-14 text-gray-400 mx-auto mb-3" />
                <h4 className="text-xl text-gray-600 font-semibold">¡La lista está vacía!</h4>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {selectedItem && <ModalItem show={selectedItem != null} selectedItem={selectedItem} refreshItems={LoadListas} setApiRes={setApiRes} onClose={() => setSelectedItem(false)} color1={ListShow.color1} color2={ListShow.color2} />}
      </motion.div>
    </div>
  );
}
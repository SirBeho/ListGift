import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useList } from "../providers/ListProvider";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { BeatLoader } from "react-spinners";
import ModalItem from "../components/ModalItem";
import { useAuth } from "../providers/AuthProvider";
import confetti from "canvas-confetti";
import Alert from "../components/Alert";
import ModalManageItem from "../components/ModalManageItem";
import GiftCard from "../components/GiftCard";
import { useTitle } from "../Hooks/useTitle";

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
      staggerChildren: 0.4,
    },
  },
};
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
      duration: 1.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { type: "tween", ease: "easeOut", duration: 1.2 }
  }
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
  const [highlightedId, setHighlightedId] = useState(null);
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
  useTitle(ListShow?.name || "Lista de Regalos");


  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": ListShow?.name,
    "description": ListShow?.description,
    "numberOfItems": ListShow?.items?.length || 0,
    "itemListElement": ListShow?.items?.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": item.name,
        "description": item.description,
        "image": item.image ? `${VITE_STORAGE_URL}/${item.image}` : `${VITE_STORAGE_URL}/pictures/git.png`,
        "offers": {
          "@type": "Offer",
          "price": item.price,
          "priceCurrency": "DOP"
        }
      }
    }))
  }), [ListShow, VITE_STORAGE_URL]);


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
      <motion.div variants={notFoundVariants} initial="initial" animate="animate" exit="exit" className="flex   flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100">
        <title>Lista no encontrada | ListGift</title>
        <motion.div className="bg-white shadow-xl rounded-3xl max-w-md w-full p-10 text-center border-t-8 border-pink-500">
          <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-pink-600 mb-6" />
          <h2 className="text-3xl font-bold text-pink-700 mb-5">Lista no encontrada</h2>
          <motion.div variants={progressBarVariants} initial="initial" animate="animate" className="bg-pink-200 h-3 rounded-full mt-5 overflow-hidden"><motion.div className="bg-pink-500 h-full rounded-full" /></motion.div>
        </motion.div>
      </motion.div>
    );
  }




  return (
    <div className=" min-h-screen bg-slate-50">

      <title>{`${ListShow.name} | ListGift`}</title>
      <meta name="description" content={ListShow.description || `Mira la lista de regalos de ${ListShow.user?.name}`} />

      {/* Open Graph (Social SEO) */}
      <meta property="og:title" content={`Lista de Regalos: ${ListShow.name}`} />
      <meta property="og:description" content={ListShow.description} />
      <meta property="og:image" content={ListShow.image ? `${VITE_STORAGE_URL}/${ListShow.image}` : `https://ununique-convertibly-rachel.ngrok-free.dev/pictures/git.png`} />
      <meta property="og:image" content={ListShow.image ? `${VITE_STORAGE_URL}/${ListShow.image}` : `${VITE_STORAGE_URL}/pictures/git.png`} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="article" />

      {/* JSON-LD Script */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <Alert apiRes={apiRes} variant="toast" onClose={() => setApiRes(null)} />


      <motion.main key={id} className="max-w-7xl mx-auto p-4 sm:p-6" variants={containerVariants} initial="initial" animate="animate" exit="exit">

        {/* BOTÓN REGRESAR */}
        <nav aria-label="Navegación de regreso">
          <button
            onClick={() => navigate('/')}
            className="mb-2 flex items-center text-slate-500 hover:text-pink-600 transition-colors font-medium text-sm group"
          >
            <ArrowRightIcon className="h-4 w-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Volver a explorar
          </button>
        </nav>

        {/* Header Lista con Estadísticas */}
        <article className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
          <motion.div
            className="relative p-6 md:p-10 text-white"
            style={{ backgroundImage: `linear-gradient(135deg, ${ListShow.color1} 0%, ${ListShow.color2} 100%)` }}
          >
            <div className="absolute inset-0 opacity-10 bg-[url('/pictures/git.png')] bg-repeat rotate-12 scale-150 pointer-events-none"></div>
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={ListShow.image ? `${VITE_STORAGE_URL}/${ListShow.image}` : `${VITE_STORAGE_URL}/pictures/git.png`}
                  className="w-28 h-28 rounded-3xl object-cover border-4 border-white/30 shadow-2xl"
                  alt={`Portada de la Lista de regalos ${ListShow.name} creada por ${ListShow.user?.name || 'un usuario'} en ListGift`}
                />
                {isOwner && (
                  <div className="absolute -bottom-2 -right-2 bg-white text-pink-600 p-2 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <PencilSquareIcon className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="flex-grow text-center md:text-left">
                {/* H1 es vital para SEO: Solo uno por página */}
                <h1 className="text-4xl font-black tracking-tight mb-2">{ListShow.name}</h1>
                <p className="text-white/80 max-w-xl line-clamp-2 italic">
                  {ListShow.description || "Sin descripción disponible"}
                </p>

                {/* BARRA DE PROGRESO */}
                <div className="mt-6 flex items-center gap-4" aria-label="Progreso de regalos cumplidos">
                  <div className="flex-grow h-2 bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
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
                  className="bg-white text-slate-900 px-6 py-4 rounded-2xl shadow-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all hover:-translate-y-1 active:scale-95"
                >
                  <PlusIcon className="h-5 w-5 text-pink-500" />
                  Agregar Regalo
                </button>
              )}
            </div>
          </motion.div>

          {/* Filtros - Mejorado con labels para accesibilidad */}
          <section className="p-4 sm:p-6 bg-white flex flex-col md:flex-row gap-4 border-t border-slate-100">
            <div className="relative flex-grow">
              <label htmlFor="search-gifts" className="sr-only">Buscar regalos</label>
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-gifts"
                type="text"
                placeholder="¿Qué regalo buscas?"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-none bg-slate-100 focus:ring-2 focus:ring-pink-500 transition-all"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <select
              aria-label="Ordenar regalos"
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
          </section>
        </article>


        <AnimatePresence mode="wait">
          {itemsToRender?.length > 0 ? (
            <motion.section
              variants={gridVariants}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >

              {itemsToRender.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={layoutVariants}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer"
                >
                  <GiftCard
                    item={item}
                    isOwner={isOwner}
                    highlightedId={highlightedId}
                    handleOpenEdit={handleOpenEdit}
                    setSelectedItem={setSelectedItem}
                    VITE_STORAGE_URL={VITE_STORAGE_URL}
                  />
                </motion.div >
              ))}

            </motion.section>
          ) : (
            <motion.div key="empty"
              className="col-span-full flex flex-col items-center justify-center py-16 px-6 bg-card border border-border rounded-3xl border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl" role="img" aria-label={searchTerm ? "Lupa de búsqueda" : "Regalo"}>
                  {searchTerm ? "🔍" : "🎁"}
                </span>
              </div>
              <h4 className="text-xl font-medium text-foreground">
                {searchTerm ? `No encontramos nada para "${searchTerm}"` : "No hay listas públicas aún"}
              </h4>
              <p className="text-muted-foreground mt-1 text-center">
                {searchTerm
                  ? "Intenta con otras palabras o revisa la ortografía."
                  : "Sé el primero en crear una lista y compartirla con el mundo."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-primary font-bold text-sm hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </motion.div>
          )}

        </AnimatePresence>


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

        <ModalManageItem
          isOpen={isOpen}
          listId={id}
          onClose={() => setIsOpen(false)}
          setApiRes={setApiRes}
          refreshItems={RefresListas}
          apiRes={apiRes}
          itemToEdit={itemToEdit} // Pasamos el item si estamos editando
        />
      </motion.main>
    </div>
  );
}



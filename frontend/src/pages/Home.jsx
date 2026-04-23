import { useState, useEffect, useCallback } from 'react';
import { useList } from '../providers/ListProvider';
import Card from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useAuth } from '../providers/AuthProvider';

const gridVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.2,
    },
  },
};
// 1. Variantes Estructurales (Para el List.jsx y el contenedor de la Card)
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



function Home() {
  const { user } = useAuth();
  const { publicLists: listas, LoadPublicListas } = useList();
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(localStorage.getItem("sidebarOpen") === "true");
  const [busqueda, setBusqueda] = useState('');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ListGift",
    "url": "https://listgift.free.nf",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://listgift.free.nf/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "Crea y comparte listas de regalos personalizadas para bodas, cumpleaños y baby showers en República Dominicana."
  };

  useEffect(() => {
    if (!listas) {
      LoadPublicListas();
    }
  }, []);

  const [mostrarBoton, setMostrarBoton] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      // Comparamos el ratio directamente (0.8 es el 80%)
      const isBottom = (window.scrollY / (d.scrollHeight - window.innerHeight)) > 0.8;
      setMostrarBoton(isBottom);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Función para hacer scroll suave hacia una sección
  const scrollToSection = (id) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

  };
  const filteredList = useCallback(() => {
    if (!listas) return [];
    const termino = busqueda.toLowerCase();
    let listaf = listas;
    if (termino) {
      listaf = listas.filter(lista =>
        lista.name.toLowerCase().includes(termino) ||
        lista.description.toLowerCase().includes(termino)
      );
    }


    return listaf;

  }, [listas, busqueda]);

  const listasFiltradas = filteredList();

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center text-destructive bg-destructive/10 border border-destructive/20 shadow-md p-6 rounded-2xl max-w-md w-full">
          <p className="font-medium">Error al cargar las listas</p>
          <p className="text-sm opacity-80 mt-1">{error}</p>
        </div>
      </main>
    );
  }

  return (
    // Agregamos id="inicio" para referencia
    <main id="inicio" className="flex flex-col min-h-screen z-30 ">


      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>


      {/* 1. SECCIÓN PRINCIPAL DE BIENVENIDA (Solo para no usuarios) */}
      {!user && (
        <section className="flex flex-col items-center justify-center text-center pt-6">
          {/* H1 con palabras clave para Google */}
          <div className='px-6 pb-10 lg:py-15'>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground md:leading-tight tracking-tight text-balance">
              Regalar se vuelve <br className="hidden md:block" />
              <span className="text-primary italic sm:text-7xl text-3xl">maravillosamente sencillo.</span>
            </h1>
            <p className="mt-6 text-sm md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Crea listas de regalos espectaculares para cualquier ocasión. Comparte con amigos y familiares,
              y deja que sepan exactamente qué te hace ilusión recibir.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
              <Link to={"/login"}
                className=" w-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-base text-primary-foreground font-medium bg-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all group">
                <span>Empecemos!! — Es Gratis</span>
                <ArrowRightIcon strokeWidth={3} className="w-4 h-4 ml-2  transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>

              <button
                onClick={() => scrollToSection('features')}
                className="w-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-base text-foreground font-medium bg-transparent border-2 border-border hover:bg-muted/50 transition-all"
              >
                Saber más
              </button>
            </div>
          </div>
        </section>)
      }

      {/* 2. GRID DE LISTAS PÚBLICAS */}
      <section className="bg-muted/30 relative">
        <div className="w-full max-w-[1400px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>

        {/* Usamos un H2 para la jerarquía SEO correcta */}
        <h2 className="w-full sticky top-0 z-10 bg-muted/80 backdrop-blur-md mx-auto text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-foreground tracking-tight hover:text-primary transition-colors py-4 md:py-2 px-6 sm:px-8 lg:px-12">
          Explorar Listas de Regalos
        </h2>

        <div className="border-b border-border/40 bg-muted/80 shadow-xl  mx-auto px-6 sm:px-8 lg:px-12 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-left group cursor-default mt-1 text-muted-foreground text-lg " >
            ¡Encuentra el detalle perfecto para tus amigos y familiares!
          </p>
          <div className="relative w-full md:w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <input
              type="text"
              placeholder="Buscar por nombre o evento..."
              value={busqueda} // Conectamos el estado
              onChange={(e) => setBusqueda(e.target.value)} // Actualizamos el estado
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm"
            />
          </div>
        </div>




        <div className="relative  bg-card  px-6 sm:px-8 lg:px-12 py-12 max-w-[1400px] mx-auto w-full rounded-md ">
          <AnimatePresence mode="wait">
            {listasFiltradas?.length > 0 ? (
              <motion.section
                key="grid"
                variants={gridVariants}
                initial="initial"
                animate="animate"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 "
              >

                {listasFiltradas.map((lista) => (
                  <motion.div
                    key={lista.id}
                    layout
                    variants={layoutVariants}
                    transition={{ layout: { type: "spring", stiffness: 300, damping: 25 } }}
                  >
                    <Card data={lista} litt />
                  </motion.div >
                ))}
              </motion.section>
            ) : (
              <motion.div key="empty"
                className="col-span-full flex flex-col items-center justify-center py-16 px-6 bg-card border border-border rounded-3xl border-dashed">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">{busqueda ? "🔍" : "🎁"}</span>
                </div>
                <h4 className="text-xl font-medium text-foreground">
                  {busqueda ? `No encontramos nada para "${busqueda}"` : "No hay listas públicas aún"}
                </h4>
                <p className="text-muted-foreground mt-1 text-center">
                  {busqueda
                    ? "Intenta con otras palabras o revisa la ortografía."
                    : "Sé el primero en crear una lista y compartirla con el mundo."}
                </p>
                {busqueda && (
                  <button
                    onClick={() => setBusqueda("")}
                    className="mt-4 text-primary font-bold text-sm hover:underline"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>


        <div className="absolute  w-full  pb-20 shadow-[0_-20px_25px_-5px_rgba(0,0,0,0.1)]">

        </div>

      </section>


      {/* 3. FEATURES SECTION */}
      <section id="features" className="bg-background relative  ">
        <div className="w-full max-w-[1400px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>

        <h3 className="w-full sticky top-0 z-10 bg-muted/80 backdrop-blur-md mx-auto text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-foreground tracking-tight hover:text-primary transition-colors py-4 md:py-2 px-6 sm:px-8 lg:px-12 text-center " >
          Todo lo que necesitas
        </h3>



        <p className="w-full text-center pb-2 text-lg text-muted-foreground mx-auto bg-muted/80 shadow-md border-b border-border">
          Funciones potentes para que regalar sea más fácil y sin complicaciones.
        </p>

        <div className="max-w-7xl mx-auto px-6 pt-16 mb-24 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 text-center">

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">Comparte Fácilmente</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty max-w-xs">
                Envía tu lista con un simple enlace. <span className="text-foreground/80 font-medium">Tus invitados no necesitan cuenta</span> para ver y reservar.
              </p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">Control de Privacidad</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty max-w-xs">
                Mantén tus listas privadas o hazlas públicas. Tú decides exactamente quién ve qué y cuándo.
              </p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">Actualizaciones en Vivo</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty max-w-xs">
                Recibe notificaciones al instante cuando alguien reserva un regalo. Mantente organizado sin adivinanzas.
              </p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">Sugerencias Inteligentes</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty max-w-xs">
                Obtén recomendaciones personalizadas basadas en tus gustos, listas anteriores y el tipo de ocasión.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION & CONTACTO */}
      {!user && (
        <section className="relative bg-white border-t border-border/50 z-50 ">
          <div className='bg-primary/5 py-10 '>
            <div className="max-w-4xl mx-auto px-6 text-center z-10  ">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
                ¿Listo para simplificar tus regalos?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
                No más regalos repetidos ni tallas equivocadas. Crea tu primera lista hoy mismo y compártela con quienes más te importan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  Crear mi cuenta gratis
                </Link>

                {/* Botón de WhatsApp - Convertido a Enlace */}
                <a
                  href={`https://wa.me/18098892235?text=${encodeURIComponent('¡Hola! Necesito soporte con mi cuenta de ListGift.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border-2 border-border text-foreground font-medium hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Contactar soporte
                </a>
              </div>
            </div>
          </div>
        </section>)}

      {/* 5. FOOTER */}


      {/* ✨ 5. BOTÓN FLOTANTE CON FRAMER MOTION ✨ */}
      <AnimatePresence>
        {mostrarBoton && (
          <motion.button
            initial={{ opacity: 0, y: 50, scale: 0.5 }} // Cómo nace (transparente, abajo y pequeño)
            animate={{ opacity: 1, y: 0, scale: 1 }}    // Cómo se queda (visible, posición normal)
            exit={{ opacity: 0, y: 50, scale: 0.5 }}    // Cómo muere (se vuelve a hundir y desaparecer)
            transition={{ duration: 0.3, ease: "easeInOut" }} // Duración de la magia
            onClick={() => scrollToSection()}
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 border border-primary-foreground/10 hover:shadow-xl hover:scale-105 transition-shadow"
            aria-label="Volver arriba"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

    </main >
  );
}

export default Home;
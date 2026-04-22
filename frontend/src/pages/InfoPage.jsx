import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeftIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    CpuChipIcon,
    CommandLineIcon,
    ServerIcon,
    CloudArrowUpIcon,
    ChevronDownIcon,
    LockClosedIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

export default function InfoPage() {
    const { section } = useParams();
    const [showDetails, setShowDetails] = useState(false);

    const infoContent = {
        about: {
            title: "Sobre el Proyecto",
            content: (
                <div className=" text-slate-600 ">
                    {/* 1. DESCRIPCIÓN */}
                    <section className="space-y-4 pb-8">
                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <GlobeAltIcon className="h-6 w-6 text-emerald-500" />
                            </div>
                            ¿Qué es ListGift?
                        </h3>
                        <p className="text-lg leading-relaxed border-l-4 border-primary pl-4 italic">
                            <strong>ListGift</strong> no es solo un gestor de listas; es una declaración de independencia para el consumidor moderno que busca centralizar sus deseos sin restricciones de plataforma.
                        </p>
                        <p>
                            Nuestra arquitectura permite la <strong>independencia total de tiendas</strong>. Puedes centralizar deseos de cualquier procedencia: desde grandes comercios internacionales hasta artesanos locales en Santiago o redes sociales.
                            <span className="block mt-2 font-bold  italic text-emerald-500">Si tiene un nombre y un lugar, puede estar en tu lista.</span>
                        </p>
                    </section>

                    {/* 2. ORIGEN */}
                    <section className="space-y-4 border-y border-slate-100 py-8 mb-8">
                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <SparklesIcon className="h-6 w-6 text-emerald-500" />
                            </div>
                            El Origen: Rompiendo Barreras
                        </h3>
                        <p>
                            La mayoría de las plataformas actuales obligan al usuario a elegir productos de catálogos específicos. <strong>ListGift</strong> surge de la necesidad de romper esos "jardines vallados".
                        </p>
                        <p>
                            Este proyecto nace de una observación cotidiana: la fragmentación de las listas actuales, donde el proceso de regalar se ha vuelto rígido y atado a algoritmos comerciales.
                        </p>
                        <p className=" text-slate-800">
                            La chispa inicial fue crear una herramienta que devolviera el control al usuario. <strong>Lo que comenzó como una solución personal pronto se transformó en un desafío de ingeniería Full-Stack.</strong>
                        </p>
                    </section>

                    {/* 3. AUTOR */}
                    <section className=" hover:border-primary/20 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row gap-8 items-center shadow-sm relative overflow-hidden group">
                        {/* Decoración sutil */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full transition-transform group-hover:scale-110 group-hover:bg-primary/20" />

                        <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl shrink-0 border-4 border-white relative z-10 ring-4 ring-emerald-50">
                            <img src="https://raw.githubusercontent.com/SirBeho/compilador/refs/heads/master/img/ouner.jpg" alt="Ing. Benjamin Tavarez" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center md:text-left relative z-10">
                            <h3 className="text-xl font-black text-slate-800">Benjamin Tavarez</h3>
                            <p className="text-primary font-bold mb-2 text-sm uppercase tracking-wider">Ingeniero en Sistemas & Full-Stack Developer</p>
                            <p className="text-sm leading-relaxed text-slate-500 italic">
                                "Como autor de ListGift, mi enfoque fue unir la robustez del backend en <strong>PHP</strong> con la interactividad de <strong>React</strong>. Este proyecto no solo cumple una función técnica, sino que resuelve problemas reales con elegancia y precisión.".
                            </p>
                        </div>
                    </section>


                    {/* 4. ESPECIFICACIONES TÉCNICAS (ADN) */}
                    <section className="mt-8 pt-8 border-t border-slate-100">
                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-10">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CommandLineIcon className="h-6 w-6 text-emerald-500" />
                            </div>
                            Arquitectura del Sistema
                        </h3>
                        {/* Encabezado con íconos y botón de toggle */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                                <div className=" gap-3 flex items-start group">
                                    <div className="p-2  rounded-2xl group-hover:bg-emerald-50 transition-colors">
                                        <CpuChipIcon className="h-8 w-8 text-emerald-500" />
                                    </div>
                                    <div className="">

                                        <h4 className="font-bold text-slate-700 text-sm">Ingeniería Robusta</h4>
                                        <p className="text-xs text-slate-400 font-medium">Desarrollado con React, PHP, y despliegue continuo mediante GitHub Actions.</p>

                                    </div>


                                </div>
                                <div className="flex items-start gap-3 group">
                                    <div className="p-2  rounded-2xl group-hover:bg-emerald-100 transition-colors">
                                        <ShieldCheckIcon className="h-8 w-8 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-700 text-sm">Seguridad JWT</h4>
                                        <p className="text-xs text-slate-400 font-medium">Protección de datos mediante tokens firmados (JWT), RBAC y cifrado Bcrypt.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="flex justify-center md:justify-end  mb-1 ">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="flex items-center gap-2 text-slate-300 hover:text-emerald-500 transition-all duration-300 group"
                            >
                                <span className="text-[9px] uppercase tracking-widest font-bold">
                                    {showDetails ? "Cerrar detalles" : "Expandir arquitectura técnica"}
                                </span>
                                <ChevronDownIcon className={`h-3 w-3 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Contenido expandible con animación */}
                        <AnimatePresence>
                            {showDetails && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-dashed border-slate-300">
                                        <TechCard
                                            icon={<CpuChipIcon className="h-5 w-5 text-emerald-500" />}
                                            title="Frontend Development"
                                            desc="SPA construida con React + Vite. Implementa diseño atómico con Tailwind CSS, animaciones en Framer Motion e interactividad 3D con Spline."
                                        />
                                        <TechCard
                                            icon={<ServerIcon className="h-5 w-5 text-emerald-500" />}
                                            title="Backend & API"
                                            desc="Core en PHP con Bramus/Router. Persistencia mediante el ORM Illuminate/Database y validación estricta con Respect/Validation."
                                        />
                                        <TechCard
                                            icon={<LockClosedIcon className="h-5 w-5 text-emerald-500" />}
                                            title="Seguridad y Acceso"
                                            desc="Gestión de sesiones mediante JWT en cookies seguras. Middlewares para control de acceso (RBAC) y cifrado Bcrypt para credenciales."
                                        />
                                        <TechCard
                                            icon={<CloudArrowUpIcon className="h-5 w-5 text-emerald-500" />}
                                            title="DevOps e Infraestructura"
                                            desc="Pipeline de CI/CD automatizado con GitHub Actions. Despliegue condicional vía FTP hacia servidores de producción en InfinityFree."
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            )
        },
        privacy: {
            title: "Política de Privacidad",
            content: (
                <div className="space-y-10 text-slate-600">
                    {/* 1. COMPROMISO DE PRIVACIDAD */}
                    <section className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <ShieldCheckIcon className="h-6 w-6 text-emerald-500" />
                            </div>
                            Privacidad por Diseño
                        </h3>
                        <p className="text-lg leading-relaxed border-l-4 border-emerald-500 pl-4 italic">
                            En <strong>ListGift</strong>, tu privacidad no es una funcionalidad añadida; es la base sobre la cual construimos nuestro código.
                        </p>
                    </section>

                    {/* 2. RECOLECCIÓN DE DATOS */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase">
                                <CommandLineIcon className="h-4 w-4 text-primary" /> Datos de Cuenta
                            </h4>
                            <p className="text-xs leading-relaxed">
                                Almacenamos exclusivamente tu correo electrónico y nombre de usuario. Estos datos son esenciales para la gestión de sesiones y la vinculación de tus listas personales.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase">
                                <CloudArrowUpIcon className="h-4 w-4 text-primary" /> Multimedia
                            </h4>
                            <p className="text-xs leading-relaxed">
                                Las imágenes de tus regalos son gestionadas mediante la <strong>Google Drive API</strong>. ListGift no almacena archivos físicos de forma local, garantizando la integridad en la nube.
                            </p>
                        </div>
                    </section>

                    {/* 3. INGENIERÍA DE PROTECCIÓN */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-black text-slate-800">Seguridad de la Información</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 items-start">
                                <div className="h-5 w-5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">JWT</div>
                                <p className="text-sm"><strong>Sesiones Seguras:</strong> Utilizamos JSON Web Tokens (JWT) para gestionar la autenticación sin estado, eliminando riesgos de persistencia de sesión en el servidor.</p>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="h-5 w-5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">***</div>
                                <p className="text-sm"><strong>Cifrado de Credenciales:</strong> Aplicamos algoritmos de hashing <strong>Bcrypt</strong> de una sola vía para proteger tus contraseñas; nunca se almacenan en texto plano.</p>
                            </li>
                        </ul>
                    </section>

                    <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 text-center">
                        <p className="text-sm font-medium text-slate-700">
                            <strong>Cero Rastreadores:</strong> ListGift no utiliza cookies de marketing ni servicios de rastreo de terceros. Tu actividad es tuya y de nadie más.
                        </p>
                    </div>
                </div>
            )
        },

        terms: {
            title: "Términos de Servicio",
            content: (
                <div className="space-y-10 text-slate-600">
                    {/* 1. GOBERNANZA DEL SERVICIO */}
                    <section className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <LockClosedIcon className="h-6 w-6 text-emerald-500" />
                            </div>
                            Gobernanza de Datos
                        </h3>
                        <p>
                            Al utilizar <strong>ListGift</strong>, el usuario acepta que la plataforma es una herramienta de organización personal basada en un sistema de <strong>Control de Acceso Basado en Roles (RBAC)</strong>.
                        </p>
                    </section>

                    {/* 2. REGLAS DE USO CRUD */}
                    <section className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-4">Responsabilidades del Usuario</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="text-xs">
                                    <span className="text-primary font-bold">●</span> <strong>Integridad:</strong> El usuario es responsable de la veracidad de los enlaces externos añadidos a sus listas.
                                </div>
                                <div className="text-xs">
                                    <span className="text-primary font-bold">●</span> <strong>Seguridad:</strong> Es deber del usuario mantener la confidencialidad de su acceso gestionado por JWT.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. PROPIEDAD INTELECTUAL Y TÉCNICA */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-black text-slate-800">Propiedad de los Recursos</h3>
                        <p className="text-sm leading-relaxed">
                            Gracias a nuestro sistema de <strong>Middlewares de Propiedad</strong>, el usuario mantiene el control absoluto sobre sus recursos (Creación, Lectura, Actualización y Eliminación). ListGift garantiza que ningún otro usuario tenga acceso a tus datos privados a menos que se utilicen las funciones de compartir explícitamente diseñadas.
                        </p>
                    </section>

                    {/* 4. DESCARGO DE RESPONSABILIDAD */}
                    <section className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-6 opacity-60">
                        <div className="max-w-xs text-[10px] leading-relaxed italic">
                            ListGift se ofrece "tal cual" como un producto de mejora continua. No nos hacemos responsables por cambios de precios o disponibilidad en sitios de terceros.
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Build 2026.04 | Santiago, RD
                        </div>
                    </section>
                </div>
            )
        }
    };

    const data = infoContent[section];
    if (!data) return <Navigate to="/" />;

    return (
        <main className="min-h-screen bg-slate-50 py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-white p-8 sm:p-14 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 border border-slate-100"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-500 mb-10 transition-colors font-bold text-sm group">
                    <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Volver al inicio
                </Link>

                <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tighter uppercase">
                    {data.title}<span className="text-primary">.</span>
                </h1>
                <div className="h-2 w-20 bg-primary rounded-full mb-12 shadow-sm shadow-emerald-500/20" />

                <div className="prose prose-slate max-w-none">
                    {data.content}
                </div>
            </motion.div>
        </main>
    );
}

function TechCard({ icon, title, desc }) {
    return (
        <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-500/20 transition-all group hover:scale-105">
            <h4 className="font-black text-slate-800 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                {icon} {title}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    );
}
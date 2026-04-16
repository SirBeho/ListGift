import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import {
    CurrencyDollarIcon,
    GiftIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";



const interactionVariants = {
    // Controla el pulso del highlight y el estado base del borde
    active: ({ isHighlighted }) => isHighlighted ? {
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
            borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            default: { type: "tween", ease: "easeOut", duration: 0.3 }
        }
    } : {
        borderColor: "rgba(0,0,0,0)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },

    // Tu hover de 1.13 y rotación
    hover: ({ isGifted }) => ({
        scale: 1.13,
        rotate: isGifted ? 0 : 1,
        transition: { duration: 0.2 }
    }),
    tap: { scale: 0.95 }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
        minimumFractionDigits: 2,
    }).format(price);
};

export default function GiftCard({ item, isOwner, highlightedId, handleOpenEdit, setSelectedItem, VITE_STORAGE_URL }) {
    const isGifted = item.status === 2;
    const isHighlighted = item.id === highlightedId;
    return (
        <motion.div
            variants={interactionVariants}
            custom={{ isHighlighted, isGifted }}
            whileHover="hover"
            whileTap="tap"
            animate="active"
            onClick={() => setSelectedItem(item)}
            className={`cursor-pointer group relative rounded-3xl p-3 border-2 
          ${isGifted ? 'bg-green-50/70 border-green-200 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}

        >
            {/* Imagen */}
            <div className={`relative h-52 w-full rounded-2xl overflow-hidden mb-4 
          ${isGifted ? 'bg-white border-b-2 border-green-100' : 'bg-slate-50'}`}>
                <img
                    src={item.img_name ? `${VITE_STORAGE_URL}/${item.img_name}` : `${VITE_STORAGE_URL}/pictures/git.png`}
                    className={`w-full h-full object-cover block transition-all duration-700 
              ${isGifted ? 'grayscale-[80%] opacity-80' : ''}`}
                    alt=""
                />

                {/* Badges Flotantes */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    {isGifted && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center shadow-lg">
                            <CheckBadgeIcon className="h-4 w-4 mr-1" /> REGALADO
                        </div>
                    )}
                    {isHighlighted && !isGifted && (
                        <div className="bg-pink-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                            <GiftIcon className="h-5 w-5" />
                        </div>
                    )}
                </div>

                {/* Acciones de Dueño */}
                {isOwner && !isGifted && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Previene que se abra el modal de detalles
                            handleOpenEdit(e, item);
                        }}
                        className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-indigo-600 p-2.5 rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10 border border-indigo-50"
                        title="Editar regalo"
                    >
                        <PencilSquareIcon className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Info */}
            <div className="px-3 pb-2 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className={`font-bold text-lg mb-1 truncate 
              ${isGifted ? 'text-green-900 line-through opacity-60' : 'text-slate-900'}`}>
                        {item.name}
                    </h3>
                    <div className={`text-base font-black flex items-center 
              ${isGifted ? 'text-green-600' : 'text-primary'}`}>
                        <CurrencyDollarIcon className="h-5 w-5 mr-1.5 opacity-70" /> {formatPrice(item.price)}
                    </div>
                </div>

                {isGifted && item.donante_nombre && (
                    <div className="mt-4 pt-3 border-t border-green-100">
                        <p className="text-[10px] font-bold tracking-wider text-green-700 uppercase">Cumplido por:</p>
                        <p className="text-sm font-semibold text-green-900 truncate">{item.donante_nombre}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

import React, { useState } from "react";
import { motion } from "framer-motion";

// 1. VARIANTES DEL PADRE (La cascada)
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

export default function SequentialCardsOriginal() {
    const [replayKey, setReplayKey] = useState(0);
    const [highlightedId, setHighlightedId] = useState(3);

    // Estado para las cartas (para poder reordenar)
    const [cards, setCards] = useState(
        Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            title: `Carta ${i + 1}`,
        }))
    );

    const handleReplay = () => {
        // Reiniciamos orden normal, llave de cascada y carta resaltada
        setCards([...cards].sort((a, b) => a.id - b.id));
        setHighlightedId(Math.floor(Math.random() * 10) + 1);
        setReplayKey((prev) => prev + 1);
    };

    // Función de reordenamiento para probar el 'layout'
    const handleShuffle = () => {
        setCards([...cards].sort(() => Math.random() - 0.5));
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-10 font-sans">

            <div className="flex gap-4 mb-12">
                <button
                    onClick={handleReplay}
                    className="px-8 py-3 bg-pink-500 text-white font-black rounded-full hover:bg-pink-400 active:scale-95 transition-all"
                >
                    Repetir Cascada + Custom
                </button>
                <button
                    onClick={handleShuffle}
                    className="px-8 py-3 bg-white text-slate-900 font-black rounded-full shadow-lg hover:bg-slate-100 active:scale-95 transition-all"
                >
                    Barajar (Probar Reorden)
                </button>
            </div>

            <motion.div
                key={replayKey}
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full max-w-5xl"
            >
                {cards.map((card) => {
                    const isHighlighted = card.id === highlightedId;

                    return (
                        <motion.div
                            key={card.id}
                            layout // 👈 AQUÍ VUELVE EL REORDENAMIENTO
                            variants={cardVariants}
                            custom={{ isHighlighted }} // 👈 AQUÍ ESTÁ EL CUSTOM

                            // Blindamos el Layout para que no use la variante tween de la entrada
                            transition={{
                                layout: { type: "spring", stiffness: 300, damping: 25 }
                            }}
                            className="bg-white h-40 rounded-3xl flex flex-col items-center justify-center shadow-lg border-b-4 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                <span className="text-slate-400 font-bold">{card.id}</span>
                            </div>
                            <span className="text-lg font-black text-slate-800">
                                {card.title}
                            </span>
                        </motion.div>
                    );
                })}
            </motion.div>

        </div>
    );
}
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({ apiRes, variant = 'inline', onClose, duration = 4000 }) => {

    const isError = apiRes?.status === 'error';

    useEffect(() => {

        if (apiRes && variant === 'toast' && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration + 300);
            return () => clearTimeout(timer);
        }
    }, [apiRes]);

    const styles = {
        inline: "relative p-3 mb-4 rounded-md border",
        toast: "fixed bottom-8 right-5 z-[111] w-80 shadow-2xl border p-4 rounded-lg", // Cambié absolute a fixed para que flote sobre todo
    };

    const colors = isError
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-green-50 border-green-200 text-green-800";

    const barColor = isError ? "bg-red-500" : "bg-green-500";

    return (
        <AnimatePresence mode="wait">
            {apiRes && (
                <motion.div
                    key={apiRes.message}
                    layout
                    onClick={(e) => e.stopPropagation()}

                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.4 } }}

                    // AQUI aplicamos todos los estilos juntos
                    className={`${styles[variant]} ${colors} overflow-hidden pointer-events-auto origin-bottom`}
                >
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{isError ? '⚠️' : '✅'}</span>
                            <p className="font-medium text-sm leading-tight">{apiRes.message}</p>
                        </div>
                        {/* Botón de cerrar opcional */}
                        {onClose && (
                            <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Barra de Progreso */}
                    {variant === 'toast' && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: duration / 1000, ease: "linear" }}
                                className={`h-full ${barColor}`} // Corregido el espacio en h-full
                            />
                        </div>
                    )}

                    {/* Lista de errores detallados */}
                    {apiRes.errors && Object.values(apiRes.errors).flat().length > 0 && (
                        <ul className="mt-2 ml-7 list-disc text-[11px] opacity-90 space-y-0.5">
                            {Object.entries(apiRes.errors).map(([field, messages]) => (
                                messages.length > 0 && <li key={field}>{messages.join(', ')}</li>
                            ))}
                        </ul>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Alert;
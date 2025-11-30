import { Fragment, useEffect, useRef } from "react";
import { Dialog, DialogTitle, DialogDescription } from "@headlessui/react";
import { motion, AnimatePresence } from 'framer-motion';
import { CurrencyDollarIcon, MapPinIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid'; // Icono de cerrar alternativo

export default function ModalItem({ selectedItem, show = false, onClose = () => { }, color1 = "#ffffff", color2 = "#ffffff" }) {
    const cancelButtonRef = useRef(null);
console.log(selectedItem)
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
        }).format(price);
    };

    useEffect(() => {
        if (show && cancelButtonRef.current) {
            cancelButtonRef.current.focus();
        }
    }, [show]);

    return (
        <Dialog
            as="div"
            id="modal"
            open={show}
            className={`fixed inset-0 flex overflow-y-auto py-4 sm:px-0 items-center justify-center z-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClose={onClose}
        >
            {/* Capa de fondo con opacidad */}
            <motion.div
                className={`fixed  inset-0  z-40`}
             
                style={{
                    opacity: 0.2 ,
                    backgroundImage: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
                  }}
                
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                onClick={onClose} // Permite cerrar al hacer clic fuera del modal
            />

            <div className="relative min-h-full flex justify-center p-4 z-50"> {/* z-index mayor para el contenido */}
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-4 md:px-8 flex flex-col overflow-hidden max-h-[90vh]"
                    initial={{ scale: 0.85, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 180 } }}
                    exit={{ scale: 0.9, opacity: 0, y: -20, transition: { duration: 0.2 } }}
                >
                    {/* Botón de Cerrar en Esquina Superior Derecha */}
                    <div className="absolute top-5 right-5">
                        <button
                            ref={cancelButtonRef}
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full hover:bg-gray-100 p-2"
                        >
                            <span className="sr-only">Cerrar modal</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Contenido Principal */}
                    <div className="flex flex-col gap-3">
                        {/* Título */}
                        <DialogTitle as="h2" className="text-3xl font-bold text-indigo-700 tracking-tight">
                            {selectedItem.name}
                        </DialogTitle>

                        {/* Imagen del Item con Animación de Entrada */}
                        <motion.div
                            className="w-auto max-h-96 rounded-xl overflow-hidden shadow-md bg-indigo-100"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <img
                                src={`/pictures/rel.gif`}
                                alt={selectedItem.name}
                                className="w-full h-full object-contain "
                                loading="lazy"
                            />
                        </motion.div>

                        {/* Descripción */}
                        <DialogDescription as="p" className="text-gray-700 leading-relaxed">
                            {selectedItem.description}
                        </DialogDescription>

                        {/* Precio */}
                        <motion.p className="text-2xl font-bold text-pink-600 flex items-center"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                            exit={{ opacity: 0, y: 15 }}
                        >
                            <CurrencyDollarIcon className="h-6 w-6 mr-2" /> {formatPrice(selectedItem.price)}
                        </motion.p>

                        {/* Información de Disponibilidad y Enlace */}
                        <div>
                            <p className="text-gray-600 font-semibold flex items-center">
                                <MapPinIcon className="h-5 min-w-[1.25rem] w-5 mr-2 text-indigo-500" />
                                Disponibilidad:
                                {selectedItem.place_link ? (
                                <motion.a
                                    href={selectedItem.place_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="uppercase inline-flex items-center  ml-2 py-1 px-3 bg-indigo-500 text-white rounded-md transition duration-300 ease-in-out hover:bg-indigo-600 font-semibold text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {selectedItem.place}
                                    <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />
                                </motion.a>
                            ) : (
                                <span className=" ml-2 uppercase text-indigo-500">{selectedItem.place}</span>
                            )}
                            </p>
                            
                        </div>
                    </div>

                    {/* Botón de Cierre */}
                    <motion.div className="mt-auto w-full flex items-center justify-center gap-10">
                    <motion.button
                            onClick={onClose}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition duration-300 ease-in-out shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
                            exit={{ opacity: 0, y: 20 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                           Regalar
                        </motion.button>

                        <motion.button
                            onClick={onClose}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition duration-300 ease-in-out shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
                            exit={{ opacity: 0, y: 20 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cerrar Detalles
                        </motion.button>
                        
                    </motion.div>
                </motion.div>
            </div>
        </Dialog>
    );
}
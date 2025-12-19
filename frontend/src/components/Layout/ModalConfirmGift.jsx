import { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from 'framer-motion';
import { GiftIcon } from '@heroicons/react/24/outline'; // Icono para el modal de regalo

export default function ModalConfirmGift({ itemName, show = false, onClose, onConfirm }) {
    const [message, setMessage] = useState('');
    const textAreaRef = useRef(null);

    const handleConfirm = () => {
        onConfirm(message);
        setMessage(''); // Limpiar el mensaje después de enviar
    };

    const handleCancel = () => {
        setMessage('');
        onClose();
    };

    return (
        <AnimatePresence>
            {show && (
                <Dialog
                    as={motion.div}
                    key="confirm-modal"
                    open={show}
                    // Usar un z-index mayor para que quede "encima" del modal de detalles
                    className="fixed inset-0 z-[60] overflow-y-auto"
                    onClose={handleCancel} 
                >
                    {/* Capa de fondo suave */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCancel}
                    />

                    <div className="flex items-center justify-center min-h-full p-4 text-center z-[60] relative">
                        <motion.div
                            className="w-full max-w-sm"
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300, delay: 0.1 } }}
                            exit={{ scale: 0.8, opacity: 0, y: 50, transition: { duration: 0.15 } }}
                        >
                            <div className="bg-white rounded-xl shadow-2xl p-6 transform transition-all">
                                
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <GiftIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                </div>
                                
                                <Dialog.Title as="h3" className="mt-3 text-lg font-semibold leading-6 text-gray-900">
                                    Confirmar Regalo
                                </Dialog.Title>
                                
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Estás a punto de regalar **{itemName}**. ¿Deseas añadir un mensaje para quien creó la lista?
                                    </p>
                                    
                                    <textarea
                                        ref={textAreaRef}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={3}
                                        placeholder="Escribe tu mensaje aquí (opcional)..."
                                        className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                
                                <div className="mt-4 flex justify-between gap-3">
                                    {/* Botón Regalar (Confirmar) */}
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-1/2 rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm"
                                        onClick={handleConfirm}
                                    >
                                        Regalar
                                    </button>
                                    
                                    {/* Botón Cancelar */}
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-1/2 rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                        onClick={handleCancel}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
}
import { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence, m } from 'framer-motion';
import {
    GiftIcon,
    UserIcon,
    PhoneIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'; // Icono para el modal de regalo
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css' //

export default function ModalConfirmGift({ itemName, show = false, onClose, onConfirm }) {

    console.log(show);

    const textAreaRef = useRef(null);
    //datos
    const [datos, setDatos] = useState(() => {
        // Intentar recuperar datos previos del navegador
        const savedName = localStorage.getItem("gift_user_name") || '';
        const savedPhone = localStorage.getItem("gift_user_phone") || '';

        return {
            name: savedName,
            phone: savedPhone,
            message: '' // El mensaje siempre empieza vacío
        };
    });

    const { name, phone, message } = datos;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };


    const handleConfirm = (e) => {
        e.preventDefault();

        if (!name.trim() || !phone.trim()) {
            alert("El nombre y el teléfono son obligatorios para que sepan quién envió el regalo.");
            return;
        }
        localStorage.setItem("gift_user_name", name);
        localStorage.setItem("gift_user_phone", phone);

        onConfirm(datos);
        // setDatos(prev => ({ ...prev, message: '' }));

    };

    const handleCancel = () => {
        setDatos(prev => ({ ...prev, message: '' }));
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

                                <form onSubmit={handleConfirm} className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Estás a punto de regalar <b>**{itemName}**</b>. ¿Deseas añadir un mensaje para quien creó la lista?
                                    </p>

                                    <div className="relative  mt-2">
                                        <ChatBubbleBottomCenterTextIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <textarea

                                            ref={textAreaRef}
                                            name="message"
                                            value={datos.message}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Escribe algo bonito..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border  border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                                        />
                                    </div>


                                    <div className="mt-4 space-y-3 text-left">
                                        {/* Campo Nombre */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 ml-1 mb-1">Tu Nombre</label>
                                            <div className="relative mt-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <UserIcon className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={datos.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="¿Quién hace el regalo?"
                                                    className="block w-full pl-10 rounded-lg border border-gray-300 p-2 text-sm ring-0 focus:ring-green-500 focus:ring-2 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Campo Teléfono (Opcional) */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 ml-1 mb-1">Teléfono</label>
                                            <div className="relative mt-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <PhoneInput
                                                    className='block w-full pl-10 rounded-lg border border-gray-300 p-2 text-sm ring-0 focus:ring-green-500 focus:ring-2 outline-none transition-all'
                                                    data-cy="input-telefono"
                                                    country='DO'
                                                    value={datos.phone}
                                                    name="phone"
                                                    onChange={(value) => setDatos(prev => ({ ...prev, phone: value }))}
                                                    placeholder="(000) 000-0000"
                                                    pattern="^\(\d{3}\) \d{3}-\d{4}$"
                                                    required={true}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between gap-3">
                                        {/* Botón Regalar (Confirmar) */}
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center w-1/2 rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm"

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

                                </form>


                            </div>
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
}
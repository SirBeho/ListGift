import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    CurrencyDollarIcon,
    MapPinIcon,
    ArrowTopRightOnSquareIcon,
    GiftIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { XMarkIcon, CheckBadgeIcon } from '@heroicons/react/20/solid';
import ModalConfirmGift from './ModalConfirmGift';
import instance from '../service/AxiosInstance';
import { useNavigate } from "react-router-dom";

export default function ModalItem({ selectedItem, show = false, onClose = () => { }, setApiRes, refreshItems, color1 = "#6366f1", color2 = "#a855f7" }) {
    const cancelButtonRef = useRef(null);
    const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";
    const [showConfirmation, setShowConfirmation] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 0 // A veces los centavos ensucian el diseño
        }).format(price);
    };

    const handleGiftClick = () => setShowConfirmation(true);

    const handleConfirmGift = async (formData) => {
        const { message, name, phone } = formData;
        try {
            const response = await instance.patch(`/public/items/${selectedItem.id}`, {
                status: 2,
                gift_message: message,
                giver_name: name,
                giver_phone: phone
            });
            if (response.status === 201 || response.status === 200) {
                refreshItems();
                setApiRes(response.data);
            }
        } catch (error) {
            setApiRes(error.normalized || {});
        } finally {
            setShowConfirmation(false);
            onClose();
        }
    };

    const isGifted = selectedItem?.status === 2;

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose} initialFocus={cancelButtonRef}>

                {/* 1. Backdrop con Gradient Dinámico */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-md transition-all"
                        style={{ background: `linear-gradient(135deg, ${color1}bb, ${color2}bb)` }} />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">


                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-8" enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-8"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-[2rem] bg-white text-left align-middle shadow-2xl transition-all relative flex flex-col max-h-[92vh]  border border-white/20">
                                {selectedItem?.isNewGift ? (
                                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 flex items-center justify-center space-x-3 shadow-inner">
                                        <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-xl">🎁</motion.span>
                                        <div className="text-center">
                                            <p className="text-[9px] uppercase tracking-widest font-black opacity-80 leading-none mb-1">Acceso Directo</p>
                                            <p className="text-xs font-bold">¡Aquí está el regalo que buscabas!</p>
                                        </div>
                                    </div>
                                ) : isGifted ? (
                                    <div className="bg-green-500 text-white py-2 px-4 flex items-center justify-center gap-2 shadow-inner">
                                        <CheckBadgeIcon className="h-4 w-4" />
                                        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.1em]">Este deseo ya ha sido cumplido</p>
                                    </div>
                                ) : null}
                                {/* HEADER */}
                                <div className="relative h-20 flex-shrink-0 bg-white border-b border-gray-50 flex items-center px-8">
                                    <div className="flex-1 min-w-0">
                                        <Dialog.Title as="h3" className="text-xl font-extrabold text-slate-900 truncate">
                                            {selectedItem.name}
                                        </Dialog.Title>
                                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                            <InformationCircleIcon className="h-3 w-3" /> Detalles del deseo
                                        </p>
                                    </div>
                                    <button onClick={onClose} className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* BODY */}
                                <div className="overflow-y-auto px-8 py-2 custom-scrollbar space-y-6">

                                    {/* Imagen con Contenedor Estilizado */}
                                    <div className="relative group">
                                        <div className={`aspect-square w-full rounded-[2rem] overflow-hidden border-2 transition-all duration-500 
                                            ${isGifted ? 'bg-green-50/50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                                            <motion.img
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                src={selectedItem.img_name ? `${VITE_STORAGE_URL}/${selectedItem.img_name}` : `${VITE_STORAGE_URL}/pictures/git.png`}
                                                alt={selectedItem.name}
                                                className={`w-full h-full object-contain p-8 ${isGifted ? 'grayscale-[0.3] opacity-70' : ''}`}
                                            />

                                            {/* Badge de Precio Flotante */}
                                            <div className="absolute top-4 left-4">
                                                <div className={`px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md font-black text-lg border ${isGifted ? 'bg-slate-100/80 text-slate-400 line-through' : 'bg-white/90 text-indigo-600 border-indigo-50'}`}>
                                                    {formatPrice(selectedItem.price)}
                                                </div>
                                            </div>
                                        </div>

                                        {isGifted && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: -5 }}
                                                className="absolute -bottom-2 -right-2 bg-green-500 text-white px-6 py-2 rounded-2xl font-bold shadow-xl flex items-center gap-2"
                                            >
                                                <CheckBadgeIcon className="h-5 w-5" /> DESEO CUMPLIDO
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Mensaje Especial (Si está regalado) */}
                                    {isGifted && (
                                        <div className="bg-green-50/50 border border-green-200 rounded-3xl p-6 relative">
                                            <GiftIcon className="absolute -top-3 -left-3 h-8 w-8 text-green-400 bg-white rounded-full p-1 shadow-sm" />
                                            <p className="text-green-900 font-medium text-sm italic text-center">
                                                {selectedItem.isOwner ? (
                                                    `"${selectedItem.message || 'Sin mensaje adicional'}" — de ${selectedItem.giver_name}`
                                                ) : (
                                                    "Este regalo ya está en camino para hacer feliz a alguien."
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {/* Descripción y Lugar */}
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50">
                                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2">Descripción</h4>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                {selectedItem.description || "El anfitrión no ha añadido una descripción para este regalo."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between p-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                    <MapPinIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-slate-400">¿Dónde comprar?</p>
                                                    <p className="text-sm font-bold text-slate-700">{selectedItem.place || 'Cualquier tienda'}</p>
                                                </div>
                                            </div>

                                            {selectedItem.place_link && (
                                                <a href={selectedItem.place_link} target="_blank" rel="noopener noreferrer"
                                                    className="p-3 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-md active:scale-95">
                                                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* FOOTER ACCIONES */}
                                <div className="p-4 px-8 bg-white border-t border-slate-50">
                                    {!isGifted ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <button onClick={onClose} className="py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                                                Cerrar
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                onClick={handleGiftClick}
                                                className="py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                ¡Yo lo regalo! <GiftIcon className="h-5 w-5" />
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <button onClick={onClose} className="w-full py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs">
                                            Volver a la lista
                                        </button>
                                    )}
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>

                <ModalConfirmGift itemName={selectedItem.name} show={showConfirmation} onClose={() => setShowConfirmation(false)} onConfirm={handleConfirmGift} />
            </Dialog>
        </Transition>
    );
}
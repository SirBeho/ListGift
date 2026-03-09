import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from 'framer-motion';
import { CurrencyDollarIcon, MapPinIcon, ArrowTopRightOnSquareIcon, GiftIcon } from '@heroicons/react/24/outline'; // Añadido GiftIcon
import { XMarkIcon, CheckBadgeIcon } from '@heroicons/react/20/solid'; // Añadido CheckBadgeIcon
import ModalConfirmGift from './ModalConfirmGift';
import instance, { API_BASE_URL } from '../service/AxiosInstance';
import { useNavigate } from "react-router-dom";



export default function ModalItem({ selectedItem, show = false, onClose = () => { }, setApiRes, refreshItems, color1 = "#ffffff", color2 = "#ffffff" }) {
    const cancelButtonRef = useRef(null);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();

    // Formateo de precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 2 }).format(price);
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
            console.log(error)
            setApiRes(error.normalized || {});
        } finally {
            setShowConfirmation(false);
            onClose();
        }
    };

    // Variable auxiliar para saber si está regalado
    const isGifted = selectedItem?.status === 2;

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose} initialFocus={cancelButtonRef}>

                {/* 1. Backdrop */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 backdrop-blur-sm transition-all" style={{ background: `linear-gradient(135deg, ${color1}99, ${color2}99)` }} />
                </Transition.Child>

                {/* 2. Wrapper */}
                <div className="fixed inset-0 overflow-hidden">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">

                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-xl transition-all relative flex flex-col max-h-[90vh]">

                                {/* === HEADER === */}
                                <div className="flex-shrink-0 z-10 bg-white border-b border-gray-100">

                                    {/* ALERTA: Si es el highlight del link (Nuevo Regalo) */}
                                    {selectedItem?.isNewGift && (
                                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 flex items-center justify-center space-x-3">
                                            <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-xl">🎁</motion.span>
                                            <div className="text-center">
                                                <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Acceso Directo</p>
                                                <p className="text-xs font-semibold">¡Aquí está el regalo que buscabas!</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* ALERTA: Si YA fue regalado (Status 2) */}
                                    {isGifted && !selectedItem?.isNewGift && (
                                        <div className="bg-green-100 text-green-800 p-3 flex items-center justify-center space-x-2 border-b border-green-200">
                                            <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                                            <p className="text-xs font-bold uppercase tracking-wide">Este deseo ya ha sido cumplido</p>
                                        </div>
                                    )}

                                    <div className="px-6 py-4 flex items-center justify-between">
                                        <Dialog.Title as="h3" className={`text-2xl font-bold leading-6 truncate pr-4 ${isGifted ? 'text-green-700 decoration-2' : 'text-indigo-900'}`}>
                                            {selectedItem.name}
                                        </Dialog.Title>
                                        <button ref={cancelButtonRef} onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500">
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* === BODY SCROLLABLE === */}
                                <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                                    <div className="flex flex-col gap-5">

                                        {/* Imagen */}
                                        <div className={`w-full h-72 sm:h-80 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center flex-shrink-0 relative border 
                                            ${isGifted ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                                            <img
                                                src={selectedItem.img_name ? `${API_BASE_URL}/uploads/${selectedItem.img_name}` : `${API_BASE_URL}/pictures/git.png`}
                                                alt={selectedItem.name}
                                                className={`w-full h-full object-contain p-4 ${isGifted ? 'grayscale-[0.5]' : ''}`}
                                            />
                                            {/* Sello de Regalado sobre la imagen */}
                                            {isGifted && (
                                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-green-700 px-4 py-1 rounded-full font-bold shadow-lg border border-green-200 flex items-center transform -rotate-2">
                                                    <CheckBadgeIcon className="h-5 w-5 mr-1" /> Regalado
                                                </div>
                                            )}
                                        </div>

                                        {/* Mensaje si está regalado */}
                                        {isGifted && (
                                            <div className="relative bg-green-50 p-5 rounded-2xl border border-green-100 mx-1">
                                                <span className="absolute top-2 left-3 text-4xl text-green-300 font-serif leading-none">“</span>

                                                <div className="relative z-10 text-center">
                                                    {selectedItem.isOwner ? (
                                                        <>
                                                            <p className="text-green-800 font-semibold mb-1">
                                                                ¡{selectedItem.giver_name || "Alguien"} cumplió este deseo!
                                                            </p>
                                                            {selectedItem.message && (
                                                                <p className="text-green-700 italic text-sm">"{selectedItem.message}"</p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <p className="text-green-800 font-semibold">
                                                                {selectedItem.isNewGift ? "¡Alguien te acaba de cumplir este deseo!" : "Este deseo ya ha sido cumplido por alguien más."}
                                                            </p>
                                                            {selectedItem.isNewGift && (
                                                                <p className="text-xs text-green-600 px-4">
                                                                    Si este regalo es para ti,{" "}
                                                                    <button
                                                                        onClick={() => navigate(`/login?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
                                                                        className="font-bold underline decoration-2 underline-offset-2 hover:text-green-800 transition-colors"
                                                                    >
                                                                        inicia sesión
                                                                    </button>{" "}
                                                                    para ver quién te lo envió y su mensaje.
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <span className="absolute bottom-[-10px] right-3 text-4xl text-green-300 font-serif leading-none">”</span>
                                            </div>
                                        )}

                                        {/* Descripción */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {selectedItem.description || "Sin descripción detallada."}
                                            </p>
                                        </div>

                                        {/* Info Precio y Lugar */}
                                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-2">
                                            <div className={`flex items-center font-bold text-2xl ${isGifted ? 'text-gray-400 line-through' : 'text-pink-600'}`}>
                                                <CurrencyDollarIcon className="h-7 w-7 mr-1 stroke-2" />
                                                {formatPrice(selectedItem.price)}
                                            </div>

                                            <div className="flex items-center gap-2 max-w-full">
                                                <MapPinIcon className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                                                {selectedItem.place_link ? (
                                                    <a href={selectedItem.place_link} target="_blank" rel="noopener noreferrer" className="truncate inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-semibold border border-indigo-100">
                                                        <span className="truncate max-w-[150px]">{selectedItem.place}</span>
                                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 flex-shrink-0" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-600 font-medium truncate">{selectedItem.place}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* === FOOTER === */}
                                <div className="flex-shrink-0 z-10 bg-gray-50 border-t border-gray-100 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-3xl">
                                    {!isGifted ? (
                                        <>
                                            <button onClick={handleGiftClick} className="inline-flex w-full sm:w-auto justify-center rounded-xl border border-transparent bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-all hover:-translate-y-0.5">
                                                Regalar 🎁
                                            </button>
                                            <button onClick={onClose} className="inline-flex w-full sm:w-auto justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none transition-all">
                                                Cerrar
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={onClose} className="w-full inline-flex justify-center rounded-xl border border-green-200 bg-green-50 px-6 py-3 text-sm font-bold text-green-700 shadow-sm hover:bg-green-100 focus:outline-none transition-all">
                                            Cerrar Detalles (Ya Regalado)
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
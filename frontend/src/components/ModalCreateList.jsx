import React, { useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, GlobeAltIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import instance from '../service/AxiosInstance';
import IconPicker from './IconPicker';

export default function ModalCreateList({ isOpen, onClose, setApiRes, apiRes, refreshItems }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // ESTADOS PARA LA ALERTA PREPOTENTE
    const [showPhotoAlert, setShowPhotoAlert] = useState(false);
    const [ignorePhotoWarning, setIgnorePhotoWarning] = useState(false);
    const bannerRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        due_date: '',
        is_public: 1,
        color1: '#8B5CF6',
        color2: '#3B82F6',
        icon: 'gift'
    });

    const inputBaseStyle = "w-full rounded-2xl border-0 bg-white/70 backdrop-blur-sm py-3 px-4 shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400";
    const labelStyle = "block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-wider";

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setShowPhotoAlert(false); // Quitamos alerta si selecciona algo
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // LÓGICA PREPOTENTE: Interceptamos si no hay imagen
        if (!selectedImage && !ignorePhotoWarning) {
            setShowPhotoAlert(true);
            setIgnorePhotoWarning(true); // La próxima vez que de clic, lo dejará pasar
            bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; // Bloqueamos el envío esta vez
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (selectedImage) data.append('image', selectedImage);

            const response = await instance.post('/lists', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 201 || response.status === 200) {
                if (refreshItems) refreshItems();
                setApiRes(response.data);
                handleClose(); // Usamos función para resetear todo
            }
        } catch (error) {
            setApiRes(error.normalized || {});
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: '', description: '', due_date: '', is_public: 1, color1: '#8B5CF6', color2: '#3B82F6', icon: 'gift' });
        setSelectedImage(null);
        setPreviewUrl(null);
        setShowPhotoAlert(false);
        setIgnorePhotoWarning(false);
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={handleClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-400 cubic-bezier(0.16, 1, 0.3, 1)" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">

                            <Dialog.Panel className="w-full max-w-lg transform overflow-visible rounded-[2rem] bg-gradient-to-br from-gray-50 to-white shadow-2xl transition-all">

                                {/* === BANNER CON ALERTA DINÁMICA === */}
                                <div ref={bannerRef} className={`relative h-36 w-full group overflow-hidden rounded-t-[2rem] `}>
                                    <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    <label htmlFor="image-upload" className="absolute inset-0 cursor-pointer">
                                        <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 `}
                                            style={{
                                                backgroundImage: previewUrl ? `url(${previewUrl})` : `linear-gradient(135deg, ${formData.color1}99, ${formData.color2}99)`,
                                                backgroundColor: '#f3f4f6'
                                            }}
                                        />
                                        <div className={`absolute inset-0 bg-black/30 transition-all duration-1000 ${previewUrl ? 'group-hover:bg-black/50' : (showPhotoAlert ? 'bg-red-600/40 backdrop-blur-sm animate-ping z-10' : '')}`}
                                        />
                                        {/* Mensaje de alerta si no hay foto */}
                                        <div className='absolute inset-0 flex flex-col justify-center items-center h-full w-full z-20'>
                                            {!previewUrl && (
                                                <div className={`flex flex-col items-center transition-all ${showPhotoAlert ? 'scale-110' : ''}`}>
                                                    <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full mb-2 transition-all  group-hover:scale-110 ${showPhotoAlert ? 'bg-white text-red-600  animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                                                        <PhotoIcon className="h-6 w-6" />
                                                    </div>
                                                    <p className={` text-sm font-medium drop-shadow-md text-white ${showPhotoAlert ? ' underline animate-bounce' : ''}`}>
                                                        {showPhotoAlert ? '¡DALE AQUÍ Y SUBE UNA FOTO!' : 'Subir imagen de portada'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute inset-0 flex flex-col justify-between items-center p-2 z-50">
                                            <div className="flex justify-between items-start w-full">
                                                <Dialog.Title as="h3" className="text-lg font-black text-white drop-shadow-md flex items-center gap-2">
                                                    <SparklesIcon className="h-6 w-6 text-yellow-300" />Nueva Lista de Realos
                                                </Dialog.Title>
                                                <button onClick={handleClose} type="button" className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>

                                            <div className="self-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                                <span className="flex items-center gap-2  text-gray-800 text-sm font-bold px-5 py-2.5 rounded-full shadow-lg group-hover:bg-white ">
                                                    <PhotoIcon className="w-5 h-5" /> {previewUrl ? 'Cambiar Portada' : 'Subir Imagen'}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <form onSubmit={handleSubmit} className="p-4 md:p-8 md:py-4 space-y-2 relative">
                                    <div className="mt-2 absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                                    {/* SECCIÓN DE DATOS (Igual a tu código anterior) */}
                                    <div className="space-y-4 pt-2">
                                        <div>
                                            <label className={labelStyle}>Nombre de la lista</label>
                                            <input type="text" required placeholder="Mi Wishlist 2026 ✨" className={inputBaseStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className={labelStyle}>Descripción</label>
                                            <textarea rows="2" placeholder="Opcional..." className={`${inputBaseStyle} resize-none`} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1 relative">
                                                <label className={labelStyle}>Fecha</label>
                                                <input type="date" className={`${inputBaseStyle} pl-10`} value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
                                                <div className="absolute top-[2.4rem] left-3.5 text-gray-400"><CalendarIcon className="h-5 w-5" /></div>
                                            </div>
                                            <div className="flex-1 relative">
                                                <label className={labelStyle}>Visibilidad</label>
                                                <select className={`${inputBaseStyle} pl-10 appearance-none`} value={formData.is_public} onChange={(e) => setFormData({ ...formData, is_public: parseInt(e.target.value) })}>
                                                    <option value={1}>Pública</option>
                                                    <option value={0}>Privada</option>
                                                </select>
                                                <div className="absolute top-[2.4rem] left-3.5 text-gray-400"><GlobeAltIcon className="h-5 w-5" /></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 pt-2">
                                        <div className="flex-1 relative z-50">
                                            <label className={labelStyle}>Icono</label>
                                            <IconPicker selectedIcon={formData.icon} onChange={(iconId) => setFormData({ ...formData, icon: iconId })} />
                                        </div>
                                        <div className="flex-1">
                                            <label className={labelStyle}>Colores</label>
                                            <div className="relative h-12 rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-100 flex group">
                                                <div className="absolute inset-0 transition-all duration-500" style={{ background: `linear-gradient(to right, ${formData.color1}, ${formData.color2})` }} />
                                                <div className="relative flex-1 group/left border-r border-white/20 hover:bg-black/10 transition-colors cursor-pointer">
                                                    <input type="color" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" value={formData.color1} onChange={(e) => setFormData({ ...formData, color1: e.target.value })} />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/left:opacity-100 transition-all z-10"><div className="w-8 h-8 rounded-full shadow-xl border-2 border-white" style={{ backgroundColor: formData.color1 }} /></div>
                                                </div>
                                                <div className="relative flex-1 group/right hover:bg-black/10 transition-colors cursor-pointer">
                                                    <input type="color" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" value={formData.color2} onChange={(e) => setFormData({ ...formData, color2: e.target.value })} />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/right:opacity-100 transition-all z-10"><div className="w-8 h-8 rounded-full shadow-xl border-2 border-white" style={{ backgroundColor: formData.color2 }} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* === BOTONES CON MENSAJE DE ADVERTENCIA === */}
                                    <div className="pt-4 flex flex-col gap-2">
                                        <div className="flex gap-4">
                                            <button type="button" onClick={handleClose} className="px-6 py-3.5 text-sm font-bold text-gray-400 hover:text-gray-600">Cancelar</button>
                                            <button type="submit" disabled={isSubmitting} className={`flex-1 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all relative overflow-hidden group/btn ${showPhotoAlert ? 'bg-red-500 shadow-red-200' : 'bg-blue-600 shadow-blue-200'}`}>
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {isSubmitting ? 'Procesando...' : showPhotoAlert ? '¡Crear Sin Foto!' : 'Crear Lista'}
                                                    {!isSubmitting && <SparklesIcon className="h-5 w-5" />}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
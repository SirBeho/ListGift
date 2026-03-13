import { useState, Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    PhotoIcon,
    CurrencyDollarIcon,
    LinkIcon,
    BuildingStorefrontIcon,
    PencilSquareIcon, // Icono para modo edición
    SparklesIcon      // Icono para modo creación
} from '@heroicons/react/24/outline';
import instance from '../service/AxiosInstance'; // Importamos API_BASE_URL para previsualizar imagen existente

export default function ModalManageItem({ isOpen, onClose, listId, refreshItems, setApiRes, apiRes, itemToEdit = null }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";


    // --- ESTADOS PARA LA ALERTA PREPOTENTE ---
    const [showPhotoAlert, setShowPhotoAlert] = useState(false);
    const [ignorePhotoWarning, setIgnorePhotoWarning] = useState(false);
    const imageContainerRef = useRef(null);

    // Estado inicial
    const [formData, setFormData] = useState({
        list_id: listId || 0,
        name: '',
        price: '',
        place: '',
        place_link: '',
        description: '',
    });

    // === EFECTO DE INICIALIZACIÓN (Detecta si es Crear o Editar) ===
    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                // MODO EDICIÓN: Rellenamos con datos existentes
                setFormData({
                    list_id: itemToEdit.list_id,
                    name: itemToEdit.name,
                    price: formatPriceForInput(itemToEdit.price), // Formateamos el precio para el input
                    place: itemToEdit.place,
                    place_link: itemToEdit.place_link,
                    description: itemToEdit.description,
                });

                // Si tiene imagen, la mostramos como preview inicial
                if (itemToEdit.img_name) {
                    setPreviewUrl(`${VITE_STORAGE_URL}/${itemToEdit.img_name}`);
                    // IMPORTANTE: En edición, asumimos que ya tiene foto válida, 
                    // así que "ignoramos" la alerta inicial para que no salte si no cambia la foto.
                    setIgnorePhotoWarning(true);
                } else {
                    setPreviewUrl(null);
                    setIgnorePhotoWarning(false);
                }

            } else {
                // MODO CREACIÓN: Todo limpio
                setFormData({ list_id: listId || 0, name: '', price: '', place: '', place_link: '', description: '' });
                setSelectedImage(null);
                setPreviewUrl(null);
                setIgnorePhotoWarning(false);
            }
            // Reseteamos alertas siempre
            setShowPhotoAlert(false);
            setSelectedImage(null); // Limpiamos la imagen nueva seleccionada
        }
    }, [isOpen, listId, itemToEdit]);

    // Helper para formatear precio al cargar (añadir comas)
    const formatPriceForInput = (price) => {
        if (!price) return '';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    // Lógica de precio (Input)
    const handleBlur = () => {
        if (!formData.price) return;
        const rawValue = formData.price.toString().replace(/,/g, '');
        const number = parseFloat(rawValue);
        if (!isNaN(number)) {
            const formatted = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(number);
            setFormData({ ...formData, price: formatted });
        }
    };

    const handlePriceChange = (e) => {
        let value = e.target.value;
        let rawValue = value.replace(/[^0-9.]/g, '');
        if ((rawValue.match(/\./g) || []).length > 1) return;
        const parts = rawValue.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setFormData({ ...formData, price: parts.join('.') });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setShowPhotoAlert(false);
            setIgnorePhotoWarning(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDACIÓN DE FOTO:
        // Si estamos editando y YA tenía foto (previewUrl existe y no es blob), pasa.
        // Si seleccionó una nueva (selectedImage), pasa.
        // Si no hay nada, salta la alerta.
        const hasExistingPhoto = itemToEdit && itemToEdit.img_name && !selectedImage;
        const hasNewPhoto = !!selectedImage;

        if (!hasNewPhoto && !hasExistingPhoto && !ignorePhotoWarning) {
            setShowPhotoAlert(true);
            setIgnorePhotoWarning(true);
            imageContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();

            // Método spoofing para Laravel (PUT no soporta multipart/form-data nativo bien en todos los servidores)
            /*  if (itemToEdit) {
                 console.log("puteee")
                 data.append('_method', 'PUT');
             } */

            Object.keys(formData).forEach(key => {
                if (key === 'price') {
                    const cleanPrice = formData[key].toString().replace(/,/g, '');
                    data.append(key, cleanPrice);
                } else {
                    data.append(key, formData[key] || ''); // Enviar string vacío si es null
                }
            });

            if (selectedImage) {
                data.append('image', selectedImage);
            }

            let response;
            if (itemToEdit) {
                // UPDATE
                // Nota: Usamos POST con _method: PUT para poder enviar archivos
                response = await instance.post(`/items/${itemToEdit.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // CREATE
                response = await instance.post('/items', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.status === 201 || response.status === 200) {
                if (refreshItems) refreshItems();
                setApiRes(response.data);
                onClose();
            }
        } catch (error) {
            setApiRes(error.normalized || {});
            console.error("Error submit:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Título y colores dinámicos
    const isEditing = !!itemToEdit;
    const modalTitle = isEditing ? 'Editar Deseo' : 'Nuevo Deseo';
    const TitleIcon = isEditing ? PencilSquareIcon : SparklesIcon;
    const headerGradient = isEditing
        ? 'from-indigo-600 to-purple-600' // Morado para editar
        : 'from-blue-600 to-indigo-600';  // Azul para crear

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">

                                {/* Header Dinámico */}
                                <div className={`relative bg-gradient-to-r ${headerGradient} p-6 py-2 transition-colors duration-300`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Dialog.Title as="h3" className="text-xl font-bold text-white flex items-center gap-2">
                                                <TitleIcon className="h-6 w-6 text-white/80" />
                                                {modalTitle}
                                            </Dialog.Title>
                                            <p className="text-blue-100 text-sm mt-1">
                                                {isEditing ? 'Actualiza los detalles de tu regalo' : 'Añade un nuevo item a tu lista'}
                                            </p>
                                        </div>
                                        <button onClick={onClose} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm">
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                        {/* COLUMNA IZQUIERDA: IMAGEN */}
                                        <div className="md:col-span-1">
                                            <label className={`block text-xs font-bold uppercase mb-2 ${showPhotoAlert ? 'text-red-600 animate-pulse' : 'text-gray-500'}`}>
                                                {showPhotoAlert ? '¡Falta la foto!' : 'Imagen del Regalo'}
                                            </label>

                                            <div ref={imageContainerRef}
                                                className={`relative group w-full aspect-square rounded-2xl transition-all duration-300 overflow-hidden flex flex-col items-center justify-center cursor-pointer border-2 border-dashed
                                                ${showPhotoAlert
                                                        ? 'border-red-500 bg-red-50 ring-4 ring-red-100'
                                                        : 'border-gray-300 bg-gray-50 hover:border-blue-500'
                                                    }`}
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                                                />

                                                {previewUrl ? (
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="relative z-20 text-center p-4">
                                                        {showPhotoAlert && (
                                                            <div className="absolute inset-0 bg-red-600/10 backdrop-blur-[1px] animate-pulse -z-10 rounded-2xl pointer-events-none" />
                                                        )}
                                                        <div className={`p-3 rounded-full inline-block mb-2 transition-transform ${showPhotoAlert ? 'bg-red-100 text-red-600 scale-110' : 'bg-blue-50 text-blue-500 group-hover:scale-110'}`}>
                                                            <PhotoIcon className="h-8 w-8" />
                                                        </div>
                                                        <p className={`text-xs font-medium ${showPhotoAlert ? 'text-red-600 font-bold underline' : 'text-gray-400'}`}>
                                                            {showPhotoAlert ? '¡SUBE UNA FOTO!' : 'Click para subir imagen'}
                                                        </p>
                                                    </div>
                                                )}

                                                {previewUrl && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold border border-white px-3 py-1 rounded-full">Cambiar</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* COLUMNA DERECHA: CAMPOS */}
                                        <div className="md:col-span-2 space-y-4">
                                            {/* Nombre */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del artículo</label>
                                                <input
                                                    type="text" required placeholder="Ej: Play Station 5"
                                                    className={`w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-blue-500 py-3 px-4 border transition-all ${apiRes?.errors?.name ? 'border-red-500' : ''}`}
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Precio */}
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio Estimado</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text" required inputMode="decimal" placeholder="$0.00"
                                                            className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-blue-500 pl-10 py-3 px-4 border transition-all"
                                                            value={formData.price} onChange={handlePriceChange} onBlur={handleBlur}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Tienda */}
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tienda / Lugar</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text" required placeholder="Amazon, Zara..."
                                                            className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-blue-500 pl-10 py-3 px-4 border transition-all"
                                                            value={formData.place} onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Link */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Enlace al producto</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <LinkIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="url" placeholder="https://..."
                                                        className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-blue-500 pl-10 py-3 px-4 border transition-all text-sm text-blue-600"
                                                        value={formData.place_link} onChange={(e) => setFormData({ ...formData, place_link: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            {/* Descripción */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notas / Descripción</label>
                                                <textarea
                                                    rows="2" required placeholder="Detalles como talla, color, etc."
                                                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-blue-500 py-2 px-4 border"
                                                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* BOTONES */}
                                    <div className="mt-8 flex gap-3 justify-end border-t border-gray-100 pt-5">
                                        <button
                                            type="button" onClick={onClose}
                                            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit" disabled={isSubmitting}
                                            className={`px-8 py-2.5 text-white rounded-xl font-bold shadow-lg transition-all flex items-center relative overflow-hidden group/btn
                                            ${showPhotoAlert
                                                    ? 'bg-red-500 shadow-red-200 hover:bg-red-600'
                                                    : isEditing
                                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-purple-200 hover:shadow-purple-300' // Color edición
                                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200 hover:shadow-blue-300' // Color creación
                                                } hover:scale-[1.02]`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                            <span className="relative z-10 flex items-center gap-2">
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                        {isEditing ? 'Actualizando...' : 'Guardando...'}
                                                    </>
                                                ) : (
                                                    showPhotoAlert
                                                        ? '¡Crear Sin Foto!'
                                                        : isEditing ? 'Guardar Cambios' : 'Añadir Deseo'
                                                )}
                                            </span>
                                        </button>
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
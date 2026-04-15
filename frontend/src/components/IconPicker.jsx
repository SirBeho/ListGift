import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { ICON_CATEGORIES, ICON_MAP, ICON_LABELS } from '../utils/iconLibrary';

const IconPicker = ({ selectedIcon, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const safeSelectedIcon = selectedIcon || 'gift';

    const selectedLabel = ICON_LABELS[safeSelectedIcon] || 'Regalo';

    const SelectedIcon = ICON_MAP[safeSelectedIcon] || ICON_MAP['gift'];



    return (
        <div className="relative w-full">

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${isOpen ? 'bg-white border-blue-500 ring-2 ring-blue-50' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary text-white rounded-lg shadow-sm">
                        <SelectedIcon size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 capitalize">
                        {selectedLabel}
                    </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40 " onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            // Ajustamos el z-index y el max-h para que no rompa el modal
                            className="  absolute z-50 left-0 right-0 mt-1    overflow-hidden"
                        >
                            {/* Scroll interno más pequeño y estilizado */}
                            <div className="mb-2 max-h-48 overflow-y-auto p-3 custom-scrollbar shadow-xl rounded-2xl bg-white border border-gray-200">
                                {Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
                                    <div key={category} className="mb-3 last:mb-0">
                                        <h4 className="text-xs font-black text-gray-400 uppercase mb-1.5 tracking-tighter opacity-70">
                                            {category.replace('_', ' ')}
                                        </h4>
                                        {/* Grid de 6 columnas para que sea más denso */}
                                        <div className="grid grid-cols-4 gap-2">
                                            {icons.map(({ id, icon: Icon, label }) => {
                                                const isSelected = safeSelectedIcon === id;
                                                return (
                                                    <button
                                                        key={id}
                                                        type="button"
                                                        onClick={() => {
                                                            onChange(id);
                                                            setIsOpen(false);
                                                        }}
                                                        className={`relative p-2 rounded-lg transition-all flex items-center justify-center ${isSelected
                                                            ? 'bg-primary text-white shadow-md'
                                                            : 'bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-primary'
                                                            }`}
                                                        title={label}
                                                    >
                                                        <Icon size={16} />
                                                        {isSelected && (
                                                            <div className="absolute -top-0.5 -right-0.5 bg-white text-primary rounded-full p-0.5 shadow-sm border border-blue-100">
                                                                <Check size={6} strokeWidth={4} />
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IconPicker;
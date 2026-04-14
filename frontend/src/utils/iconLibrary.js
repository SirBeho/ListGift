import {
    Gift,
    Cake,
    PartyPopper,
    Wine,
    Heart,
    Gem,
    Baby,
    Star,
    Home,
    GraduationCap,
    Plane,
    Camera,
    Gamepad2,
    Music,
    Dumbbell,
    Pizza
} from 'lucide-react';

export const ICON_CATEGORIES = {
    Celebraciones: [
        { id: 'gift', icon: Gift, label: 'Regalo' },
        { id: 'cake', icon: Cake, label: 'Cumpleaños' },
        { id: 'party', icon: PartyPopper, label: 'Fiesta' },
        { id: 'wine', icon: Wine, label: 'Brindis' },
    ],
    Relaciones: [
        { id: 'heart', icon: Heart, label: 'Amor' },
        { id: 'gem', icon: Gem, label: 'Boda' }, // 👈 Actualizado aquí
        { id: 'baby', icon: Baby, label: 'Bebé' },
        { id: 'star', icon: Star, label: 'Especial' },
    ],
    Estilo_de_Vida: [
        { id: 'home', icon: Home, label: 'Hogar' },
        { id: 'school', icon: GraduationCap, label: 'Graduación' },
        { id: 'travel', icon: Plane, label: 'Viaje' },
        { id: 'photo', icon: Camera, label: 'Evento' },
    ],
    Hobbies: [
        { id: 'game', icon: Gamepad2, label: 'Gaming' },
        { id: 'music', icon: Music, label: 'Música' },
        { id: 'gym', icon: Dumbbell, label: 'Deporte' },
        { id: 'food', icon: Pizza, label: 'Comida' },
    ]
};

export const ICON_MAP = Object.values(ICON_CATEGORIES)
    .flat()
    .reduce((acc, item) => {
        acc[item.id] = item.icon;
        return acc;
    }, {});

export const ICON_LABELS = Object.values(ICON_CATEGORIES)
    .flat()
    .reduce((acc, item) => {
        acc[item.id] = item.label;
        return acc;
    }, {});
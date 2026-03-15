import instance from './AxiosInstance';

export const useNotifications = () => {
    const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    const subscribeUser = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Las notificaciones no son compatibles');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js');

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                return { status: 'error', message: 'Permiso de notificaciones denegado' };
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: VAPID_PUBLIC_KEY
            });

            const response = await instance.post('/subscription/subscribe', subscription)

            return response.data;

        } catch (error) {
            console.error('❌ Error en el proceso:', error);
            return error.normalized || { status: 'error', message: '❌ Error al suscribirse a las notificaciones' };
        }
    };

    return { subscribeUser };
};
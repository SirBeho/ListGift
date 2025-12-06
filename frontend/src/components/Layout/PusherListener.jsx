import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

function PusherListener({ onUpdateItemStatus }) {
    // ... Tu estado para las listas de regalos

    const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
    const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;
    
    useEffect(() => {
        const pusher = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER,
        });

        // 2. Suscribirse al Canal
        const channel = pusher.subscribe('list-gifts'); 

        // 3. Escuchar el Evento 'item-gifted'
        channel.bind('item-gifted', function(data) {
            if (onUpdateItemStatus) {
                onUpdateItemStatus(data); 
            }
            
            // Lógica para actualizar el estado de React:
            // Encuentra el ítem en tu estado global o local
            // y actualiza su status_id a 2 (gifted).
            // setListItems(prevItems => ... lógica de actualización)
        });

        // Limpieza: importante para evitar fugas de memoria
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []); 

    
}
export default PusherListener;
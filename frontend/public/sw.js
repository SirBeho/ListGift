self.addEventListener('push', function (event) {

    const data = event.data ? event.data.json() : { title: 'Nuevo Regalo', body: '¡Alguien actualizó una lista!' };

    const options = {
        body: data.body,
        vibrate: [100, 50, 100],
        icon: './pictures/icon.png',
        badge: './svg/gift.svg',
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Al hacer clic en la notificación
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        // eslint-disable-next-line no-undef
        clients.openWindow(event.notification.data.url)
    );
});
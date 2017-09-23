// vim: ts=4:sw=4:expandtab

/*
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 * TL;DR; This gets downloaded every 24 hours.
 */

console.info("%cStarting Service Worker", 'font-size: 1.2em; font-weight: bold;');

firebase.initializeApp(F.env.FIREBASE_CONFIG);

addEventListener('install', function(ev) {
    console.warn("Service Worker Install");
    ev.waitUntil(skipWaiting());
});

addEventListener('activate', function(ev) {
    console.warn("Service Worker Activate");
    ev.waitUntil(clients.claim());
});

let _init;
async function messageHandler() {
    if ((await clients.matchAll()).length) {
        console.warn("Active clients found - Dropping GCM wakeup request");
        return;
    }
    console.info('GCM Wakeup request - Waking up messaging stack');
    if (!_init) {
        _init = true;
        const userId = location.search.split('?id=')[1]; // XXX
        await F.ccsm.workerLogin(userId);
        await F.cache.validate();
        await F.foundation.initServiceWorker();
    }
    await F.util.never();
    //return self.registration.showNotification(notificationTitle, notificationOptions);
}

const fbm = firebase.messaging();
fbm.setBackgroundMessageHandler(function(payload) {
    F.queueAsync('fb-msg-handler', messageHandler);
});

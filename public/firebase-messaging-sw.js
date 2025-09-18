/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyBdzJTOazGcj1g4eBLZK3Rjj1jlg0naacU',
  authDomain: 'swd392-d2c4e.firebaseapp.com',
  projectId: 'swd392-d2c4e',
  storageBucket: 'swd392-d2c4e.appspot.com',
  messagingSenderId: '47109893633',
  appId: '1:47109893633:web:e4f1860d2f7bb01fe81a00',
  measurementId: 'G-8ZJBXCKP8M',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('message', payload);
  const { title, body } = payload.notification;

  const notificationOptions = {
    body,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/2560px-FPT_logo_2010.svg.png',
  };

  self.registration.showNotification(title, notificationOptions);
});

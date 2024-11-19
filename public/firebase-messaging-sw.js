importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDjmhDRDh04nXVjQGdn6oV9kCMBx-_2zQA",
  authDomain: "chaloghoomne-b4c09.firebaseapp.com",
  projectId: "chaloghoomne-b4c09",
  storageBucket: "chaloghoomne-b4c09.appspot.com",
  messagingSenderId: "1001829843334",
  appId: "1:1001829843334:web:ab89c55b076d57c042ac07",
};
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

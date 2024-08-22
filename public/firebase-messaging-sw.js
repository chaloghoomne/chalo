importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

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

messaging.onMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    // icon: payload.data.icon, // Use if you have an icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    // icon: payload.data.icon, // Use if you have an icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

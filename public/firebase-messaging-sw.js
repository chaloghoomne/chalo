// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );

// const defaultConfig = {
//   apiKey: "AIzaSyA57ATfewo20uHosQhU_8xLqzQH4nHWguk",
//   authDomain: "video-calling-4152f.firebaseapp.com",
//   projectId: "video-calling-4152f",
//   storageBucket: "video-calling-4152f.appspot.com",
//   messagingSenderId: "351423523016",
//   appId: "1:351423523016:web:2bcf6073502754d9abddfd",
//   measurementId: "G-4GHVBR33LF",
//   // apiKey: true,
//   // authDomain: true,
//   // projectId: true,
//   // storageBucket: true,
//   // messagingSenderId: true,
//   // appId: true,
//   // measurementId: true,
// };
// firebase.initializeApp(defaultConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//     console.log(payload,'backgroundpayload')
//   const notificationTitle = payload.data.title;
//   const notificationOptions = {
//     body: payload.data.body,
//     // icon: payload.data.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
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

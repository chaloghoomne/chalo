// src/firebase.js
import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDjmhDRDh04nXVjQGdn6oV9kCMBx-_2zQA",
  authDomain: "chaloghoomne-b4c09.firebaseapp.com",
  projectId: "chaloghoomne-b4c09",
  storageBucket: "chaloghoomne-b4c09.appspot.com",
  messagingSenderId: "1001829843334",
  appId: "1:1001829843334:web:ab89c55b076d57c042ac07",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const messaging = getMessaging(app);

const VITE_APP_VAPID_KEY =
  "BGF_EOWSTdrqTErGAr-ORoVfIJY5XdXj279ITME_svm-fTyoLgoBlHcVcLJcr9vyCeLtHmD2I2duSxIfDpqc9Uk";

export async function generateToken() {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: VITE_APP_VAPID_KEY,
    });

    if (token) {
      localStorage.setItem("deviceToken", token);
      return token;
    } 
  } else if (permission === "denied") {
    alert("You denied for the notification");
  }
}
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { auth, googleProvider, facebookProvider };

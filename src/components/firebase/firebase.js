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
console.log(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const messaging = getMessaging(app);

const VITE_APP_VAPID_KEY =
  "BGF_EOWSTdrqTErGAr-ORoVfIJY5XdXj279ITME_svm-fTyoLgoBlHcVcLJcr9vyCeLtHmD2I2duSxIfDpqc9Uk";
console.log(VITE_APP_VAPID_KEY, "VITE_APP_VAPID_KEY/////////////");

export async function generateToken() {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: VITE_APP_VAPID_KEY,
    });

    if (token) {
      console.log("current token for client: ", token);
      localStorage.setItem("deviceToken", token);
      return token;
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
    console.log("Token generated : ", token);
  } else if (permission === "denied") {
    alert("You denied for the notification");
  }
}
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });

export { auth, googleProvider, facebookProvider };

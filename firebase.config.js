import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfigNew = {
    apiKey: "AIzaSyBuKOgZfuVZKYSk5J0UUZyZByCvsrfiR3c",
    authDomain: "visa-root-3eaf0.firebaseapp.com",
    projectId: "visa-root-3eaf0",
    storageBucket: "visa-root-3eaf0.appspot.com",
    messagingSenderId: "205031662087",
    appId: "1:205031662087:web:9bcf15e92e3fecbfc3c0a2",
    measurementId: "G-X6YS7TSSRK"
};

export const firebaseAppNew = initializeApp(firebaseConfigNew);
export const storage = getStorage(firebaseAppNew);
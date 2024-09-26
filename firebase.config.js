import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfigNew = {
    apiKey: "AIzaSyD-t8-r3CoMQtKmJdPxpHFEAvT60njoXtM",
    authDomain: "realestatehrm-17d4b.firebaseapp.com",
    projectId: "realestatehrm-17d4b",
    storageBucket: "realestatehrm-17d4b.appspot.com",
    messagingSenderId: "427696444801",
    appId: "1:427696444801:web:3bd485cd5f99398a880480",
    measurementId: "G-FKFK3Q2D1D"
};

export const firebaseAppNew = initializeApp(firebaseConfigNew);
export const storage = getStorage(firebaseAppNew);
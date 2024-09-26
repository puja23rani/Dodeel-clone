import { initializeApp } from 'firebase/app';
import firebaseConfig from './config';
import { getStorage } from 'firebase/storage';

export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);

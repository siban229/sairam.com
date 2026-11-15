import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC1I6iF5zzoEook7R2SMdheBq1U_mtszUE',
  authDomain: 'cafe-d76c4.firebaseapp.com',
  projectId: 'cafe-d76c4',
  storageBucket: 'cafe-d76c4.firebasestorage.app',
  messagingSenderId: '43326368199',
  appId: '1:43326368199:web:0b6c95df9cd0441fe1d1e2',
  measurementId: 'G-XQH61XVC1W'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

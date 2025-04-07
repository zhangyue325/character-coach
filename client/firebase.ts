// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6uqKNM17M4Ac9fLOszlruZBXd6LD8Ck4",
  authDomain: "character-coach.firebaseapp.com",
  projectId: "character-coach",
  storageBucket: "character-coach.firebasestorage.app",
  messagingSenderId: "521795714166",
  appId: "1:521795714166:web:a7d00eeaa999c191163357"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

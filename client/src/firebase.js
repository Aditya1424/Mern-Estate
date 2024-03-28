// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-1e27b.firebaseapp.com",
  projectId: "mern-estate-1e27b",
  storageBucket: "mern-estate-1e27b.appspot.com",
  messagingSenderId: "996026434184",
  appId: "1:996026434184:web:f8c710adfbfbbc3e10153d"
};

// This app contains all the information regarding the firebase
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfTFt6QEa7yIuSJ-1W9xxRrMAkI6MvFN0",
  authDomain: "buy-busy-app-a2229.firebaseapp.com",
  projectId: "buy-busy-app-a2229",
  storageBucket: "buy-busy-app-a2229.appspot.com",
  messagingSenderId: "883135911397",
  appId: "1:883135911397:web:4c351a3b5c72ebd0c78b0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
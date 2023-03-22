// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSqb6g2CS4jY8BJaImCTWbq1F3gQYj6bc",
  authDomain: "house-maketplace-app-d65cd.firebaseapp.com",
  projectId: "house-maketplace-app-d65cd",
  storageBucket: "house-maketplace-app-d65cd.appspot.com",
  messagingSenderId: "409362894757",
  appId: "1:409362894757:web:53cd83f20333db7fbfa24c"
};

// Initialize Firebase
 initializeApp(firebaseConfig);
export const db =  getFirestore();
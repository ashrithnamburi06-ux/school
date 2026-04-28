import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt3bcaX5D1qfqSRmjSywEZ3CRoqmHR8qY",
  authDomain: "school-winfield.firebaseapp.com",
  projectId: "school-winfield",
  storageBucket: "school-winfield.firebasestorage.app",
  messagingSenderId: "1007235120326",
  appId: "1:1007235120326:web:de31503a70b35c9f02ebc7",
  measurementId: "G-NC5X6R7JPY"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

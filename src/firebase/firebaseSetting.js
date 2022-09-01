// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB068tKgTOKH6xt37NDzf0jjv56UKP-KlA",
    authDomain: "vue-invoice-f50a9.firebaseapp.com",
    projectId: "vue-invoice-f50a9",
    storageBucket: "vue-invoice-f50a9.appspot.com",
    messagingSenderId: "893707908264",
    appId: "1:893707908264:web:f59ac3ce5a3f8fdbf53e9d"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }
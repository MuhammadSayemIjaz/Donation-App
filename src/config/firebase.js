// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore/lite";
import { getFirestore as getFirestore1 } from "firebase/firestore";
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
     apiKey: "AIzaSyCMmb010krbBeOP4pkMYN8G2_RVjEM-wjc",
  authDomain: "donation-management-app.firebaseapp.com",
  projectId: "donation-management-app",
  storageBucket: "donation-management-app.appspot.com",
  messagingSenderId: "647703580129",
  appId: "1:647703580129:web:a7e61e67b8bd4cdb2156a0",
  measurementId: "G-1RJT4XJ2Y9"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
// getAuth(initializeAuth(app, {
//      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// }));
const db = getDatabase(app);
const firestoreDB = getFirestore(app);
const firestoreDB1 = getFirestore1(app);
export { auth, db, firestoreDB, firestoreDB1 };
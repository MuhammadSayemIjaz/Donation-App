// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore/lite";
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
     // apiKey: "AIzaSyCskyPGhJ4KrWWpWoTbnhhw9AvBEWaVs7g",
     // authDomain: "ambutrack-2e076.firebaseapp.com",
     // projectId: "ambutrack-2e076",
     // storageBucket: "ambutrack-2e076.appspot.com",
     // messagingSenderId: "198314085753",
     // appId: "1:198314085753:web:88a7bf86f2b882cd0ef3a8",
     // measurementId: "G-JMCQSSBYSQ",
     // databaseURL: "https://ambutrack-2e076-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
// getAuth(initializeAuth(app, {
//      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// }));
const db = getDatabase(app);
const firestoreDB = getFirestore(app);
export { auth, db, firestoreDB };
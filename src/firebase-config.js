// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKkxrOWo1KaoWYkjRaEj7HsMA4Lhy8Vw8",
  authDomain: "choco-d72bf.firebaseapp.com",
  projectId: "choco-d72bf",
  storageBucket: "choco-d72bf.firebasestorage.app",
  messagingSenderId: "1020799802411",
  appId: "1:1020799802411:web:076cc3e863273f57c69e6e",
  measurementId: "G-RV9E4L89VV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
export { auth, db };

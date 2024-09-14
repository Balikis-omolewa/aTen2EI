import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions'; 

const firebaseConfig = {
    apiKey: "AIzaSyC6p_wtRmVk4zRN1KTypdxymTcJH_cH5sQ",
    authDomain: "attendeees.firebaseapp.com",
    projectId: "attendeees",
    storageBucket: "attendeees.appspot.com",
    messagingSenderId: "894037039559",
    appId: "1:894037039559:web:c99c4e467df3f9657e61e2",
    measurementId: "G-067NSLJ7SR"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Functions
const functions = getFunctions(app); // Add Firebase Functions initialization

export { auth, db, functions };

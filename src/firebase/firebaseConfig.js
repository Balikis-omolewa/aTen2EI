import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions'; 

const firebaseConfig = {
    apiKey: "AIzaSyC7Wn_uHOJ7IdiAgpH6B5jQhIyMaSAKBzc",
    authDomain: "practice-attendance-d1e99.firebaseapp.com",
    projectId: "practice-attendance-d1e99",
    storageBucket: "practice-attendance-d1e99.appspot.com",
    messagingSenderId: "54246539513",
    appId: "1:54246539513:web:0da26dc6f672c4b8976228",
    measurementId: "G-DNH8DT03ZZ"
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

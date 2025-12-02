// firebase-config.js - Full and Correct Export Setup for iryastone-uk
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    doc, 
    deleteDoc, 
    updateDoc, 
    where, 
    serverTimestamp,
    onSnapshot // Firestore functions (Includes query and orderBy for robust data fetching)
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    updateProfile // Auth functions
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { 
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL // Storage functions
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// Your web app's Firebase configuration (iryastone-uk project details)
// NOTE: Ensure these credentials are correct for your Firebase project
const firebaseConfig = {
    apiKey: "AIzaSyDNwzhOkQQLAQbkiNFTFEGSpWJdKaxbTRk",
    authDomain: "iryastone-uk.firebaseapp.com",
    projectId: "iryastone-uk",
    storageBucket: "iryastone-uk.firebasestorage.app",
    messagingSenderId: "110940910896",
    appId: "1:110940910896:web:b25e92127118665e5c84f5",
    measurementId: "G-6YM1FLYN48"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Export everything for use in other modules
export { 
    app, db, auth, storage, googleProvider, analytics, // Core services

    // Firestore exports (All necessary functions for querying are available)
    collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc, where, serverTimestamp, onSnapshot,
    
    // Auth exports
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, onAuthStateChanged, updateProfile,
    
    // Storage exports
    ref, uploadBytes, getDownloadURL
};

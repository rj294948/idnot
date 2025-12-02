// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

// Firestore imports
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    orderBy,
    doc,
    deleteDoc,
    updateDoc,
    where,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Authentication imports
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Storage imports
import {
    getStorage,
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// Analytics import (if needed)
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

// ===== Firebase Configuration =====
const firebaseConfig = {
    apiKey: "AIzaSyDNwzhOkQQLAQbkiNFTFEGSpWJdKaxbTRk",
    authDomain: "iryastone-uk.firebaseapp.com",
    projectId: "iryastone-uk",
    storageBucket: "iryastone-uk.firebasestorage.app",
    messagingSenderId: "110940910896",
    appId: "1:110940910896:web:b25e92127118665e5c84f5",
    measurementId: "G-6YM1FLYN48"
};

// ===== Initialize Firebase Services =====
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// ===== Export All Firebase Services =====
export {
    // Firebase Core
    app,
    analytics,
    
    // Firestore
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    orderBy,
    doc,
    deleteDoc,
    updateDoc,
    where,
    serverTimestamp,
    onSnapshot,
    
    // Authentication
    auth,
    googleProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    onAuthStateChanged,
    updateProfile,
    
    // Storage
    storage,
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL
};

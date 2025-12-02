// firebase-config.js - Full and Correct Export Setup for iryastone-uk
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js"; // Analytics को भी शामिल किया गया
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
    onSnapshot // Firestore functions
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
const analytics = getAnalytics(app); // Analytics initialization
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Export everything for use in other modules
export { 
    app, db, auth, storage, googleProvider, analytics, // Core services

    // Firestore exports
    collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc, where, serverTimestamp, onSnapshot,
    
    // Auth exports
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, onAuthStateChanged, updateProfile,
    
    // Storage exports
    ref, uploadBytes, getDownloadURL
};

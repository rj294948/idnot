// firebase-config.js - Correct version for Firebase JS SDK v12.6.0
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

// Import Firestore functions
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
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Import Authentication functions
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

// Import Storage functions
import { 
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNwzhOkQQLAQbkiNFTFEGSpWJdKaxbTRk",
    authDomain: "iryastone-uk.firebaseapp.com",
    projectId: "iryastone-uk",
    storageBucket: "iryastone-uk.firebasestorage.app",
    messagingSenderId: "110940910896",
    appId: "1:110940910896:web:b25e92127118665e5c84f5",
    measurementId: "G-6YM1FLYN48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Export everything as a single object
export { 
    app, 
    analytics,
    db, 
    auth, 
    storage, 
    googleProvider,
    // Firestore
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
    onSnapshot,
    // Auth
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    updateProfile,
    // Storage
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
};

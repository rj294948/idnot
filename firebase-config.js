// firebase-config.js - Only Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
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
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxNMhU09mINvq_aDLtylBg3FucCK-MzYE",
    authDomain: "sandstonebijoliya-293d2.firebaseapp.com",
    projectId: "sandstonebijoliya-293d2",
    storageBucket: "sandstonebijoliya-293d2.appspot.com",
    messagingSenderId: "133756247845",
    appId: "1:133756247845:web:8e769ce2af3db1765484cc",
    measurementId: "G-H7JMX9VNYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export everything
export { 
    app, db, auth, googleProvider,
    collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc, where, serverTimestamp,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, onAuthStateChanged, updateProfile
};

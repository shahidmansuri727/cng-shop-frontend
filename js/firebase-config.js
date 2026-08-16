// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

// TODO: Replace this with the firebaseConfig code you copied from Firebase!
const firebaseConfig = {
  apiKey: "AIzaSyCz-CKKbUeuasc49229_eK0eyvs67i3b2o",
  authDomain: "ns-motors-cng.firebaseapp.com",
  projectId: "ns-motors-cng",
  storageBucket: "ns-motors-cng.firebasestorage.app",
  messagingSenderId: "1098509763531",
  appId: "1:1098509763531:web:68a61fcfb8936758fd6c4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
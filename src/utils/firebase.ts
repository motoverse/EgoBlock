import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import config from "./config";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuLp6t7XWOw4GnHwC6-RYBGn6Yb9P-yr8",
    authDomain: "egoblock-b17ad.firebaseapp.com",
    projectId: "egoblock-b17ad",
    storageBucket: "egoblock-b17ad.appspot.com",
    messagingSenderId: "131222901232",
    appId: "1:131222901232:web:f38ab2efb1db2bb9704d35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
if (config.useEmulators) {
    connectAuthEmulator(auth, "http://localhost:9099");
}

export const db = getFirestore(app);
if (config.useEmulators) {
    connectFirestoreEmulator(db, "localhost", 8080);
}

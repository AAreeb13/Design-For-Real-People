import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtai3PnZayNSzA4_5nm4guJpagIB37yTU",
  authDomain: "studychain-2b33a.firebaseapp.com",
  projectId: "studychain-2b33a",
  storageBucket: "studychain-2b33a.appspot.com",
  messagingSenderId: "203870817975",
  appId: "1:203870817975:web:c8f7074854b22ba43d8732",
  measurementId: "G-ZZ9K1L4TN5"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);  dont think we need this
export const auth = getAuth(app);
export const db = getFirestore(app);

let currentUser = null;


export const getCurrentUserData = () => {
  return currentUser;
};


export const initAuthStateListener = () => {

  onAuthStateChanged(auth, (user) => {
    if (user) {

      console.log("User is signed in:", user);
      currentUser = user;
    } else {
      console.log("No user is signed in");
      currentUser = null; // if no user is signed in, should set null to be safe
    }
  });
};

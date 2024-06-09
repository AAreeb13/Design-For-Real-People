import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

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
export const auth = getAuth(app);
export const db = getFirestore(app);

let currentUser = null;

export const getCurrentUserData = () => {
  return currentUser;
};

export const getCurrentUserDocData = async (email) => {
  try {
    const userQuery = query(collection(db, "Users"), where("email", "==", email));
    const userQuerySnapshot = await getDocs(userQuery);

    if (userQuerySnapshot.empty) {
      console.log("No user document found with the email:", email);
      return null;
    }

    // asm: Only ever one that matches, will not work if 2 docs with same email
    const userData = userQuerySnapshot.docs[0].data();
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
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

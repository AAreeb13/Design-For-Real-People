import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtai3PnZayNSzA4_5nm4guJpagIB37yTU",
  authDomain: "studychain-2b33a.firebaseapp.com",
  projectId: "studychain-2b33a",
  storageBucket: "studychain-2b33a.appspot.com",
  messagingSenderId: "203870817975",
  appId: "1:203870817975:web:c8f7074854b22ba43d8732",
  measurementId: "G-ZZ9K1L4TN5",
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
    const userQuery = query(
      collection(db, "Users"),
      where("email", "==", email)
    );
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

export const getSuggestionData = async () => {
  try {
    const suggestionQuery = collection(db, "Suggestions");
    const suggestionQuerySnapshot = await getDocs(suggestionQuery);

    if (suggestionQuerySnapshot.empty) {
      console.log("No suggestions found from database");
      return [];
    }

    const suggestions = [];
    suggestionQuerySnapshot.forEach((doc) => {
      suggestions.push(doc.data());
    });
    console.log("suggestions", suggestions)
    return suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
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

export const updateCompletionStatus = async (
  userEmail,
  topicKey,
  newStatus
) => {
  try {
    const docId = await getUserDocumentByUserEmail(userEmail); // Get the document ID
    const userDocData = await getCurrentUserDocData(userEmail);

    if (docId && userDocData) {
      const updatedSubjectProgress = {
        ...userDocData.subjectProgress,
        [topicKey]: newStatus,
      };

      const userDocRef = doc(db, "Users", docId); // Use the retrieved document ID
      await updateDoc(userDocRef, {
        subjectProgress: updatedSubjectProgress,
      });
      console.log("Completion status updated successfully.");
    } else {
      console.error("User document not found.");
    }
  } catch (error) {
    console.error("Error updating completion status:", error);
  }
};

const getUserDocumentByUserEmail = async (email) => {
  try {
    const userQuery = query(
      collection(db, "Users"),
      where("email", "==", email)
    );
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      return userQuerySnapshot.docs[0].id; // Return the document ID
    } else {
      console.error("User document not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return null;
  }
};

export const getUserPrivledge = async (email) => {
  const userDoc = await getCurrentUserDocData(email);
  return userDoc.privledge;
};

export const getUserSubjectProgress = async (email) => {
  const userDoc = await getCurrentUserDocData(email);
  return userDoc.subjectProgress;
};

export const addUserSuggestion = async (suggestion) => {
  try {
    const suggestionData = {
      ...suggestion,
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, "Suggestions"), suggestionData);
    console.log("Suggestion added successfully.");
  } catch (error) {
    console.error("Error adding suggestion:", error);
  }
};

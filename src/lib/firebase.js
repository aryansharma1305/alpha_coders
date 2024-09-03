import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, increment, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
  authDomain: "hospital-management-7db12.firebaseapp.com",
  projectId: "hospital-management-7db12",
  storageBucket: "hospital-management-7db12.appspot.com",
  messagingSenderId: "569412174081",
  appId: "1:569412174081:web:a913d536a7fc672f61db00",
  measurementId: "G-XT0EPB3GG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db, doc, getDoc, getDocs, setDoc, updateDoc, increment, collection, addDoc, deleteDoc };

// Function to get user data from Firestore
export async function getUserData(uid) {
  try {
    const userDoc = doc(db, "users", uid); // Ensure `doc` is imported correctly
    const userSnap = await getDoc(userDoc); // Ensure `getDoc` is imported correctly

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}
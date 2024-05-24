// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7scnrksDYWA-KtvmkewDAo8KV71Lc0fs",
  authDomain: "house-marketplace-app-51d8a.firebaseapp.com",
  projectId: "house-marketplace-app-51d8a",
  storageBucket: "house-marketplace-app-51d8a.appspot.com",
  messagingSenderId: "384541526030",
  appId: "1:384541526030:web:75ab58248b85de0b5f545f",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore()

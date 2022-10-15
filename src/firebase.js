import { initializeApp } from "firebase/app"
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage"
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAP7vZ9ykPLWb1qZYuPda8L08Aa3NTblgE",
    authDomain: "chatapp-f082b.firebaseapp.com",
    projectId: "chatapp-f082b",
    storageBucket: "chatapp-f082b.appspot.com",
    messagingSenderId: "201852684733",
    appId: "1:201852684733:web:7617f1013c8fec53112ad4"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const storage = getStorage(app)
export const db = getFirestore()
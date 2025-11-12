import {initializeApp,getApp,getApps} from "firebase/app";
import { getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyADl2aYrreuNAH0BRFOt_J9_bL09hNAAdQ",
    authDomain: "questa-ea431.firebaseapp.com",
    projectId: "questa-ea431",
    storageBucket: "questa-ea431.firebasestorage.app",
    messagingSenderId: "1014511561077",
    appId: "1:1014511561077:web:bcff06c5127b2b27b64b3c",
    measurementId: "G-0T4F31N86Z"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp()

export const auth=getAuth(app)
export const db=getFirestore(app);
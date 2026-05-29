import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyjd30AFI5giahRMU62665BXAZWCDBTYw",
  authDomain: "dcs-workshop-2026.firebaseapp.com",
  projectId: "dcs-workshop-2026",
  storageBucket: "dcs-workshop-2026.firebasestorage.app",
  messagingSenderId: "56910798748",
  appId: "1:56910798748:web:3e994189b10a57ac90b259",
  measurementId: "G-RXPF6JSPJK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

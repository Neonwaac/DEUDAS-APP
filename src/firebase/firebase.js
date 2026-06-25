import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxT7VqoRQ0ASgjibiAeG1yC8-ilMZyhWc",
  authDomain: "tab-ledger-70a92.firebaseapp.com",
  projectId: "tab-ledger-70a92",
  storageBucket: "tab-ledger-70a92.firebasestorage.app",
  messagingSenderId: "646911423831",
  appId: "1:646911423831:web:5c5b82eccf71503b70fa12"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default app;
export { db };

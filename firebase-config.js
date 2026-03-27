import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfjniWnsLrMWCOnEUaseYhrdgKOnEieSc",
  authDomain: "nate-a4e32.firebaseapp.com",
  projectId: "nate-a4e32",
  storageBucket: "nate-a4e32.firebasestorage.app",
  messagingSenderId: "654021943545",
  appId: "1:654021943545:web:525318e12bbbb994838228",
  measurementId: "G-3EREXC4P2E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

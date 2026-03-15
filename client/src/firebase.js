// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Added for file uploads

const firebaseConfig = {
  apiKey: "AIzaSyA4jbp9YpJPZZmcFhL7Pm75-TOzlNE_V8w",
  authDomain: "unitime-db5fa.firebaseapp.com",
  projectId: "unitime-db5fa",
  storageBucket: "unitime-db5fa.firebasestorage.app",
  messagingSenderId: "806375496068",
  appId: "1:806375496068:web:771e800ba5d61d864ba5d1",
  measurementId: "G-4FWL8BHPR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in your components
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app); // Exported to support Timetable.jsx uploads
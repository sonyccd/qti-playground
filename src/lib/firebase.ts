import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// These values are safe to expose as they're protected by Firebase Security Rules
const firebaseConfig = {
  apiKey: "AIzaSyCskXfeEClSDaGEsnT7dna0AezVTDkIdPw",
  authDomain: "qti-playground.firebaseapp.com",
  projectId: "qti-playground",
  storageBucket: "qti-playground.firebasestorage.app",
  messagingSenderId: "918762825264",
  appId: "1:918762825264:web:38f37e51d154ad7ea8aff5",
  measurementId: "G-GDLJQ8ZM0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
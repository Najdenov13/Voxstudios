import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC4mxIN2ktJoAss3KS5EHdOIMGBZW0ade8",
  authDomain: "vox-studios.firebaseapp.com",
  projectId: "vox-studios",
  storageBucket: "vox-studios.firebasestorage.app",
  messagingSenderId: "413102018826",
  appId: "1:413102018826:web:dc3177f15e09fe5bec2af3",
  measurementId: "G-57CLQVJ8TQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app; 
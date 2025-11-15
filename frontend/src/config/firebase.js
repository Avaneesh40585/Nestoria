import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDA1iovnics1eSUW65kbJUImGCFAd5wiU",
  authDomain: "hotelmanagement-43171.firebaseapp.com",
  projectId: "hotelmanagement-43171",
  storageBucket: "hotelmanagement-43171.firebasestorage.app",
  messagingSenderId: "460877620754",
  appId: "1:460877620754:web:4e102792fd3d8741c1dacb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Get Firebase ID token
    const idToken = await user.getIdToken();
    
    return {
      success: true,
      token: idToken,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export { auth, googleProvider };

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let firebaseApp = null;

// Initialize Firebase Admin SDK
try {
  // Method 1: Try to use service account JSON file
  const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized successfully (using JSON file)');
  } else {
    // Method 2: Use environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (projectId && privateKey && clientEmail && 
        projectId !== 'your_firebase_project_id') {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail
        })
      });
      console.log('✅ Firebase Admin initialized successfully (using .env)');
    } else {
      console.warn('⚠️  Firebase credentials not configured. Google authentication will not work.');
      console.warn('   Option 1: Download firebase-service-account.json and place it in backend/');
      console.warn('   Option 2: Set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL in .env');
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
}

// Helper function to verify Firebase token
const verifyFirebaseToken = async (idToken) => {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase is not initialized');
    }
    
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        email_verified: decodedToken.email_verified
      }
    };
  } catch (error) {
    console.error('Token verification error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  admin,
  firebaseApp,
  verifyFirebaseToken
};

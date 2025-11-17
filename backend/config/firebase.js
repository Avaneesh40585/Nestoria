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

    console.log('🔍 Checking Firebase environment variables...');
    console.log('   FIREBASE_PROJECT_ID:', projectId ? 'SET' : 'MISSING');
    console.log('   FIREBASE_PRIVATE_KEY:', privateKey ? 'SET' : 'MISSING');
    console.log('   FIREBASE_CLIENT_EMAIL:', clientEmail ? 'SET' : 'MISSING');

    // Add more detailed logging for debugging
    if (privateKey) {
      console.log('   FIREBASE_PRIVATE_KEY length:', privateKey.length);
      console.log('   FIREBASE_PRIVATE_KEY starts with:', privateKey.substring(0, 50) + '...');
      console.log('   FIREBASE_PRIVATE_KEY ends with:', '...' + privateKey.substring(privateKey.length - 50));
    }

    // Log the actual values (but mask sensitive data)
    if (projectId) {
      console.log('   FIREBASE_PROJECT_ID value:', projectId);
    }
    if (clientEmail) {
      console.log('   FIREBASE_CLIENT_EMAIL value:', clientEmail);
    }

    if (projectId && privateKey && clientEmail && 
        projectId !== 'your_firebase_project_id') {
      try {
        console.log('🔧 Attempting to initialize Firebase Admin SDK...');
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey,
            clientEmail
          })
        });
        console.log('✅ Firebase Admin initialized successfully (using .env)');
      } catch (initError) {
        console.error('❌ Failed to initialize Firebase Admin with provided credentials:', initError.message);
        console.error('   Project ID:', projectId);
        console.error('   Client Email:', clientEmail);
        console.error('   Private Key length:', privateKey ? privateKey.length : 'NOT SET');
        console.error('Stack trace:', initError.stack);
      }
    } else {
      console.warn('⚠️  Firebase credentials not configured. Google authentication will not work.');
      console.warn('   Option 1: Download firebase-service-account.json and place it in backend/');
      console.warn('   Option 2: Set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL in .env');
      console.warn('   Current values:');
      console.warn('     FIREBASE_PROJECT_ID:', projectId || 'NOT SET');
      console.warn('     FIREBASE_CLIENT_EMAIL:', clientEmail || 'NOT SET');
      console.warn('     FIREBASE_PRIVATE_KEY length:', privateKey ? privateKey.length : 'NOT SET');
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  console.error('Stack trace:', error.stack);
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
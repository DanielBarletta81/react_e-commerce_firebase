// Firebase Admin SDK Configuration
// This is for server-side operations only - DO NOT use in client-side code

const admin = require('firebase-admin');

// Initialize Admin SDK
const initializeAdmin = () => {
  if (admin.apps.length === 0) {
    try {
      // Option 1: Using service account key file
      const serviceAccount = require('../../../service-account-key.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'ct-firebase-react-e-commerce'
      });
      
      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
      
      // Option 2: Try environment variable
      try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
          const serviceAccount = JSON.parse(serviceAccountKey);
          
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: 'ct-firebase-react-e-commerce'
          });
          
          console.log('✅ Firebase Admin SDK initialized from environment variable');
        } else {
          throw new Error('No service account key found');
        }
      } catch (envError) {
        console.error('❌ Failed to initialize from environment variable:', envError.message);
        console.log('Please ensure you have either:');
        console.log('1. A service-account-key.json file in the project root');
        console.log('2. FIREBASE_SERVICE_ACCOUNT_KEY environment variable set');
      }
    }
  }
  
  return admin;
};

// Get Admin Firestore instance
const getAdminFirestore = () => {
  const adminApp = initializeAdmin();
  return adminApp.firestore();
};

// Get Admin Auth instance
const getAdminAuth = () => {
  const adminApp = initializeAdmin();
  return adminApp.auth();
};

module.exports = {
  initializeAdmin,
  getAdminFirestore,
  getAdminAuth,
  admin
};

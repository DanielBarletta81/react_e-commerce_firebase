# Firebase Admin SDK Setup Guide

## 🔧 **Step 1: Save Your Private Key**

Since you already have the private key, save it securely:

### Option A: Local File (Recommended for Development)
1. Create a file named `service-account-key.json` in your project root
2. Paste your private key JSON content into it
3. The file is already in `.gitignore` so it won't be committed

### Option B: Environment Variable
```bash
# Create .env file in project root
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"ct-firebase-react-e-commerce",...}'
```

## 📝 **Step 2: Install Firebase Admin SDK**

```bash
npm install firebase-admin
```

## 🚀 **Step 3: Seed Your Database with Admin Privileges**

Now you can add sample data without permission errors:

```bash
# Run the admin seeding script
npm run seed
```

This will add:
- ✅ 25 Products with admin privileges
- ✅ 5 Sample customers 
- ✅ 5 Sample orders
- ✅ No authentication required

## 🛠️ **What's Been Created**

### Server-side Admin Configuration:
- `src/config/firebase-admin.js` - Admin SDK setup
- `scripts/seed-data.js` - Database seeding script
- Added `npm run seed` command

### Security:
- ✅ Service account key added to `.gitignore`
- ✅ Admin operations run server-side only
- ✅ Client-side code unchanged

## 🔧 **Troubleshooting Permission Errors**

### If you get "Insufficient permissions":
1. **Check your Firestore Security Rules**:
```javascript
// Temporary rules for development
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

2. **Use the Admin SDK for seeding**:
```bash
npm run seed
```

3. **Verify your service account key is valid**:
   - Make sure the JSON is valid
   - Check the project_id matches your Firebase project

### If you get "Module not found":
```bash
npm install firebase-admin
```

### If authentication fails:
- Double-check your `service-account-key.json` file
- Make sure it's in the project root
- Verify the JSON structure is correct

## 🎯 **Usage Examples**

### Seed Database:
```bash
npm run seed
```

### Custom Admin Operations:
```javascript
const { getAdminFirestore } = require('./src/config/firebase-admin');

const db = getAdminFirestore();
// Now you have full admin access to Firestore
```

## ⚠️ **Important Notes**

1. **Server-side only**: Admin SDK should never be used in client-side React code
2. **Keep keys secure**: Never commit service account keys to version control
3. **Production**: Use environment variables for production deployments
4. **Permissions**: Admin SDK bypasses all Firestore security rules

Your permission errors should now be resolved! The admin SDK gives you full access to perform any Firestore operations.

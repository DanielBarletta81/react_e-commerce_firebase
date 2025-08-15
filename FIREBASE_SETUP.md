# Firebase Setup Checklist

## 1. Enable Required Services in Firebase Console

Visit: https://console.firebase.google.com/project/ct-firebase-react-e-commerce

### Authentication
- Go to **Authentication** → **Sign-in method**
- Enable **Email/Password** provider
- Add your domain to authorized domains: `localhost:3000` (should be there by default)

### Firestore Database
- Go to **Firestore Database**
- Click **Create database**
- Choose **Start in test mode** (for now)
- Select a location close to you

### Firestore Security Rules (Test Mode)
```javascript
// Allow read/write access on all documents to any user signed in to the application
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 2. Common 400 Error Causes

1. **Missing Firebase services** - Check if Auth/Firestore are enabled
2. **CORS issues** - Usually resolved by adding localhost to authorized domains
3. **Security rules** - Start with test mode rules above
4. **API key restrictions** - Make sure API key isn't restricted

## 3. Test Your Setup

1. Visit: http://localhost:3000/test
2. Check browser console for detailed error messages
3. Try registering a new user: http://localhost:3000/register

## 4. Update Security Rules (Production)

Once everything works, update to production rules:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Test collection for debugging (remove in production)
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

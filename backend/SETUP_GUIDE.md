# SmartED Backend - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Configuration](#configuration)
4. [Database Initialization](#database-initialization)
5. [Testing the Setup](#testing-the-setup)
6. [Security Rules](#security-rules)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, ensure you have:
- [ ] Node.js installed (v14 or higher)
- [ ] A Google account for Firebase
- [ ] The SmartED project cloned/downloaded
- [ ] Firebase package installed (`npm install firebase` - already done)

---

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project details:
   - **Project name**: `SmartED` (or your preferred name)
   - **Project ID**: Will be auto-generated (note this down)
4. Enable Google Analytics (recommended for monitoring)
5. Select Analytics location: **Sri Lanka** or nearest
6. Click **"Create project"** and wait for setup to complete

### Step 2: Register Web Application

1. In your Firebase project, click the **Web icon** (`</>`)
2. Register your app:
   - **App nickname**: `SmartED Web App`
   - ✅ Check "Also set up Firebase Hosting" (optional)
3. Click **"Register app"**
4. **IMPORTANT**: Copy the `firebaseConfig` object that appears
5. Keep this information safe - you'll need it in Step 3

### Step 3: Enable Authentication

1. In Firebase Console, navigate to **Build** → **Authentication**
2. Click **"Get started"**
3. Enable sign-in methods:
   - **Email/Password**: Click and enable
   - *(Optional)* **Google**: For easier sign-in
4. Click **"Save"**

### Step 4: Create Firestore Database

1. Navigate to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **Start mode**:
   - Select **"Production mode"** (we'll add rules later)
4. Select location: **asia-south1 (Mumbai)** - closest to Sri Lanka
5. Click **"Enable"**
6. Wait for database creation (may take 1-2 minutes)

### Step 5: Setup Cloud Storage

1. Navigate to **Build** → **Storage**
2. Click **"Get started"**
3. Review security rules (start in production mode)
4. Choose location: **asia-south1** (same as Firestore)
5. Click **"Done"**

---

## ⚙️ Configuration

### Step 1: Update Firebase Config

1. Open `backend/firebase/config.js`
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### Step 2: Verify Installation

Create a test file to verify the connection:

```javascript
// frontend/src/testFirebase.js
import { auth, db } from '../backend/firebase/config';

console.log('Firebase Auth:', auth);
console.log('Firestore DB:', db);
console.log('✅ Firebase configured successfully!');
```

---

## 🗄️ Database Initialization

### Initialize Database Structure

The database needs to be initialized with collections and default data.

#### Option 1: Using Admin Panel (Recommended)

1. Start your development server: `npm run dev`
2. Login as admin
3. Navigate to Settings → Database
4. Click "Initialize Database"
5. Wait for confirmation

#### Option 2: Using Code

Create a setup script:

```javascript
// frontend/src/setupDatabase.js
import { initializeDatabase } from '../backend/services/dbInitService';

const setup = async () => {
  try {
    console.log('Initializing database...');
    const result = await initializeDatabase();
    console.log('✅ Success:', result);
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

setup();
```

Run: `node frontend/src/setupDatabase.js`

---

## 🧪 Testing the Setup

### Test Authentication

1. Open your app in browser
2. Go to Register page
3. Try creating a test student account:
   - Email: `test.student@mahindacollege.lk`
   - Password: `Test123!`
   - Fill in required fields
4. Check Firebase Console → Authentication → Users
5. You should see the new user

### Test Database

1. After registration, check Firestore Database
2. Navigate to Collections → `users`
3. Find your test user document
4. Verify all fields are populated correctly

### Test Login

1. Go to Login page
2. Use the test account credentials
3. Verify you can login and are redirected correctly
4. Check role-based routing works

---

## 🔒 Security Rules

### Firestore Security Rules

1. Go to Firebase Console → Firestore Database → Rules
2. Replace default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isAdmin() {
      return isSignedIn() && getUserRole() == 'admin';
    }
    
    function isTeacher() {
      return isSignedIn() && getUserRole() == 'teacher';
    }
    
    function isStudent() {
      return isSignedIn() && getUserRole() == 'student';
    }
    
    function isParent() {
      return isSignedIn() && getUserRole() == 'parent';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (
        request.auth.uid == userId || isAdmin()
      );
      allow delete: if isAdmin();
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if isSignedIn();
      allow write: if isAdmin() || isTeacher();
    }
    
    // Grades collection
    match /grades/{gradeId} {
      allow read: if isSignedIn();
      allow create, update: if isTeacher() || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Assessments collection
    match /assessments/{assessmentId} {
      allow read: if isSignedIn();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Student Progress collection
    match /studentProgress/{progressId} {
      allow read: if isSignedIn();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Activities collection
    match /activities/{activityId} {
      allow read: if isSignedIn();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isSignedIn() && 
        resource.data.recipientId == request.auth.uid;
      allow write: if isTeacher() || isAdmin();
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if isSignedIn() && (
        resource.data.from.userId == request.auth.uid ||
        resource.data.to.userId == request.auth.uid
      );
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (
        resource.data.to.userId == request.auth.uid
      );
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      allow read: if isSignedIn();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Achievements collection
    match /achievements/{achievementId} {
      allow read: if isSignedIn();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Subjects collection (read-only for most users)
    match /subjects/{subjectId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
    
    // Settings collection (admin only)
    match /settings/{settingId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

3. Click **"Publish"**

### Storage Security Rules

1. Go to Firebase Console → Storage → Rules
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile images
    match /profileImages/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Activity attachments
    match /activityAttachments/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // General uploads
    match /uploads/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Firebase: Error (auth/configuration-not-found)"
**Solution**: Check that you've correctly updated `config.js` with your Firebase credentials

#### 2. "Missing or insufficient permissions"
**Solution**: 
- Ensure you're logged in
- Check that security rules are properly configured
- Verify user role is set correctly

#### 3. "Network request failed"
**Solution**:
- Check internet connection
- Verify Firebase project is active
- Check if billing is enabled (for production)

#### 4. "Firebase: Error (auth/email-already-in-use)"
**Solution**: Email is already registered. Use different email or try login

#### 5. Collections not appearing
**Solution**:
- Run database initialization
- Check Firestore rules allow writes
- Verify user has proper permissions

### Getting Help

If issues persist:
1. Check Firebase Console → Usage
2. Review Firebase Console → Logs
3. Check browser console for errors
4. Verify all services are enabled in Firebase Console

---

## ✨ Next Steps

After successful setup:

1. **Test all user roles**: Create accounts for student, teacher, parent, admin
2. **Add sample data**: Use admin panel to add courses, subjects
3. **Test features**: Try grade entry, notifications, progress tracking
4. **Deploy**: When ready, deploy to Firebase Hosting or your preferred platform

---

## 📞 Support

For additional help:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support

---

**✅ Setup Complete!** Your SmartED backend is now ready to use.

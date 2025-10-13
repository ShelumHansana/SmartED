# 🔥 Firebase Setup Walkthrough - Step by Step

## 📋 What You'll Create
- Firebase Project for SmartED
- Authentication (Email/Password)
- Firestore Database (12 collections)
- Cloud Storage (File uploads)
- Web App Configuration

**Time Required**: ~15 minutes

---

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
👉 **Open**: https://console.firebase.google.com/

### 1.2 Create New Project
1. Click **"Add project"** or **"Create a project"**
2. **Project name**: `SmartED` (or your preferred name)
3. Click **Continue**

### 1.3 Google Analytics (Optional)
- **Enable Google Analytics**: Toggle ON (recommended) or OFF (skip)
- If ON, select or create Analytics account
- Click **Create project**

### 1.4 Wait for Setup
- Firebase will create your project (~30 seconds)
- Click **Continue** when done

✅ **Checkpoint**: You should see the Firebase project dashboard

---

## 🌐 Step 2: Register Web App

### 2.1 Add Web App
1. On the project dashboard, look for "Get started by adding Firebase to your app"
2. Click the **Web icon** `</>`
3. Or go to **Project Settings** (gear icon) → **General** → Scroll to "Your apps" → Click **Web**

### 2.2 Register App
1. **App nickname**: `SmartED Web`
2. **Firebase Hosting**: Leave unchecked (for now)
3. Click **Register app**

### 2.3 Copy Configuration
You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "smarted-xxxxx.firebaseapp.com",
  projectId: "smarted-xxxxx",
  storageBucket: "smarted-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxx"
};
```

📋 **COPY THIS** - You'll need it in Step 6!

4. Click **Continue to console**

✅ **Checkpoint**: Your web app is registered

---

## 🔐 Step 3: Enable Authentication

### 3.1 Navigate to Authentication
1. In the left sidebar, click **Build** → **Authentication**
2. Click **Get started**

### 3.2 Enable Email/Password
1. Click **Sign-in method** tab
2. Find **Email/Password** in the list
3. Click on it
4. Toggle **Enable** to ON
5. Leave **Email link (passwordless sign-in)** OFF
6. Click **Save**

### 3.3 Verify Setup
- Email/Password should show **Enabled** status
- Status indicator should be green

✅ **Checkpoint**: Authentication is ready

---

## 🗄️ Step 4: Create Firestore Database

### 4.1 Navigate to Firestore
1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**

### 4.2 Security Rules Mode
You'll see two options:

**Choose**: **Test mode** (for development)
- ✅ Start in test mode
- ⚠️ Data is open by default (we'll add rules later)
- Click **Next**

> **Production Note**: We'll add proper security rules after testing

### 4.3 Cloud Firestore Location
1. **Select location**: Choose closest to your users
   - For Sri Lanka: `asia-south1` (Mumbai) - RECOMMENDED
   - Or: `asia-southeast1` (Singapore)
2. Click **Enable**

### 4.4 Wait for Creation
- Firestore will provision database (~1 minute)
- You'll see "Cloud Firestore" screen

✅ **Checkpoint**: Firestore Database is ready

---

## 📦 Step 5: Setup Cloud Storage

### 5.1 Navigate to Storage
1. In the left sidebar, click **Build** → **Storage**
2. Click **Get started**

### 5.2 Security Rules
You'll see security rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

- This allows authenticated users to upload/download
- Click **Next**

### 5.3 Storage Location
- Should match your Firestore location
- Click **Done**

### 5.4 Verify Setup
- You should see empty Storage bucket
- URL format: `gs://smarted-xxxxx.appspot.com`

✅ **Checkpoint**: Cloud Storage is ready

---

## 🔧 Step 6: Update Backend Configuration

### 6.1 Open Config File
Open: `d:\SmartED\backend\firebase\config.js`

### 6.2 Replace Placeholder Values
Find this section:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6.3 Paste Your Values
Replace with the values from Step 2.3:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",          // ← Your actual API key
  authDomain: "smarted-xxxxx.firebaseapp.com",          // ← Your actual domain
  projectId: "smarted-xxxxx",                            // ← Your actual project ID
  storageBucket: "smarted-xxxxx.appspot.com",           // ← Your actual storage bucket
  messagingSenderId: "123456789012",                     // ← Your actual sender ID
  appId: "1:123456789012:web:xxxxxxxxxxxx"              // ← Your actual app ID
};
```

### 6.4 Save the File
- Press `Ctrl + S` to save
- **IMPORTANT**: Don't commit this file to public repositories!

✅ **Checkpoint**: Configuration updated

---

## 🧪 Step 7: Test Firebase Connection

### 7.1 Open Terminal
In VS Code, open terminal (`` Ctrl + ` ``)

### 7.2 Navigate to Backend
```powershell
cd d:\SmartED\backend
```

### 7.3 Run Test Script
```powershell
node scripts/testConnection.js
```

### 7.4 Expected Output
```
🔥 Testing Firebase Connection...
========================================

✅ Firebase Auth initialized successfully
✅ Firestore Database connected successfully
✅ Cloud Storage initialized successfully

========================================
🎉 All Firebase services are working!
========================================
```

### 7.5 If You See Errors
**Error**: "Firebase: Error (auth/invalid-api-key)"
- ✗ Check your apiKey in config.js
- ✗ Ensure no extra spaces

**Error**: "Firebase: Error (storage/invalid-default-bucket)"
- ✗ Check storageBucket value
- ✗ Ensure it ends with .appspot.com

**Error**: Module not found
- ✗ Run: `cd d:\SmartED\frontend` then `npm list firebase`
- ✗ If not found: `npm install firebase`

✅ **Checkpoint**: Firebase connection successful

---

## 🗃️ Step 8: Initialize Database

### 8.1 Run Initialization Script
Still in `d:\SmartED\backend` directory:

```powershell
node scripts/initDatabase.js
```

### 8.2 Expected Output
```
🗄️  Initializing SmartED Database...
========================================

📁 Creating database collections...
   ✅ users
   ✅ courses
   ✅ subjects
   ✅ assessments
   ✅ grades
   ✅ studentProgress
   ✅ activities
   ✅ notifications
   ✅ messages
   ✅ attendance
   ✅ achievements
   ✅ settings

📚 Initializing subjects...
   ✅ Added 13 O/L subjects
   ✅ Added 14 A/L subjects
   ✅ Total: 27 subjects configured

⚙️  Initializing school settings...
   ✅ School information
   ✅ Academic settings
   ✅ System settings

========================================
🎉 Database initialization complete!
========================================
```

### 8.3 Verify in Firebase Console
1. Go to Firebase Console → **Firestore Database**
2. You should see collections:
   - `subjects` (27 documents)
   - `settings` (1 document)
   - Other empty collections

✅ **Checkpoint**: Database initialized with default data

---

## 🛡️ Step 9: Update Security Rules (Important!)

### 9.1 Firestore Security Rules
1. Go to Firebase Console → **Firestore Database**
2. Click **Rules** tab
3. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isAdmin() {
      return isAuthenticated() && getUserData().role == 'admin';
    }
    
    function isTeacher() {
      return isAuthenticated() && getUserData().role == 'teacher';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if true; // Anyone can register
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Subjects collection (read-only for all)
    match /subjects/{subjectId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Assessments collection
    match /assessments/{assessmentId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Grades collection
    match /grades/{gradeId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Student Progress
    match /studentProgress/{progressId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Activities
    match /activities/{activityId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated();
      allow create: if isTeacher() || isAdmin();
      allow update, delete: if isAdmin();
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.senderId) || isAdmin();
    }
    
    // Attendance
    match /attendance/{attendanceId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Achievements
    match /achievements/{achievementId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher() || isAdmin();
    }
    
    // Settings (admin only)
    match /settings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

4. Click **Publish**

### 9.2 Storage Security Rules
1. Go to Firebase Console → **Storage**
2. Click **Rules** tab
3. Replace with these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Profile images - any authenticated user can upload their own
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true; // Public read
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Activity resources - teachers can upload
    match /activities/{activityId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated(); // Will validate role in app
    }
    
    // Student submissions
    match /submissions/{userId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // School resources - admin only (validated in app)
    match /resources/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated(); // Will validate admin role in app
    }
  }
}
```

4. Click **Publish**

✅ **Checkpoint**: Security rules configured

---

## ✅ Step 10: Final Verification

### 10.1 Checklist
Go through this checklist:

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Cloud Storage enabled
- [ ] `backend/firebase/config.js` updated with real credentials
- [ ] `node scripts/testConnection.js` shows all green ✅
- [ ] `node scripts/initDatabase.js` completed successfully
- [ ] Firestore has `subjects` collection with 27 documents
- [ ] Firestore has `settings` collection with 1 document
- [ ] Security rules updated for Firestore
- [ ] Security rules updated for Storage

### 10.2 Firebase Console Quick Check
1. **Authentication** → Sign-in method → Email/Password = Enabled ✅
2. **Firestore Database** → Data → See collections ✅
3. **Storage** → Files → Empty but ready ✅

✅ **ALL DONE!** Firebase setup complete! 🎉

---

## 🚀 Ready for Part 2 Implementation!

Your Firebase backend is now fully configured and ready to use!

**Next Steps**:
1. ✅ Create React contexts (AuthContext, UserContext)
2. ✅ Build custom hooks (useAuth, useFirestore)
3. ✅ Integrate Login/Register components
4. ✅ Connect dashboards to real data
5. ✅ Add real-time features
6. ✅ Implement file uploads

---

## 📞 Troubleshooting

### Issue 1: "Firebase: Error (auth/api-key-not-valid)"
**Solution**: 
- Go to Firebase Console → Project Settings → General
- Copy the EXACT apiKey value
- Paste into config.js (no spaces)

### Issue 2: "Cannot find module 'firebase'"
**Solution**:
```powershell
cd d:\SmartED\frontend
npm install firebase
```

### Issue 3: "Permission denied" errors
**Solution**:
- Check Firebase Console → Firestore → Rules
- Ensure rules are published
- Try re-running initialization script

### Issue 4: Collections not created
**Solution**:
```powershell
cd d:\SmartED\backend
node scripts/initDatabase.js
```

### Issue 5: Storage bucket not found
**Solution**:
- Go to Firebase Console → Storage
- Click "Get Started" if not done
- Verify storageBucket in config.js matches exactly

---

## 🎯 What You Achieved

✅ **Firebase Project**: SmartED is live!  
✅ **Authentication**: Ready for user registration/login  
✅ **Database**: 12 collections + 27 subjects configured  
✅ **Storage**: Ready for file uploads  
✅ **Security**: Proper rules in place  
✅ **Testing**: All services verified working  

**You're now ready to start Part 2 - Frontend Integration!** 🚀

---

**Status**: ✅ Firebase Setup Complete  
**Next**: Part 2 - Create Context Providers & Hooks

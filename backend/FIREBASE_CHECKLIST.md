# ✅ Firebase Setup Quick Checklist

**Follow this checklist while setting up Firebase**

---

## 📋 Quick Steps

### ☐ Step 1: Create Firebase Project (2 min)
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Name: `SmartED`
- [ ] Click "Create project"

### ☐ Step 2: Register Web App (1 min)
- [ ] Click Web icon `</>`
- [ ] App nickname: `SmartED Web`
- [ ] Click "Register app"
- [ ] **COPY the firebaseConfig object** 📋

### ☐ Step 3: Enable Authentication (1 min)
- [ ] Go to Authentication → Get started
- [ ] Click "Sign-in method"
- [ ] Enable "Email/Password"
- [ ] Save

### ☐ Step 4: Create Firestore Database (2 min)
- [ ] Go to Firestore Database
- [ ] Click "Create database"
- [ ] Select "Test mode"
- [ ] Location: `asia-south1` (Mumbai) or `asia-southeast1` (Singapore)
- [ ] Click "Enable"

### ☐ Step 5: Enable Cloud Storage (1 min)
- [ ] Go to Storage
- [ ] Click "Get started"
- [ ] Click "Next" (accept default rules)
- [ ] Click "Done"

### ☐ Step 6: Update Config File (2 min)
- [ ] Open: `d:\SmartED\backend\firebase\config.js`
- [ ] Replace placeholder values with YOUR values from Step 2
- [ ] Save file (Ctrl+S)

### ☐ Step 7: Test Connection (1 min)
```powershell
cd d:\SmartED\backend
node scripts/testConnection.js
```
- [ ] See all ✅ green checkmarks

### ☐ Step 8: Initialize Database (1 min)
```powershell
node scripts/initDatabase.js
```
- [ ] See success messages
- [ ] Verify in Firebase Console → Firestore → See collections

### ☐ Step 9: Update Security Rules (3 min)
- [ ] Copy Firestore rules from `FIREBASE_SETUP_WALKTHROUGH.md`
- [ ] Go to Firestore → Rules → Paste → Publish
- [ ] Copy Storage rules from walkthrough
- [ ] Go to Storage → Rules → Paste → Publish

### ☐ Step 10: Final Check (1 min)
- [ ] Firebase Console shows: Authentication ✅
- [ ] Firebase Console shows: Firestore with data ✅
- [ ] Firebase Console shows: Storage enabled ✅
- [ ] Test script passed ✅
- [ ] Init script passed ✅

---

## 🎯 After Completion

**Tell me**: "Firebase setup complete!" 

**Then I'll start Part 2 implementation:**
1. Create Context Providers
2. Build custom hooks
3. Integrate authentication
4. Connect dashboards
5. Add real-time features

---

**Estimated Total Time**: ~15 minutes

**Detailed Guide**: See `FIREBASE_SETUP_WALKTHROUGH.md` for step-by-step screenshots and troubleshooting.

**Current Status**: ⏳ Waiting for you to complete Firebase setup

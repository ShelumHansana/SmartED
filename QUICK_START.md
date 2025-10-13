# 🚀 SmartED Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Start Development Server
```powershell
cd d:\SmartED\frontend
npm run dev
```

### 2. Open Browser
```
http://localhost:5173
```

### 3. Register Your First User
- Click "Sign Up"
- Fill in the form
- Choose role (Student/Teacher/Parent)
- Click "Register"

### 4. You're In!
- Automatically logged in
- Redirected to your dashboard
- Data loads from Firebase

---

## 🎯 What You Can Do NOW

### ✅ Working Features
- **Register** students, teachers, parents
- **Login** with email/password
- **View** student dashboard with real data
- **Logout** and switch users
- **Protected** routes by role

### 🔄 Currently Building
- Teacher dashboard integration
- Parent dashboard integration
- File uploads
- Messaging system

---

## 📋 Quick Commands

### Frontend
```powershell
cd d:\SmartED\frontend
npm run dev          # Start dev server
npm run build        # Build for production
```

### Backend Testing
```powershell
cd d:\SmartED\backend
node scripts/testConnection.js     # Test Firebase
node scripts/initDatabase.js       # Initialize DB
```

---

## 🔑 Test Accounts

Create your own test accounts or use Firebase Console to add:

**Student**: Any email + password (grade 10-13)  
**Teacher**: Any email + password (with subjects)  
**Parent**: Any email + password (with child info)

---

## 📊 Firebase Console

**View Data**: https://console.firebase.google.com/
- Authentication → Users
- Firestore Database → Collections
- Storage → Files

---

## 🐛 Quick Troubleshooting

**Problem**: Page shows "Loading..."
**Fix**: Check browser console, verify Firebase config

**Problem**: Can't login
**Fix**: Check email/password, verify user exists in Firebase

**Problem**: Data not loading
**Fix**: Check Firestore rules, verify collections exist

**Problem**: Module errors
**Fix**: Run `npm install` in frontend folder

---

## 📁 Project Structure

```
SmartED/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── contexts/     # Auth context
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utilities
│   └── package.json
│
└── backend/           # Firebase services
    ├── firebase/        # Config
    ├── services/        # Auth, User, DB
    ├── utils/           # Validation, Errors
    └── scripts/         # Testing scripts
```

---

## 🎓 Common Use Cases

### Check if User is Logged In
```javascript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please login</div>
  }
  
  return <div>Welcome {user.firstName}</div>
}
```

### Load Data from Firestore
```javascript
import { useFirestore } from '../hooks/useFirestore'

function MyComponent() {
  const { user } = useAuth()
  
  const { data, loading, error } = useFirestore('grades', {
    where: [['studentId', '==', user.id]]
  })
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <div>{data.length} grades found</div>
}
```

### Protect a Route
```jsx
<Route 
  path="/student-dashboard" 
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentDashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 📚 Documentation Files

1. **FIREBASE_SETUP_WALKTHROUGH.md** - Complete Firebase setup
2. **PART_2_PLAN.md** - Integration roadmap
3. **PART_2_SUMMARY.md** - What's implemented
4. **VERIFICATION_REPORT.md** - Part 1 checklist
5. **QUICK_REFERENCE.md** (this file) - Quick guide

---

## 🎯 Next Steps

1. ✅ Authentication working
2. ✅ Student dashboard with data
3. ⏳ Add Teacher dashboard integration
4. ⏳ Add Parent dashboard integration
5. ⏳ Implement file uploads
6. ⏳ Add messaging system

---

## 💡 Pro Tips

- Use Chrome DevTools to inspect Firebase calls
- Check Firestore Console to see data in real-time
- Use React DevTools to inspect component state
- Keep browser console open for errors

---

## 🆘 Need Help?

1. Check browser console for errors
2. Review documentation files
3. Check Firebase Console for data
4. Verify security rules are published

---

**Status**: ✅ Ready to use!  
**Last Updated**: October 13, 2025  
**Version**: 2.0 (Firebase Integrated)

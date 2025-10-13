# 🚀 SmartED Backend - Quick Reference

## One-Page Cheat Sheet

### 🔥 Firebase Setup (5 Steps)

```bash
# 1. Create Firebase Project
Visit: https://console.firebase.google.com/
Create project: "SmartED"

# 2. Enable Services
✓ Authentication (Email/Password)
✓ Firestore Database (Production mode, asia-south1)
✓ Cloud Storage

# 3. Update Config
Copy Firebase config → backend/firebase/config.js

# 4. Initialize Database
cd backend
node scripts/initDatabase.js

# 5. Apply Security Rules
Copy from SETUP_GUIDE.md → Firebase Console
```

---

### 📚 Import Examples

```javascript
// Authentication
import { 
  registerStudent, 
  registerTeacher,
  registerParent,
  loginUser, 
  logoutUser 
} from '../backend/services/authService';

// User Management
import { 
  getAllStudents,
  getAllTeachers,
  updateUserProfile,
  uploadProfileImage 
} from '../backend/services/userService';

// Database
import { initializeDatabase } from '../backend/services/dbInitService';

// Utilities
import { validateEmail, validatePassword } from '../backend/utils/validation';
import { getErrorMessage } from '../backend/utils/errorHandler';

// Or import everything
import * as backend from '../backend/index';
```

---

### 🔐 Common Operations

#### Register Student
```javascript
const result = await registerStudent({
  email: 'student@school.lk',
  password: 'SecurePass123!',
  fullName: 'John Doe',
  grade: '10',
  class: 'A',
  indexNumber: 'ST2025001',
  gender: 'male',
  birthDay: 15,
  birthMonth: 5,
  birthYear: 2008,
  guardianName: 'Parent Name',
  guardianContact: '+94771234567',
  address: 'Colombo, Sri Lanka',
  contactNumber: '+94771234567',
  admissionDate: '2025-01-15'
});
```

#### Login User
```javascript
const result = await loginUser('user@school.lk', 'password');
if (result.success) {
  console.log('Role:', result.role);
  // Navigate based on role
  navigate(`/${result.role}-dashboard`);
}
```

#### Get All Students
```javascript
const students = await getAllStudents();
console.log('Total students:', students.length);
```

#### Update Profile
```javascript
await updateUserProfile(userId, {
  fullName: 'Updated Name',
  contactNumber: '+94771234567'
});
```

#### Upload Profile Image
```javascript
const imageUrl = await uploadProfileImage(userId, imageFile);
console.log('Image URL:', imageUrl);
```

---

### 🗄️ Database Collections

| Collection | Purpose | Who Can Write |
|------------|---------|---------------|
| `users` | All user accounts | Self, Admin |
| `courses` | Course information | Teacher, Admin |
| `subjects` | Subject definitions | Admin |
| `assessments` | Tests, exams | Teacher, Admin |
| `grades` | Student marks | Teacher, Admin |
| `studentProgress` | Progress tracking | Teacher, Admin |
| `activities` | Assignments | Teacher, Admin |
| `notifications` | Alerts | Teacher, Admin |
| `messages` | Direct messages | All authenticated |
| `attendance` | Attendance records | Teacher, Admin |
| `achievements` | Student awards | Teacher, Admin |
| `settings` | School config | Admin |

---

### 🎓 User Roles

| Role | Access Level | Can Do |
|------|-------------|---------|
| **Student** | Own data | View grades, progress, courses |
| **Teacher** | Class data | Enter grades, manage courses |
| **Parent** | Children's data | View child's progress |
| **Admin** | Everything | Full system control |

---

### ✅ Validation Functions

```javascript
// Email
validateEmail('test@school.lk') // Returns boolean

// Password (returns object with strength)
validatePassword('MyPass123!') 
// { isValid: true, strength: 'strong', message: '...' }

// Phone (Sri Lankan format)
validatePhoneNumber('+94771234567') // Returns boolean

// Required fields
validateRequiredFields(data, ['email', 'name', 'password'])
// { isValid: boolean, missingFields: [], message: '...' }
```

---

### 🐛 Error Handling

```javascript
try {
  await someFirebaseOperation();
} catch (error) {
  const message = getErrorMessage(error);
  console.error(message); // User-friendly message
}

// Or use handleError
const result = handleError(error, 'Login Operation');
// Returns: { success: false, error: { code, message, context } }
```

---

### 📊 Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `auth/email-already-in-use` | Email registered | Use different email |
| `auth/wrong-password` | Wrong password | Check password |
| `auth/user-not-found` | User doesn't exist | Check email |
| `permission-denied` | No access | Check role/rules |
| `not-found` | Data not found | Verify ID |

---

### 🔍 Filters & Queries

```javascript
// Students by class
const students = await getStudentsByClass('10', 'A');

// Students by level
const alStudents = await getStudentsByLevel('A/L');

// Teachers by subject
const mathTeachers = await getTeachersBySubject('Mathematics');

// All users by role
const allTeachers = await getUsersByRole('teacher');
```

---

### 🎯 Quick Testing

```bash
# Test Firebase connection
node backend/scripts/testConnection.js

# Initialize database
node backend/scripts/initDatabase.js

# Check if everything works
✅ Connection successful
✅ Database initialized
✅ Can create user
✅ Can login
✅ Can read data
```

---

### 📱 Frontend Integration

#### Update Login.jsx
```javascript
import { loginUser } from '../backend/services/authService';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await loginUser(email, password);
    if (result.success) {
      navigate(`/${result.role}-dashboard`);
    }
  } catch (error) {
    alert(getErrorMessage(error));
  }
};
```

#### Update Register.jsx
```javascript
import { registerStudent, registerTeacher, registerParent } 
  from '../backend/services/authService';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let result;
    if (selectedRole === 'student') {
      result = await registerStudent(formData);
    } else if (selectedRole === 'teacher') {
      result = await registerTeacher(formData);
    } else {
      result = await registerParent(formData);
    }
    
    if (result.success) {
      navigate(`/${selectedRole}-dashboard`);
    }
  } catch (error) {
    alert(getErrorMessage(error));
  }
};
```

---

### 🔧 Environment Variables (Optional)

```env
# .env file
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

```javascript
// Update config.js to use env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

---

### 🎨 27 Pre-configured Subjects

**O/L**: Math, Science, English, Sinhala, Tamil, History, Geography, Buddhism, Christianity, Islam, Art, Music, PE (13 subjects)

**A/L Physical**: Math, Physics, Chemistry (3 subjects)

**A/L Bio**: Biology, Chemistry, Physics (3 subjects)

**A/L Common**: English, ICT, GIT (3 subjects)

**A/L Arts**: Literature, Economics, Political Science (3 subjects)

**A/L Tech**: Engineering Tech, Science for Tech (2 subjects)

---

### 📞 Need Help?

```
1. Check: backend/SETUP_GUIDE.md
2. Review: backend/README.md
3. Debug: node backend/scripts/testConnection.js
4. Firebase Console: https://console.firebase.google.com/
5. Logs: Check browser console for errors
```

---

### ✨ Pro Tips

1. **Always check user is logged in** before operations
2. **Use error handling** on all Firebase calls
3. **Validate data** before sending to Firebase
4. **Keep config.js secure** - don't commit real credentials
5. **Test security rules** thoroughly
6. **Use environment variables** in production
7. **Monitor Firebase usage** in console
8. **Backup regularly** - use Firebase export

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Status**: Production Ready ✅

For complete documentation, see:
- `backend/README.md` - Full API reference
- `backend/SETUP_GUIDE.md` - Detailed setup
- `backend/CODE_SUMMARY.md` - Implementation details

# SmartED Backend

Firebase-based backend services for the SmartED School Management System.

## 📁 Structure

```
backend/
├── firebase/
│   ├── config.js          # Firebase configuration
│   └── README.md          # Firebase setup instructions
├── services/
│   ├── authService.js     # Authentication services
│   ├── userService.js     # User management services
│   └── dbInitService.js   # Database initialization
├── utils/
│   ├── validation.js      # Validation utilities
│   └── errorHandler.js    # Error handling utilities
├── index.js               # Main export file
├── package.json           # Dependencies
├── SETUP_GUIDE.md         # Complete setup guide
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install firebase
```

### 2. Configure Firebase
1. Create a Firebase project at https://console.firebase.google.com/
2. Copy your Firebase configuration
3. Update `backend/firebase/config.js` with your credentials

### 3. Initialize Database
```bash
npm run init-db
```

### 4. Test Connection
```bash
npm run test
```

## 📚 Available Services

### Authentication (`authService.js`)
- `registerStudent()` - Register new student
- `registerTeacher()` - Register new teacher
- `registerParent()` - Register new parent/guardian
- `loginUser()` - User login
- `logoutUser()` - User logout
- `resetPassword()` - Password reset
- `getCurrentUser()` - Get current user data
- `onAuthStateChange()` - Listen to auth state changes

### User Management (`userService.js`)
- `getUserById()` - Get user by ID
- `getUserByEmail()` - Get user by email
- `getAllStudents()` - Get all students
- `getAllTeachers()` - Get all teachers
- `getAllParents()` - Get all parents
- `updateUserProfile()` - Update user profile
- `uploadProfileImage()` - Upload profile picture
- `toggleUserStatus()` - Activate/Deactivate user
- `getStudentsByClass()` - Get students by class
- `getTeachersBySubject()` - Get teachers by subject

### Database Initialization (`dbInitService.js`)
- `initializeDatabase()` - Initialize all collections
- `initializeSubjects()` - Add default subjects
- `initializeSchoolSettings()` - Set default settings

### Utilities
- **Validation** (`validation.js`)
  - Email validation
  - Password strength checking
  - Phone number validation
  - Required fields validation

- **Error Handling** (`errorHandler.js`)
  - User-friendly error messages
  - Error logging
  - Custom error creation

## 🔒 Security

### Firestore Security Rules
Role-based access control implemented:
- **Students**: Read own data, read courses
- **Teachers**: Read/write grades, manage courses
- **Parents**: Read children's data
- **Admins**: Full access

### Authentication
- Email/Password authentication
- Secure password hashing (handled by Firebase)
- Password reset functionality
- Session management

## 📊 Database Collections

1. **users** - All user accounts (students, teachers, parents, admins)
2. **courses** - Course information
3. **subjects** - Subject definitions
4. **assessments** - Tests, exams, assignments
5. **grades** - Student marks and grades
6. **studentProgress** - Progress tracking
7. **activities** - Assignments and activities
8. **notifications** - System notifications
9. **messages** - Direct messaging
10. **attendance** - Attendance records
11. **achievements** - Student achievements
12. **settings** - School settings

## 🔧 Configuration

### Environment Variables (Optional)
For production, use environment variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📖 Usage Examples

### Register a Student
```javascript
import { registerStudent } from '../backend/services/authService';

const userData = {
  email: 'student@school.lk',
  password: 'SecurePass123!',
  fullName: 'John Doe',
  grade: '10',
  class: 'A',
  // ... other fields
};

const result = await registerStudent(userData);
console.log(result);
```

### Login User
```javascript
import { loginUser } from '../backend/services/authService';

const result = await loginUser('user@school.lk', 'password123');
if (result.success) {
  // Redirect based on role
  if (result.role === 'student') {
    navigate('/student-dashboard');
  }
}
```

### Get All Students
```javascript
import { getAllStudents } from '../backend/services/userService';

const students = await getAllStudents();
console.log(students);
```

### Update User Profile
```javascript
import { updateUserProfile } from '../backend/services/userService';

await updateUserProfile(userId, {
  fullName: 'Updated Name',
  contactNumber: '+94771234567'
});
```

## 🧪 Testing

### Test Authentication
```javascript
import { loginUser, registerStudent } from '../backend/services/authService';

// Test registration
const testUser = {
  email: 'test@school.lk',
  password: 'Test123!',
  fullName: 'Test User',
  // ... required fields
};

const result = await registerStudent(testUser);
console.log('Registration:', result);

// Test login
const loginResult = await loginUser('test@school.lk', 'Test123!');
console.log('Login:', loginResult);
```

## 🐛 Common Issues

### Issue: "Firebase not configured"
**Solution**: Update `backend/firebase/config.js` with your Firebase credentials

### Issue: "Permission denied"
**Solution**: Check Firestore security rules are properly configured

### Issue: "Module not found"
**Solution**: Ensure Firebase is installed: `npm install firebase`

## 📚 Documentation

- [Complete Setup Guide](./SETUP_GUIDE.md)
- [Firebase Configuration](./firebase/README.md)
- [Firebase Documentation](https://firebase.google.com/docs)

## 🤝 Contributing

1. Follow the existing code structure
2. Add JSDoc comments for all functions
3. Test all changes before committing
4. Update documentation as needed

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check the [Setup Guide](./SETUP_GUIDE.md)
2. Review Firebase Console logs
3. Check browser console for errors
4. Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Status**: Production Ready

# SmartED - Quick Start & Testing Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account (already configured)

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

2. **Backend** (Optional - Already using Firebase directly)
The frontend communicates directly with Firebase, so no backend server is needed for basic operations.

## 🧪 Testing Integrated Features

### Test 1: User Registration & Login

#### Create a Student Account
1. Navigate to `http://localhost:5173`
2. Click "Get Started" or "Sign Up"
3. Fill in student registration form:
   - Full Name: `Test Student`
   - Email: `student@test.com`
   - Password: `password123`
   - Role: `Student`
   - Grade: `12`
   - Index Number: `2025001`
4. Click "Register"
5. You should be redirected to Student Dashboard

#### Create a Teacher Account
1. Logout from student account
2. Click "Sign Up"
3. Fill in teacher registration form:
   - Full Name: `Mr. Test Teacher`
   - Email: `teacher@test.com`
   - Password: `password123`
   - Role: `Teacher`
   - Title: `Mr.`
   - Subjects: Select subjects
   - Teaching Classes: `Grade 12 M1`
4. Click "Register"
5. You should be redirected to Teacher Dashboard

#### Create a Parent Account
1. Logout from teacher account
2. Click "Sign Up"
3. Fill in parent registration form:
   - Full Name: `Mr. Test Parent`
   - Email: `parent@test.com`
   - Password: `password123`
   - Role: `Parent`
   - Children: Add child with index number `2025001` (the student created above)
4. Click "Register"
5. You should be redirected to Parent Dashboard

### Test 2: Student Dashboard Features

**Login as Student** (`student@test.com` / `password123`)

#### Verify Display
- ✅ Welcome message with student name
- ✅ Profile section with index number
- ✅ Grade cards (will be empty initially)
- ✅ Assignments section
- ✅ Notifications panel

#### Expected State (New Account)
- No grades yet (empty state message)
- No assignments yet
- Welcome notification should appear

### Test 3: Teacher Dashboard Features

**Login as Teacher** (`teacher@test.com` / `password123`)

#### Verify Profile Section
- ✅ Teacher name displayed: "Mr. Test Teacher"
- ✅ Subjects list shown
- ✅ Teaching classes displayed
- ✅ Welcome header with teacher name

#### Verify Student List
- ✅ Students from teacher's classes appear
- ✅ Can view student details

#### Test Grade Entry
1. Click "Grades" tab
2. Select Class: `Grade 12 M1`
3. Select Subject: Choose from your subjects
4. Click "➕" to add new assessment:
   - Name: `First Term Test`
   - Type: `Term Test`
   - Max Marks: `100`
   - Date: Select current date
5. Click "Add Assessment"
6. Select the created assessment from dropdown
7. Enter marks for students (e.g., 85, 90, 75)
8. Observe:
   - ✅ Automatic percentage calculation
   - ✅ Letter grade calculation (A/B/C/S/W)
   - ✅ Class statistics update
9. Click "💾 Save Marks"
10. Marks should be saved to Firebase

### Test 4: Parent Dashboard Features

**Login as Parent** (`parent@test.com` / `password123`)

#### Verify Children Display
- ✅ Child selector shows linked children
- ✅ Student name and class displayed
- ✅ Can switch between children (if multiple)

#### Verify Academic Data
- ✅ Overview tab shows stats cards
- ✅ Grades entered by teacher appear in recent tests
- ✅ Progress tab shows subject-wise performance
- ✅ Overall grade calculated from all grades

#### Test Multi-Child Support
If you added multiple children:
1. Click on different child tabs
2. Verify data changes for each child
3. Check grade display updates

### Test 5: Cross-Dashboard Data Flow

**Complete Flow Test**:

1. **Teacher**: Enter grades for student
   - Login as teacher
   - Go to Grades tab
   - Create assessment
   - Enter marks (e.g., 90 for Mathematics)
   - Save marks

2. **Student**: View received grades
   - Logout and login as student
   - Go to Student Dashboard
   - Verify new grade appears in:
     - Subject cards
     - Recent tests section
     - Overall GPA calculation

3. **Parent**: Monitor child's grades
   - Logout and login as parent
   - Select child
   - Verify same grade appears in:
     - Overview tab (recent tests)
     - Progress tab (subject performance)
     - Stats cards update

### Test 6: Authentication Features

#### Test Session Persistence
1. Login as any user
2. Close browser tab
3. Reopen browser and navigate to app
4. ✅ Should remain logged in
5. ✅ User data should load

#### Test Logout
1. Click logout button in navbar
2. ✅ Should redirect to landing page
3. ✅ Cannot access dashboard without login
4. ✅ Attempting to navigate to dashboard redirects to login

#### Test Protected Routes
1. Logout completely
2. Try to manually navigate to:
   - `http://localhost:5173/student-dashboard`
   - `http://localhost:5173/teacher-dashboard`
3. ✅ Should redirect to login page

## 🐛 Known Issues & Limitations

### Current Limitations
1. **AdminDashboard**: Not yet integrated with Firebase (shows hardcoded data)
2. **File Uploads**: Profile images and document uploads not implemented
3. **Messaging**: Real-time messaging system not implemented
4. **Attendance**: Attendance tracking not implemented
5. **Notifications**: Static notifications (not real-time updates)

### Expected Behaviors
- **Empty States**: New accounts will show "No data" messages until data is created
- **Loading States**: Brief loading indicators when fetching from Firebase
- **First Load**: Initial load may take 1-2 seconds to establish Firebase connection

## 🔍 Debugging Tips

### Check Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `smart-ed-b7023`
3. Navigate to:
   - **Authentication**: See registered users
   - **Firestore Database**: View collections and documents
   - **Storage**: Check uploaded files (when implemented)

### Browser Console Errors
Open browser DevTools (F12) and check:
- **Console tab**: Look for JavaScript errors
- **Network tab**: Check Firebase API calls
- **Application tab**: Verify localStorage for session data

### Common Issues

**Issue**: "Firebase not found" error
- **Solution**: Ensure Firebase packages are installed: `npm install firebase`

**Issue**: Grades not appearing
- **Solution**: Verify student is linked to correct class and teacher

**Issue**: Cannot login
- **Solution**: 
  - Check email/password correctness
  - Verify user exists in Firebase Authentication
  - Check browser console for specific error

**Issue**: Data not loading
- **Solution**:
  - Check Firebase connection in browser console
  - Verify Firestore rules allow reads
  - Check user permissions

## 📊 Test Data Verification

### In Firebase Console

#### Check Users Collection
```
users/{userId}
  - fullName: "Test Student"
  - email: "student@test.com"
  - role: "student"
  - grade: "12"
  - indexNumber: "2025001"
```

#### Check Grades Collection
```
grades/{gradeId}
  - studentId: "{studentId}"
  - subject: "Mathematics"
  - marks: 90
  - grade: "A"
  - teacherId: "{teacherId}"
  - teacherName: "Mr. Test Teacher"
```

#### Check Assessments Collection
```
assessments/{assessmentId}
  - name: "First Term Test"
  - type: "Term Test"
  - maxMarks: 100
  - class: "Grade 12 M1"
  - subject: "Mathematics"
  - teacherId: "{teacherId}"
```

## ✅ Success Criteria

Your integration is working correctly if:

1. ✅ Users can register for all roles (Student/Teacher/Parent)
2. ✅ Login redirects to correct dashboard based on role
3. ✅ Student dashboard shows user-specific data
4. ✅ Teacher can view students from their classes
5. ✅ Teacher can create assessments and enter grades
6. ✅ Grades entered by teacher appear in student dashboard
7. ✅ Parent can view their children's grades
8. ✅ Session persists across browser refreshes
9. ✅ Logout works and clears session
10. ✅ Protected routes redirect unauthorized users

## 🎯 Next Testing Phase

Once basic features are verified:

1. Test with multiple students in same class
2. Test with multiple teachers teaching same students
3. Test grade entry with various mark ranges
4. Test parent with multiple children
5. Test edge cases (missing data, invalid inputs)
6. Performance testing with larger datasets

## 📞 Support

If you encounter issues:
1. Check FIREBASE_INTEGRATION_STATUS.md for known limitations
2. Review browser console for error messages
3. Verify Firebase Console data matches expectations
4. Ensure all dependencies are installed

---

**Testing Checklist Progress**: Use this to track your testing

- [ ] Student registration
- [ ] Teacher registration  
- [ ] Parent registration
- [ ] Student login and dashboard
- [ ] Teacher login and dashboard
- [ ] Parent login and dashboard
- [ ] Grade entry by teacher
- [ ] Grade display for student
- [ ] Grade display for parent
- [ ] Session persistence
- [ ] Logout functionality
- [ ] Protected routes
- [ ] Cross-dashboard data flow

**Happy Testing! 🚀**

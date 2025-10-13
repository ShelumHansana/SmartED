# Firebase Configuration Setup

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **SmartED**
4. Enable/Disable Google Analytics (recommended: Enable)
5. Choose Analytics location: **Sri Lanka** or closest region
6. Accept terms and click "Create project"

## Step 2: Register Web App

1. In Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register app with nickname: **SmartED Web App**
3. Enable Firebase Hosting (optional)
4. Click "Register app"
5. Copy the `firebaseConfig` object

## Step 3: Update Configuration

1. Open `backend/firebase/config.js`
2. Replace the placeholder values with your actual Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. (Optional) Enable **Google** sign-in for easier authentication

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll set rules later)
4. Select location: **asia-south1** (Mumbai - closest to Sri Lanka)
5. Click "Enable"

## Step 6: Setup Storage

1. In Firebase Console, go to **Storage**
2. Click "Get started"
3. Choose **Production mode**
4. Use same location as Firestore
5. Click "Done"

## Step 7: Install Firebase CLI (Optional - for deployment)

```bash
npm install -g firebase-tools
firebase login
firebase init
```

## Important Security Notes

⚠️ **Never commit your actual Firebase config to public repositories**
- Add `config.js` to `.gitignore` if making the repo public
- Use environment variables for production
- Keep your API keys secure

## Database Structure

The database collections are:
- `users` - All user accounts (students, teachers, parents, admins)
- `courses` - All courses/subjects
- `assessments` - Tests, exams, assignments
- `grades` - Student marks and grades
- `studentProgress` - Progress tracking
- `activities` - Assignments and activities
- `notifications` - System notifications
- `messages` - Direct messages
- `attendance` - Attendance records
- `achievements` - Student achievements
- `settings` - School settings

## Next Steps

After completing the setup:
1. Update the config file with your credentials
2. Test the connection by running the app
3. Configure Firestore security rules
4. Set up Authentication rules
5. Initialize sample data (optional)

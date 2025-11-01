// Authentication Service
// Handles all authentication-related operations

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config.js';

// ==================== USER REGISTRATION ====================

/**
 * Register a new student
 * @param {Object} userData - Student registration data
 * @returns {Promise<Object>} Created user object
 */
export const registerStudent = async (userData) => {
  try {
    // Create authentication account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;

    // Prepare student data for Firestore
    const studentData = {
      email: userData.email,
      role: 'student',
      fullName: userData.fullName,
      status: 'Active',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      profileImage: '',
      studentData: {
        indexNumber: userData.indexNumber,
        admissionNo: `ST${Date.now()}`, // Generate unique admission number
        grade: userData.grade,
        class: userData.className || userData.class,
        className: userData.className || userData.class,
        stream: userData.stream || null,
        level: parseInt(userData.grade) >= 12 ? 'A/L' : 'O/L',
        gender: userData.gender,
        birthday: userData.birthday,
        admissionDate: userData.admissionDate,
        address: userData.address,
        contactNumber: userData.phoneNumber || userData.contactNumber,
        guardianName: userData.guardianName,
        guardianContact: userData.guardianContact,
        attendance: 0,
        overallGrade: 'N/A',
        gpa: 0
      }
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), studentData);

    // Update display name
    await updateProfile(user, {
      displayName: userData.fullName
    });

    return {
      success: true,
      userId: user.uid,
      userData: studentData
    };

  } catch (error) {
    console.error('Error registering student:', error);
    throw new Error(error.message);
  }
};

/**
 * Register a new teacher
 * @param {Object} userData - Teacher registration data
 * @returns {Promise<Object>} Created user object
 */
export const registerTeacher = async (userData) => {
  try {
    // Create authentication account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;

    // Prepare teacher data for Firestore
    const teacherData = {
      email: userData.email,
      role: 'teacher',
      fullName: userData.fullName,
      title: userData.title,
      status: 'Active',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      profileImage: '',
      // Store frequently accessed fields at top level
      subjects: userData.subjects || [],
      classes: userData.classes || userData.teachingClasses || [],
      teacherIndex: userData.teacherIndex,
      teacherData: {
        title: userData.title,
        teacherIndex: userData.teacherIndex,
        subjects: userData.subjects || [],
        teachingClasses: userData.classes || userData.teachingClasses || [],
        inCharge: {
          type: userData.inChargeType || '',
          details: userData.inChargeDetails || ''
        },
        experience: userData.experience || '0 years',
        availability: 'Mon-Fri 8AM-3PM'
      }
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), teacherData);

    // Update display name
    await updateProfile(user, {
      displayName: teacherData.fullName
    });

    return {
      success: true,
      userId: user.uid,
      userData: teacherData
    };

  } catch (error) {
    console.error('Error registering teacher:', error);
    throw new Error(error.message);
  }
};

/**
 * Register a new parent/guardian
 * @param {Object} userData - Parent registration data
 * @returns {Promise<Object>} Created user object
 */
export const registerParent = async (userData) => {
  try {
    // Create authentication account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;

    // Prepare parent data for Firestore
    const parentData = {
      email: userData.email,
      role: 'parent',
      fullName: userData.fullName,
      title: userData.title,
      status: 'Active',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      profileImage: '',
      // Store children at top level for easy access
      children: userData.children || [],
      parentData: {
        title: userData.title,
        children: userData.children || [],
        relationship: userData.relationship,
        maritalStatus: userData.maritalStatus,
        birthday: userData.birthday,
        telephone: userData.phoneNumber || userData.telephone,
        mobile: userData.mobileNumber || userData.mobile
      }
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), parentData);

    // Update display name
    await updateProfile(user, {
      displayName: parentData.fullName
    });

    return {
      success: true,
      userId: user.uid,
      userData: parentData
    };

  } catch (error) {
    console.error('Error registering parent:', error);
    throw new Error(error.message);
  }
};

// ==================== USER LOGIN ====================

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data with role
 */
export const loginUser = async (email, password) => {
  try {
    // Check for hardcoded admin account
    if (email === 'admin@gmail.com' && password === '12345') {
      console.log('Admin login detected with hardcoded credentials');
      
      // Return admin user data without Firebase authentication
      return {
        success: true,
        userId: 'admin-hardcoded-001',
        email: 'admin@gmail.com',
        role: 'admin',
        fullName: 'System Administrator',
        userData: {
          email: 'admin@gmail.com',
          role: 'admin',
          fullName: 'System Administrator',
          title: 'Admin',
          status: 'Active',
          isHardcodedAdmin: true
        }
      };
    }

    // Regular login flow for other users
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();

    // Update last login timestamp
    await setDoc(userDocRef, {
      lastLogin: serverTimestamp()
    }, { merge: true });

    return {
      success: true,
      userId: user.uid,
      email: user.email,
      role: userData.role,
      fullName: userData.fullName,
      userData: userData
    };

  } catch (error) {
    console.error('Error logging in:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled.';
    }
    
    throw new Error(errorMessage);
  }
};

// ==================== USER LOGOUT ====================

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Logout failed. Please try again.');
  }
};

// ==================== PASSWORD RESET ====================

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<Object>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.'
    };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    
    let errorMessage = 'Failed to send reset email.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    }
    
    throw new Error(errorMessage);
  }
};

// ==================== GET CURRENT USER ====================

/**
 * Get current authenticated user data
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return null;
    }

    // Get user data from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();

    return {
      userId: user.uid,
      email: user.email,
      role: userData.role,
      fullName: userData.fullName,
      userData: userData
    };

  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// ==================== AUTH STATE OBSERVER ====================

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to execute on state change
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const userData = await getCurrentUser();
      callback(userData);
    } else {
      // User is signed out
      callback(null);
    }
  });
};

// ==================== CHECK USER STATUS ====================

/**
 * Check if user account is active
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export const isUserActive = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    return userData.status === 'Active';

  } catch (error) {
    console.error('Error checking user status:', error);
    return false;
  }
};

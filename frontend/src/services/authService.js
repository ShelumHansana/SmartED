// Authentication Service for Frontend
// Handles all authentication-related operations

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

// ==================== USER REGISTRATION ====================

/**
 * Register a new student
 */
export const registerStudent = async (userData) => {
  let userCredential = null;
  
  try {
    console.log('Starting student registration for:', userData.email);
    
    // Create authentication account
    userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;
    console.log('Firebase Auth user created successfully:', user.uid);

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
        admissionNo: `ST${Date.now()}`,
        grade: userData.grade,
        class: userData.className || userData.class,
        stream: userData.stream || '',
        dateOfBirth: userData.dateOfBirth || '',
        contactNumber: userData.contactNumber || '',
        parentContact: userData.parentContact || ''
      }
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), studentData);
    console.log('Student data saved to Firestore');

    return {
      uid: user.uid,
      email: user.email,
      ...studentData
    };
  } catch (error) {
    console.error('Error in registerStudent:', error);
    
    // If user was created but Firestore save failed, we should clean up
    if (userCredential && userCredential.user) {
      try {
        await userCredential.user.delete();
        console.log('Cleaned up auth user after Firestore failure');
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }
    }
    
    throw error;
  }
};

/**
 * Register a new teacher
 */
export const registerTeacher = async (userData) => {
  let userCredential = null;
  
  try {
    console.log('Starting teacher registration for:', userData.email);
    
    userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;

    const teacherData = {
      email: userData.email,
      role: 'teacher',
      fullName: userData.fullName,
      status: 'Active',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      profileImage: '',
      teacherData: {
        employeeId: userData.employeeId || `T${Date.now()}`,
        subjects: userData.subjects || [],
        classes: userData.classes || [],
        contactNumber: userData.contactNumber || '',
        qualification: userData.qualification || ''
      }
    };

    await setDoc(doc(db, 'users', user.uid), teacherData);
    console.log('Teacher data saved to Firestore');

    return {
      uid: user.uid,
      email: user.email,
      ...teacherData
    };
  } catch (error) {
    console.error('Error in registerTeacher:', error);
    
    if (userCredential && userCredential.user) {
      try {
        await userCredential.user.delete();
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }
    }
    
    throw error;
  }
};

/**
 * Register a new parent
 */
export const registerParent = async (userData) => {
  let userCredential = null;
  
  try {
    console.log('Starting parent registration for:', userData.email);
    
    userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;

    const parentData = {
      email: userData.email,
      role: 'parent',
      fullName: userData.fullName,
      status: 'Active',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      profileImage: '',
      parentData: {
        contactNumber: userData.contactNumber || '',
        address: userData.address || '',
        occupation: userData.occupation || '',
        children: userData.children || []
      }
    };

    await setDoc(doc(db, 'users', user.uid), parentData);
    console.log('Parent data saved to Firestore');

    return {
      uid: user.uid,
      email: user.email,
      ...parentData
    };
  } catch (error) {
    console.error('Error in registerParent:', error);
    
    if (userCredential && userCredential.user) {
      try {
        await userCredential.user.delete();
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }
    }
    
    throw error;
  }
};

// ==================== USER LOGIN ====================

/**
 * Login user with username, index number, or email and password
 */
export const loginUser = async (identifier, password) => {
  try {
    const rawIdentifier = (identifier || '').trim();
    console.log('Attempting login for:', rawIdentifier);

    // Check for hardcoded admin credentials
    if ((rawIdentifier.toLowerCase() === 'admin@gmail.com' || rawIdentifier.toLowerCase() === 'admin') && password === '12345') {
      console.log('Admin login with default credentials');
      return {
        uid: 'admin-hardcoded-001',
        id: 'admin-hardcoded-001',
        email: 'admin@gmail.com',
        username: 'admin',
        role: 'admin',
        fullName: 'System Administrator',
        status: 'Active',
        isHardcodedAdmin: true
      };
    }

    let emailToAuth = rawIdentifier;

    // If identifier is not an email, lookup user in Firestore by username or index number
    if (!rawIdentifier.includes('@')) {
      const usersRef = collection(db, 'users');
      
      // Check username (case-insensitive search by lowercase)
      let q = query(usersRef, where('username', '==', rawIdentifier.toLowerCase()));
      let querySnapshot = await getDocs(q);

      // If not found, check indexNumber
      if (querySnapshot.empty) {
        q = query(usersRef, where('indexNumber', '==', rawIdentifier));
        querySnapshot = await getDocs(q);
      }

      // If not found, check studentData.indexNumber
      if (querySnapshot.empty) {
        q = query(usersRef, where('studentData.indexNumber', '==', rawIdentifier));
        querySnapshot = await getDocs(q);
      }

      if (querySnapshot.empty) {
        throw new Error('No account found with this username or index number.');
      }

      const matchedData = querySnapshot.docs[0].data();
      if (!matchedData.email) {
        throw new Error('No linked email found for this user account.');
      }
      emailToAuth = matchedData.email;
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, emailToAuth, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const userData = userDoc.data();
    
    // Check if user is active
    if (userData.status && userData.status !== 'Active') {
      await firebaseSignOut(auth);
      throw new Error('Account is inactive. Please contact administrator.');
    }
    
    // Update last login
    await setDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });
    
    return {
      uid: user.uid,
      id: user.uid,
      email: user.email,
      ...userData
    };
  } catch (error) {
    console.error('Login error:', error);
    let errorMessage = error.message || 'Login failed. Please try again.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid username, index number, email, or password.';
    }
    throw new Error(errorMessage);
  }
};

// ==================== USER LOGOUT ====================

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// ==================== GET CURRENT USER ====================

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe();
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              resolve({
                uid: user.uid,
                email: user.email,
                ...userDoc.data()
              });
            } else {
              resolve(null);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};

// ==================== AUTH STATE LISTENER ====================

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          callback({
            uid: user.uid,
            email: user.email,
            ...userDoc.data()
          });
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// ==================== PASSWORD RESET ====================

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent');
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// ==================== USER STATUS ====================

/**
 * Check if user is active
 */
export const isUserActive = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().status === 'Active';
    }
    return false;
  } catch (error) {
    console.error('Error checking user status:', error);
    return false;
  }
};

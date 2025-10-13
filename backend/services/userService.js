// User Service
// Handles user profile and data management operations

import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase/config.js';

// ==================== GET USER DATA ====================

/**
 * Get user data by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    return {
      userId: userDoc.id,
      ...userDoc.data()
    };

  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Get user data by email
 * @param {string} email - User email
 * @returns {Promise<Object>} User data
 */
export const getUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const userDoc = querySnapshot.docs[0];
    return {
      userId: userDoc.id,
      ...userDoc.data()
    };

  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

/**
 * Get all users by role
 * @param {string} role - User role (student, teacher, parent, admin)
 * @returns {Promise<Array>} Array of users
 */
export const getUsersByRole = async (role) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', role));
    const querySnapshot = await getDocs(q);

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        userId: doc.id,
        ...doc.data()
      });
    });

    return users;

  } catch (error) {
    console.error('Error getting users by role:', error);
    throw error;
  }
};

/**
 * Get all students
 * @returns {Promise<Array>} Array of students
 */
export const getAllStudents = async () => {
  return await getUsersByRole('student');
};

/**
 * Get all teachers
 * @returns {Promise<Array>} Array of teachers
 */
export const getAllTeachers = async () => {
  return await getUsersByRole('teacher');
};

/**
 * Get all parents
 * @returns {Promise<Array>} Array of parents
 */
export const getAllParents = async () => {
  return await getUsersByRole('parent');
};

// ==================== UPDATE USER DATA ====================

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    // Update Firebase Auth profile if fullName changed
    if (updates.fullName && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: updates.fullName
      });
    }

    return { success: true };

  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Update student-specific data
 * @param {string} userId - User ID
 * @param {Object} studentUpdates - Student data to update
 * @returns {Promise<void>}
 */
export const updateStudentData = async (userId, studentUpdates) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      studentData: studentUpdates,
      updatedAt: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    console.error('Error updating student data:', error);
    throw error;
  }
};

/**
 * Update teacher-specific data
 * @param {string} userId - User ID
 * @param {Object} teacherUpdates - Teacher data to update
 * @returns {Promise<void>}
 */
export const updateTeacherData = async (userId, teacherUpdates) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      teacherData: teacherUpdates,
      updatedAt: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    console.error('Error updating teacher data:', error);
    throw error;
  }
};

/**
 * Update parent-specific data
 * @param {string} userId - User ID
 * @param {Object} parentUpdates - Parent data to update
 * @returns {Promise<void>}
 */
export const updateParentData = async (userId, parentUpdates) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      parentData: parentUpdates,
      updatedAt: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    console.error('Error updating parent data:', error);
    throw error;
  }
};

// ==================== UPDATE EMAIL & PASSWORD ====================

/**
 * Update user email
 * @param {string} newEmail - New email address
 * @returns {Promise<void>}
 */
export const updateUserEmail = async (newEmail) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently logged in');
    }

    // Update in Firebase Auth
    await updateEmail(user, newEmail);

    // Update in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      email: newEmail,
      updatedAt: serverTimestamp()
    });

    return { success: true, message: 'Email updated successfully' };

  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently logged in');
    }

    await updatePassword(user, newPassword);

    return { success: true, message: 'Password updated successfully' };

  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// ==================== PROFILE IMAGE UPLOAD ====================

/**
 * Upload user profile image
 * @param {string} userId - User ID
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<string>} Download URL of uploaded image
 */
export const uploadProfileImage = async (userId, imageFile) => {
  try {
    // Create a reference to the storage location
    const storageRef = ref(storage, `profileImages/${userId}/${imageFile.name}`);

    // Upload the file
    await uploadBytes(storageRef, imageFile);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update user profile with image URL
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      profileImage: downloadURL,
      updatedAt: serverTimestamp()
    });

    // Update Firebase Auth profile
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL
      });
    }

    return downloadURL;

  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// ==================== USER STATUS MANAGEMENT ====================

/**
 * Toggle user status (Active/Inactive)
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const toggleUserStatus = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentStatus = userDoc.data().status;
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    await updateDoc(userDocRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    return { success: true, newStatus };

  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

/**
 * Deactivate user account
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const deactivateUser = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      status: 'Inactive',
      deactivatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
};

/**
 * Activate user account
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const activateUser = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      status: 'Active',
      activatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    console.error('Error activating user:', error);
    throw error;
  }
};

// ==================== STUDENT-SPECIFIC FUNCTIONS ====================

/**
 * Get students by class
 * @param {string} grade - Grade level
 * @param {string} className - Class name
 * @returns {Promise<Array>} Array of students
 */
export const getStudentsByClass = async (grade, className) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'student'),
      where('studentData.grade', '==', grade),
      where('studentData.class', '==', className)
    );
    
    const querySnapshot = await getDocs(q);

    const students = [];
    querySnapshot.forEach((doc) => {
      students.push({
        userId: doc.id,
        ...doc.data()
      });
    });

    return students;

  } catch (error) {
    console.error('Error getting students by class:', error);
    throw error;
  }
};

/**
 * Get students by level (O/L or A/L)
 * @param {string} level - Level (O/L or A/L)
 * @returns {Promise<Array>} Array of students
 */
export const getStudentsByLevel = async (level) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'student'),
      where('studentData.level', '==', level)
    );
    
    const querySnapshot = await getDocs(q);

    const students = [];
    querySnapshot.forEach((doc) => {
      students.push({
        userId: doc.id,
        ...doc.data()
      });
    });

    return students;

  } catch (error) {
    console.error('Error getting students by level:', error);
    throw error;
  }
};

// ==================== TEACHER-SPECIFIC FUNCTIONS ====================

/**
 * Get teachers by subject
 * @param {string} subject - Subject name
 * @returns {Promise<Array>} Array of teachers
 */
export const getTeachersBySubject = async (subject) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'teacher'),
      where('teacherData.subjects', 'array-contains', subject)
    );
    
    const querySnapshot = await getDocs(q);

    const teachers = [];
    querySnapshot.forEach((doc) => {
      teachers.push({
        userId: doc.id,
        ...doc.data()
      });
    });

    return teachers;

  } catch (error) {
    console.error('Error getting teachers by subject:', error);
    throw error;
  }
};

// ==================== PARENT-SPECIFIC FUNCTIONS ====================

/**
 * Get parent by child's student ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Object>} Parent data
 */
export const getParentByStudentId = async (studentId) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'parent')
    );
    
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      const parentData = doc.data();
      const children = parentData.parentData?.children || [];
      
      if (children.some(child => child.studentId === studentId)) {
        return {
          userId: doc.id,
          ...parentData
        };
      }
    }

    throw new Error('Parent not found for this student');

  } catch (error) {
    console.error('Error getting parent by student ID:', error);
    throw error;
  }
};

/**
 * Link child to parent account
 * @param {string} parentId - Parent user ID
 * @param {Object} childData - Child information
 * @returns {Promise<void>}
 */
export const linkChildToParent = async (parentId, childData) => {
  try {
    const parentDocRef = doc(db, 'users', parentId);
    const parentDoc = await getDoc(parentDocRef);

    if (!parentDoc.exists()) {
      throw new Error('Parent not found');
    }

    const parentData = parentDoc.data();
    const currentChildren = parentData.parentData?.children || [];

    // Check if child is already linked
    const isAlreadyLinked = currentChildren.some(
      child => child.studentId === childData.studentId
    );

    if (isAlreadyLinked) {
      throw new Error('Child is already linked to this parent');
    }

    // Add new child
    const updatedChildren = [...currentChildren, childData];

    await updateDoc(parentDocRef, {
      'parentData.children': updatedChildren,
      updatedAt: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    console.error('Error linking child to parent:', error);
    throw error;
  }
};

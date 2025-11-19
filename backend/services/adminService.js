// Admin Service
// Handles admin-specific operations for user and course management

import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  deleteUser as deleteAuthUser,
  updateEmail,
  updatePassword
} from 'firebase/auth';
import { auth, db } from '../firebase/config.js';

// ==================== USER MANAGEMENT ====================

/**
 * Get all users with optional filtering
 * @param {Object} filters - Filter options (role, status, searchQuery)
 * @returns {Promise<Array>} Array of users
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const usersRef = collection(db, 'users');
    let q = query(usersRef);

    // Apply role filter
    if (filters.role && filters.role !== 'all') {
      q = query(usersRef, where('role', '==', filters.role));
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }

    const snapshot = await getDocs(q);
    let users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply search filter (client-side)
    if (filters.searchQuery) {
      const search = filters.searchQuery.toLowerCase();
      users = users.filter(user => 
        user.fullName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.indexNumber?.toLowerCase().includes(search) ||
        user.teacherIndex?.toLowerCase().includes(search) ||
        user.studentData?.indexNumber?.toLowerCase().includes(search) ||
        user.teacherData?.teacherIndex?.toLowerCase().includes(search)
      );
    }

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

/**
 * Create a new user (Admin function)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  try {
    console.log('Admin creating user:', userData.email);

    // Create authentication account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password || 'Password123!' // Default password
    );

    const userId = userCredential.user.uid;

    // Prepare user data based on role
    let firestoreData = {
      email: userData.email,
      role: userData.role,
      fullName: userData.fullName,
      status: userData.status || 'Active',
      createdAt: serverTimestamp(),
      lastLogin: null,
      profileImage: userData.profileImage || ''
    };

    // Add role-specific data
    if (userData.role === 'student') {
      firestoreData.studentData = {
        indexNumber: userData.indexNumber,
        admissionNo: userData.admissionNo || `ST${Date.now()}`,
        grade: userData.grade,
        class: userData.class,
        className: userData.class,
        stream: userData.stream || null,
        level: parseInt(userData.grade) >= 12 ? 'A/L' : 'O/L',
        gender: userData.gender,
        birthday: userData.birthday,
        admissionDate: userData.admissionDate,
        address: userData.address,
        contactNumber: userData.contactNumber,
        guardianName: userData.guardianName,
        guardianContact: userData.guardianContact,
        attendance: 0,
        overallGrade: 'N/A',
        gpa: 0
      };
    } else if (userData.role === 'teacher') {
      firestoreData.title = userData.title;
      firestoreData.subjects = userData.subjects || [];
      firestoreData.classes = userData.classes || [];
      firestoreData.teacherIndex = userData.teacherIndex;
      firestoreData.teacherData = {
        title: userData.title,
        teacherIndex: userData.teacherIndex,
        subjects: userData.subjects || [],
        teachingClasses: userData.classes || [],
        inCharge: userData.inCharge || { type: '', details: '' },
        experience: userData.experience || '0 years',
        availability: userData.availability || 'Mon-Fri 8AM-3PM'
      };
    } else if (userData.role === 'parent') {
      firestoreData.title = userData.title;
      firestoreData.children = userData.children || [];
      firestoreData.parentData = {
        title: userData.title,
        children: userData.children || [],
        relationship: userData.relationship,
        maritalStatus: userData.maritalStatus,
        birthday: userData.birthday,
        telephone: userData.telephone,
        mobile: userData.mobile
      };
    }

    // Save to Firestore
    await setDoc(doc(db, 'users', userId), firestoreData);

    console.log('User created successfully:', userId);

    return {
      success: true,
      userId: userId,
      userData: firestoreData
    };

  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Update user data
 * @param {string} userId - User ID
 * @param {Object} updates - Data to update
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (userId, updates) => {
  try {
    console.log('Updating user:', userId);

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentData = userDoc.data();
    
    // Prepare update data
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    // Update role-specific nested data
    if (currentData.role === 'student' && updates.studentData) {
      updateData.studentData = {
        ...currentData.studentData,
        ...updates.studentData
      };
    } else if (currentData.role === 'teacher' && updates.teacherData) {
      updateData.teacherData = {
        ...currentData.teacherData,
        ...updates.teacherData
      };
      // Also update top-level fields
      if (updates.subjects) updateData.subjects = updates.subjects;
      if (updates.classes) updateData.classes = updates.classes;
      if (updates.teacherIndex) updateData.teacherIndex = updates.teacherIndex;
    } else if (currentData.role === 'parent' && updates.parentData) {
      updateData.parentData = {
        ...currentData.parentData,
        ...updates.parentData
      };
      if (updates.children) updateData.children = updates.children;
    }

    await updateDoc(userRef, updateData);

    console.log('User updated successfully');

    return {
      success: true,
      userId: userId,
      updates: updateData
    };

  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Success response
 */
export const deleteUser = async (userId) => {
  try {
    console.log('Deleting user:', userId);

    // Delete from Firestore
    await deleteDoc(doc(db, 'users', userId));

    console.log('User deleted successfully from Firestore');

    return {
      success: true,
      message: 'User deleted successfully'
    };

  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Toggle user status (Active/Inactive)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated status
 */
export const toggleUserStatus = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentStatus = userDoc.data().status;
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    await updateDoc(userRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      newStatus: newStatus
    };

  } catch (error) {
    console.error('Error toggling user status:', error);
    throw new Error(`Failed to toggle user status: ${error.message}`);
  }
};

// ==================== COURSE MANAGEMENT ====================

/**
 * Get all courses with optional filtering
 * @param {Object} filters - Filter options (level, status, searchQuery)
 * @returns {Promise<Array>} Array of courses
 */
export const getAllCourses = async (filters = {}) => {
  try {
    const coursesRef = collection(db, 'courses');
    let q = query(coursesRef);

    // Apply level filter
    if (filters.level && filters.level !== 'all') {
      q = query(coursesRef, where('level', '==', filters.level));
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }

    const snapshot = await getDocs(q);
    let courses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply search filter (client-side)
    if (filters.searchQuery) {
      const search = filters.searchQuery.toLowerCase();
      courses = courses.filter(course => 
        course.courseName?.toLowerCase().includes(search) ||
        course.courseCode?.toLowerCase().includes(search) ||
        course.teacher?.toLowerCase().includes(search) ||
        course.subject?.toLowerCase().includes(search)
      );
    }

    return courses;
  } catch (error) {
    console.error('Error getting all courses:', error);
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
};

/**
 * Get course by ID
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} Course data
 */
export const getCourseById = async (courseId) => {
  try {
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }

    return {
      id: courseDoc.id,
      ...courseDoc.data()
    };
  } catch (error) {
    console.error('Error getting course by ID:', error);
    throw new Error(`Failed to fetch course: ${error.message}`);
  }
};

/**
 * Create a new course
 * @param {Object} courseData - Course data
 * @returns {Promise<Object>} Created course
 */
export const createCourse = async (courseData) => {
  try {
    console.log('Creating course:', courseData.courseName);

    const courseRef = doc(collection(db, 'courses'));
    
    const newCourse = {
      courseCode: courseData.courseCode,
      courseName: courseData.courseName,
      subject: courseData.subject,
      level: courseData.level,
      grade: courseData.grade,
      teacher: courseData.teacher,
      teacherId: courseData.teacherId || null,
      schedule: courseData.schedule || {
        day: '',
        time: '',
        duration: ''
      },
      classroom: courseData.classroom || '',
      capacity: courseData.capacity || 0,
      enrolledStudents: courseData.enrolledStudents || 0,
      status: courseData.status || 'Active',
      description: courseData.description || '',
      syllabus: courseData.syllabus || [],
      resources: courseData.resources || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(courseRef, newCourse);

    console.log('Course created successfully:', courseRef.id);

    return {
      success: true,
      courseId: courseRef.id,
      courseData: newCourse
    };

  } catch (error) {
    console.error('Error creating course:', error);
    throw new Error(`Failed to create course: ${error.message}`);
  }
};

/**
 * Update course data
 * @param {string} courseId - Course ID
 * @param {Object} updates - Data to update
 * @returns {Promise<Object>} Updated course
 */
export const updateCourse = async (courseId, updates) => {
  try {
    console.log('Updating course:', courseId);

    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);

    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    await updateDoc(courseRef, updateData);

    console.log('Course updated successfully');

    return {
      success: true,
      courseId: courseId,
      updates: updateData
    };

  } catch (error) {
    console.error('Error updating course:', error);
    throw new Error(`Failed to update course: ${error.message}`);
  }
};

/**
 * Delete course
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} Success response
 */
export const deleteCourse = async (courseId) => {
  try {
    console.log('Deleting course:', courseId);

    await deleteDoc(doc(db, 'courses', courseId));

    console.log('Course deleted successfully');

    return {
      success: true,
      message: 'Course deleted successfully'
    };

  } catch (error) {
    console.error('Error deleting course:', error);
    throw new Error(`Failed to delete course: ${error.message}`);
  }
};

/**
 * Enroll student in course
 * @param {string} courseId - Course ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Object>} Success response
 */
export const enrollStudent = async (courseId, studentId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);

    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }

    const courseData = courseDoc.data();
    const currentEnrolled = courseData.enrolledStudents || 0;

    await updateDoc(courseRef, {
      enrolledStudents: currentEnrolled + 1,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      message: 'Student enrolled successfully'
    };

  } catch (error) {
    console.error('Error enrolling student:', error);
    throw new Error(`Failed to enroll student: ${error.message}`);
  }
};

/**
 * Get courses by teacher
 * @param {string} teacherId - Teacher ID
 * @returns {Promise<Array>} Array of courses
 */
export const getCoursesByTeacher = async (teacherId) => {
  try {
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, where('teacherId', '==', teacherId));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error('Error getting courses by teacher:', error);
    throw new Error(`Failed to fetch teacher courses: ${error.message}`);
  }
};

/**
 * Get courses by level
 * @param {string} level - Level (O/L or A/L)
 * @returns {Promise<Array>} Array of courses
 */
export const getCoursesByLevel = async (level) => {
  try {
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, where('level', '==', level));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error('Error getting courses by level:', error);
    throw new Error(`Failed to fetch level courses: ${error.message}`);
  }
};

/**
 * Bulk update courses
 * @param {Array} updates - Array of {courseId, data} objects
 * @returns {Promise<Object>} Success response
 */
export const bulkUpdateCourses = async (updates) => {
  try {
    const batch = writeBatch(db);

    updates.forEach(({ courseId, data }) => {
      const courseRef = doc(db, 'courses', courseId);
      batch.update(courseRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    });

    await batch.commit();

    return {
      success: true,
      message: `${updates.length} courses updated successfully`
    };

  } catch (error) {
    console.error('Error bulk updating courses:', error);
    throw new Error(`Failed to bulk update courses: ${error.message}`);
  }
};

/**
 * Get course statistics
 * @returns {Promise<Object>} Course statistics
 */
export const getCourseStatistics = async () => {
  try {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    const courses = coursesSnapshot.docs.map(doc => doc.data());

    const stats = {
      totalCourses: courses.length,
      activeCourses: courses.filter(c => c.status === 'Active').length,
      inactiveCourses: courses.filter(c => c.status === 'Inactive').length,
      totalEnrolledStudents: courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0),
      averageEnrollment: courses.length > 0 
        ? Math.round(courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0) / courses.length)
        : 0,
      coursesByLevel: {
        'O/L': courses.filter(c => c.level === 'O/L').length,
        'A/L': courses.filter(c => c.level === 'A/L').length
      }
    };

    return stats;

  } catch (error) {
    console.error('Error getting course statistics:', error);
    throw new Error(`Failed to fetch course statistics: ${error.message}`);
  }
};

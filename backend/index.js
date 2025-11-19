// Backend Services Export
// Central export point for all backend services

// Firebase Configuration
export { auth, db, storage } from './firebase/config.js';

// Authentication Services
export {
  registerStudent,
  registerTeacher,
  registerParent,
  loginUser,
  logoutUser,
  resetPassword,
  getCurrentUser,
  onAuthStateChange,
  isUserActive
} from './services/authService.js';

// User Management Services
export {
  getUserById,
  getUserByEmail,
  getUsersByRole,
  getAllStudents,
  getAllTeachers,
  getAllParents,
  updateUserProfile,
  updateStudentData,
  updateTeacherData,
  updateParentData,
  updateUserEmail,
  updateUserPassword,
  uploadProfileImage,
  toggleUserStatus,
  deactivateUser,
  activateUser,
  getStudentsByClass,
  getStudentsByLevel,
  getTeachersBySubject,
  getParentByStudentId,
  linkChildToParent
} from './services/userService.js';

// Database Initialization
export {
  initializeCollections,
  initializeSubjects,
  initializeSchoolSettings,
  createSampleData,
  initializeDatabase
} from './services/dbInitService.js';

// Admin Services - User & Course Management
export {
  getAllUsers,
  getUserById as getAdminUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus as adminToggleUserStatus,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  getCoursesByTeacher,
  getCoursesByLevel,
  bulkUpdateCourses,
  getCourseStatistics
} from './services/adminService.js';

// Validation Utilities
export {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateIndexNumber,
  validateGrade,
  validateRequiredFields,
  sanitizeInput,
  formatDate,
  calculateAge,
  generateUniqueId
} from './utils/validation.js';

// Error Handling
export {
  getErrorMessage,
  handleError,
  validateOrThrow,
  createError,
  isAuthError,
  isPermissionError,
  isNetworkError
} from './utils/errorHandler.js';

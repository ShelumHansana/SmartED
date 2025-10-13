// Application Constants

// User Roles
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  PARENT: 'parent',
  ADMIN: 'admin'
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SIGNUP: '/signup',
  STUDENT_DASHBOARD: '/student-dashboard',
  TEACHER_DASHBOARD: '/teacher-dashboard',
  PARENT_DASHBOARD: '/parent-dashboard',
  ADMIN_DASHBOARD: '/admin-dashboard'
};

// Grade Levels
export const GRADES = {
  OL: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
  AL: ['12', '13']
};

// A/L Streams
export const STREAMS = {
  PHYSICAL_SCIENCE: 'Physical Science',
  BIO_SCIENCE: 'Bio Science',
  COMMERCE: 'Commerce',
  ARTS: 'Arts',
  TECHNOLOGY: 'Technology'
};

// Assessment Types
export const ASSESSMENT_TYPES = {
  TERM_TEST: 'term-test',
  MONTHLY_TEST: 'monthly-test',
  MODEL_PAPER: 'model-paper',
  PRACTICAL: 'practical',
  ASSIGNMENT: 'assignment',
  PROJECT: 'project'
};

// Status Types
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  SUBMITTED: 'submitted',
  GRADED: 'graded'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ANNOUNCEMENT: 'announcement',
  GRADE_UPDATE: 'grade_update',
  ASSIGNMENT: 'assignment',
  MESSAGE: 'message',
  REMINDER: 'reminder',
  ACHIEVEMENT: 'achievement'
};

// File Upload Limits
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_PROFILE_IMAGE_SIZE: 2 * 1024 * 1024 // 2MB
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'This email is already registered.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
  UPLOAD_SUCCESS: 'File uploaded successfully!',
  SAVE_SUCCESS: 'Saved successfully!'
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'smarted_user',
  TOKEN: 'smarted_token',
  THEME: 'smarted_theme',
  LANGUAGE: 'smarted_language'
};

export default {
  ROLES,
  ROUTES,
  GRADES,
  STREAMS,
  ASSESSMENT_TYPES,
  STATUS,
  NOTIFICATION_TYPES,
  FILE_LIMITS,
  PAGINATION,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_STATES,
  STORAGE_KEYS
};

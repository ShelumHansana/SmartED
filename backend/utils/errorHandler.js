// Error Handler Utility
// Centralized error handling and user-friendly error messages

/**
 * Firebase error code to user-friendly message mapping
 */
const ERROR_MESSAGES = {
  // Authentication errors
  'auth/email-already-in-use': 'This email address is already registered. Please use a different email or try logging in.',
  'auth/invalid-email': 'Invalid email address format. Please check and try again.',
  'auth/operation-not-allowed': 'This operation is not allowed. Please contact system administrator.',
  'auth/weak-password': 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.',
  'auth/user-disabled': 'This account has been disabled. Please contact administrator for assistance.',
  'auth/user-not-found': 'No account found with this email address. Please check your email or register.',
  'auth/wrong-password': 'Incorrect password. Please try again or use "Forgot Password" to reset.',
  'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later or reset your password.',
  'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/requires-recent-login': 'This operation requires recent authentication. Please log out and log in again.',
  
  // Firestore errors
  'permission-denied': 'You do not have permission to perform this action.',
  'not-found': 'The requested data was not found.',
  'already-exists': 'This record already exists in the database.',
  'resource-exhausted': 'Too many requests. Please try again later.',
  'failed-precondition': 'Operation cannot be performed in the current state.',
  'aborted': 'Operation was aborted. Please try again.',
  'out-of-range': 'Operation was attempted past the valid range.',
  'unimplemented': 'This feature is not yet implemented.',
  'internal': 'Internal server error. Please try again later.',
  'unavailable': 'Service is currently unavailable. Please try again later.',
  'data-loss': 'Data loss or corruption detected. Please contact support.',
  
  // Storage errors
  'storage/unauthorized': 'You are not authorized to upload files.',
  'storage/canceled': 'File upload was canceled.',
  'storage/unknown': 'An unknown error occurred during file upload.',
  'storage/object-not-found': 'File not found.',
  'storage/bucket-not-found': 'Storage bucket not configured.',
  'storage/quota-exceeded': 'Storage quota exceeded.',
  'storage/unauthenticated': 'Please log in to upload files.',
  'storage/retry-limit-exceeded': 'Upload retry limit exceeded. Please try again later.',
  'storage/invalid-checksum': 'File upload failed verification. Please try again.',
  'storage/canceled': 'File upload was canceled.',
  
  // Custom application errors
  'invalid-student-data': 'Invalid student information provided.',
  'invalid-teacher-data': 'Invalid teacher information provided.',
  'invalid-parent-data': 'Invalid parent information provided.',
  'student-not-found': 'Student not found in the system.',
  'teacher-not-found': 'Teacher not found in the system.',
  'parent-not-found': 'Parent not found in the system.',
  'course-not-found': 'Course not found in the system.',
  'invalid-grade': 'Invalid grade value provided.',
  'invalid-class': 'Invalid class selection.',
  'missing-required-fields': 'Please fill in all required fields.',
  'duplicate-entry': 'This entry already exists in the system.',
  'link-expired': 'This link has expired. Please request a new one.',
  'session-expired': 'Your session has expired. Please log in again.'
};

/**
 * Get user-friendly error message
 * @param {Error|string} error - Error object or error code
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error;
  }

  if (error && error.code) {
    return ERROR_MESSAGES[error.code] || error.message || 'An unexpected error occurred.';
  }

  if (error && error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Handle and log errors
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Error details
 */
export const handleError = (error, context = 'Unknown') => {
  // Log error for debugging
  console.error(`Error in ${context}:`, error);

  // Get user-friendly message
  const message = getErrorMessage(error);

  // Return structured error object
  return {
    success: false,
    error: {
      code: error.code || 'unknown',
      message: message,
      context: context,
      timestamp: new Date().toISOString()
    }
  };
};

/**
 * Validate and throw custom error
 * @param {boolean} condition - Condition to check
 * @param {string} errorCode - Error code
 * @param {string} customMessage - Custom error message (optional)
 * @throws {Error} Throws error if condition is false
 */
export const validateOrThrow = (condition, errorCode, customMessage = null) => {
  if (!condition) {
    const error = new Error(customMessage || ERROR_MESSAGES[errorCode] || 'Validation failed');
    error.code = errorCode;
    throw error;
  }
};

/**
 * Create custom error
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @returns {Error} Custom error object
 */
export const createError = (code, message = null) => {
  const error = new Error(message || ERROR_MESSAGES[code] || 'An error occurred');
  error.code = code;
  return error;
};

/**
 * Check if error is authentication related
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error && error.code && error.code.startsWith('auth/');
};

/**
 * Check if error is permission related
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isPermissionError = (error) => {
  return error && (
    error.code === 'permission-denied' ||
    error.code === 'auth/unauthorized'
  );
};

/**
 * Check if error is network related
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return error && (
    error.code === 'auth/network-request-failed' ||
    error.code === 'unavailable' ||
    error.message.toLowerCase().includes('network')
  );
};

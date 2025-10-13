// Validation Utilities
// Helper functions for data validation

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      errors: ['Password must be at least 6 characters long'],
      message: 'Password must be at least 6 characters long'
    };
  }

  if (password.length < 8) {
    return {
      isValid: true,
      message: 'Password is acceptable but consider using 8+ characters',
      strength: 'weak'
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
    .filter(Boolean).length;

  if (strengthScore >= 3) {
    return {
      isValid: true,
      message: 'Strong password',
      strength: 'strong'
    };
  } else if (strengthScore >= 2) {
    return {
      isValid: true,
      message: 'Medium strength password',
      strength: 'medium'
    };
  } else {
    return {
      isValid: true,
      message: 'Weak password - consider adding uppercase, numbers, or special characters',
      strength: 'weak'
    };
  }
};

/**
 * Validate phone number (Sri Lankan format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const validatePhoneNumber = (phone) => {
  // Sri Lankan phone formats: +94771234567, 0771234567, 771234567
  const phoneRegex = /^(\+94|0)?[1-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate index number format
 * @param {string} indexNumber - Index number to validate
 * @returns {boolean}
 */
export const validateIndexNumber = (indexNumber) => {
  // Basic validation - adjust based on your school's format
  return indexNumber && indexNumber.length >= 5;
};

/**
 * Validate grade (1-13)
 * @param {string|number} grade - Grade to validate
 * @returns {boolean}
 */
export const validateGrade = (grade) => {
  const gradeNum = parseInt(grade);
  return gradeNum >= 1 && gradeNum <= 13;
};

/**
 * Validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];

  for (const field of requiredFields) {
    if (!data[field] || data[field] === '') {
      missingFields.push(field);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    message: missingFields.length > 0
      ? `Missing required fields: ${missingFields.join(', ')}`
      : 'All required fields are present'
  };
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate age from birthday
 * @param {Object} birthday - Birthday object {day, month, year}
 * @returns {number} Age in years
 */
export const calculateAge = (birthday) => {
  if (!birthday || !birthday.year) return 0;
  
  const today = new Date();
  const birthDate = new Date(birthday.year, birthday.month - 1, birthday.day);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}${random}`;
};

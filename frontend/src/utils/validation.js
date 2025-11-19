// Validation Utilities for SmartED

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  if (!email) return false;
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
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  // Accept phone numbers with 10 digits (with or without country code)
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
};

/**
 * Validate index number format
 * @param {string} indexNumber - Index number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateIndexNumber = (indexNumber) => {
  if (!indexNumber) return false;
  // Accept alphanumeric index numbers
  return indexNumber.length >= 3;
};

/**
 * Validate grade/class
 * @param {string} grade - Grade to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateGrade = (grade) => {
  if (!grade) return false;
  return grade.trim().length > 0;
};

/**
 * Validate required fields
 * @param {object} fields - Object with field names and values
 * @returns {object} - Object with validation results
 */
export const validateRequiredFields = (fields) => {
  const errors = {};
  Object.keys(fields).forEach(key => {
    if (!fields[key] || (typeof fields[key] === 'string' && fields[key].trim() === '')) {
      errors[key] = `${key} is required`;
    }
  });
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Calculate age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} - Age in years
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
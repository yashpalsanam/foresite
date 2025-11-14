import { VALIDATION_RULES } from './constants';

/**
 * Validation Utilities
 * Functions for validating and sanitizing user input
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return VALIDATION_RULES.EMAIL.pattern.test(email.trim());
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return VALIDATION_RULES.PHONE.pattern.test(phone.trim());
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if within range
 */
export const isValidLength = (value, minLength, maxLength) => {
  if (!value || typeof value !== 'string') return false;
  const length = value.trim().length;
  return length >= minLength && length <= maxLength;
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {object} Validation result with isValid and message
 */
export const validateName = (name) => {
  if (!isRequired(name)) {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (!isValidLength(name, VALIDATION_RULES.NAME.minLength, VALIDATION_RULES.NAME.maxLength)) {
    return { isValid: false, message: VALIDATION_RULES.NAME.message };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate email with detailed response
 * @param {string} email - Email to validate
 * @returns {object} Validation result with isValid and message
 */
export const validateEmail = (email) => {
  if (!isRequired(email)) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!isValidEmail(email)) {
    return { isValid: false, message: VALIDATION_RULES.EMAIL.message };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate phone with detailed response
 * @param {string} phone - Phone to validate
 * @returns {object} Validation result with isValid and message
 */
export const validatePhone = (phone) => {
  if (!isRequired(phone)) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  if (!isValidPhone(phone)) {
    return { isValid: false, message: VALIDATION_RULES.PHONE.message };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate message/textarea
 * @param {string} message - Message to validate
 * @returns {object} Validation result with isValid and message
 */
export const validateMessage = (message) => {
  if (!isRequired(message)) {
    return { isValid: false, message: 'Message is required' };
  }
  
  if (!isValidLength(message, VALIDATION_RULES.MESSAGE.minLength, VALIDATION_RULES.MESSAGE.maxLength)) {
    return { isValid: false, message: VALIDATION_RULES.MESSAGE.message };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 8)
 * @returns {object} Validation result with strength level and requirements
 */
export const validatePassword = (password, minLength = 8) => {
  const result = {
    isValid: false,
    strength: 'weak',
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
    message: '',
  };
  
  if (!password) {
    result.message = 'Password is required';
    return result;
  }
  
  // Check requirements
  result.requirements.length = password.length >= minLength;
  result.requirements.uppercase = /[A-Z]/.test(password);
  result.requirements.lowercase = /[a-z]/.test(password);
  result.requirements.number = /[0-9]/.test(password);
  result.requirements.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // Calculate strength
  const metRequirements = Object.values(result.requirements).filter(Boolean).length;
  
  if (metRequirements < 3) {
    result.strength = 'weak';
    result.message = 'Password is too weak';
  } else if (metRequirements === 3 || metRequirements === 4) {
    result.strength = 'medium';
    result.isValid = true;
    result.message = 'Password strength is acceptable';
  } else {
    result.strength = 'strong';
    result.isValid = true;
    result.message = 'Password is strong';
  }
  
  return result;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate numeric input
 * @param {any} value - Value to validate
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {boolean} True if valid number
 */
export const isValidNumber = (value, min = null, max = null) => {
  const num = Number(value);
  
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  
  return true;
};

/**
 * Sanitize string input (remove HTML tags and trim)
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  return sanitized;
};

/**
 * Sanitize email
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

/**
 * Sanitize phone number (remove non-numeric characters except +)
 * @param {string} phone - Phone to sanitize
 * @returns {string} Sanitized phone
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^\d+\-\s()]/g, '').trim();
};

/**
 * Validate contact form
 * @param {object} formData - Form data object
 * @returns {object} Validation result with errors
 */
export const validateContactForm = (formData) => {
  const errors = {};
  
  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  // Validate phone (optional)
  if (formData.phone) {
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message;
    }
  }
  
  // Validate message
  const messageValidation = validateMessage(formData.message);
  if (!messageValidation.isValid) {
    errors.message = messageValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate inquiry form
 * @param {object} formData - Form data object
 * @returns {object} Validation result with errors
 */
export const validateInquiryForm = (formData) => {
  const errors = {};
  
  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  // Validate phone
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.message;
  }
  
  // Validate inquiry type
  if (!formData.inquiryType) {
    errors.inquiryType = 'Please select an inquiry type';
  }
  
  // Validate message (optional for inquiry)
  if (formData.message) {
    const messageValidation = validateMessage(formData.message);
    if (!messageValidation.isValid) {
      errors.message = messageValidation.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Check if value is empty
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {object} Validation result
 */
export const validateFile = (file, allowedTypes, maxSize) => {
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'File type not allowed' };
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return { isValid: false, message: `File size exceeds ${maxSizeMB}MB` };
  }
  
  return { isValid: true, message: '' };
};

export default {
  isValidEmail,
  isValidPhone,
  isRequired,
  isValidLength,
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  validatePassword,
  isValidUrl,
  isValidNumber,
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  validateContactForm,
  validateInquiryForm,
  isEmpty,
  escapeHtml,
  validateFile,
};

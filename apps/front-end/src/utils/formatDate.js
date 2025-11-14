import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';
import { DATE_FORMAT } from './constants';

/**
 * Date Formatting Utilities
 * Using date-fns for consistent date formatting
 */

/**
 * Format date to specified format
 * @param {Date|string} date - Date to format
 * @param {string} formatString - Format string (from constants or custom)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = DATE_FORMAT.FULL) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format date to full format (e.g., "January 15, 2024")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateFull = (date) => {
  return formatDate(date, DATE_FORMAT.FULL);
};

/**
 * Format date to short format (e.g., "Jan 15, 2024")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (date) => {
  return formatDate(date, DATE_FORMAT.SHORT);
};

/**
 * Format date to numeric format (e.g., "01/15/2024")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateNumeric = (date) => {
  return formatDate(date, DATE_FORMAT.NUMERIC);
};

/**
 * Format date and time (e.g., "Jan 15, 2024 14:30")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date) => {
  return formatDate(date, DATE_FORMAT.DATETIME);
};

/**
 * Format time only (e.g., "14:30")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  return formatDate(date, DATE_FORMAT.TIME);
};

/**
 * Format date relative to now (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative date string
 */
export const formatRelativeDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
};

/**
 * Format date in relative context (e.g., "yesterday at 2:30 PM")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative context date string
 */
export const formatRelativeContext = (date) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    return formatRelative(dateObj, new Date());
  } catch (error) {
    console.error('Error formatting relative context date:', error);
    return 'Invalid date';
  }
};

/**
 * Get time ago text (e.g., "Posted 2 days ago")
 * @param {Date|string} date - Date to format
 * @param {string} prefix - Prefix text
 * @returns {string} Time ago string with prefix
 */
export const getTimeAgo = (date, prefix = 'Posted') => {
  const relative = formatRelativeDate(date);
  return `${prefix} ${relative}`;
};

/**
 * Format property listing date
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted listing date
 */
export const formatListingDate = (date) => {
  if (!date) return 'Date not available';
  
  const now = new Date();
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Listed today';
  if (diffInDays === 1) return 'Listed yesterday';
  if (diffInDays < 7) return `Listed ${diffInDays} days ago`;
  if (diffInDays < 30) return `Listed ${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `Listed ${Math.floor(diffInDays / 30)} months ago`;
  
  return `Listed ${formatDateShort(date)}`;
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPast = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
};

/**
 * Check if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFuture = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj > new Date();
};

/**
 * Get date range text (e.g., "Jan 1 - Jan 7, 2024")
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  const start = formatDateShort(startDate);
  const end = formatDateShort(endDate);
  
  return `${start} - ${end}`;
};

/**
 * Parse date string to Date object
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isValid(date) ? date : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Get current timestamp in ISO format
 * @returns {string} Current timestamp
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format availability date for properties
 * @param {Date|string} date - Availability date
 * @returns {string} Formatted availability text
 */
export const formatAvailability = (date) => {
  if (!date) return 'Available immediately';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isPast(dateObj)) {
    return 'Available now';
  }
  
  if (isToday(dateObj)) {
    return 'Available today';
  }
  
  return `Available from ${formatDateShort(date)}`;
};

/**
 * Calculate days between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number} Number of days
 */
export const daysBetween = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format business hours
 * @param {string} openTime - Opening time (e.g., "09:00")
 * @param {string} closeTime - Closing time (e.g., "17:00")
 * @returns {string} Formatted business hours
 */
export const formatBusinessHours = (openTime, closeTime) => {
  if (!openTime || !closeTime) return 'Hours not available';
  
  try {
    const open = format(parseISO(`2000-01-01T${openTime}`), 'h:mm a');
    const close = format(parseISO(`2000-01-01T${closeTime}`), 'h:mm a');
    return `${open} - ${close}`;
  } catch (error) {
    return 'Hours not available';
  }
};

export default {
  formatDate,
  formatDateFull,
  formatDateShort,
  formatDateNumeric,
  formatDateTime,
  formatTime,
  formatRelativeDate,
  formatRelativeContext,
  getTimeAgo,
  formatListingDate,
  isToday,
  isPast,
  isFuture,
  formatDateRange,
  parseDate,
  getCurrentTimestamp,
  formatAvailability,
  daysBetween,
  formatBusinessHours,
};

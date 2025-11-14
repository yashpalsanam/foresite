/**
 * Application Constants
 * Centralized constants for the Foresite Real Estate website
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
};

// Site Configuration
export const SITE_CONFIG = {
  NAME: 'Foresite Real Estate',
  TAGLINE: 'Find Your Perfect Property',
  DESCRIPTION: 'Discover your dream home with Foresite Real Estate. Browse luxury properties, apartments, and commercial spaces.',
  URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://foresite.com',
  CONTACT_EMAIL: 'info@foresite.com',
  CONTACT_PHONE: '+1 (555) 123-4567',
  SOCIAL: {
    FACEBOOK: 'https://facebook.com/foresite',
    TWITTER: 'https://twitter.com/foresite',
    INSTAGRAM: 'https://instagram.com/foresite',
    LINKEDIN: 'https://linkedin.com/company/foresite',
    YOUTUBE: 'https://youtube.com/foresite',
  },
};

// SEO Configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Foresite Real Estate - Find Your Perfect Property',
  TITLE_TEMPLATE: '%s | Foresite Real Estate',
  DEFAULT_DESCRIPTION: 'Discover your dream home with Foresite Real Estate. Browse luxury properties, apartments, and commercial spaces.',
  DEFAULT_KEYWORDS: ['real estate', 'property', 'homes', 'apartments', 'commercial', 'luxury homes'],
  OG_IMAGE: '/images/og-image.jpg',
  TWITTER_HANDLE: '@foresite',
};

// Property Types
export const PROPERTY_TYPES = [
  { value: 'residential', label: 'Residential', icon: '🏠' },
  { value: 'commercial', label: 'Commercial', icon: '🏢' },
  { value: 'apartment', label: 'Apartment', icon: '🏘️' },
  { value: 'villa', label: 'Villa', icon: '🏡' },
  { value: 'land', label: 'Land', icon: '🌳' },
  { value: 'office', label: 'Office', icon: '💼' },
  { value: 'warehouse', label: 'Warehouse', icon: '🏭' },
  { value: 'retail', label: 'Retail', icon: '🛍️' },
];

// Property Status
export const PROPERTY_STATUS = {
  FOR_SALE: 'for-sale',
  FOR_RENT: 'for-rent',
  SOLD: 'sold',
  RENTED: 'rented',
  PENDING: 'pending',
  OFF_MARKET: 'off-market',
};

export const PROPERTY_STATUS_LABELS = {
  [PROPERTY_STATUS.FOR_SALE]: 'For Sale',
  [PROPERTY_STATUS.FOR_RENT]: 'For Rent',
  [PROPERTY_STATUS.SOLD]: 'Sold',
  [PROPERTY_STATUS.RENTED]: 'Rented',
  [PROPERTY_STATUS.PENDING]: 'Pending',
  [PROPERTY_STATUS.OFF_MARKET]: 'Off Market',
};

// Property Features/Amenities
export const PROPERTY_AMENITIES = [
  { value: 'parking', label: 'Parking', icon: '🅿️' },
  { value: 'pool', label: 'Swimming Pool', icon: '🏊' },
  { value: 'gym', label: 'Gym', icon: '💪' },
  { value: 'garden', label: 'Garden', icon: '🌳' },
  { value: 'security', label: '24/7 Security', icon: '🔒' },
  { value: 'elevator', label: 'Elevator', icon: '🛗' },
  { value: 'balcony', label: 'Balcony', icon: '🪟' },
  { value: 'ac', label: 'Air Conditioning', icon: '❄️' },
  { value: 'heating', label: 'Heating', icon: '🔥' },
  { value: 'furnished', label: 'Furnished', icon: '🛋️' },
  { value: 'pet_friendly', label: 'Pet Friendly', icon: '🐕' },
  { value: 'wifi', label: 'WiFi', icon: '📶' },
];

// Price Ranges for Filtering
export const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: null },
  { label: 'Under $100,000', min: 0, max: 100000 },
  { label: '$100,000 - $250,000', min: 100000, max: 250000 },
  { label: '$250,000 - $500,000', min: 250000, max: 500000 },
  { label: '$500,000 - $1,000,000', min: 500000, max: 1000000 },
  { label: '$1,000,000 - $2,000,000', min: 1000000, max: 2000000 },
  { label: 'Over $2,000,000', min: 2000000, max: null },
];

// Bedrooms/Bathrooms Options
export const BEDROOM_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
];

export const BATHROOM_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'area-asc', label: 'Area: Small to Large' },
  { value: 'area-desc', label: 'Area: Large to Small' },
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
};

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  BASE_URL: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`,
};

// Image Transformations
export const IMAGE_TRANSFORMATIONS = {
  THUMBNAIL: 'c_fill,w_300,h_200,q_auto,f_auto',
  CARD: 'c_fill,w_800,h_600,q_auto,f_auto',
  DETAIL: 'c_limit,w_1920,h_1080,q_auto,f_auto',
  HERO: 'c_fill,w_1920,h_1080,q_auto,f_auto',
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  PHONE: {
    pattern: /^[\d\s\-\+\(\)]+$/,
    message: 'Please enter a valid phone number',
  },
  NAME: {
    minLength: 2,
    maxLength: 50,
    message: 'Name must be between 2 and 50 characters',
  },
  MESSAGE: {
    minLength: 10,
    maxLength: 1000,
    message: 'Message must be between 10 and 1000 characters',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  INQUIRY_SENT: 'Your inquiry has been sent successfully!',
  CONTACT_SENT: 'Thank you for contacting us. We will get back to you soon.',
  NEWSLETTER_SUBSCRIBED: 'Successfully subscribed to our newsletter!',
  FAVORITE_ADDED: 'Property added to favorites',
  FAVORITE_REMOVED: 'Property removed from favorites',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recentSearches',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Routes
export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: (id) => `/property/${id}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  SEARCH: '/search',
};

// Animation Durations (in milliseconds)
export const ANIMATION = {
  FAST: 150,
  BASE: 200,
  SLOW: 300,
  VERY_SLOW: 500,
};

// Breakpoints (should match Tailwind config)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Google Maps Configuration
export const MAPS_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  DEFAULT_CENTER: { lat: 25.7617, lng: -80.1918 }, // Miami coordinates
  DEFAULT_ZOOM: 12,
  STYLES: [], // Add custom map styles if needed
};

// Date Format
export const DATE_FORMAT = {
  FULL: 'MMMM dd, yyyy',
  SHORT: 'MMM dd, yyyy',
  NUMERIC: 'MM/dd/yyyy',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
};

// Currency Configuration
export const CURRENCY = {
  CODE: 'USD',
  SYMBOL: '$',
  LOCALE: 'en-US',
};

// Toast Notification Configuration
export const TOAST_CONFIG = {
  POSITION: 'top-right',
  AUTO_CLOSE: 5000,
  HIDE_PROGRESS_BAR: false,
  CLOSE_ON_CLICK: true,
  PAUSE_ON_HOVER: true,
  DRAGGABLE: true,
};

// Inquiry Types
export const INQUIRY_TYPES = [
  { value: 'buy', label: 'I want to buy' },
  { value: 'rent', label: 'I want to rent' },
  { value: 'sell', label: 'I want to sell' },
  { value: 'info', label: 'General inquiry' },
];

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
};

export default {
  API_CONFIG,
  SITE_CONFIG,
  SEO_CONFIG,
  PROPERTY_TYPES,
  PROPERTY_STATUS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_AMENITIES,
  PRICE_RANGES,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  SORT_OPTIONS,
  PAGINATION,
  CLOUDINARY_CONFIG,
  IMAGE_TRANSFORMATIONS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ROUTES,
  ANIMATION,
  BREAKPOINTS,
  MAPS_CONFIG,
  DATE_FORMAT,
  CURRENCY,
  TOAST_CONFIG,
  INQUIRY_TYPES,
  UPLOAD_LIMITS,
};

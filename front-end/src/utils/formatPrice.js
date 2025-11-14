import { CURRENCY } from './constants';

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatPrice = (amount, options = {}) => {
  const {
    currency = CURRENCY.CODE,
    locale = CURRENCY.LOCALE,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    notation = 'standard', // 'standard', 'compact', 'scientific', 'engineering'
  } = options;

  // Handle invalid inputs
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${CURRENCY.SYMBOL}0`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
      notation,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${CURRENCY.SYMBOL}${amount.toLocaleString()}`;
  }
};

/**
 * Format price in compact notation (e.g., $1.2M)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted compact currency string
 */
export const formatPriceCompact = (amount) => {
  return formatPrice(amount, {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
};

/**
 * Format price with cents
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with cents
 */
export const formatPriceWithCents = (amount) => {
  return formatPrice(amount, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format price range
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 * @returns {string} Formatted price range string
 */
export const formatPriceRange = (min, max) => {
  if (!min && !max) return 'Any Price';
  if (!min) return `Up to ${formatPrice(max)}`;
  if (!max) return `${formatPrice(min)}+`;
  return `${formatPrice(min)} - ${formatPrice(max)}`;
};

/**
 * Format area/square footage
 * @param {number} area - Area in square feet
 * @param {string} unit - Unit of measurement (sqft, sqm)
 * @returns {string} Formatted area string
 */
export const formatArea = (area, unit = 'sqft') => {
  if (!area || isNaN(area)) return 'N/A';
  
  const formatted = new Intl.NumberFormat(CURRENCY.LOCALE).format(area);
  const unitLabel = unit === 'sqm' ? 'sq m' : 'sq ft';
  
  return `${formatted} ${unitLabel}`;
};

/**
 * Format number with commas (thousands separator)
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat(CURRENCY.LOCALE).format(number);
};

/**
 * Calculate and format monthly mortgage payment
 * @param {number} price - Property price
 * @param {number} downPayment - Down payment amount
 * @param {number} interestRate - Annual interest rate (e.g., 4.5 for 4.5%)
 * @param {number} years - Loan term in years
 * @returns {string} Formatted monthly payment
 */
export const calculateMortgage = (price, downPayment = 0, interestRate = 4.5, years = 30) => {
  const principal = price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return formatPrice(principal / numberOfPayments);
  }
  
  const monthlyPayment = 
    principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return formatPrice(monthlyPayment);
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Parse price string to number (remove currency symbols and commas)
 * @param {string} priceString - Price string to parse
 * @returns {number} Parsed number
 */
export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  if (!priceString) return 0;
  
  // Remove currency symbols, commas, and whitespace
  const cleaned = priceString.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format price per square foot
 * @param {number} price - Total price
 * @param {number} area - Area in square feet
 * @returns {string} Formatted price per square foot
 */
export const formatPricePerSqFt = (price, area) => {
  if (!price || !area || area === 0) return 'N/A';
  
  const pricePerSqFt = price / area;
  return `${formatPrice(pricePerSqFt)}/sq ft`;
};

/**
 * Abbreviate large numbers (e.g., 1000000 -> 1M)
 * @param {number} number - Number to abbreviate
 * @returns {string} Abbreviated number string
 */
export const abbreviateNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  const abbreviations = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];
  
  for (const abbr of abbreviations) {
    if (Math.abs(number) >= abbr.value) {
      return `${(number / abbr.value).toFixed(1)}${abbr.symbol}`;
    }
  }
  
  return number.toString();
};

/**
 * Format down payment suggestion
 * @param {number} price - Property price
 * @param {number} percentage - Down payment percentage (e.g., 20 for 20%)
 * @returns {string} Formatted down payment
 */
export const formatDownPayment = (price, percentage = 20) => {
  if (!price || isNaN(price)) return formatPrice(0);
  
  const downPayment = (price * percentage) / 100;
  return formatPrice(downPayment);
};

export default {
  formatPrice,
  formatPriceCompact,
  formatPriceWithCents,
  formatPriceRange,
  formatArea,
  formatNumber,
  calculateMortgage,
  formatPercentage,
  parsePrice,
  formatPricePerSqFt,
  abbreviateNumber,
  formatDownPayment,
};

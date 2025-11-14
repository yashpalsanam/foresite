/**
 * Lib Index
 * Barrel exports for server-side utilities
 */

// Property fetching functions
export {
  getProperties,
  getFeaturedProperties,
  searchProperties,
  getPropertyTypes,
  getPropertiesByLocation,
  getPropertyStats,
} from './getProperties';

export {
  getPropertyById,
  getSimilarProperties,
  getAllPropertyIds,
  validatePropertyData,
  propertyExists,
  prefetchProperty,
} from './getPropertyById';

// SEO utilities
export {
  generateMetadata,
  generatePropertyMetadata,
  generatePropertyStructuredData,
  generateBreadcrumbStructuredData,
  generateOrganizationStructuredData,
  generateFAQStructuredData,
  generateSearchActionStructuredData,
  createCanonicalUrl,
  generateSitemapEntry,
} from './seo';

// Email/form utilities
export {
  sendContactEmail,
  sendPropertyInquiry,
  subscribeToNewsletter,
  scheduleViewing,
  subscribeToPriceAlert,
  reportPropertyIssue,
} from './mailer';

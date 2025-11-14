import { SEO_CONFIG, SITE_CONFIG } from '@/utils/constants';

/**
 * Generate SEO metadata for pages
 * @param {object} options - SEO options
 * @returns {object} Next.js metadata object
 */
export const generateMetadata = (options = {}) => {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    noIndex = false,
    canonicalUrl,
  } = options;

  const pageTitle = title 
    ? `${title} | ${SITE_CONFIG.NAME}`
    : SEO_CONFIG.DEFAULT_TITLE;

  const pageDescription = description || SEO_CONFIG.DEFAULT_DESCRIPTION;
  const pageImage = image || `${SITE_CONFIG.URL}${SEO_CONFIG.OG_IMAGE}`;
  const pageUrl = url || SITE_CONFIG.URL;
  const allKeywords = [...SEO_CONFIG.DEFAULT_KEYWORDS, ...keywords];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: allKeywords.join(', '),
    
    // Open Graph
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: SITE_CONFIG.NAME,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.NAME,
        },
      ],
      locale: 'en_US',
      type,
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      site: SEO_CONFIG.TWITTER_HANDLE,
      creator: SEO_CONFIG.TWITTER_HANDLE,
    },
    
    // Robots
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Canonical URL
    alternates: canonicalUrl ? {
      canonical: canonicalUrl,
    } : undefined,
    
    // Additional metadata
    authors: [{ name: SITE_CONFIG.NAME }],
    category: 'Real Estate',
  };
};

/**
 * Generate property page metadata
 * @param {object} property - Property object
 * @returns {object} Metadata for property page
 */
export const generatePropertyMetadata = (property) => {
  if (!property) {
    return generateMetadata({
      title: 'Property Not Found',
      noIndex: true,
    });
  }

  const {
    title,
    description,
    price,
    type,
    bedrooms,
    bathrooms,
    area,
    location,
    images,
    id,
  } = property;

  // Create rich description
  const richDescription = description || 
    `${bedrooms} bedroom, ${bathrooms} bathroom ${type} property in ${location?.city || location?.address || 'prime location'}. ${area ? `${area} sq ft.` : ''} ${price ? `Priced at $${price.toLocaleString()}.` : ''}`;

  // Get primary image
  const primaryImage = images && images.length > 0 
    ? images[0].url || images[0]
    : null;

  // Keywords
  const keywords = [
    type,
    `${bedrooms} bedroom`,
    location?.city,
    location?.state,
    'real estate',
    'property for sale',
    'property for rent',
  ].filter(Boolean);

  return generateMetadata({
    title,
    description: richDescription,
    keywords,
    image: primaryImage,
    url: `${SITE_CONFIG.URL}/property/${id}`,
    type: 'article',
  });
};

/**
 * Generate JSON-LD structured data for property
 * @param {object} property - Property object
 * @returns {object} JSON-LD structured data
 */
export const generatePropertyStructuredData = (property) => {
  if (!property) return null;

  const {
    title,
    description,
    price,
    images,
    location,
    bedrooms,
    bathrooms,
    area,
    id,
  } = property;

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description,
    url: `${SITE_CONFIG.URL}/property/${id}`,
    image: images?.map(img => img.url || img) || [],
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: location?.address,
      addressLocality: location?.city,
      addressRegion: location?.state,
      postalCode: location?.zipCode,
      addressCountry: 'US',
    },
    numberOfRooms: bedrooms,
    numberOfBathroomsTotal: bathrooms,
    floorSize: area ? {
      '@type': 'QuantitativeValue',
      value: area,
      unitCode: 'FTK', // Square foot
    } : undefined,
  };
};

/**
 * Generate breadcrumb structured data
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {object} JSON-LD breadcrumb data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_CONFIG.URL}${crumb.path}`,
    })),
  };
};

/**
 * Generate organization structured data
 * @returns {object} JSON-LD organization data
 */
export const generateOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: SITE_CONFIG.NAME,
    url: SITE_CONFIG.URL,
    logo: `${SITE_CONFIG.URL}/logo.png`,
    description: SITE_CONFIG.DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.CONTACT_PHONE,
      contactType: 'Customer Service',
      email: SITE_CONFIG.CONTACT_EMAIL,
    },
    sameAs: Object.values(SITE_CONFIG.SOCIAL),
  };
};

/**
 * Generate FAQ structured data
 * @param {Array} faqs - Array of FAQ items
 * @returns {object} JSON-LD FAQ data
 */
export const generateFAQStructuredData = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate search action structured data
 * @returns {object} JSON-LD search action data
 */
export const generateSearchActionStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_CONFIG.URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.URL}/properties?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Create canonical URL
 * @param {string} path - Page path
 * @returns {string} Canonical URL
 */
export const createCanonicalUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.URL}${cleanPath}`;
};

/**
 * Generate sitemap entry
 * @param {string} path - Page path
 * @param {object} options - Sitemap options
 * @returns {object} Sitemap entry
 */
export const generateSitemapEntry = (path, options = {}) => {
  const {
    lastmod = new Date().toISOString(),
    changefreq = 'weekly',
    priority = 0.7,
  } = options;

  return {
    url: createCanonicalUrl(path),
    lastmod,
    changefreq,
    priority,
  };
};

export default {
  generateMetadata,
  generatePropertyMetadata,
  generatePropertyStructuredData,
  generateBreadcrumbStructuredData,
  generateOrganizationStructuredData,
  generateFAQStructuredData,
  generateSearchActionStructuredData,
  createCanonicalUrl,
  generateSitemapEntry,
};

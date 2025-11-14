import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SEO_CONFIG, SITE_CONFIG } from '@/utils/constants';

/**
 * SEOHead Component
 * Manages SEO meta tags for pages
 */

const SEOHead = ({
  title,
  description,
  keywords = [],
  image,
  type = 'website',
  noIndex = false,
  canonicalUrl,
  structuredData,
  children,
}) => {
  const router = useRouter();
  
  const pageTitle = title 
    ? `${title} | ${SITE_CONFIG.NAME}`
    : SEO_CONFIG.DEFAULT_TITLE;

  const pageDescription = description || SEO_CONFIG.DEFAULT_DESCRIPTION;
  const pageImage = image || `${SITE_CONFIG.URL}${SEO_CONFIG.OG_IMAGE}`;
  const pageUrl = canonicalUrl || `${SITE_CONFIG.URL}${router.asPath}`;
  const allKeywords = [...SEO_CONFIG.DEFAULT_KEYWORDS, ...keywords];

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={allKeywords.join(', ')} />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={SITE_CONFIG.NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:site" content={SEO_CONFIG.TWITTER_HANDLE} />
      <meta name="twitter:creator" content={SEO_CONFIG.TWITTER_HANDLE} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Additional Meta Tags */}
      <meta name="author" content={SITE_CONFIG.NAME} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#0ea5e9" />
      <meta name="msapplication-TileColor" content="#0ea5e9" />

      {/* Apple Touch Icon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Additional Head Elements */}
      {children}
    </Head>
  );
};

/**
 * Property SEO Head
 * Pre-configured SEO for property pages
 */
export const PropertySEOHead = ({ property }) => {
  if (!property) {
    return <SEOHead title="Property Not Found" noIndex />;
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
  ].filter(Boolean);

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: richDescription,
    url: `${SITE_CONFIG.URL}/property/${id}`,
    image: primaryImage,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: location?.address,
      addressLocality: location?.city,
      addressRegion: location?.state,
      postalCode: location?.zipCode,
      addressCountry: 'US',
    },
  };

  return (
    <SEOHead
      title={title}
      description={richDescription}
      keywords={keywords}
      image={primaryImage}
      type="article"
      structuredData={structuredData}
    />
  );
};

export default SEOHead;

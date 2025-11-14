import { CLOUDINARY_CONFIG, IMAGE_TRANSFORMATIONS } from './constants';

/**
 * Cloudinary Utilities
 * Helper functions for Cloudinary image transformations and URL generation
 */

/**
 * Build Cloudinary URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {string} transformation - Transformation string
 * @returns {string} Complete Cloudinary URL
 */
export const buildCloudinaryUrl = (publicId, transformation = '') => {
  if (!publicId) return '';
  
  const cloudName = CLOUDINARY_CONFIG.CLOUD_NAME;
  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured');
    return publicId; // Return original if not configured
  }
  
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (transformation) {
    return `${baseUrl}/${transformation}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
};

/**
 * Get thumbnail image URL
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Thumbnail URL
 */
export const getThumbnailUrl = (publicId) => {
  return buildCloudinaryUrl(publicId, IMAGE_TRANSFORMATIONS.THUMBNAIL);
};

/**
 * Get card image URL
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Card image URL
 */
export const getCardImageUrl = (publicId) => {
  return buildCloudinaryUrl(publicId, IMAGE_TRANSFORMATIONS.CARD);
};

/**
 * Get detail image URL
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Detail image URL
 */
export const getDetailImageUrl = (publicId) => {
  return buildCloudinaryUrl(publicId, IMAGE_TRANSFORMATIONS.DETAIL);
};

/**
 * Get hero image URL
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Hero image URL
 */
export const getHeroImageUrl = (publicId) => {
  return buildCloudinaryUrl(publicId, IMAGE_TRANSFORMATIONS.HERO);
};

/**
 * Build custom transformation URL
 * @param {string} publicId - Cloudinary public ID
 * @param {object} options - Transformation options
 * @returns {string} Custom transformation URL
 */
export const buildCustomUrl = (publicId, options = {}) => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity,
    effect,
    radius,
    overlay,
  } = options;
  
  const transformations = [];
  
  if (crop) transformations.push(`c_${crop}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (effect) transformations.push(`e_${effect}`);
  if (radius) transformations.push(`r_${radius}`);
  if (overlay) transformations.push(`l_${overlay}`);
  
  const transformation = transformations.join(',');
  return buildCloudinaryUrl(publicId, transformation);
};

/**
 * Get responsive image URLs (srcSet)
 * @param {string} publicId - Cloudinary public ID
 * @param {Array} sizes - Array of width sizes
 * @returns {string} srcSet string for responsive images
 */
export const getResponsiveSrcSet = (publicId, sizes = [320, 640, 960, 1280, 1920]) => {
  if (!publicId) return '';
  
  return sizes
    .map((size) => {
      const url = buildCustomUrl(publicId, { width: size, quality: 'auto', format: 'auto' });
      return `${url} ${size}w`;
    })
    .join(', ');
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Full Cloudinary URL
 * @returns {string} Public ID
 */
export const extractPublicId = (url) => {
  if (!url) return '';
  
  try {
    // Match pattern: https://res.cloudinary.com/{cloud_name}/image/upload/[transformations]/{public_id}
    const regex = /\/image\/upload\/(?:v\d+\/)?(?:[^\/]+\/)*(.+)$/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      // Remove file extension
      return match[1].replace(/\.[^.]+$/, '');
    }
    
    return url;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return url;
  }
};

/**
 * Get optimized image for Next.js Image component
 * @param {string} publicId - Cloudinary public ID
 * @param {number} width - Desired width
 * @param {number} quality - Image quality (1-100)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, width, quality = 85) => {
  return buildCustomUrl(publicId, {
    width,
    quality,
    format: 'auto',
    crop: 'limit',
  });
};

/**
 * Apply blur effect (for loading placeholders)
 * @param {string} publicId - Cloudinary public ID
 * @param {number} strength - Blur strength (1-2000)
 * @returns {string} Blurred image URL
 */
export const getBlurredImageUrl = (publicId, strength = 100) => {
  return buildCustomUrl(publicId, {
    effect: `blur:${strength}`,
    quality: 'auto',
    format: 'auto',
    width: 50, // Small size for placeholder
  });
};

/**
 * Apply grayscale effect
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Grayscale image URL
 */
export const getGrayscaleImageUrl = (publicId) => {
  return buildCustomUrl(publicId, {
    effect: 'grayscale',
    quality: 'auto',
    format: 'auto',
  });
};

/**
 * Get image with rounded corners
 * @param {string} publicId - Cloudinary public ID
 * @param {number} radius - Corner radius in pixels (or 'max' for circle)
 * @returns {string} Rounded image URL
 */
export const getRoundedImageUrl = (publicId, radius = 20) => {
  return buildCustomUrl(publicId, {
    radius,
    quality: 'auto',
    format: 'auto',
  });
};

/**
 * Get image with watermark overlay
 * @param {string} publicId - Cloudinary public ID
 * @param {string} watermarkId - Watermark public ID
 * @param {object} options - Watermark position options
 * @returns {string} Watermarked image URL
 */
export const getWatermarkedImageUrl = (publicId, watermarkId, options = {}) => {
  const { gravity = 'south_east', opacity = 50, width = 100 } = options;
  
  return buildCustomUrl(publicId, {
    overlay: watermarkId,
    gravity,
    quality: 'auto',
    format: 'auto',
  });
};

/**
 * Cloudinary loader for Next.js Image component
 * @param {object} params - Loader parameters
 * @returns {string} Image URL
 */
export const cloudinaryLoader = ({ src, width, quality }) => {
  // If src is already a full URL, extract public ID
  const publicId = src.startsWith('http') ? extractPublicId(src) : src;
  
  return getOptimizedImageUrl(publicId, width, quality || 85);
};

/**
 * Check if URL is a Cloudinary URL
 * @param {string} url - URL to check
 * @returns {boolean} True if Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  if (!url) return false;
  return url.includes('res.cloudinary.com');
};

/**
 * Get placeholder image URL (low quality for loading)
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Placeholder URL
 */
export const getPlaceholderUrl = (publicId) => {
  return buildCustomUrl(publicId, {
    width: 50,
    quality: 30,
    format: 'auto',
    effect: 'blur:500',
  });
};

/**
 * Generate srcSet for art-directed responsive images
 * @param {string} publicId - Cloudinary public ID
 * @param {object} breakpoints - Breakpoint configurations
 * @returns {object} Object with srcSet and sizes
 */
export const getArtDirectedSrcSet = (publicId, breakpoints) => {
  const srcSet = Object.entries(breakpoints)
    .map(([breakpoint, config]) => {
      const url = buildCustomUrl(publicId, config);
      return `${url} ${config.width}w`;
    })
    .join(', ');
  
  const sizes = Object.entries(breakpoints)
    .map(([breakpoint, config]) => {
      if (breakpoint === 'default') {
        return `${config.width}px`;
      }
      return `(min-width: ${breakpoint}px) ${config.width}px`;
    })
    .join(', ');
  
  return { srcSet, sizes };
};

/**
 * Upload image to Cloudinary (client-side)
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} Upload result with public_id and secure_url
 */
export const uploadImage = async (file, onProgress) => {
  const uploadPreset = CLOUDINARY_CONFIG.UPLOAD_PRESET;
  const cloudName = CLOUDINARY_CONFIG.CLOUD_NAME;
  
  if (!uploadPreset || !cloudName) {
    throw new Error('Cloudinary configuration missing');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return {
      publicId: data.public_id,
      secureUrl: data.secure_url,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export default {
  buildCloudinaryUrl,
  getThumbnailUrl,
  getCardImageUrl,
  getDetailImageUrl,
  getHeroImageUrl,
  buildCustomUrl,
  getResponsiveSrcSet,
  extractPublicId,
  getOptimizedImageUrl,
  getBlurredImageUrl,
  getGrayscaleImageUrl,
  getRoundedImageUrl,
  getWatermarkedImageUrl,
  cloudinaryLoader,
  isCloudinaryUrl,
  getPlaceholderUrl,
  getArtDirectedSrcSet,
  uploadImage,
};

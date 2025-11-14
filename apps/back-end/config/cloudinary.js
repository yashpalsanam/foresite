import { v2 as cloudinary } from 'cloudinary';
import { logger } from './logger.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (file, folder = 'foresite') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    logger.info('File uploaded to Cloudinary:', result.public_id);
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
    };
  } catch (error) {
    logger.error('Cloudinary upload failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info('File deleted from Cloudinary:', publicId);
    return { success: true, result };
  } catch (error) {
    logger.error('Cloudinary delete failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const uploadMultipleToCloudinary = async (files, folder = 'foresite') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    return {
      success: true,
      uploaded: successful,
      failed,
      count: successful.length,
    };
  } catch (error) {
    logger.error('Multiple upload failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getCloudinaryUrl = (publicId, transformations = {}) => {
  try {
    return cloudinary.url(publicId, {
      secure: true,
      ...transformations,
    });
  } catch (error) {
    logger.error('Get Cloudinary URL failed:', error.message);
    return null;
  }
};

export default cloudinary;

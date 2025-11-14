import { uploadToCloudinary, deleteFromCloudinary, uploadMultipleToCloudinary } from '../config/cloudinary.js';
import { logger } from '../config/logger.js';
import fs from 'fs';

export const uploadImage = async (file, folder = 'foresite') => {
  try {
    const result = await uploadToCloudinary(file, folder);
    
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    
    return result;
  } catch (error) {
    logger.error('Image upload failed:', error.message);
    
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    
    throw error;
  }
};

export const uploadMultipleImages = async (files, folder = 'foresite') => {
  try {
    const result = await uploadMultipleToCloudinary(files, folder);
    
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    
    return result;
  } catch (error) {
    logger.error('Multiple images upload failed:', error.message);
    
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    return await deleteFromCloudinary(publicId);
  } catch (error) {
    logger.error('Image deletion failed:', error.message);
    throw error;
  }
};

export const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteFromCloudinary(publicId));
    const results = await Promise.allSettled(deletePromises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || !r.value.success).length;
    
    logger.info(`Bulk delete: ${successful} successful, ${failed} failed`);
    
    return {
      success: true,
      successful,
      failed,
    };
  } catch (error) {
    logger.error('Multiple images deletion failed:', error.message);
    throw error;
  }
};

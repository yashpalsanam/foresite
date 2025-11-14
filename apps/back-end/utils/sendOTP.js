import { sendEmail } from './sendEmail.js';
import { cacheSet, cacheGet, cacheDel } from '../config/redis.js';
import { logger } from '../config/logger.js';
import crypto from 'crypto';

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTP = async (email, type = 'verification') => {
  try {
    const otp = generateOTP();
    const key = `otp:${type}:${email}`;
    
    await cacheSet(key, otp, 600);
    
    const subject = type === 'verification' ? 'Email Verification OTP' : 'Password Reset OTP';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Your OTP Code</h2>
        <p>Your OTP code is: <strong style="font-size: 24px;">${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
    
    await sendEmail({
      to: email,
      subject,
      html,
    });
    
    logger.info(`OTP sent to ${email} for ${type}`);
    
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    logger.error('Send OTP failed:', error.message);
    throw error;
  }
};

export const verifyOTP = async (email, otp, type = 'verification') => {
  try {
    const key = `otp:${type}:${email}`;
    const storedOTP = await cacheGet(key);
    
    if (!storedOTP) {
      return { success: false, message: 'OTP expired or not found' };
    }
    
    if (storedOTP !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }
    
    await cacheDel(key);
    
    logger.info(`OTP verified for ${email}`);
    
    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    logger.error('Verify OTP failed:', error.message);
    throw error;
  }
};

export const resendOTP = async (email, type = 'verification') => {
  try {
    const key = `otp:${type}:${email}`;
    await cacheDel(key);
    
    return await sendOTP(email, type);
  } catch (error) {
    logger.error('Resend OTP failed:', error.message);
    throw error;
  }
};

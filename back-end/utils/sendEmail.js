import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent: ${info.messageId} to ${to}`);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error('Email send failed:', error.message);
    throw error;
  }
};

export const sendBulkEmail = async (recipients, subject, text, html) => {
  try {
    const promises = recipients.map(to => 
      sendEmail({ to, subject, text, html })
    );
    
    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    logger.info(`Bulk email sent: ${successful} successful, ${failed} failed`);
    
    return {
      success: true,
      successful,
      failed,
    };
  } catch (error) {
    logger.error('Bulk email send failed:', error.message);
    throw error;
  }
};

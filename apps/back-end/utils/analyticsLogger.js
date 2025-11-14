import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { logger } from '../config/logger.js';

export const logEvent = async (eventData) => {
  try {
    const event = await AnalyticsEvent.create(eventData);
    logger.info(`Analytics event logged: ${eventData.eventType} - ${eventData.eventName}`);
    return event;
  } catch (error) {
    logger.error('Analytics event logging failed:', error.message);
    throw error;
  }
};

export const logPageView = async (req, path) => {
  return await logEvent({
    eventType: 'page_view',
    eventName: 'Page Viewed',
    sessionId: req.sessionID || 'unknown',
    user: req.user?._id || null,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    path,
    referrer: req.get('referrer'),
  });
};

export const logPropertyView = async (req, propertyId) => {
  return await logEvent({
    eventType: 'property_view',
    eventName: 'Property Viewed',
    sessionId: req.sessionID || 'unknown',
    user: req.user?._id || null,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    relatedModel: 'Property',
    relatedId: propertyId,
    path: req.path,
  });
};

export const logPropertySearch = async (req, searchParams) => {
  return await logEvent({
    eventType: 'property_search',
    eventName: 'Property Search',
    sessionId: req.sessionID || 'unknown',
    user: req.user?._id || null,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    metadata: searchParams,
    path: req.path,
  });
};

export const logInquirySubmitted = async (req, inquiryId) => {
  return await logEvent({
    eventType: 'inquiry_submitted',
    eventName: 'Inquiry Submitted',
    sessionId: req.sessionID || 'unknown',
    user: req.user?._id || null,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    relatedModel: 'Inquiry',
    relatedId: inquiryId,
    path: req.path,
  });
};

export const logUserRegistration = async (req, userId) => {
  return await logEvent({
    eventType: 'user_registered',
    eventName: 'User Registered',
    sessionId: req.sessionID || 'unknown',
    user: userId,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    path: req.path,
  });
};

export const logUserLogin = async (req, userId) => {
  return await logEvent({
    eventType: 'user_login',
    eventName: 'User Login',
    sessionId: req.sessionID || 'unknown',
    user: userId,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    path: req.path,
  });
};

export const logApiCall = async (req, endpoint, duration, status) => {
  return await logEvent({
    eventType: 'api_call',
    eventName: `API Call: ${endpoint}`,
    sessionId: req.sessionID || 'unknown',
    user: req.user?._id || null,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    path: req.path,
    duration,
    status: status >= 200 && status < 300 ? 'success' : 'error',
  });
};

export const logError = async (req, error) => {
  return await logEvent({
    eventType: 'error_occurred',
    eventName: 'Error',
    sessionId: req.sessionID || 'unknown',
    user: req.user?._id || null,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    path: req.path,
    status: 'error',
    errorMessage: error.message,
    metadata: {
      stack: error.stack,
    },
  });
};

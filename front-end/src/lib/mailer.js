import { API_CONFIG, SITE_CONFIG } from '@/utils/constants';

/**
 * Send contact form email
 * Server-side function to send email via backend API
 * 
 * @param {object} formData - Contact form data
 * @returns {Promise<object>} Response
 */
export const sendContactEmail = async (formData) => {
  const { name, email, phone, subject, message } = formData;

  // Validate required fields
  if (!name || !email || !message) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  const url = `${API_CONFIG.BASE_URL}/contact`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        subject: subject || 'Contact Form Submission',
        message,
        source: 'website',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to send email: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'Email sent successfully',
    };
  } catch (error) {
    console.error('Error sending contact email:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
};

/**
 * Send property inquiry email
 * @param {object} inquiryData - Inquiry form data
 * @returns {Promise<object>} Response
 */
export const sendPropertyInquiry = async (inquiryData) => {
  const {
    propertyId,
    propertyTitle,
    name,
    email,
    phone,
    message,
    inquiryType,
  } = inquiryData;

  // Validate required fields
  if (!propertyId || !name || !email || !phone) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  const url = `${API_CONFIG.BASE_URL}/inquiries`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        property: propertyId,
        propertyTitle,
        name,
        email,
        phone,
        message: message || `Inquiry about ${propertyTitle}`,
        type: inquiryType || 'buy',
        source: 'website',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to send inquiry: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'Inquiry sent successfully',
      inquiryId: data.data?.id || data.inquiry?.id,
    };
  } catch (error) {
    console.error('Error sending property inquiry:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to send inquiry',
    };
  }
};

/**
 * Subscribe to newsletter
 * @param {string} email - Email address
 * @param {string} name - Subscriber name (optional)
 * @returns {Promise<object>} Response
 */
export const subscribeToNewsletter = async (email, name = '') => {
  if (!email) {
    return {
      success: false,
      error: 'Email is required',
    };
  }

  const url = `${API_CONFIG.BASE_URL}/newsletter/subscribe`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        source: 'website',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle already subscribed case
      if (response.status === 409) {
        return {
          success: false,
          error: 'This email is already subscribed',
          alreadySubscribed: true,
        };
      }
      
      throw new Error(errorData.message || `Failed to subscribe: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'Successfully subscribed to newsletter',
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to subscribe',
    };
  }
};

/**
 * Send schedule viewing request
 * @param {object} viewingData - Viewing request data
 * @returns {Promise<object>} Response
 */
export const scheduleViewing = async (viewingData) => {
  const {
    propertyId,
    propertyTitle,
    name,
    email,
    phone,
    preferredDate,
    preferredTime,
    message,
  } = viewingData;

  // Validate required fields
  if (!propertyId || !name || !email || !phone || !preferredDate) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  const url = `${API_CONFIG.BASE_URL}/inquiries`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        property: propertyId,
        propertyTitle,
        name,
        email,
        phone,
        message: message || `Viewing request for ${propertyTitle}`,
        type: 'viewing',
        preferredDate,
        preferredTime,
        source: 'website',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to schedule viewing: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'Viewing request sent successfully',
      inquiryId: data.data?.id || data.inquiry?.id,
    };
  } catch (error) {
    console.error('Error scheduling viewing:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to schedule viewing',
    };
  }
};

/**
 * Send price alert subscription
 * @param {object} alertData - Alert subscription data
 * @returns {Promise<object>} Response
 */
export const subscribeToPriceAlert = async (alertData) => {
  const {
    propertyId,
    email,
    targetPrice,
  } = alertData;

  if (!propertyId || !email || !targetPrice) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  const url = `${API_CONFIG.BASE_URL}/alerts/price`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        property: propertyId,
        email,
        targetPrice,
        source: 'website',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to set price alert: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'Price alert set successfully',
    };
  } catch (error) {
    console.error('Error setting price alert:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to set price alert',
    };
  }
};

/**
 * Report a property issue
 * @param {object} reportData - Report data
 * @returns {Promise<object>} Response
 */
export const reportPropertyIssue = async (reportData) => {
  const {
    propertyId,
    email,
    issueType,
    description,
  } = reportData;

  if (!propertyId || !email || !issueType || !description) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  const url = `${API_CONFIG.BASE_URL}/properties/${propertyId}/report`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        issueType,
        description,
        source: 'website',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to submit report: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'Report submitted successfully',
    };
  } catch (error) {
    console.error('Error reporting property issue:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to submit report',
    };
  }
};

export default {
  sendContactEmail,
  sendPropertyInquiry,
  subscribeToNewsletter,
  scheduleViewing,
  subscribeToPriceAlert,
  reportPropertyIssue,
};

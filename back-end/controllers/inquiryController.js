import Inquiry from '../models/Inquiry.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendPushNotification } from '../utils/sendPush.js';
import { logger } from '../config/logger.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';

export const getAllInquiries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, property, user } = req.query;

  const query = {};

  if (status) query.status = status;
  if (property) query.property = property;
  if (user) query.user = user;

  const inquiries = await Inquiry.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Inquiry.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      inquiries,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    },
  });
});

export const getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found',
    });
  }

  if (!inquiry.isRead) {
    inquiry.isRead = true;
    await inquiry.save();
  }

  res.status(200).json({
    success: true,
    data: { inquiry },
  });
});

export const createInquiry = asyncHandler(async (req, res) => {
  const { property, name, email, phone, message, inquiryType, preferredContactMethod, preferredDate, preferredTime } = req.body;

  const inquiryData = {
    property,
    user: req.user._id,
    name,
    email,
    phone,
    message,
    inquiryType,
    preferredContactMethod,
    preferredDate,
    preferredTime,
  };

  const inquiry = await Inquiry.create(inquiryData);

  logger.info(`Inquiry created: ${inquiry._id} by ${req.user.email}`);

  try {
    await sendEmail({
      to: email,
      subject: 'Inquiry Confirmation',
      html: `<p>Thank you for your inquiry. We will get back to you soon.</p>`,
    });
  } catch (error) {
    logger.error('Failed to send inquiry confirmation email:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully',
    data: { inquiry },
  });
});

export const updateInquiry = asyncHandler(async (req, res) => {
  const { status, assignedTo, notes } = req.body;

  let inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found',
    });
  }

  if (status) inquiry.status = status;
  if (assignedTo) inquiry.assignedTo = assignedTo;
  if (notes) inquiry.notes = notes;

  if (status && status !== inquiry.status && !inquiry.responseTime) {
    inquiry.responseTime = new Date();
  }

  await inquiry.save();

  logger.info(`Inquiry updated: ${inquiry._id}`);

  res.status(200).json({
    success: true,
    message: 'Inquiry updated successfully',
    data: { inquiry },
  });
});

export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found',
    });
  }

  await inquiry.deleteOne();

  logger.info(`Inquiry deleted: ${inquiry._id}`);

  res.status(200).json({
    success: true,
    message: 'Inquiry deleted successfully',
  });
});

export const getMyInquiries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { user: req.user._id };

  if (status) query.status = status;

  const inquiries = await Inquiry.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Inquiry.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      inquiries,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    },
  });
});

export const getInquiryStats = asyncHandler(async (req, res) => {
  const totalInquiries = await Inquiry.countDocuments();
  const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });
  const completedInquiries = await Inquiry.countDocuments({ status: 'completed' });
  const cancelledInquiries = await Inquiry.countDocuments({ status: 'cancelled' });

  const inquiriesByType = await Inquiry.aggregate([
    { $group: { _id: '$inquiryType', count: { $sum: 1 } } },
  ]);

  const averageResponseTime = await Inquiry.aggregate([
    { $match: { responseTime: { $ne: null } } },
    {
      $project: {
        responseTimeMs: {
          $subtract: ['$responseTime', '$createdAt'],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: '$responseTimeMs' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalInquiries,
      pendingInquiries,
      completedInquiries,
      cancelledInquiries,
      inquiriesByType,
      averageResponseTimeHours: averageResponseTime[0]
        ? Math.round(averageResponseTime[0].avgResponseTime / (1000 * 60 * 60))
        : 0,
    },
  });
});

export const createPublicInquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, propertyId } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required',
    });
  }

  const inquiryData = {
    name,
    email,
    phone,
    message,
    inquiryType: subject || 'general',
    property: propertyId || null,
    user: null,
    status: 'pending',
  };

  const inquiry = await Inquiry.create(inquiryData);

  logger.info(`Public inquiry created: ${inquiry._id} from ${email}`);

  try {
    await sendEmail({
      to: email,
      subject: 'Thank You for Contacting Foresite Real Estate',
      html: `
        <h2>Thank You for Your Inquiry</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <p>Best regards,<br>Foresite Real Estate Team</p>
      `,
    });
  } catch (error) {
    logger.error('Failed to send public inquiry confirmation email:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully. We will get back to you soon!',
    data: { inquiry },
  });
});

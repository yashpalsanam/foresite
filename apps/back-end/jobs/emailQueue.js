import { Queue, Worker } from 'bullmq';
import { sendEmail } from '../utils/sendEmail.js';
import { logger } from '../config/logger.js';

const emailQueue = new Queue('email-queue', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
});

const emailWorker = new Worker(
  'email-queue',
  async (job) => {
    try {
      const { to, subject, text, html } = job.data;

      await sendEmail({ to, subject, text, html });

      logger.info(`Email sent successfully to ${to}`);

      return { success: true };
    } catch (error) {
      logger.error('Email queue error:', error);
      throw error;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    },
  }
);

emailWorker.on('completed', (job) => {
  logger.info(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Email job ${job.id} failed:`, err);
});

export const addEmailToQueue = async (emailData, options = {}) => {
  try {
    const job = await emailQueue.add('send-email', emailData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      ...options,
    });

    logger.info(`Email job ${job.id} added to queue`);

    return { success: true, jobId: job.id };
  } catch (error) {
    logger.error('Add to email queue error:', error);
    throw error;
  }
};

export const getQueueStats = async () => {
  try {
    const waiting = await emailQueue.getWaitingCount();
    const active = await emailQueue.getActiveCount();
    const completed = await emailQueue.getCompletedCount();
    const failed = await emailQueue.getFailedCount();

    return {
      waiting,
      active,
      completed,
      failed,
    };
  } catch (error) {
    logger.error('Get queue stats error:', error);
    throw error;
  }
};

export { emailQueue, emailWorker };

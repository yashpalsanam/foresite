import cron from 'node-cron';
import { logger } from '../config/logger.js';

const scheduledTasks = new Map();

export const scheduleTask = (name, cronExpression, task) => {
  try {
    if (scheduledTasks.has(name)) {
      logger.warn(`Task ${name} already scheduled, stopping existing task`);
      stopTask(name);
    }

    const scheduledTask = cron.schedule(cronExpression, async () => {
      try {
        logger.info(`Running scheduled task: ${name}`);
        await task();
        logger.info(`Completed scheduled task: ${name}`);
      } catch (error) {
        logger.error(`Error in scheduled task ${name}:`, error);
      }
    });

    scheduledTasks.set(name, scheduledTask);
    logger.info(`Scheduled task: ${name} with expression: ${cronExpression}`);

    return scheduledTask;
  } catch (error) {
    logger.error(`Failed to schedule task ${name}:`, error);
    throw error;
  }
};

export const stopTask = (name) => {
  const task = scheduledTasks.get(name);
  if (task) {
    task.stop();
    scheduledTasks.delete(name);
    logger.info(`Stopped scheduled task: ${name}`);
    return true;
  }
  return false;
};

export const stopAllTasks = () => {
  scheduledTasks.forEach((task, name) => {
    task.stop();
    logger.info(`Stopped task: ${name}`);
  });
  scheduledTasks.clear();
  logger.info('All scheduled tasks stopped');
};

export const getScheduledTasks = () => {
  return Array.from(scheduledTasks.keys());
};

export const isTaskScheduled = (name) => {
  return scheduledTasks.has(name);
};

export const validateCronExpression = (expression) => {
  return cron.validate(expression);
};

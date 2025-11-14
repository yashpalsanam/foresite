import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { logger } from '../config/logger.js';

dotenv.config();

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB_NAME || 'foresite';

const createBackup = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

    logger.info('Starting database backup...');

    const command = `mongodump --uri="${MONGO_URI}" --db=${DB_NAME} --out="${backupPath}"`;

    await execPromise(command);

    logger.info(`Backup completed successfully: ${backupPath}`);

    return {
      success: true,
      path: backupPath,
      timestamp,
    };
  } catch (error) {
    logger.error('Backup failed:', error);
    throw error;
  }
};

const restoreBackup = async (backupPath) => {
  try {
    logger.info(`Starting database restore from: ${backupPath}`);

    const command = `mongorestore --uri="${MONGO_URI}" --db=${DB_NAME} "${backupPath}/${DB_NAME}"`;

    await execPromise(command);

    logger.info('Restore completed successfully');

    return {
      success: true,
      message: 'Database restored successfully',
    };
  } catch (error) {
    logger.error('Restore failed:', error);
    throw error;
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const action = process.argv[2];

  if (action === 'backup') {
    createBackup()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (action === 'restore') {
    const backupPath = process.argv[3];
    if (!backupPath) {
      logger.error('Backup path is required for restore');
      process.exit(1);
    }
    restoreBackup(backupPath)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    logger.info('Usage: node dbBackup.js [backup|restore] [backupPath]');
    process.exit(0);
  }
}

export { createBackup, restoreBackup };

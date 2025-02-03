import { v4 as uuidv4 } from 'uuid';
import { getNamespace } from 'continuation-local-storage';
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

// Initialize the logger namespace
const namespace = getNamespace('logger');
const logsPath = `${process.cwd()}/logger/logs/`;

// Custom log format for files and console
const fileFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(function (info) {
    let log = '';
    try {
      const logId =
        namespace && namespace.get('logId') ? namespace.get('logId') : uuidv4();
      const { timestamp, level, message, ...args } = info;
      const ts = timestamp.slice(0, 19).replace('T', ' ');
      log = `${ts} - ${logId} - ${level}: ${message ? message.trim() : ''} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
    } catch (error) {
      console.log('Error @ fileFormat @ logger ', error);
    }
    return log;
  }),
);

// Define transports for file and console
const infoLogger = createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    new transports.DailyRotateFile({
      level: 'info',
      filename: `${logsPath}/info-%DATE%.log`,
      handleExceptions: true,
      json: true,
      maxSize: 5242880, // 5MB
    }),
    new transports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

const errorLogger = createLogger({
  level: 'error',
  format: fileFormat,
  transports: [
    new transports.DailyRotateFile({
      level: 'error',
      filename: `${logsPath}/error-%DATE%.log`,
      handleExceptions: true,
      json: true,
      maxSize: 5242880, // 5MB
    }),
    new transports.Console({
      level: 'error',
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

// If not in production, show colored logs in console
if (process.env.NODE_ENV !== 'production') {
  infoLogger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
  errorLogger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

// Create a service to log messages
const logger = {
  info: async (msg: string, ...args: any[]) => {
    infoLogger.info(msg, ...args);
  },
  error: async (msg: string, ...args: any[]) => {
    errorLogger.error(msg, ...args);
  },
};

export default logger;

const path = require("path");
const fs = require("fs");
const winston = require("winston");

// Logs folder
const logsDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors, json } =
  winston.format;

// Human-readable format for the console
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",

  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true })
  ),

  transports: [
    // Errors only
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        json()
      ),
    }),

    // All logs
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        json()
      ),
    }),
  ],
});

// Console transport (not in test)
if (process.env.NODE_ENV !== "test") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        consoleFormat
      ),
    })
  );
}

module.exports = logger;
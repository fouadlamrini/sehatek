const morgan = require("morgan");
const logger = require("../config/logger");

// Send morgan output through winston
const stream = {
  write: (message) => logger.info(message.trim()),
};

// Skip HTTP logs while running tests
const skip = () => process.env.NODE_ENV === "test";

// Clean format (no colors) so logs stay readable in files
const format =
  process.env.NODE_ENV === "production"
    ? "combined"
    : ":method :url :status :response-time ms - :res[content-length]";

const requestLogger = morgan(format, {
  stream,
  skip,
});

module.exports = requestLogger;
// Allowed origins from .env (comma separated). "*" allows any.
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowAll = allowedOrigins.includes("*");

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin (Postman, mobile apps, server-to-server)
    if (!origin || allowAll || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Not allowed: omit CORS headers (browser will block it)
    return callback(null, false);
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
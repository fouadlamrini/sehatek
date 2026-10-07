// Allowed origins from .env (comma separated). "*" allows any.
// A pattern may contain a single "*" wildcard segment, e.g.
// "https://*.vercel.app", so preview deployments keep working — Vercel appends
// a unique suffix to every deployment URL.
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

let allowAll = allowedOrigins.includes("*");

// Reflecting any origin while sending credentials turns CORS into an open
// relay for the refresh-token cookie. Ignore the wildcard and fall back to
// the explicit allowlist (or no-origin requests only) when it is present.
if (allowAll) {
  // eslint-disable-next-line no-console
  console.warn(
    '[cors] CORS_ORIGIN contains "*" with credentials enabled; ignoring the wildcard.'
  );
  allowAll = false;
}

const escapeRegExp = (value) => value.replace(/[.+?^${}()|[\]\\]/g, "\\$&");

const isAllowed = (origin) =>
  allowedOrigins.some((allowed) => {
    if (allowed === origin) {
      return true;
    }

    if (!allowed.includes("*")) {
      return false;
    }

    // "*" matches one path/host segment only, never the scheme separator.
    return new RegExp(`^${escapeRegExp(allowed).replace(/\*/g, "[^/]+")}$`).test(
      origin
    );
  });

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin (Postman, mobile apps, server-to-server)
    if (!origin || allowAll || isAllowed(origin)) {
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
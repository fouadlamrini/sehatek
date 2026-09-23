const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const packRoutes = require("./routes/packRoutes");
const orderRoutes = require("./routes/orderRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const requestLogger = require("./middleware/requestLogger");
const errorMiddleware = require("./middleware/errorMiddleware");
const AppError = require("./utils/AppError");
const corsOptions = require("./config/corsOptions");

const app = express();

// =========================
// MIDDLEWARES
// =========================

// Security headers
app.use(
  helmet({
    // Allow resources from other origins
    crossOriginResourcePolicy: { policy: "cross-origin" },

    // API does not serve HTML
    contentSecurityPolicy: false,
  })
);

// CORS
app.use(cors(corsOptions));

// HTTP request logging
app.use(requestLogger);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for all API requests
app.use("/api", apiLimiter);

// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sahetak API is running",
  });
});

// =========================
// ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/packs", packRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/settings", settingsRoutes);

// =========================
// 404 - ROUTE NOT FOUND
// =========================

app.use((req, res, next) => {
  const error = new AppError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    404
  );

  next(error);
});

// =========================
// CENTRAL ERROR HANDLER
// =========================

app.use(errorMiddleware);

// =========================
// EXPORT
// =========================

module.exports = app;
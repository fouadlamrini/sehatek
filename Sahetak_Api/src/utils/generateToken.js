const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    }
  );
};

const generateRefreshToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      jti: crypto.randomUUID(),
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
    }
  );
};

// Extract expiry date from a JWT
const getTokenExpiry = (token) => {
  const decoded = jwt.decode(token);

  return decoded && decoded.exp
    ? new Date(decoded.exp * 1000)
    : new Date();
};

// Hash the refresh token before storing it in the DB
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = {
  generateToken,
  generateRefreshToken,
  getTokenExpiry,
  hashToken,
};
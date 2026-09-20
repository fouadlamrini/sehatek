const cloudinary = require("cloudinary").v2;

// Cloudinary configuration is read ONLY from environment variables.
// Credentials are never hardcoded and never logged.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
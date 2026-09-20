const multer = require("multer");
const path = require("path");
const AppError = require("../utils/AppError");

// Product images are now uploaded to Cloudinary, not stored on disk.
// Multer keeps the file in memory (req.file.buffer) only for the duration
// of the request, so no temporary files are ever written.
const storage = multer.memoryStorage();

// Accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const extension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedTypes.test(file.mimetype);

  if (extension && mimeType) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed", 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;
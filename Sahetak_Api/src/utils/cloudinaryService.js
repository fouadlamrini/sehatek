const cloudinary = require("../config/cloudinary");
const AppError = require("./AppError");

// Cloudinary folder structure: sehatek_api/products
const PRODUCT_IMAGE_FOLDER = "sehatek_api/products";

// Upload a product image buffer to Cloudinary.
// Returns Cloudinary's generated public_id and secure_url.
const uploadProductImage = (buffer) => {
  if (!buffer || buffer.length === 0) {
    throw new AppError("Product image is required", 400);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: PRODUCT_IMAGE_FOLDER },
      (error, result) => {
        if (error) {
          reject(
            new AppError("Image upload failed. Please try again later", 500)
          );
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    stream.end(buffer);
  });
};

// Delete a Cloudinary image by its public_id.
// Returns true/false. Already-deleted images are not treated as errors.
const deleteCloudinaryImage = (publicId) => {
  if (!publicId) {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(
          new AppError("Image deletion failed. Please try again later", 500)
        );
      } else {
        resolve(result && result.result === "ok");
      }
    });
  });
};

module.exports = {
  uploadProductImage,
  deleteCloudinaryImage,
  PRODUCT_IMAGE_FOLDER,
};
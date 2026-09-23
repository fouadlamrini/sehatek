const cloudinary = require("../config/cloudinary");
const AppError = require("./AppError");

// Cloudinary folder structure
const PRODUCT_IMAGE_FOLDER = "sehatek_api/products";
const PROFILE_IMAGE_FOLDER = "sehatek_api/profile";

// Upload an image buffer to Cloudinary inside the given folder.
// Returns Cloudinary's generated public_id and secure_url.
const uploadImage = (buffer, folder) => {
  if (!buffer || buffer.length === 0) {
    throw new AppError("Image is required", 400);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
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

// Upload a product image buffer to Cloudinary.
const uploadProductImage = (buffer) => uploadImage(buffer, PRODUCT_IMAGE_FOLDER);

// Upload a profile (logo/avatar) or banner image buffer to Cloudinary.
const uploadProfileImage = (buffer) => uploadImage(buffer, PROFILE_IMAGE_FOLDER);

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
  uploadProfileImage,
  deleteCloudinaryImage,
  PRODUCT_IMAGE_FOLDER,
  PROFILE_IMAGE_FOLDER,
};
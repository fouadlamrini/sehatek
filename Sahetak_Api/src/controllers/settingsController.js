const Settings = require("../models/Settings");
const AppError = require("../utils/AppError");
const {
  uploadProfileImage,
  deleteCloudinaryImage,
} = require("../utils/cloudinaryService");

// The settings collection holds a single document.
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return settings;
};

// =========================
// GET PUBLIC SETTINGS
// =========================
// Used by the customer site to render the profile/banner images.
// Only the URLs are exposed; Cloudinary public_ids stay private.

const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      message: "Settings retrieved successfully",
      data: {
        profileImage: settings.profileImage?.url
          ? { url: settings.profileImage.url }
          : null,
        bannerImage: settings.bannerImage?.url
          ? { url: settings.bannerImage.url }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET SETTINGS (ADMIN)
// =========================

const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      message: "Settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// UPDATE SETTINGS (ADMIN)
// =========================
// Accepts profileImage and/or bannerImage files. New images are uploaded to
// Cloudinary (folder: sehatek_api/profile) BEFORE the document is saved, and
// replaced images are deleted only AFTER the save succeeds.

const updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    const profileFile = req.files?.profileImage?.[0];
    const bannerFile = req.files?.bannerImage?.[0];

    if (!profileFile && !bannerFile) {
      throw new AppError(
        "At least one image (profileImage or bannerImage) is required",
        400
      );
    }

    const uploads = [];

    try {
      if (profileFile) {
        const asset = await uploadProfileImage(profileFile.buffer);

        uploads.push({
          asset,
          previous: settings.profileImage?.publicId,
        });

        settings.profileImage = {
          url: asset.url,
          publicId: asset.publicId,
        };
      }

      if (bannerFile) {
        const asset = await uploadProfileImage(bannerFile.buffer);

        uploads.push({
          asset,
          previous: settings.bannerImage?.publicId,
        });

        settings.bannerImage = {
          url: asset.url,
          publicId: asset.publicId,
        };
      }

      await settings.save();
    } catch (error) {
      // DB/upload failed -> roll back the freshly uploaded Cloudinary images.
      for (const { asset } of uploads) {
        await deleteCloudinaryImage(asset.publicId).catch(() => {});
      }

      throw error;
    }

    // Document now references the new images, so replaced images can be removed.
    for (const { previous } of uploads) {
      if (previous) {
        await deleteCloudinaryImage(previous).catch(() => {});
      }
    }

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicSettings,
  getSettings,
  updateSettings,
};
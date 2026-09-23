const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const BlacklistedToken = require("../models/BlacklistedToken");
const RefreshToken = require("../models/RefreshToken");
const AppError = require("../utils/AppError");

const {
  generateToken,
  generateRefreshToken,
  getTokenExpiry,
  hashToken,
} = require("../utils/generateToken");

// =========================
// LOGIN
// =========================

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin
    // password is select:false, so we explicitly select it
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!admin) {
      throw new AppError("Invalid email or password", 401);
    }

    // Check password
    const isPasswordCorrect = await admin.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new AppError("Invalid email or password", 401);
    }

    // Create access + refresh tokens
    const token = generateToken(admin);
    const refreshToken = generateRefreshToken(admin);

    // Remove any existing refresh tokens for this admin (single active token per admin)
    await RefreshToken.deleteMany({ admin: admin._id });

    // Store refresh token (hashed) server-side
    await RefreshToken.create({
      admin: admin._id,
      token: hashToken(refreshToken),
      expiresAt: getTokenExpiry(refreshToken),
    });

    // Store the refresh token in a secure httpOnly cookie, not in the JSON body
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// CHANGE PASSWORD
// =========================

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get admin with password
    const admin = await Admin.findById(req.admin.id).select("+password");

    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    // Check current password
    const isPasswordCorrect = await admin.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Change password
    admin.password = newPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// CHANGE NAME
// =========================

const changeName = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Get admin
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    // Change name
    admin.name = name;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Name changed successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET PROFILE
// =========================

const getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.token;
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    // Revoke the refresh token (hashed) if provided
    if (refreshToken) {
      await RefreshToken.deleteOne({
        token: hashToken(refreshToken),
      });
    }

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const decoded = jwt.decode(token);

    const expiresAt = decoded && decoded.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Blacklist the access token so it can no longer be used
    await BlacklistedToken.updateOne(
      { token },
      {
        $setOnInsert: {
          token,
          expiresAt,
        },
      },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// REFRESH TOKEN
// =========================

const refresh = async (req, res, next) => {
  try {
    // Prefer the refresh token from the httpOnly cookie (fallback: JSON body)
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    // Verify refresh token signature
    let payload;

    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }

    // Check that it exists and admin is still valid
    const stored = await RefreshToken.findOne({
      token: hashToken(refreshToken),
    });

    if (!stored) {
      throw new AppError("Invalid refresh token", 401);
    }

    if (stored.expiresAt < new Date()) {
      await stored.deleteOne();

      throw new AppError("Refresh token has expired", 401);
    }

    const admin = await Admin.findById(payload.id);

    if (!admin) {
      await stored.deleteOne();

      throw new AppError("Invalid refresh token", 401);
    }

    // Rotate: invalidate the used refresh token and issue new ones
    await stored.deleteOne();

    const token = generateToken(admin);
    const newRefreshToken = generateRefreshToken(admin);

    await RefreshToken.create({
      admin: admin._id,
      token: hashToken(newRefreshToken),
      expiresAt: getTokenExpiry(newRefreshToken),
    });

    // Refresh the token via the httpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  changePassword,
  changeName,
  getProfile,
  logout,
  refresh,
};
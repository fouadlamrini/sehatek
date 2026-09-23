require("dotenv").config();

const crypto = require("crypto");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const logger = require("./config/logger");

const isProduction = process.env.NODE_ENV === "production";

// Never seed credentials into a real environment unless it is explicit.
if (isProduction && process.env.SEED_ALLOW_PRODUCTION !== "true") {
  logger.error(
    "Refusing to seed admins in production. Set SEED_ALLOW_PRODUCTION=true to override."
  );
  process.exit(1);
}

const createAdmins = async () => {
  try {
    await connectDB();

    const email = (process.env.SEED_ADMIN_EMAIL || "").trim().toLowerCase();
    const name = (process.env.SEED_ADMIN_NAME || "").trim();
    const role = process.env.SEED_ADMIN_ROLE || "super_admin";

    if (!email) {
      logger.error("SEED_ADMIN_EMAIL is required.");
      process.exit(1);
    }

    const existing = await Admin.findOne({ email });

    // Never overwrite existing accounts from a seed: this could downgrade a
    // real super_admin or silently lock a team member out.
    if (existing) {
      logger.info(`Admin already exists (skipped): ${email}`);
      process.exit(0);
    }

    let password = process.env.SEED_ADMIN_PASSWORD || "";

    if (!password) {
      if (isProduction) {
        logger.error("SEED_ADMIN_PASSWORD is required in production.");
        process.exit(1);
      }

      password = crypto.randomBytes(18).toString("base64url");
      logger.warn(`Generated admin password for ${email}: ${password}`);
    } else if (password.length < 8) {
      logger.error("SEED_ADMIN_PASSWORD must be at least 8 characters.");
      process.exit(1);
    }

    await Admin.create({
      email,
      name: name || email.split("@")[0],
      password,
      role,
    });

    logger.info(`Admin created: ${email} (${role})`);
    logger.info("Admin creation process completed");
    process.exit(0);
  } catch (error) {
    logger.error("Error creating admins:", error);
    process.exit(1);
  }
};

createAdmins();
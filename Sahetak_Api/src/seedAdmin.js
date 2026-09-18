require("dotenv").config();

const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const logger = require("./config/logger");

const createAdmins = async () => {
  try {
    await connectDB();

    const admins = [
      {
        name: "Ilyass",
        email: "habbailiass1@gmail.com",
        password: "Admin123456",
        role: "super_admin",
      },
      {
        name: "Soufian",
        email: "Soufianabattyou@gmail.com",
        password: "Admin123456",
        role: "admin",
      },
      {
        name: "sehatek",
        email: "Sehatek8@gmail.com",
        password: "Admin123456",
        role: "admin",
      },
    ];

    for (const adminData of admins) {
      const existingAdmin = await Admin.findOne({
        email: adminData.email,
      });

      if (existingAdmin) {
        if (existingAdmin.role !== adminData.role) {
          existingAdmin.role = adminData.role;
          await existingAdmin.save();

          logger.info(`Admin role updated: ${existingAdmin.email}`);
        } else {
          logger.info(`${adminData.email} already exists`);
        }

        continue;
      }

      const admin = await Admin.create(adminData);

      logger.info(`Admin created: ${admin.email} (${admin.role})`);
    }

    logger.info("Admin creation process completed");

    process.exit(0);
  } catch (error) {
    logger.error("Error creating admins:", error);
    process.exit(1);
  }
};

createAdmins();
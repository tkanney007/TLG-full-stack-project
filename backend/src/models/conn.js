const { Sequelize } = require("sequelize");

// DB Connection Configuration
const sequelize = new Sequelize("easybills", "root", "P3rk1n3lm3r", {
  host: "localhost",
  dialect: "mysql",
});

// Test connection function
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
}

module.exports = { sequelize, testConnection };

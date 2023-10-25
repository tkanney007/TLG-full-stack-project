const { DataTypes } = require("sequelize");
const { sequelize } = require("./conn");

const Budget = sequelize.define(
  "budget",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    budget_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, timestamps: true }
);

sequelize.sync();
Budget.sync({ force: false });

module.exports = Budget;

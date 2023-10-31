const { sequelize } = require("./conn");
const { DataTypes } = require("sequelize");

const Interval = sequelize.define(
  "interval",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    interval_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    num_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_pays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Interval.sync({ alter: true });
module.exports = Interval;

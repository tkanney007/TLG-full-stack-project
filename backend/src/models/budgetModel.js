const { DataTypes } = require("sequelize");
const { sequelize } = require("./conn");
const User = require("./userModel");

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
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  { sequelize, timestamps: true }
);

User.hasMany(Budget, {
  foreignKey: "user_id",
});

Budget.belongsTo(User, {
  foreignKey: "user_id",
});

sequelize.sync();
Budget.sync({ force: false });

module.exports = Budget;

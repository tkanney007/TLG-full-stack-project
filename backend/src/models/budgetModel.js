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
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["budget_name", "user_id"],
      },
    ],
  },
  {
    sequelize,
    timestamps: false,
  }
);

User.hasMany(Budget, {
  foreignKey: "user_id",
});

Budget.belongsTo(User, {
  foreignKey: "user_id",
});

//Budget.sync({ alter: true });
// Budget.sync({ force: false });

module.exports = Budget;

const Budget = require("./userModel");
const { DataTypes } = require("sequelize");
const { sequelize } = require("./conn");
const Interval = require("./intervalModel");

const Bill = sequelize.define(
  "bill",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bill_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amt_due: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    day_due: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website_login: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    budget_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "budgets",
        key: "id",
      },
    },
    interval_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "intervals",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["bill_name", "budget_id"],
      },
    ],
  },
  {
    timestamps: false,
  }
);

Budget.hasMany(Bill, {
  foreignKey: "budget_id",
  onDelete: "CASCADE",
});

Bill.belongsTo(Budget, {
  foreignKey: "budget_id",
});

Bill.hasOne(Interval, {
  foreignKey: "interval_id",
});

Bill.belongsTo(Interval, {
  foreignKey: "interval_id",
});

Bill.sync({ alter: true });

module.exports = Bill;

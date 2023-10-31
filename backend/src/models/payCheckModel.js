const { sequelize } = require("./conn");
const { DataTypes } = require("sequelize");
const Contributor = require("./contributorModel");
const Interval = require("./intervalModel");
const Budget = require("./budgetModel");

const PayCheck = sequelize.define(
  "paycheck",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pay_check_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_pay_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // end_pay_date: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    // },
    budget_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "budgets",
        key: "id",
      },
    },
    contributor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "contributors",
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
        fields: ["pay_check_name", "budget_id", "contributor_id"],
      },
    ],
  },
  {
    timestamps: false,
  }
);

Contributor.hasMany(PayCheck, {
  foreignKey: "contributor_id",
  onDelete: "CASCADE",
});

PayCheck.belongsTo(Contributor, {
  foreignKey: "contributor_id",
});

Budget.hasMany(PayCheck, {
  foreignKey: "budget_id",
  onDelete: "CASCADE",
});

PayCheck.belongsTo(Budget, {
  foreignKey: "budget_id",
});

PayCheck.hasOne(Interval, {
  foreignKey: "interval_id",
});

PayCheck.belongsTo(Interval, {
  foreignKey: "interval_id",
});

PayCheck.sync({ alter: true });

module.exports = PayCheck;

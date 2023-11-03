const { sequelize } = require("./conn");
const { DataTypes } = require("sequelize");
const Bill = require("./billModel");
const PayDay = require("./payDayModel");
const Contributor = require("./contributorModel");
const Budget = require("./budgetModel");

const PayDayBill = sequelize.define(
  "pay_day_bill",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bills",
        key: "id",
      },
    },
    payday_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "paydays",
        key: "id",
      },
    },
    budget_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "budgets",
        key: "id",
      },
    },
    contributor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "contributors",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["bill_id", "payday_id"],
      },
    ],
  },
  { sequelize, timestamps: false }
);

Bill.hasMany(PayDayBill, {
  foreignKey: "bill_id",
  onDelete: "CASCADE",
});

PayDayBill.belongsTo(Bill, {
  foreignKey: "bill_id",
});

PayDay.hasMany(PayDayBill, {
  foreignKey: "payday_id",
  onDelete: "CASCADE",
});

PayDayBill.belongsTo(PayDay, {
  foreignKey: "payday_id",
});

Contributor.hasMany(PayDayBill, {
  foreignKey: "contributor_id",
});

PayDayBill.belongsTo(Contributor, {
  foreignKey: "contributor_id",
});

Budget.hasMany(PayDayBill, {
  foreignKey: "budget_id",
});

PayDayBill.belongsTo(Budget, {
  foreignKey: "budget_id",
});

//PayDayBill.sync({ alter: true });
//PayDayBill.sync({ force: false });
module.exports = PayDayBill;

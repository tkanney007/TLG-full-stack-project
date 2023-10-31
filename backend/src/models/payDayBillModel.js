const { sequelize } = require("./conn");
const { DataTypes } = require("sequelize");
const Bill = require("./billModel");
const PayDay = require("./payDayModel");
const Contributor = require("./contributorModel");

const PayDayBill = sequelize.define(
  "paydaybill",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bill_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "bills",
        key: "id",
      },
    },
    payday_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "paydays",
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
  },
  {
    timestamps: false,
  }
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

PayDayBill.sync({ alter: true });

module.exports = PayDayBill;

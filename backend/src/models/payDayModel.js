const { sequelize } = require("./conn");
const { DataTypes } = require("sequelize");
const Contributor = require("./contributorModel");
const Interval = require("./intervalModel");
const Budget = require("./budgetModel");
const PayCheck = require("./payCheckModel");

const PayDay = sequelize.define(
  "payday",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pay_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    pay_amount_act: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
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
    pay_check_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "paychecks",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["pay_date", "pay_check_id"],
      },
    ],
  },
  {
    sequelize,
    timestamps: false,
  }
);

Contributor.hasMany(PayDay, {
  foreignKey: "contributor_id",
  //onDelete: "CASCADE",
});

PayDay.belongsTo(Contributor, {
  foreignKey: "contributor_id",
});

Budget.hasMany(PayDay, {
  foreignKey: "budget_id",
  //onDelete: "CASCADE",
});

PayDay.belongsTo(Budget, {
  foreignKey: "budget_id",
});

PayCheck.hasMany(PayDay, {
  foreignKey: "pay_check_id",
  onDelete: "CASCADE",
});

PayDay.belongsTo(PayCheck, {
  foreignKey: "pay_check_id",
});

//PayDay.sync({ alter: true });
//PayDay.sync({ force: true });

module.exports = PayDay;

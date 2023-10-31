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
    paycheck_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "paychecks",
        key: "id",
      },
    },
    // interval_id: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: "intervals",
    //     key: "id",
    //   },
    // },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["pay_date", "paycheck_id"],
      },
    ],
  },
  {
    timestamps: false,
  }
);

Contributor.hasMany(PayDay, {
  foreignKey: "contributor_id",
  onDelete: "CASCADE",
});

PayDay.belongsTo(Contributor, {
  foreignKey: "contributor_id",
});

Budget.hasMany(PayDay, {
  foreignKey: "budget_id",
  onDelete: "CASCADE",
});

PayDay.belongsTo(Budget, {
  foreignKey: "budget_id",
});

PayCheck.hasMany(PayDay, {
  foreignKey: "paycheck_id",
  onDelete: "CASCADE",
});

PayDay.belongsTo(PayCheck, {
  foreignKey: "paycheck_id",
});

// PayDay.hasOne(Interval, {
//   foreignKey: "interval_id",
// });

// PayDay.belongsTo(Interval, {
//   foreignKey: "interval_id",
// });

PayDay.sync({ alter: true });

module.exports = PayDay;

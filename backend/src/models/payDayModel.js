const Contributor = require("./contributorModel");
const { sequelize } = require("./conn");
const Interval = require("./intervalModel");

const PayDay = sequelize.define(
  "payday",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pay_date: {
      type: DataTypes.DATE,
      allowNull: false,
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
    timestamps: false,
  }
);

Contributor.hasMany(PayDay, {
  foreignKey: "contributor_id",
});

PayDay.belongsTo(Contributor, {
  foreignKey: "contributor_id",
});

PayDay.hasOne(Interval, {
  foreignKey: "interval_id",
});

PayDay.belongsTo(Interval, {
  foreignKey: "interval_id",
});

PayDay.sync({ force: false });

module.exports = Bill;

const { sequelize } = require("./conn");
const { DataTypes } = require("sequelize");
const Budget = require("./budgetModel");

const Contributor = sequelize.define(
  "contributor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contributor_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
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
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["contributor_name", "budget_id"],
      },
    ],
  },
  {
    sequelize,
    timestamps: false,
  }
);

Budget.hasMany(Contributor, {
  foreignKey: "budget_id",
  onDelete: "CASCADE",
});

Contributor.belongsTo(Budget, {
  foreignKey: "budget_id",
});

//Contributor.sync({ alter: true });
//Contributor.sync({ force: false });

module.exports = Contributor;

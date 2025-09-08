const { DataTypes } = require("sequelize");
const sequelize = require("../src/db/database");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = { Order };

const { DataTypes } = require("sequelize");
const sequelize = require("../Utils/db-connection"); // adjust path if needed

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // important for webhook lookup
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  currency: {
    type: DataTypes.STRING,
    defaultValue: "INR",
  },

  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
    defaultValue: "PENDING",
  },

  paymentId: {
    type: DataTypes.STRING,
    allowNull: true, // will be filled after payment success
  }

}, {
  timestamps: true // gives createdAt & updatedAt
});

module.exports = Order;
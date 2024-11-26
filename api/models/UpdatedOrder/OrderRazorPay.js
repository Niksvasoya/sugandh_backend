const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");

const hooks = {};

const tableName = "Order_Razorpay";

const OrderRazorPay = sequelize.define(
  "OrderRazorPay",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    signature: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    payment_link_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    payment_link_reference_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    payment_link_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    payment_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  },
  { hooks, tableName }
);

module.exports = OrderRazorPay;

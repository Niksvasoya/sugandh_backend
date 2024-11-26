const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const ProductVariants = require("../Product/ProductVariants");
const Supplier = require("../Supplier/Supplier");
const User = require("../User/User");
const OrderStatus = require("./OrderStatus");
const OrderHistory = require("./OrderHistory");

const hooks = {};

const tableName = "order_history_payment_details";

const OrderHistoryPaymentDetails = sequelize.define(
  "OrderHistoryPaymentDetails",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    order_history_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: OrderHistory,
        key: "id",
      },
    },
    razorpay_order_id: {
      type: Sequelize.STRING,
    },
    razorpay_payment_id: {
      type: Sequelize.STRING,
    },
    razorpay_signature: {
      type: Sequelize.STRING,
    },

    is_deleted: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  },
  { hooks, tableName }
);

OrderHistory.hasMany(OrderHistoryPaymentDetails, {
  foreignKey: "order_history_id",
});
OrderHistoryPaymentDetails.belongsTo(OrderHistory, {
  foreignKey: "order_history_id",
});
module.exports = OrderHistoryPaymentDetails;

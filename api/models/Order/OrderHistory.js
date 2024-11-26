const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const ProductVariants = require("../Product/ProductVariants");
const Supplier = require("../Supplier/Supplier");
const User = require("../User/User");
const OrderStatus = require("./OrderStatus");

const hooks = {};

const tableName = "order_history";

const OrderHistory = sequelize.define(
  "OrderHistory",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    supplier_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: Supplier,
        key: "id",
      },
    },
    date: {
      type: Sequelize.DATE,
    },
    order_status_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: OrderStatus,
        key: "id",
      },
    },
    order_type: {
      type: Sequelize.BOOLEAN,
    },
    billing_address: {
      type: Sequelize.JSON,
    },
    shipping_address: {
      type: Sequelize.JSON,
    },
    is_shipping_address: {
      type: Sequelize.BOOLEAN,
    },
    is_online_payment: {
      type: Sequelize.BOOLEAN,
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

module.exports = OrderHistory;

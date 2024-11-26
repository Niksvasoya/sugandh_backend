const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");

const hooks = {};

const tableName = "Order_Status";

const OrderStatus = sequelize.define(
  "OrderStatus",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: {
        args: true,
        msg: "Order Status exists with this Name.",
      },
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
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

module.exports = OrderStatus;

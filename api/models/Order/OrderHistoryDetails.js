const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Product = require("../Product/Product");
const ProductVariants = require("../Product/ProductVariants");
const OrderHistory = require("./OrderHistory");

const hooks = {};

const tableName = "order_history_details";

const OrderHistoryDetails = sequelize.define(
  "OrderHistoryDetails",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    order_history_id: {
      type: Sequelize.BIGINT,
      // allowNull: false,
      references: {
        model: OrderHistory,
        key: "id",
      },
    },
    product_id: {
      type: Sequelize.BIGINT,
      // allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    product_variants_id: {
      type: Sequelize.BIGINT,
      // allowNull: false,
      references: {
        model: ProductVariants,
        key: "id",
      },
    },
    color: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.DECIMAL,
    },
    size: {
      type: Sequelize.STRING,
    },
    thumbnail_image: {
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
OrderHistory.hasMany(OrderHistoryDetails, {
  foreignKey: "order_history_id",
});
OrderHistoryDetails.belongsTo(OrderHistory, {
  foreignKey: "order_history_id",
});

module.exports = OrderHistoryDetails;

const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Product = require("./Product");
const ProductVariants = require("./ProductVariants");
const Logistics = require("../Logistics/Logistics");
const hooks = {};

const tableName = "product_shipping_details";

const ShippingDetails = sequelize.define(
  "ShippingDetails",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: Sequelize.BIGINT,
      references: {
        model: Product,
        key: "id",
      },
    },
    product_variant_id: {
      type: Sequelize.BIGINT,
      references: {
        model: ProductVariants,
        key: "id",
      },
    },
    logistics_id: {
      type: Sequelize.BIGINT,
      references: {
        model: Logistics,
        key: "id",
      },
    },
    is_manual_shipping: {
      type: Sequelize.BOOLEAN,
    },
    date_of_dispatch: {
      type: Sequelize.DATEONLY,
    },
    delivery_date: {
      type: Sequelize.DATEONLY,
    },
    length: {
      type: Sequelize.DECIMAL,
    },
    breadth: {
      type: Sequelize.DECIMAL,
    },
    height: {
      type: Sequelize.DECIMAL,
    },
    weight: {
      type: Sequelize.DECIMAL,
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

module.exports = ShippingDetails;

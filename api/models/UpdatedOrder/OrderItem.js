const Order = require("./Order");
const Product = require("../Product/Product");
const ProductVariants = require("../Product/ProductVariants");

const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");

const crudService = require("../../services/crud.service");

const hooks = {};

const tableName = "Order_Item";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: Order,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Valid Order Reference.",
        },
        isInt: {
          args: true,
          msg: "Order Reference can not be non Numeric.",
        },
        async CheckOrderRef(value) {
          if (typeof value === "string")
            throw new Error("Order Reference can not be non Numeric");
          const OrderData = await crudService.get(Order, {
            where: { id: value, is_deleted: false },
          });
          if (OrderData[0] == undefined)
            throw new Error("Please Provide Order Reference of Existing User.");
        },
      },
    },
    qty: {
      allowNull: false,
      type: Sequelize.BIGINT,
      validate: {
        isNumeric: {
          args: true,
          msg: "Quantity should only be numeric",
        },
        min: {
          args: [1],
          msg: "Product Quantity in Cart must be atleast one.",
        },
      },
    },
    product_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: Product,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Valid Product Reference.",
        },
        isInt: {
          args: true,
          msg: "Product Reference can not be non Numeric.",
        },
        async CheckProductRef(value) {
          if (typeof value === "string")
            throw new Error("Product Reference can not be non Numeric");
          const ProductData = await crudService.get(Product, {
            where: { id: value, is_deleted: false },
          });
          if (ProductData[0] == undefined)
            throw new Error(
              "Please Provide Product Reference of Existing User."
            );
        },
      },
    },
    product_name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    product_variant_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: ProductVariants,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Valid Product Variant Reference.",
        },
        isInt: {
          args: true,
          msg: "Product Variant Reference can not be non Numeric.",
        },
        async CheckProductVariantRef(value) {
          if (typeof value === "string")
            throw new Error("Product Variant Reference can not be non Numeric");
          const ProductVariantData = await crudService.get(ProductVariants, {
            where: { id: value, is_deleted: false },
          });
          if (ProductVariantData[0] == undefined)
            throw new Error(
              "Please Provide Product VariantData Reference of Existing User."
            );
        },
      },
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

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

ProductVariants.hasMany(OrderItem, { foreignKey: "product_variant_id" });
OrderItem.belongsTo(ProductVariants, { foreignKey: "product_variant_id" });

module.exports = OrderItem;

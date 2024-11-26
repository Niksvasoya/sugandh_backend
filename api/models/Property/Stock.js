const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const PropertyCategory = require("./PropertyCategory");
const Property = require("./Property");
const Product = require("../Product/Product");
const ProductVariants = require("../Product/ProductVariants");
// const ZipCode = require('../Master/ZipCode')

const hooks = {};

const tableName = "product_stock";

const Stock = sequelize.define(
  "Stock",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    property_category_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: PropertyCategory,
        key: "id",
      },
    },
    property_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Property,
        key: "id",
      },
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Product,
        key: "id",
      },
    },
    product_variants_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: ProductVariants,
        key: "id",
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    barcode: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
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

// User.hasMany(Property, {
//     foreignKey: "user_id",
// })
// Property.belongsTo(User, {
//     foreignKey: "user_id",
// });
Product.hasMany(Stock, {
  foreignKey: "product_id",
});
Stock.belongsTo(Product, {
  foreignKey: "product_id",
});
ProductVariants.hasMany(Stock, {
  foreignKey: "product_variants_id",
});
Stock.belongsTo(ProductVariants, {
  foreignKey: "product_variants_id",
});
module.exports = Stock;

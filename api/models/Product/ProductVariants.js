const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Color = require("./Color");
const Product = require("./Product");
const Size = require("./Size");
const Coupon = require("../Coupon/Coupon");
const hooks = {};

const tableName = "product_variants";

const ProductVariants = sequelize.define(
  "ProductVariants",
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
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Product",
        },
        async checkProductId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Product");
          }
          // const ProductData = await Product.findByPk(value);
          // if (!ProductData) {
          //     throw new Error('Please enter valid Product');
          // }
        },
      },
    },
    color_id: {
      type: Sequelize.BIGINT,
      references: {
        model: Color,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Color",
        },
        async checkColorId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Color");
          }
          const ColorData = await Color.findByPk(value);
          if (!ColorData) {
            throw new Error("Please enter valid Color");
          }
        },
      },
    },
    size_id: {
      type: Sequelize.BIGINT,
      references: {
        model: Size,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Size",
        },
        async checkSizeId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Size");
          }
          const SizeData = await Size.findByPk(value);
          if (!SizeData) {
            throw new Error("Please enter valid Size");
          }
        },
      },
    },
    image: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      validate: {
        isArrayOfValidUrls(value) {
          if (!Array.isArray(value)) {
            throw new Error("Image must be in valid formate");
          }

          const isValidUrl = (url) => {
            try {
              new URL(url);
              return true;
            } catch {
              return false;
            }
          };

          if (!value.every(isValidUrl)) {
            throw new Error("Image must be valid URLs");
          }
        },
      },
    },
    mrp: {
      type: Sequelize.DOUBLE,
      validate: {
        isNumeric: {
          msg: "Please enter a valid MRP price",
        },
        min: {
          args: [0],
          msg: "MRP price cannot be negative",
        },
      },
    },
    purchase_rate: {
      type: Sequelize.DOUBLE,
      validate: {
        isNumeric: {
          msg: "Please enter a valid Purchase rate",
        },
        min: {
          args: [0],
          msg: "Purchase rate cannot be negative",
        },
      },
    },
    sell_rate: {
      type: Sequelize.DOUBLE,
      validate: {
        isNumeric: {
          msg: "Please enter a valid Sell rate",
        },
        min: {
          args: [0],
          msg: "Sell rate cannot be negative",
        },
      },
    },
    discount: {
      type: Sequelize.DECIMAL,
      allowNull: true,
      validate: {
        isNumeric: {
          msg: "Please enter a valid discount value",
        },
        min: {
          args: [0],
          msg: "Discount value cannot be negative",
        },
        max: {
          args: [100],
          msg: "Discount value cannot be greater than 100",
        },
      },
    },
    product_variants_number: {
      type: Sequelize.BIGINT,
      validate: {
        isNumeric: {
          msg: "Please enter a valid product variants number",
        },
      },
    },
    coupon_id: {
      type: Sequelize.BIGINT,
      references: {
        model: Coupon,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter Coupon ID",
        },
        async checkCouponId(value) {
          if (value) {
            if (typeof value == "string") {
              throw new Error("Coupon ID can not be non Integer");
            }
            const CouponData = await Coupon.findByPk(value);
            if (!CouponData) {
              throw new Error(
                "Coupon with Coupon ID provided does not exists for Product variant data."
              );
            }
          }
        },
      },
    }, // prodVar(m:1)coupon
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

Coupon.hasMany(ProductVariants, { foreignKey: "coupon_id" });
ProductVariants.belongsTo(Coupon, { foreignKey: "coupon_id" });
Color.hasMany(ProductVariants, {
  foreignKey: "color_id",
});
ProductVariants.belongsTo(Color, {
  foreignKey: "color_id",
});
Size.hasMany(ProductVariants, {
  foreignKey: "size_id",
});
ProductVariants.belongsTo(Size, {
  foreignKey: "size_id",
});
Product.hasMany(ProductVariants, {
  foreignKey: "product_id",
});
ProductVariants.belongsTo(Product, {
  foreignKey: "product_id",
});

module.exports = ProductVariants;

const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const CouponType = require("./CouponType");
const DiscountType = require("./DiscountType");

const crudService = require("../../services/crud.service");

const hooks = {};

const tableName = "coupon";

const Coupon = sequelize.define(
  "Coupon",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Coupon exists with this Name.",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Coupon Name can not be Null.",
        },
      },
    },
    coupon_type_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: CouponType,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Valid Coupon Type Reference.",
        },
        isInt: {
          args: true,
          msg: "Coupon Type Reference can not be non Numeric.",
        },
        async CheckCouponTypeRef(value) {
          if (typeof value === "string")
            throw new Error("Coupon Type Reference can not be non Numeric");
          const CouponTypeData = await crudService.get(CouponType, {
            where: { id: value, is_deleted: false },
          });
          if (CouponTypeData[0] == undefined)
            throw new Error(
              "Please Provide Coupon Type Reference of Existing Coupon Type."
            );
        },
      },
    },
    discount_type_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: DiscountType,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Valid Discount Type Reference.",
        },
        isInt: {
          args: true,
          msg: "Discount Type Reference can not be non Numeric.",
        },
        async CheckDiscountTypeRef(value) {
          if (typeof value === "string")
            throw new Error("Discount Type Reference can not be non Numeric");
          const DiscountTypeData = await crudService.get(DiscountType, {
            where: { id: value, is_deleted: false },
          });
          if (DiscountTypeData[0] == undefined)
            throw new Error(
              "Please Provide Discount Type Reference of Existing Discount Type."
            );
        },
      },
    },
    discount_value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Please provide valid Discount value",
        },
        checkDiscountValue(value) {
          if (this.discount_type_id == 1 && (value < 0 || value > 100))
            throw new Error("Please Provide valid Discount Percentage.");
          if (value < 0)
            throw new Error("Please Provide valid Discount Amount.");
        },
      },
    },
    is_permanent: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    start_time: {
      type: Sequelize.DATEONLY,
      validate: {
        checkStartTime(value) {
          if (this.is_permanent) {
            if (value)
              throw new Error(
                "When Creating Coupon of Permanent Type, Time Duration for the coupon is not required."
              );
          } else {
            if (!value)
              throw new Error(
                "When Creating Coupon of Limited Time Duration Type, Time Duration for the coupon is required."
              );
          }
        },
      },
    },
    end_time: {
      type: Sequelize.DATEONLY,
      validate: {
        checkStartTime(value) {
          if (this.is_permanent) {
            if (value)
              throw new Error(
                "When Creating Coupon of Permanent Type, Time Duration for the coupon is not required."
              );
          } else {
            if (!value)
              throw new Error(
                "When Creating Coupon of Limited Time Duration Type, Time Duration for the coupon is required."
              );
            if (value < this.start_time)
              throw new Error(
                "When Creating Coupon of Limited Time Duration Type, make sure that Duration is provided in valid Chronological order."
              );
          }
        },
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

CouponType.hasMany(Coupon, { foreignKey: "coupon_type_id" });
Coupon.belongsTo(CouponType, { foreignKey: "coupon_type_id" });

DiscountType.hasMany(Coupon, { foreignKey: "discount_type_id" });
Coupon.belongsTo(DiscountType, { foreignKey: "discount_type_id" });

module.exports = Coupon;

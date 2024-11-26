const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");

const hooks = {};

const tableName = "coupon_type";

const CouponType = sequelize.define(
  "CouponType",
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
        msg: "Coupon Type exists with this Name.",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Coupon Type can not be Null.",
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

module.exports = CouponType;

const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const OrderLocation = require("./OrderLocation");
const OrderRazorPay = require("./OrderRazorPay");
const OrderStatus = require("./OrderStatus");
const User = require("../User/User");

const crudService = require("../../services/crud.service");

const hooks = {};

const tableName = "Order";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: User,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Valid User Reference.",
        },
        isInt: {
          args: true,
          msg: "User Reference can not be non Numeric.",
        },
        async CheckUserRef(value) {
          if (typeof value === "string")
            throw new Error("User Reference can not be non Numeric");
          const UserData = await crudService.get(User, {
            where: { id: value, is_deleted: false },
          });
          if (UserData[0] == undefined)
            throw new Error("Please Provide User Reference of Existing User.");
        },
      },
    },
    razorpay_id: {
      type: Sequelize.BIGINT,
      references: {
        model: OrderRazorPay,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Razorpay Reference can not be non Numeric.",
        },
        async CheckRzpRef(value) {
          if (value) {
            if (typeof value === "string")
              throw new Error("Razorpay Reference can not be non Numeric");
            const RzpData = await crudService.get(OrderRazorPay, {
              where: { id: value, is_deleted: false },
            });
            if (RzpData[0] == undefined)
              throw new Error(
                "Please Provide Razorpay Reference of Existing Instance."
              );
          }
        },
      },
    },
    status_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: OrderStatus,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Valid Order Status Reference.",
        },
        isInt: {
          args: true,
          msg: "Order Status Reference can not be non Numeric.",
        },
        async CheckOrderStatusRef(value) {
          if (typeof value === "string")
            throw new Error("Order Status Reference can not be non Numeric");
          const OrderStatusData = await crudService.get(OrderStatus, {
            where: { id: value, is_deleted: false },
          });
          if (OrderStatusData[0] == undefined)
            throw new Error("Please Provide Order Reference of Existing User.");
        },
      },
    },
    amount: {
      allowNull: false,
      type: Sequelize.BIGINT,
    },
    is_payment_online: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    billing_address_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: OrderLocation,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Valid Location Reference.",
        },
        isInt: {
          args: true,
          msg: "Location Reference can not be non Numeric.",
        },
        async CheckLocationRef(value) {
          if (typeof value === "string")
            throw new Error("Location Reference can not be non Numeric");
          const LocationData = await crudService.get(OrderLocation, {
            where: { id: value, is_deleted: false },
          });
          if (LocationData[0] == undefined)
            throw new Error(
              "Please Provide Location Reference of Existing User."
            );
        },
      },
    },
    shipping_address_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: OrderLocation,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Valid Location Reference.",
        },
        isInt: {
          args: true,
          msg: "Location Reference can not be non Numeric.",
        },
        async CheckLocationRef(value) {
          if (typeof value === "string")
            throw new Error("Location Reference can not be non Numeric");
          const LocationData = await crudService.get(OrderLocation, {
            where: { id: value, is_deleted: false },
          });
          if (LocationData[0] == undefined)
            throw new Error(
              "Please Provide Location Reference of Existing User."
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

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

OrderRazorPay.hasOne(Order, { foreignKey: "razorpay_id" });
Order.belongsTo(OrderRazorPay, { foreignKey: "razorpay_id" });

OrderStatus.hasMany(Order, { foreignKey: "status_id" });
Order.belongsTo(OrderStatus, { foreignKey: "status_id" });

OrderLocation.hasMany(Order, { foreignKey: "billing_address_id" });
Order.belongsTo(OrderLocation, { foreignKey: "billing_address_id" });

OrderLocation.hasMany(Order, { foreignKey: "shipping_address_id" });
Order.belongsTo(OrderLocation, { foreignKey: "shipping_address_id" });

module.exports = Order;

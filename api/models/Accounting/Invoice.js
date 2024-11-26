const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Logistics = require("../../models/Logistics/Logistics");
const User = require("../User/User");
const ShippingDetails = require("../Product/ShippingDetails");
const hooks = {};

const tableName = "invoice";

const Invoice = sequelize.define(
  "Invoice",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    invoice_date: {
      type: Sequelize.DATEONLY,
      validate: {
        isDate: true,
        isValidInvoiceDate(value) {
          // Check if the date is not in the future
          if (value > new Date()) {
            throw new Error("Invoice date cannot be in the future");
          }
          // Check if the date is within a reasonable range (e.g. last 10 years)
          const tenYearsAgo = new Date();
          tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
          if (value < tenYearsAgo) {
            throw new Error("Invoice date must be within the last 10 years");
          }
        },
      },
    },
    payment_status: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid Payment Status");
          }
        },
      },
    },
    is_transporter: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid transporter");
          }
        },
      },
    },
    logistics_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Logistics,
        key: "id",
      },
      validate: {
        async logisticsIsRequiredIfTransporter() {
          if (this.is_transporter && !this.logistics_id) {
            throw new Error(
              "Logistics id is required if add transporter is checked"
            );
          } else if (this.logistics_id) {
            if (typeof value == "string") {
              throw new Error("Please enter valid logistics");
            }
            const logisticsData = await Logistics.findOne({
              where: {
                is_deleted: false,
                id: value,
              },
            });
            if (!logisticsData) {
              throw new Error("Please enter valid logistics");
            }
          }
        },
      },
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid user",
        },
        async checkUserId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid user");
          }
          const userData = await User.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!userData) {
            throw new Error("Please enter valid user");
          }
        },
      },
    },
    is_different_state: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid different state");
          }
        },
      },
    },
    is_online_payment: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid online payment");
          }
        },
      },
    },
    is_website_order: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid online payment");
          }
        },
      },
    },
    is_shipping_address: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid online payment");
          }
        },
      },
    },
    billing_address: {
      type: Sequelize.JSON,
    },
    shipping_address: {
      type: Sequelize.JSON,
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
    order_status_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    note: {
      type: Sequelize.STRING,
    },
    refund_exccange: {
      type: Sequelize.STRING,
    },
    shipping_details_id:{
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    is_refund_coupon_gen: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    image:{
      type: Sequelize.STRING,
    },
    reason: {
      type: Sequelize.STRING,
    },
  },
  { hooks, tableName }
);
User.hasMany(Invoice, {
  foreignKey: "user_id",
});
Invoice.belongsTo(User, {
  foreignKey: "user_id",
});
Logistics.hasMany(Invoice, {
  foreignKey: "logistics_id",
});
Invoice.belongsTo(Logistics, {
  foreignKey: "logistics_id",
});
ShippingDetails.belongsTo(Invoice, {
  foreignKey: "shipping_details_id",
});
module.exports = Invoice;

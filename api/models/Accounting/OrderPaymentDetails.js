const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Invoice = require("./Invoice");

const hooks = {};

const tableName = "order_payment_details";

const OrderPaymentDetails = sequelize.define(
  "OrderPaymentDetails",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: Invoice,
        key: "id",
      },
    },
    razorpay_order_id: {
      type: Sequelize.STRING,
    },
    razorpay_payment_id: {
      type: Sequelize.STRING,
    },
    razorpay_signature: {
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

Invoice.hasMany(OrderPaymentDetails, {
  foreignKey: "invoice_id",
});
OrderPaymentDetails.belongsTo(Invoice, {
  foreignKey: "invoice_id",
});
module.exports = OrderPaymentDetails;

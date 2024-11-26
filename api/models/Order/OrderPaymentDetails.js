// const Sequelize = require("sequelize");
// const sequelize = require("../../../config/database");
// const Order = require("./Order");

// const hooks = {};

// const tableName = "order_payment_details_data";

// const OrderPaymentDetails = sequelize.define(
//   "OrderPaymentDetails",
//   {
//     id: {
//       type: Sequelize.BIGINT,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     order_id: {
//       type: Sequelize.BIGINT,
//       allowNull: false,
//       references: {
//         model: Order,
//         key: "id",
//       },
//     },
//     razorpay_order_id: {
//       type: Sequelize.STRING,
//     },
//     razorpay_payment_id: {
//       type: Sequelize.STRING,
//     },
//     razorpay_signature: {
//       type: Sequelize.STRING,
//     },

//     is_deleted: {
//       type: Sequelize.BOOLEAN,
//     },
//     deleted_at: {
//       type: Sequelize.DATE,
//     },
//   },
//   { hooks, tableName }
// );

// Order.hasMany(OrderPaymentDetails, {
//   foreignKey: "order_id",
// });
// OrderPaymentDetails.belongsTo(Order, {
//   foreignKey: "order_id",
// });
// module.exports = OrderPaymentDetails;

// const Sequelize = require("sequelize");
// const sequelize = require("../../../config/database");
// const ProductVariants = require("../Product/ProductVariants");
// const Supplier = require("../Supplier/Supplier");
// const User = require("../User/User");
// const OrderStatus = require("./OrderStatus");

// const hooks = {};

// const tableName = "order";

// const Order = sequelize.define(
//   "Order",
//   {
//     id: {
//       type: Sequelize.BIGINT,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     title: {
//       type: Sequelize.STRING,
//     },
//     user_id: {
//       type: Sequelize.BIGINT,
//       allowNull: false,
//       references: {
//         model: User,
//         key: "id",
//       },
//       validate: {
//         isInt: {
//           args: true,
//           msg: "Please enter valid user",
//         },
//         async checkUserId(value) {
//           if (typeof value == "string") {
//             throw new Error("Please enter valid user");
//           }
//           const userData = await User.findOne({
//             where: {
//               is_deleted: false,
//               id: value,
//             },
//           });
//           if (!userData) {
//             throw new Error("Please enter valid user");
//           }
//         },
//       },
//     },
//     supplier_id: {
//       type: Sequelize.BIGINT,
//       allowNull: true,
//       references: {
//         model: Supplier,
//         key: "id",
//       },
//       validate: {
//         isInt: {
//           args: true,
//           msg: "Please enter valid Supplier",
//         },
//         async checkSupplierId(value) {
//           if (typeof value == "string") {
//             throw new Error("Please enter valid Supplier");
//           }
//           const SupplierData = await Supplier.findOne({
//             where: {
//               is_deleted: false,
//               id: value,
//             },
//           });
//           if (!SupplierData) {
//             throw new Error("Please enter valid Supplier");
//           }
//         },
//       },
//     },
//     date: {
//       type: Sequelize.DATE,
//     },
//     order_status_id: {
//       type: Sequelize.BIGINT,
//       allowNull: false,
//       references: {
//         model: OrderStatus,
//         key: "id",
//       },
//       validate: {
//         isInt: {
//           args: true,
//           msg: "Please enter valid Order Status",
//         },
//         async checkOrderStatusId(value) {
//           if (typeof value == "string") {
//             throw new Error("Please enter valid Order Status");
//           }
//           const OrderStatusData = await OrderStatus.findOne({
//             where: {
//               is_deleted: false,
//               id: value,
//             },
//           });
//           if (!OrderStatusData) {
//             throw new Error("Please enter valid Order Status");
//           }
//         },
//       },
//     },
//     product_variant_id: {
//       type: Sequelize.BIGINT,
//       allowNull: false,
//       references: {
//         model: ProductVariants,
//         key: "id",
//       },
//       validate: {
//         isInt: {
//           args: true,
//           msg: "Please enter valid Product Variants",
//         },
//         async checkProductVariantsId(value) {
//           if (typeof value == "string") {
//             throw new Error("Please enter valid Product Variants");
//           }
//           const ProductVariantsData = await ProductVariants.findOne({
//             where: {
//               is_deleted: false,
//               id: value,
//             },
//           });
//           if (!ProductVariantsData) {
//             throw new Error("Please enter valid Product Variants");
//           }
//         },
//       },
//     },
//     order_type: {
//       type: Sequelize.BOOLEAN,
//       validate: {
//         isValidBoolean(value) {
//           if (typeof value !== "boolean") {
//             throw new Error("Please enter valid order type");
//           }
//         },
//       },
//     },
//     is_online_payment: {
//       type: Sequelize.BOOLEAN,
//       validate: {
//         isValidBoolean(value) {
//           if (typeof value !== "boolean") {
//             throw new Error("Please enter valid online payment");
//           }
//         },
//       },
//     },
//     is_shipping_address: {
//       type: Sequelize.BOOLEAN,
//       validate: {
//         isValidBoolean(value) {
//           if (typeof value !== "boolean") {
//             throw new Error("Please enter valid shipping address");
//           }
//         },
//       },
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

// module.exports = Order;

// const Sequelize = require("sequelize");
// const sequelize = require("../../../config/database");
// const Product = require("../Product/Product");
// const ProductVariants = require("../Product/ProductVariants");
// const Order = require("./Order");

// const hooks = {};

// const tableName = "order_details";

// const OrderDetails = sequelize.define(
//   "OrderDetails",
//   {
//     id: {
//       type: Sequelize.BIGINT,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     // order_id: {
//     //   type: Sequelize.BIGINT,
//     //   allowNull: false,
//     //   references: {
//     //     model: Order,
//     //     key: "id",
//     //   },
//     //   validate: {
//     //     isInt: {
//     //       args: true,
//     //       msg: "Please enter valid Order",
//     //     },
//     //     async checkOrderId(value) {
//     //       if (typeof value == "string") {
//     //         throw new Error("Please enter valid Order");
//     //       }
//     //       const OrderData = await Order.findOne({
//     //         where: {
//     //           is_deleted: false,
//     //           id: value,
//     //         },
//     //       });
//     //       if (!OrderData) {
//     //         throw new Error("Please enter valid Order");
//     //       }
//     //     },
//     //   },
//     // },
//     product_id: {
//       type: Sequelize.BIGINT,
//       allowNull: false,
//       references: {
//         model: Product,
//         key: "id",
//       },
//       validate: {
//         isInt: {
//           args: true,
//           msg: "Please enter valid Product",
//         },
//         async checkProductId(value) {
//           if (typeof value == "string") {
//             throw new Error("Please enter valid Product");
//           }
//           const ProductData = await Product.findOne({
//             where: {
//               is_deleted: false,
//               id: value,
//             },
//           });
//           if (!ProductData) {
//             throw new Error("Please enter valid Product");
//           }
//         },
//       },
//     },
//     product_variants_id: {
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
//     is_deleted: {
//       type: Sequelize.BOOLEAN,
//     },
//     deleted_at: {
//       type: Sequelize.DATE,
//     },
//   },
//   { hooks, tableName }
// );
// Order.hasMany(OrderDetails, {
//   foreignKey: "order_id",
// });
// OrderDetails.belongsTo(Order, {
//   foreignKey: "order_id",
// });

// module.exports = OrderDetails;

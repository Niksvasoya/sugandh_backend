const Product = require("../../models/Product/Product");
const ProductVariants = require("../../models/Product/ProductVariants");
const Order = require("../../models/UpdatedOrder/Order");
const OrderItem = require("../../models/UpdatedOrder/OrderItem");
const OrderLocation = require("../../models/UpdatedOrder/OrderLocation");
const { OrderSchema } = require("../../schemas/UpdatedOrderSchema");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const Sequelize = require("sequelize");
const Razorpay = require("razorpay");
const OrderRazorPay = require("../../models/UpdatedOrder/OrderRazorPay");
const crypto = require("crypto");
const util = require("util");
const OrderStatus = require("../../models/UpdatedOrder/OrderStatus");
const User = require("../../models/User/User");
const Coupon = require("../../models/Coupon/Coupon");
const CouponType = require("../../models/Coupon/CouponType");
const DiscountType = require("../../models/Coupon/DiscountType");
const Stock = require("../../models/Property/Stock");
const sgMail = require("@sendgrid/mail");
const OrderPaymentDetails = require("../../models/Accounting/OrderPaymentDetails");
const InvoiceModel = require("../../../api/models/Accounting/Invoice");
const { InvoiceSchemas } = require("../../schemas/AccountingSchemas");
const RefuncCouponModel = require('../../models/Coupon/RefundCoupon')
const InvoiceDetailsModel = require("../../../api/models/Accounting/InvoiceDetails");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let instance = new Razorpay({
  key_id: process.env.RAZOR_API_KEY,
  key_secret: process.env.RAZOR_SECRET_KEY,
});

const OrderApi = () => {

  function calculateGST(gstInclusivePrice, gstRatePercentage) {
    // Convert GST rate percentage to decimal
    console.log(gstInclusivePrice, gstRatePercentage);
    const gstRateDecimal = gstRatePercentage / 100;
    console.log(gstRateDecimal);
    // Calculate GST amount
    const gstAmount =
      (gstInclusivePrice * gstRateDecimal) / (1 + gstRateDecimal);

    // Calculate GST-exclusive price
    const gstExclusivePrice = gstInclusivePrice - gstAmount;

    return {
      gstAmount,
      gstExclusivePrice,
    };
  }
  async function generateUniqueInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const existingInvoice = await crudService.get(InvoiceModel, {
      where: { is_deleted: false },
      attributes: [Sequelize.fn("max", Sequelize.col("id"))],
      raw: true,
    });
    const invoiceNumber = `INV-${year}${month}${day}-${existingInvoice[0].max + 1
      }`;
    return invoiceNumber;
  }

  const master_save = async (req, res) => {

    req.body.order_status_id = 8
    req.body.invoice_number = await generateUniqueInvoiceNumber();
    console.log("req.body.invoice_number", req.body.invoice_number);
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, InvoiceSchemas)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            response = await crudService.update(
              InvoiceModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
            if (reqData.invoice_details) {
              for (let data of reqData.invoice_details) {
                if (data.id) {
                  let gstData = calculateGST(
                    parseInt(data.mrp),
                    parseInt(data.gst_value)
                  );
                  console.log(gstData);
                  data.final_total_amount = data.mrp * data.quantity;
                  if (reqData.is_different_state) {
                    data.igst_amount = gstData.gstAmount;
                    data.igst_value = data.gst_value;
                    data.total_amount = gstData.gstExclusivePrice;
                    data.total_amount_with_quantity =
                      gstData.gstExclusivePrice * data.quantity;
                  } else {
                    data.sgst_amount = gstData.gstAmount / 2;
                    data.cgst_amount = gstData.gstAmount / 2;
                    data.sgst_value = data.gst_value / 2;
                    data.cgst_value = data.gst_value / 2;
                    data.total_amount = gstData.gstExclusivePrice;
                    data.total_amount_with_quantity =
                      gstData.gstExclusivePrice * data.quantity;
                  }
                  data.invoice_id = reqData.id;
                  await crudService.update(
                    InvoiceDetailsModel,
                    { id: data.id },
                    data
                  );
                } else {
                  let gstData = calculateGST(
                    parseInt(data.mrp),
                    parseInt(data.gst_value)
                  );
                  console.log(gstData);
                  data.final_total_amount = data.mrp * data.quantity;
                  if (reqData.is_different_state) {
                    data.igst_amount = gstData.gstAmount;
                    data.igst_value = data.gst_value;
                    data.total_amount = gstData.gstExclusivePrice;
                    data.total_amount_with_quantity =
                      gstData.gstExclusivePrice * data.quantity;
                  } else {
                    save
                    data.sgst_amount = gstData.gstAmount / 2;
                    data.cgst_amount = gstData.gstAmount / 2;
                    data.sgst_value = data.gst_value / 2;
                    data.cgst_value = data.gst_value / 2;
                    data.total_amount = gstData.gstExclusivePrice;
                    data.total_amount_with_quantity =
                      gstData.gstExclusivePrice * data.quantity;
                  }
                  data.invoice_id = reqData.id;
                  await crudService.insert(InvoiceDetailsModel, data);
                }

                if (data.coupon) {
                  await crudService.update(
                    RefuncCouponModel,
                    { coupon_code: data.coupon },
                    { isused: true }
                  );
                }
              }
            }
          } else {
            reqData.payment_status = false
            reqData.is_online_payment = true
            response = await crudService.insert(InvoiceModel, reqData);
            // let final_total_amount;
            if (reqData.invoice_details) {
              for (let data of reqData.invoice_details) {
                let gstData = calculateGST(
                  parseInt(data.mrp),
                  parseInt(data.gst_value)
                );
                console.log(gstData);
                data.final_total_amount = data.mrp * data.quantity;
                if (reqData.is_different_state) {
                  data.igst_amount = gstData.gstAmount;
                  data.igst_value = data.gst_value;
                  data.total_amount = gstData.gstExclusivePrice;
                  data.total_amount_with_quantity =
                    gstData.gstExclusivePrice * data.quantity;
                } else {
                  data.sgst_amount = gstData.gstAmount / 2;
                  data.cgst_amount = gstData.gstAmount / 2;
                  data.sgst_value = data.gst_value / 2;
                  data.cgst_value = data.gst_value / 2;
                  data.total_amount = gstData.gstExclusivePrice;
                  data.total_amount_with_quantity =
                    gstData.gstExclusivePrice * data.quantity;
                }

                if (data.coupon) {
                  await crudService.update(
                    RefuncCouponModel,
                    { coupon_code: data.coupon },
                    { isused: true }
                  );
                }


                data.invoice_id = response.id;
                try {
                  await crudService.insert(InvoiceDetailsModel, data);
                } catch (error) {
                  console.log(error);
                  await crudService.destroy(InvoiceModel, { id: response.id });
                  return res.status(error.status).json(error.error);
                }
              }
            }
            if (reqData.is_online_payment && reqData.payment_details) {
              reqData.payment_details.invoice_id = response.id;
              try {
                await crudService.insert(
                  OrderPaymentDetails,
                  reqData.payment_details
                );
              } catch (error) {
                await crudService.destroy(InvoiceModel, { id: response.id });
                await crudService.destroy(InvoiceDetailsModel, {
                  invoice_id: response.id,
                });
                return res.status(error.status).json(error.error);
              }
            }
            if (reqData.is_website_order && reqData.payment_details) {
              reqData.payment_details.invoice_id = response.id;
              try {
                await crudService.insert(
                  OrderPaymentDetails,
                  reqData.payment_details
                );
              } catch (error) {
                await crudService.destroy(InvoiceModel, { id: response.id });
                await crudService.destroy(InvoiceDetailsModel, {
                  invoice_id: response.id,
                });
                return res.status(error.status).json(error.error);
              }
            }
          }

          const totalAmount = reqData.invoice_details.reduce((total, product) => {
            return total + (parseFloat(product.mrp) * product.quantity);
          }, 0);

          const razorPayAmount = parseInt(
            Math.round(totalAmount * 100)
          );

          const reference_id = `${response.id.toString()}_${Date.now()}`;

          instance.paymentLink.create(
            {
              amount: razorPayAmount,
              currency: "INR",
              reference_id: reference_id,
              accept_partial: false,
              description: "Online Payment for Sugandh",
              customer: {
                name: "Sugandh Customer",
              },
              notify: {
                sms: true,
                email: true,
              },
              reminder_enable: true,
              notes: {
                policy_name: "Sugandh Order",
              },
              callback_url: 'https://sugandh.co/public/api/order/razorpay/validation/v2',// process.env.CALLBACK_URL,
              callback_method: "get",
            },
            function (err, order) {
              if (err) {
                console.log(err);
                return res.status(500).json({ message: err, success: false });
              }
              return res.status(200).json({
                data: order,
                messgae:
                  "Order Placed successfully. ( OrderType : Online Payment. )",
                success: true,
              });
            }
          );

          // return res.status(201).json({
          //   code: 200,
          //   success: true,
          //   message: `Invoice ${reqData.id ? "updated" : "created"
          //     } successfully`,
          //   data: response || {},
          // });
        } catch (error) {
          console.log(error);
          return res.status(error.status).json(error.error);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          code: 500,
          success: false,
          message: "Internal Server Error",
          error: err,
        });
      });


    // if (
    //   req.body.user_id == undefined ||
    //   req.body.is_payment_online == undefined ||
    //   req.body.is_shipping_is_billing == undefined ||
    //   req.body.shipping_address == undefined ||
    //   req.body.order_items == undefined
    // ) {
    //   return res.status(401).json({
    //     code: 401,
    //     success: false,
    //     message: "Missing Required Details.",
    //   });
    // }

    // try {
    //   let amount = 0;
    //   let prod_var;
    //   for (let i = 0; i < req.body.order_items.length; ++i) {
    //     let whereClause_prod_var = {};
    //     whereClause_prod_var.is_deleted = false;
    //     whereClause_prod_var.id = {
    //       [Sequelize.Op.eq]: req.body.order_items[i].product_variants_id,
    //     };
    //     let executing_parameters = {
    //       where: whereClause_prod_var,
    //       include: [
    //         {
    //           model: Coupon,
    //           require: false,
    //           attributes: {
    //             exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
    //           },
    //           include: [
    //             {
    //               model: DiscountType,
    //               require: false,
    //               attributes: {
    //                 exclude: [
    //                   "is_deleted",
    //                   "deleted_at",
    //                   "createdAt",
    //                   "updatedAt",
    //                 ],
    //               },
    //             },
    //           ],
    //         },
    //         {
    //           model: Stock,
    //           require: false,
    //           attributes: [
    //             "property_id",
    //             "product_id",
    //             "product_variants_id",
    //             "quantity",
    //           ],
    //           where: { property_id: 1, is_deleted: false },
    //         },
    //       ],
    //     };

    //     prod_var = await crudService.get(ProductVariants, executing_parameters);
    //     console.log("Nikul prod_var", prod_var);
    //     if (
    //       prod_var[0].Stocks[0] &&
    //       prod_var[0].Stocks[0].quantity < req.body.order_items[i].quantity
    //     )
    //       return res.status(401).json({
    //         code: 401,
    //         success: false,
    //         message: `Product Variant : ${req.body.order_items[i].product_name} is out of stock. Only ${prod_var[0].Stocks[0].quantity} left in stock where as you are trying to purchase ${req.body.order_items[i].quantity}`,
    //       });

    //     let ith_prod_var_discounted_value = prod_var[0].mrp;
    //     if (prod_var[0].Coupon != undefined) {
    //       if (prod_var[0].Coupon.DiscountType.name == "percentage")
    //         ith_prod_var_discounted_value =
    //           ith_prod_var_discounted_value *
    //           (1 - prod_var[0].Coupon.discount_value / 100);
    //       else if (prod_var[0].Coupon.DiscountType.name == "flat")
    //         ith_prod_var_discounted_value =
    //           ith_prod_var_discounted_value - prod_var[0].Coupon.discount_value;
    //     }

    //     amount =
    //       amount +
    //       req.body.order_items[i].quantity * ith_prod_var_discounted_value;
    //   }

    //   console.log("hello ", amount);
    //   return

    //   let saved_shipping_info = await crudService.insert(
    //     OrderLocation,
    //     req.body.shipping_address
    //   );

    //   req.body.shipping_address_id = saved_shipping_info.id;
    //   if (req.body.is_shipping_is_billing == true)
    //     req.body.billing_address_id = saved_shipping_info.id;
    //   else {
    //     let saved_billing_info = await crudService.insert(
    //       OrderLocation,
    //       req.body.billing_address
    //     );
    //     req.body.billing_address_id = saved_billing_info.id;
    //   }
    //   if (req.body.is_payment_online) req.body.status_id = 8;
    //   else req.body.status_id = 8;

    //   const order_data = {};
    //   order_data.user_id = req.body.user_id;
    //   order_data.status_id = req.body.status_id;
    //   order_data.amount = amount;
    //   order_data.billing_address_id = req.body.billing_address_id;
    //   order_data.shipping_address_id = req.body.shipping_address_id;
    //   order_data.is_payment_online = req.body.is_payment_online;

    //   const saved_order_data = await crudService.insert(Order, order_data);
    //   for (let order_item of req.body.order_items) {
    //     order_item.order_id = saved_order_data.id;
    //     order_item.qty = order_item.quantity;
    //     order_item.product_variant_id = order_item.product_variants_id;
    //     await crudService.insert(OrderItem, order_item);
    //   }

    //   if (!req.body.is_payment_online)
    //     return res.status(201).json({
    //       code: 201,
    //       success: false,
    //       message:
    //         "Order Placed Successfully. ( OrderType : Cash on Delivery )",
    //     });

    //   const razorPayAmount = parseInt(
    //     Math.round(saved_order_data.amount * 100)
    //   );
    //   if (razorPayAmount < 0)
    //     return res.status(401).json({
    //       code: 401,
    //       success: false,
    //       message:
    //         "This Error is never supposed to occur until and unless for some Product the disount price was more than its actual price.",
    //     });
    //   const reference_id = `${saved_order_data.id.toString()}_${Date.now()}`;

    //   instance.paymentLink.create(
    //     {
    //       amount: razorPayAmount,
    //       currency: "INR",
    //       reference_id: reference_id,
    //       accept_partial: false,
    //       description: "Online Payment for Sugandh",
    //       customer: {
    //         name: "Sugandh Customer",
    //       },
    //       notify: {
    //         sms: true,
    //         email: true,
    //       },
    //       reminder_enable: true,
    //       notes: {
    //         policy_name: "Sugandh Order",
    //       },
    //       callback_url: 'http://localhost:5021/public/api/order/razorpay/validation/v2',// process.env.CALLBACK_URL,
    //       callback_method: "get",
    //     },
    //     function (err, order) {
    //       if (err) {
    //         console.log(err);
    //         return res.status(500).json({ message: err, success: false });
    //       }
    //       return res.status(200).json({
    //         data: order,
    //         messgae:
    //           "Order Placed successfully. ( OrderType : Online Payment. )",
    //         success: true,
    //       });
    //     }
    //   );
    // } catch (error) {
    //   console.log(error);
    //   return res.status(501).json({
    //     code: 501,
    //     success: false,
    //     message: "Internal Server Error.",
    //     error: error.error,
    //   });
    // }
  };

  const validate_order = async (req, res) => {
    const {
      razorpay_signature,
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_payment_id,
    } = req.query;

    const razorpay_payment_signature = razorpay_signature;
    let signatureData =
      razorpay_payment_link_id +
      "|" +
      razorpay_payment_link_reference_id +
      "|" +
      razorpay_payment_link_status +
      "|" +
      razorpay_payment_id;

    console.log(signatureData);

    signatureData = signatureData.toString();
    const expected_signature = crypto
      .createHmac("sha256", process.env.RAZOR_SECRET_KEY.toString())
      .update(signatureData)
      .digest("hex");

    if (expected_signature !== razorpay_payment_signature)
      return res.status(400).json({
        data: { signatureIsValid: "false" },
        message: "Signature is Invalid.",
        success: false,
      });

    if (req.query.razorpay_payment_link_status !== "paid")
      return res.status(400).json({
        message: "payment failed please contact the administration.",
        success: false,
      });

    const fetchPaymentLink = util.promisify(instance.paymentLink.fetch);

    try {
      const data = await fetchPaymentLink(razorpay_payment_link_id);
      let order_data = data.reference_id.split("_");
      console.log("order_data >> ", order_data);
      const order_id = parseInt(order_data[0]);

      const updateData = await crudService.update(
        InvoiceModel,
        { id: order_id },
        { payment_status: true }
      );

      let options = {}

      options.where = {
        id: order_id
      }
      const response = await crudService.getOne(InvoiceModel, options);

      const userData = await crudService.getOne(UserModel, { id: response.user_id })

      const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Placed Details</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 80%;
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #555;
                    line-height: 1.5;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    padding: 10px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #f2f2f2;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    background-color: #f2f2f2;
                    border-top: 1px solid #ddd;
                    margin-top: 20px;
                    border-radius: 0 0 8px 8px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Order Placed Details</h1>
                <p>Dear Customer,</p>
                <p>We are pleased to inform you that your order has been Placed.:</p>
                <table>
                    <tr>
                        <th>Invoice Number</th>
                        <td>${response.invoice_number}</td>
                    </tr>
                </table>
                <p>If you have any questions or need further assistance, please feel free to contact our support team at ${process.env.ADMIN_EMAIL}.</p>
                <p>Thank you for shopping with us!</p>
                <div class="footer">
                    <p>&copy; 2024 Sugandh. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`

      await emailSend(userData.email_id, html, "Placed Order")

      await emailSend(process.env.ADMIN_EMAIL, html, "Placed Order")

      // let whereClause_order = {};
      // whereClause_order.is_deleted = false;
      // whereClause_order.id = order_id;

      // let exec_params_order = {
      //   where: whereClause_order,
      //   include: [
      //     {
      //       model: OrderItem,
      //       attributes: {
      //         exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
      //       },
      //       include: [
      //         {
      //           model: ProductVariants,
      //           attributes: {
      //             exclude: [
      //               "is_deleted",
      //               "deleted_at",
      //               "createdAt",
      //               "updatedAt",
      //             ],
      //           },
      //           include: [
      //             {
      //               model: Stock,
      //               where: { property_id: 1, is_deleted: false },
      //               attributes: {
      //                 exclude: [
      //                   "is_deleted",
      //                   "deleted_at",
      //                   "createdAt",
      //                   "updatedAt",
      //                 ],
      //               },
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      // };

      // const order_details = await crudService.get(Order, exec_params_order);
      // console.log(order_details);
      // for (let orderItem of order_details[0].OrderItems) {
      //   console.log(
      //     "Stock ID ",
      //     orderItem.ProductVariant.Stocks[0].id,
      //     " Current Stock ",
      //     orderItem.ProductVariant.Stocks[0].quantity,
      //     " Purchased Stock ",
      //     orderItem.qty,
      //     " updated stock ",
      //     orderItem.ProductVariant.Stocks[0].quantity - orderItem.qty
      //   );
      //   await crudService.update(
      //     Stock,
      //     { id: orderItem.ProductVariant.Stocks[0].id },
      //     {
      //       quantity:
      //         orderItem.ProductVariant.Stocks[0].quantity - orderItem.qty,
      //     }
      //   );
      // }

      // const saved_razorpay_details = await OrderRazorPay.create({
      //   signature: razorpay_signature,
      //   payment_link_id: razorpay_payment_link_id,
      //   payment_link_reference_id: razorpay_payment_link_reference_id,
      //   payment_link_status: razorpay_payment_link_status,
      //   payment_id: razorpay_payment_id,
      // });

      // await Order.update(
      //   { razorpay_id: saved_razorpay_details.id },
      //   { where: { id: order_id }, returning: true }
      // );

      // let whereClause_user = {};
      // whereClause_user.is_deleted = false;
      // whereClause_user.id = { [Sequelize.Op.eq]: order_details[0].user_id };

      // let executing_parameters = {
      //   where: whereClause_user,
      //   attributes: ["email_id"],
      // };

      // let user_data = await crudService.get(User, executing_parameters);

      // const on_order_placed_email_to_user = {
      //   from: process.env.SENDGRID_SENDER_EMAIL,
      //   to: user_data[0].email_id,
      //   subject: "Your order has been placed.",
      //   text: "Your Order has been placed.",
      // };

      // let email_response_1 = await sgMail.send(on_order_placed_email_to_user);

      // const on_order_placed_email_to_sugandh = {
      //   from: process.env.SENDGRID_SENDER_EMAIL,
      //   to: process.env.OFFICIAL_SUGANDH_EMAIL,
      //   subject: "New Order Placed",
      //   text: "New Order Placed",
      // };

      // let email_response_2 = await sgMail.send(
      //   on_order_placed_email_to_sugandh
      // );

      // // return res.status(200).json({
      // //   message: "success",
      // //   data: order_details,
      // //   success: true,
      // // });

      return res.status(200).redirect("https://sugandh.co/paymentsuccess");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error, success: false });
    }
  };

  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, OrderSchema)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            response = await crudService.update(
              Order,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(Order, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Order record ${reqData.id ? "updated" : "created"
              } successfully`,
            data: response || {},
          });
        } catch (error) {
          console.log(error);
          return res.status(501).json(error);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          code: 500,
          success: false,
          message: "Internal Server Error",
          error: err,
        });
      });
  };

  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        await crudService.destroy(Order, { id: req.body.record_id });
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Order record deleted successfully.`,
          data: {},
        });
      } else {
        return res.status(207).json({
          code: 207,
          success: false,
          message: `Invalid Url Parameters`,
          data: {},
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(501).json(error);
    }
  };

  const get = async (req, res) => {
    try {
      let whereClause = {};
      whereClause.is_deleted = false;

      if (req.query.id) whereClause.id = { [Sequelize.Op.eq]: req.query.id };
      if (req.query.user_id)
        whereClause.user_id = { [Sequelize.Op.eq]: req.query.user_id };
      if (req.query.razorpay_id)
        whereClause.razorpay_id = { [Sequelize.Op.eq]: req.query.razorpay_id };
      if (req.query.status_id)
        whereClause.status_id = { [Sequelize.Op.eq]: req.query.status_id };
      if (req.query.is_payment_online)
        whereClause.is_payment_online = {
          [Sequelize.Op.eq]: req.query.is_payment_online,
        };
      if (req.query.shipping_address_id)
        whereClause.shipping_address_id = {
          [Sequelize.Op.eq]: req.query.shipping_address_id,
        };
      if (req.query.billing_address_id)
        whereClause.billing_address_id = {
          [Sequelize.Op.eq]: req.query.billing_address_id,
        };

      const {
        query: { current_page, page_size },
      } = req;
      let skip, limit;
      if (current_page && page_size) {
        skip =
          parseInt(current_page) > 0
            ? (parseInt(current_page) - 1) * parseInt(page_size)
            : 0;
        limit = parseInt(page_size);
      }

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        skip,
        limit,
        sortField: "name",
        include: [
          {
            model: User,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
          },
          {
            model: OrderItem,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
          },
          {
            model: OrderLocation,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
          },
          {
            model: OrderRazorPay,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
          },
          {
            model: OrderStatus,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
          },
        ],
      };

      let response = await crudService.get(Order, executing_parameters);

      let page_info = {};
      page_info.total_items = response.totalCount;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.totalCount / page_size);
      page_info.page_size = response.length;

      return res.status(200).json({
        code: 200,
        success: true,
        message: "Order Record found.",
        data: response,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json(error);
    }
  };

  return {
    master_save,
    validate_order,
    save,
    destroy,
    get,
  };
};
module.exports = OrderApi;

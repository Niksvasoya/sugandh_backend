const InvoiceModel = require("../../../api/models/Accounting/Invoice");
const InvoiceDetailsModel = require("../../../api/models/Accounting/InvoiceDetails");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { InvoiceSchemas } = require("../../schemas/AccountingSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const User = require("../../models/User/User");
const Logistics = require("../../models/Logistics/Logistics");
const OrderPaymentDetails = require("../../models/Accounting/OrderPaymentDetails");
const Product = require("../../models/Product/Product");
const productShippingDetails = require("../../models/Product/ShippingDetails");
const UserModel = require("../../models/User/User");
const RefuncCouponModel = require('../../models/Coupon/RefundCoupon')
const { emailSend } = require("../../helper/mail");
const voucher_codes = require('voucher-code-generator');


const InvoiceApi = () => {
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

  // For create and update Invoice
  const save = async (req, res) => {
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

            console.log("reqData >>", reqData);
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

          let options = {}

          options.where = {
            invoice_number: req.body.invoice_number
          }

          const invoiceData = await crudService.getOne(InvoiceModel, options)

          let options2 = {}

          options2.where = {
            invoice_id: invoiceData.id
          }
          const invoiceDetais = await crudService.getOne(InvoiceDetailsModel, options2)

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
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #555;
            line-height: 1.5;
            margin: 10px 0;
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
        .product-image {
            width: 100px;
            height: auto;
            border-radius: 8px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Placed Details</h1>
        <p>Dear Customer,</p>
        <p>We are pleased to inform you that your order has been placed.</p>
        <table>
            <tr>
                <th>Invoice Number</th>
                <td>${req.body?.invoice_number}</td>
            </tr>
            <tr>
                <th>Product Name</th>
                <td>${invoiceDetais?.product_name}</td>
            </tr>
            <tr>
                <th>Size</th>
                <td>${invoiceDetais?.size}</td>
            </tr>
            <tr>
                <th>Quantity</th>
                <td>${invoiceDetais?.quantity}</td>
            </tr>
            <tr>
                <th>MRP</th>
                <td>${invoiceDetais?.mrp}</td>
            </tr>
            <tr>
                <th>Image</th>
                <td><img src=${invoiceDetais?.image} alt="Product Image" class="product-image"></td>
            </tr>
        </table>
        <p>If you have any questions or need further assistance, please feel free to contact our support team at ${process.env.ADMIN_EMAIL}.</p>
        <p>Thank you for shopping with us!</p>
        <div class="footer">
            <p>&copy; 2024 Sugandh. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

          await emailSend(userData.email_id, html, "Placed Order")

          await emailSend(process.env.ADMIN_EMAIL, html, "Placed Order")

          return res.status(201).json({
            code: 200,
            success: true,
            message: `Invoice ${reqData.id ? "updated" : "created"
              } successfully`,
            data: response || {},
          });
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
  };
  // for deleting Invoice
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(InvoiceModel, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Invoice deleted successfully.`,
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
      return res.status(error.status).json(error.error);
    }
  };

  const get = async (req, res) => {
    try {
      console.log("nikul get ", req);
      const order_status_id = req?.query?.order_status_id
      let response;
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.query.keyword) {
        whereClause.invoice_number = {
          [Sequelize.Op.iLike]: req.query.keyword + "%",
        };
      }
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      if (req.query.payment_status) {
        whereClause.payment_status = req.query.payment_status;
      }
      if (req.query.user_id) {
        whereClause.user_id = { [Op.eq]: req.query.user_id };
      }
      if (req.query.invoice_number) {
        whereClause.invoice_number = { [Op.eq]: req.query.invoice_number };
      }
      const {
        query: { current_page, page_size },
      } = req;
      let offset;
      if (current_page && page_size) {
        offset = (current_page - 1) * page_size;
      } else {
        offset = undefined;
      }

      order_status_id ? whereClause.order_status_id = order_status_id : order_status_id

      response = await crudService.getAll(InvoiceModel, {
        where: whereClause,
        attributes: {
          exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
        },
        distinct: true,
        limit: page_size,
        offset: offset,

        include: [
          {
            model: InvoiceDetailsModel,
            where: { is_deleted: false },
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            required: false,
            include: [
              {
                model: Product,
                where: { is_deleted: false },
                attributes: ["sku"],
                required: false,
              },
            ],
          },
          // {
          //     model: OrderPaymentDetails,
          //     where: { is_deleted: false },
          //     attributes: { exclude: ['is_deleted', 'deleted_at', 'createdAt', 'updatedAt'] },
          //     required: false,
          // },
          {
            model: User,
            where: { is_deleted: false },
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            required: false,
          },
          {
            model: Logistics,
            where: { is_deleted: false },
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            required: false,
          },
        ],
      });

      // console.log(response);
      for (let data of response.rows) {
        let totalIGST = 0;
        let totalCGST = 0;
        let totalSGST = 0;
        let total_gst_exclusive_rate = 0;
        let total_gst_inclusive_rate = 0;
        let total_quantity = 0;
        let total_gst_exclusive_amount = 0;
        data.InvoiceDetails.forEach((detail) => {
          totalCGST += detail.cgst_amount * detail.quantity || 0;
          totalSGST += detail.sgst_amount * detail.quantity || 0;
          totalIGST += detail.igst_amount * detail.quantity || 0;
          total_gst_exclusive_rate += detail.total_amount || 0;
          total_gst_inclusive_rate += detail.mrp * detail.quantity || 0;
          total_quantity += detail.quantity || 0;
          total_gst_exclusive_amount +=
            detail.total_amount * detail.quantity || 0;
        });
        data.totalCGST = totalCGST;
        data.totalSGST = totalSGST;
        data.totalIGST = totalIGST;
        data.total_gst_inclusive_rate = total_gst_inclusive_rate;
        data.total_gst_exclusive_rate = total_gst_exclusive_rate;
        data.total_gst_exclusive_amount = total_gst_exclusive_amount;
        data.total_quantity = total_quantity;
      }

      // for pagination in Invoice
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Invoice get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const getDataByUserId = async (req, res) => {
    const user_id = req?.query?.id
    let options = {}
    options.where = {
      user_id: user_id
    }

    const response = await crudService.getAll(InvoiceModel, options);
    return res.status(200).json({
      code: 200,
      success: true,
      message: `Get Order Data successfully.`,
      data: response,
    });
  }

  const updateInvoice = async (req, res) => {
    try {
      const { id, self_shipping_details, is_manual_shipping, awb_number } = req.body

      // save logistic detais

      const shippingData = {
        logistics_id: self_shipping_details.logistics_id,
        is_manual_shipping: is_manual_shipping,
        date_of_dispatch: self_shipping_details.date_of_dispatch,
        delivery_date: self_shipping_details.delivery_date,
        length: self_shipping_details.length,
        height: self_shipping_details.height,
        weight: self_shipping_details.weight
      }

      const saveData = await crudService.insert(productShippingDetails, shippingData);

      const data = { order_status_id: 9, shipping_details_id: saveData.id }

      const updateData = await crudService.update(
        InvoiceModel,
        { id: id },
        data
      );

      let options = {}

      options.where = {
        id: id
      }
      const response = await crudService.getOne(InvoiceModel, options);

      let options2 = {}

      options2.where = {
        invoice_id: response.id
      }
      const invoiceDetais = await crudService.getOne(InvoiceDetailsModel, options2)

      const userData = await crudService.getOne(UserModel, { id: response.user_id })


      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Shipment Details</title>
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
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #555;
            line-height: 1.5;
            margin: 10px 0;
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
        .product-image {
            width: 100px;
            height: auto;
            border-radius: 8px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Shipment Details</h1>
        <p>Dear Customer,</p>
        <p>We are pleased to inform you that your order has been shipped.

</p>
        <table>
            <tr>
                <th>Invoice Number</th>
                <td>${response?.invoice_number}</td>
            </tr>
<tr>
                <th>Date of Dispatch</th>
                <td>${shippingData?.date_of_dispatch}</td>
            </tr>
 <tr>
                <th>Delivery Date</th>
                <td>${shippingData?.delivery_date}</td>
            </tr>
            <tr>
                <th>Product Name</th>
                <td>${invoiceDetais?.product_name}</td>
            </tr>
            <tr>
                <th>Size</th>
                <td>${invoiceDetais?.size}</td>
            </tr>
            <tr>
                <th>Quantity</th>
                <td>${invoiceDetais?.quantity}</td>
            </tr>
            <tr>
                <th>MRP</th>
                <td>${invoiceDetais?.mrp}</td>
            </tr>
            <tr>
                <th>Image</th>
                <td><img src=${invoiceDetais?.image} alt="Product Image" class="product-image"></td>
            </tr>
        </table>
        <p>If you have any questions or need further assistance, please feel free to contact our support team at ${process.env.ADMIN_EMAIL}.</p>
        <p>Thank you for shopping with us!</p>
        <div class="footer">
            <p>&copy; 2024 Sugandh. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
      await emailSend(userData.email_id, html, "Shipped Order")

      await emailSend(process.env.ADMIN_EMAIL, html, "Shipped Order")


      return res.status(200).json({
        code: 200,
        success: true,
        message: `Shipped order successfully.`,
        data: response,
      });


    } catch (error) {
      console.log("Error", error);
      const statusCode = error?.status || 400
      return res.status(statusCode).json(error.error);
    }
  }

  const delivered = async (req, res) => {
    try {
      const { id, delivery_date } = req.body
      const data = { order_status_id: 10 }

      let options = {}
      options.where = {
        id: id
      }

      const response = await crudService.getOne(InvoiceModel, options);
      if (response) {
        const updateData = await crudService.update(
          InvoiceModel,
          { id: id },
          data
        );

        let options2 = {}

        options2.where = {
          invoice_id: response.id
        }
        const invoiceDetais = await crudService.getOne(InvoiceDetailsModel, options2)
        await crudService.update(productShippingDetails, { id: response?.shipping_details_id }, { delivery_date })
        const userData = await crudService.getOne(UserModel, { id: response.user_id })

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Delivered Details</title>
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
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #555;
            line-height: 1.5;
            margin: 10px 0;
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
        .product-image {
            width: 100px;
            height: auto;
            border-radius: 8px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Delivered Details</h1>
        <p>Dear Customer,</p>
        <p>We are pleased to inform you that your order has been Delivered.:

</p>
        <table>
            <tr>
                <th>Invoice Number</th>
                <td>${response?.invoice_number}</td>
            <tr>
                        <th>Delivery Date</th>
                        <td>${delivery_date}</td>
                    </tr>
            <tr>
                <th>Product Name</th>
                <td>${invoiceDetais?.product_name}</td>
            </tr>
            <tr>
                <th>Size</th>
                <td>${invoiceDetais?.size}</td>
            </tr>
            <tr>
                <th>Quantity</th>
                <td>${invoiceDetais?.quantity}</td>
            </tr>
            <tr>
                <th>MRP</th>
                <td>${invoiceDetais?.mrp}</td>
            </tr>
            <tr>
                <th>Image</th>
                <td><img src=${invoiceDetais?.image} alt="Product Image" class="product-image"></td>
            </tr>
        </table>
        <p>If you have any questions or need further assistance, please feel free to contact our support team at ${process.env.ADMIN_EMAIL}.</p>
        <p>Thank you for shopping with us!</p>
        <div class="footer">
            <p>&copy; 2024 Sugandh. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

        await emailSend(userData.email_id, html, "Delivered Order")

        await emailSend(process.env.ADMIN_EMAIL, html, "Delivered Order")

        return res.status(200).json({
          code: 200,
          success: true,
          message: `Delivered order successfully.`,
          data: updateData,
        });

      } else {
        return res.status(401).json("Order not found");
      }


    } catch (error) {
      return res.status(error?.status).json(error.error);
    }
  }

  const refund = async (req, res) => {
    try {
      const { id } = req.body
      const updateData = await crudService.update(
        InvoiceModel,
        { id: id },
        { order_status_id: 11 }
      );

      let options = {}

      options.where = {
        id: id
      }
      const response = await crudService.getOne(InvoiceModel, options);
      let options2 = {}

      options2.where = {
        invoice_id: response.id
      }
      const invoiceDetais = await crudService.getOne(InvoiceDetailsModel, options2)
      const userData = await crudService.getOne(UserModel, { id: response.user_id })

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Canceled Details</title>
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
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #555;
            line-height: 1.5;
            margin: 10px 0;
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
        .product-image {
            width: 100px;
            height: auto;
            border-radius: 8px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Canceled Details</h1>
        <p>Dear Customer,</p>
        <p>We are pleased to inform you that your order has been Canceled.:

</p>
        <table>
            <tr>
                <th>Invoice Number</th>
                <td>${response?.invoice_number}</td>
            <tr>
                <th>Product Name</th>
                <td>${invoiceDetais?.product_name}</td>
            </tr>
            <tr>
                <th>Size</th>
                <td>${invoiceDetais?.size}</td>
            </tr>
            <tr>
                <th>Quantity</th>
                <td>${invoiceDetais?.quantity}</td>
            </tr>
            <tr>
                <th>MRP</th>
                <td>${invoiceDetais?.mrp}</td>
            </tr>
            <tr>
                <th>Image</th>
                <td><img src=${invoiceDetais?.image} alt="Product Image" class="product-image"></td>
            </tr>
        </table>
        <p>If you have any questions or need further assistance, please feel free to contact our support team at ${process.env.ADMIN_EMAIL}.</p>
        <p>Thank you for shopping with us!</p>
        <div class="footer">
            <p>&copy; 2024 Sugandh. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

      await emailSend(userData.email_id, html, "Canceled Order")

      await emailSend(process.env.ADMIN_EMAIL, html, "Canceled Order")

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Cancel order successfully.`,
        data: updateData,
      });

    } catch (error) {
      return res.status(error?.status).json(error.error);
    }
  }

  const genrateCoupon = async (req, res) => {
    try {

      const { id } = req.body;

      // Get the invoice data by ID
      const invoice = await crudService.getOne(InvoiceModel, { where: { id } });

      if (invoice?.is_refund_coupon_gen) {
        return res.status(201).json({
          code: 201,
          success: true,
          message: 'Coupon already generated',
          data: invoice,
        });
      }

      // Generate a unique coupon code
      const couponCode = voucher_codes.generate({ length: 8, count: 1 })[0];

      // Get invoice details
      const invoiceDetail = await crudService.getOne(InvoiceDetailsModel, { where: { invoice_id: id } });

      // Calculate the expiry date (one month from now)
      const expireDate = new Date();
      expireDate.setMonth(expireDate.getMonth() + 1);

      // Create the refund coupon object
      const refundCoupon = {
        coupon_code: couponCode,
        user_id: invoice.user_id,
        amount: invoiceDetail.main_mrp || invoiceDetail.mrp,
        invoice_id: id,
        expire_date: expireDate,
        isused: false
      };

      console.log("refundCoupon >>> ", refundCoupon);

      const saveData = await crudService.insert(RefuncCouponModel, refundCoupon)
      await crudService.update(
        InvoiceModel,
        { id: id },
        { is_refund_coupon_gen: true }
      );

      const html = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancellation Notice</title>
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
        .coupon {
            background-color: #ffeb3b;
            border: 1px dashed #333;
            padding: 10px;
            text-align: center;
            font-size: 1.2em;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Cancellation Notice</h1>
        <p>Dear Customer,</p>
        <p>We regret to inform you that your order has been cancelled. We apologize for any inconvenience this may cause.</p>
        <table>
            <tr>
                <th>Invoice Number</th>
                <td>${invoice?.invoice_number}</td>
            </tr>
            <tr>
                <th>Expire Date</th>
                <td>${refundCoupon.expire_date}</td>
            </tr>
        </table>
        <p>As a token of our appreciation for your understanding, we would like to offer you the following coupon:</p>
        <div class="coupon">
            <p><strong>Coupon Code: ${couponCode}</strong></p>
            <p>Get ${refundCoupon.amount} off on your next purchase.</p>
        </div>
        <p>If you have any questions or need further assistance, please feel free to contact our support team at ${process.env.ADMIN_EMAIL}.</p>
        <p>Thank you for your understanding and we hope to serve you better in the future!</p>
        <div class="footer">
            <p>&copy; 2024 Sugandh. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

      `

      const userData = await crudService.getOne(UserModel, { id: invoice.user_id })

      await emailSend(userData.email_id, html, "Placed Order")

      await emailSend(process.env.ADMIN_EMAIL, html, "Placed Order")

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Genrate coupon successfully.`,
        data: saveData,
      });
    } catch (error) {
      console.log("Error  >>> ", error);
      return res.status(error?.status).json(error.error);
    }
  }

  const genrateCreditPoint = async (req, res) => {
    try {

      const { id } = req.body;

      // Get the invoice data by ID
      const invoice = await crudService.getOne(InvoiceModel, { where: { id } });

      if (invoice?.is_refund_coupon_gen) {
        return res.status(201).json({
          code: 201,
          success: true,
          message: 'Credit Points already generated',
          data: invoice,
        });
      }

      // Get invoice details
      const invoiceDetail = await crudService.getOne(InvoiceDetailsModel, { where: { invoice_id: id } });

      const userData = await crudService.getOne(UserModel, { id: invoice.user_id })

      const credit_point = Math.floor(userData?.credit_point + (invoiceDetail.main_mrp || invoiceDetail.mrp));

      const updatePoint = await crudService.update(UserModel, { id: invoice.user_id }, { credit_point: credit_point });

      await crudService.update(
        InvoiceModel,
        { id: id },
        { is_refund_coupon_gen: true }
      );

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Genrate Credit Point successfully.`,
        data: credit_point,
      });
    } catch (error) {
      console.log("Error  >>> ", error);
      return res.status(error?.status).json(error.error);
    }
  }

  const getCredit = async (req, res) => {
    try {
      const { id } = req.body
      const userData = await crudService.getOne(UserModel, { where: { id: id } })
      // const couponList = await crudService.getAll(RefuncCouponModel, { where: { user_id: id, isused: false } });
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Get Credit successfully.`,
        data: userData,
      });
    } catch (error) {
      const statusCode = error?.status || 400
      return res.status(statusCode).json(error.error);
    }
  }

  const getCoupon = async (req, res) => {
    try {
      const { id, coupon } = req.body
      const couponList = await crudService.getOne(RefuncCouponModel, { where: { user_id: id, coupon_code: coupon, isused: false } });
      if (couponList) {
        const currentDate = new Date();
        if (new Date(couponList.expire_date) <= currentDate) {
          return res.status(202).json({
            code: 202,
            success: false,
            message: 'Coupon is expired',
          });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Get coupon successfully.`,
          data: couponList,
        });
      } else {
        return res.status(201).json({
          code: 201,
          success: true,
          message: `invalid coupon`,
          data: couponList,
        });
      }
    } catch (error) {
      const statusCode = error?.status || 400
      return res.status(statusCode).json(error.error);
    }
  }

  const cancel = async (req, res) => {
    try {
      try {
        const { id, reason } = req.body
        const updateData = await crudService.update(
          InvoiceModel,
          { id: id },
          { order_status_id: 12, reason: reason }
        );

        let options = {}

        options.where = {
          id: id
        }
        const response = await crudService.getOne(InvoiceModel, options);
        let options2 = {}

        options2.where = {
          invoice_id: response.id
        }
        const invoiceDetais = await crudService.getOne(InvoiceDetailsModel, options2)
        const userData = await crudService.getOne(UserModel, { id: response.user_id })

        const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Canceled Details</title>
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
              font-size: 24px;
              margin-bottom: 20px;
          }
          p {
              color: #555;
              line-height: 1.5;
              margin: 10px 0;
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
          .product-image {
              width: 100px;
              height: auto;
              border-radius: 8px;
              margin-top: 10px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Order Canceled Details</h1>
          <p>Dear Customer,</p>
          <p>We are pleased to inform you that your order has been Canceled.:
  
  </p>
          <table>
              <tr>
                  <th>Invoice Number</th>
                  <td>${response?.invoice_number}</td>
              <tr>
                  <th>Product Name</th>
                  <td>${invoiceDetais?.product_name}</td>
              </tr>
              <tr>
                  <th>Size</th>
                  <td>${invoiceDetais?.size}</td>
              </tr>
              <tr>
                  <th>Quantity</th>
                  <td>${invoiceDetais?.quantity}</td>
              </tr>
              <tr>
                  <th>MRP</th>
                  <td>${invoiceDetais?.mrp}</td>
              </tr>
              <tr>
                  <th>Image</th>
                  <td><img src=${invoiceDetais?.image} alt="Product Image" class="product-image"></td>
              </tr>
          </table>
          <p>If you have any questions or need further assistance, please feel free to contact our support team at ${process.env.ADMIN_EMAIL}.</p>
          <p>Thank you for shopping with us!</p>
          <div class="footer">
              <p>&copy; 2024 Sugandh. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `

        await emailSend(userData.email_id, html, "Canceled Order")

        await emailSend(process.env.ADMIN_EMAIL, html, "Canceled Order")

        return res.status(200).json({
          code: 200,
          success: true,
          message: `Cancel order successfully.`,
          data: updateData,
        });

      } catch (error) {
        return res.status(error?.status).json(error.error);
      }

    } catch (error) {
      console.log("Error  >>> ", error);
      return res.status(error?.status).json(error.error);
    }
  }

  return {
    save,
    destroy,
    get,
    getDataByUserId,
    updateInvoice,
    delivered,
    refund,
    genrateCoupon,
    genrateCreditPoint,
    getCredit,
    getCoupon,
    cancel
  };
};
module.exports = InvoiceApi;

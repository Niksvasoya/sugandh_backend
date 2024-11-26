const Order = require("../../models/Order/Order");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { OrderSchemas } = require("../../schemas/OrderSchemas");
const Sequelize = require("sequelize");
const { calculateLimitAndOffset, paginate } = require("paginate-info");
const { Op } = require("sequelize");
const OrderDetails = require("../../models/Order/OrderDetails");
const OrderPaymentDetails = require("../../models/Order/OrderPaymentDetails");
const OrderLocationDetails = require("../../models/Order/OrderLocationDetails");

const sgMail = require("@sendgrid/mail");
const User = require("../../models/User/User");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const OrderApi = () => {
  // For create and update Order history
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, OrderSchemas)
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
            console.log(response);
            for (let data of reqData.details) {
              console.log(data);
              data.order_id = response.id;
              await crudService.insert(OrderDetails, data);
            }
            if (reqData.payment_details) {
              reqData.payment_details.order_id = response.id;
              await crudService.insert(
                OrderPaymentDetails,
                reqData.payment_details
              );
            }
            if (reqData.billing_address) {
              reqData.billing_address.order_id = response.id;
              await crudService.insert(
                OrderLocationDetails,
                reqData.payment_details
              );
            }
            if (reqData.shipping_address && reqData.is_shipping_address) {
              reqData.billing_address.order_id = response.id;
              await crudService.insert(
                OrderLocationDetails,
                reqData.payment_details
              );
            }

            let whereClause_user = {};
            whereClause_user.is_deleted = false;
            whereClause_user.id = { [Sequelize.Op.eq]: reqData.user_id };

            let executing_parameters = {
              where: whereClause_user,
              attributes: ["email_id"],
            };

            let user_data = await crudService.get(User, executing_parameters);

            // send email to user regarding order being placed successfully with order details
            const on_order_placed_email_to_user = {
              from: process.env.SENDGRID_SENDER_EMAIL,
              to: user_data[0].email_id,
              subject: "Your order has been placed.",
              text: "Your Order has been placed.",
            };

            let email_response_1 = await sgMail.send(
              on_order_placed_email_to_user
            );
            console.log(email_response_1);
            // send email to sugandh offical email regarding getting new order with user details in it

            const on_order_placed_email_to_sugandh = {
              from: process.env.SENDGRID_SENDER_EMAIL,
              to: process.env.OFFICIAL_SUGANDH_EMAIL,
              subject: "New Order Placed",
              text: "New Order Placed",
            };

            let email_response_2 = await sgMail.send(
              on_order_placed_email_to_sugandh
            );
            console.log(email_response_2);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Order history ${
              reqData.id ? "updated" : "created"
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
  // for deleting Order history
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(Order, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Order history deleted successfully.`,
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
      let response;
      let whereClause = {};
      whereClause.is_deleted = false;
      // if (req.query.keyword) {
      //     whereClause.name = { [Sequelize.Op.iLike]: req.query.keyword + "%" }
      // }
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      if (req.query.user_id) {
        whereClause.user_id = { [Op.eq]: req.query.user_id };
      }
      if (req.query.supplier_id) {
        whereClause.supplier_id = { [Op.eq]: req.query.supplier_id };
      }
      if (req.query.product_variant_id) {
        whereClause.product_variant_id = {
          [Op.eq]: req.query.product_variant_id,
        };
      }
      if (req.query.order_status_id) {
        whereClause.order_status_id = { [Op.eq]: req.query.order_status_id };
      }
      response = await crudService.get(Order, {
        where: whereClause,
        // attributes: ['id', 'name', 'description'],
        distinct: true,
        // order: [
        //     ['name', 'ASC'],
        // ],
        include: [
          {
            model: OrderDetails,
            // attributes: ['id', 'name']
          },
          {
            model: OrderPaymentDetails,
            // attributes: ['id', 'name']
          },
          {
            model: OrderLocationDetails,
            // attributes: ['id', 'name']
          },
        ],
      });
      // for pagination in Order history
      if (req.query.pageSize != undefined) {
        const {
          query: { currentPage, pageSize },
        } = req;
        const { limit, offset } = calculateLimitAndOffset(
          currentPage,
          pageSize
        );
        const count = response.length;
        const paginatedData = response.slice(offset, offset + limit);
        const paginationInfo = paginate(currentPage, count, paginatedData);
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Order history get successfully.`,
          data: paginatedData,
          pageInfo: paginationInfo,
        });
      } else {
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Order history get successfully.`,
          data: response,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  return {
    save,
    destroy,
    get,
  };
};
module.exports = OrderApi;

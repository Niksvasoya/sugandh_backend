const OrderHistory = require("../../models/Order/OrderHistory");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { OrderHistorySchemas } = require("../../schemas/OrderSchemas");
const Sequelize = require("sequelize");
const { calculateLimitAndOffset, paginate } = require("paginate-info");
const { Op } = require("sequelize");
const OrderHistoryDetails = require("../../models/Order/OrderHistoryDetails");
const OrderPaymentDetails = require("../../models/Order/OrderHistoryPaymentDetails");
const OrderHistoryApi = () => {
  // For create and update Order history
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, OrderHistorySchemas)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            response = await crudService.update(
              OrderHistory,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(OrderHistory, reqData);
            console.log(response);
            for (let data of reqData.details) {
              console.log(data);
              data.order_history_id = response.id;
              await crudService.insert(OrderHistoryDetails, data);
            }
            if (reqData.payment_details) {
              reqData.payment_details.order_history_id = response.id;
              await crudService.insert(
                OrderHistoryDetails,
                reqData.payment_details
              );
            }
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
          let response = await crudService.destroy(OrderHistory, { id: id });
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
      response = await crudService.get(OrderHistory, {
        where: whereClause,
        // attributes: ['id', 'name', 'description'],
        distinct: true,
        include: [
          {
            model: OrderHistoryDetails,
            // attributes: ['id', 'name']
          },
          {
            model: OrderPaymentDetails,
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
module.exports = OrderHistoryApi;

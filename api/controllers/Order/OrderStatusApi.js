const OrderStatusModel = require("../../../api/models/Order/OrderStatus");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { OrderStatusSchemas } = require("../../schemas/OrderSchemas");
const Sequelize = require("sequelize");
const { calculateLimitAndOffset, paginate } = require("paginate-info");
const { Op } = require("sequelize");
const OrderStatusApi = () => {
  // For create and update Order Status
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, OrderStatusSchemas)
      .then(async (reqData) => {
        try {
          console.log("check");
          let response;
          if (reqData.id) {
            response = await crudService.update(
              OrderStatusModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(OrderStatusModel, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Order Status ${
              reqData.id ? "updated" : "created"
            } successfully`,
            data: response || {},
          });
        } catch (error) {
          return res.status(error.status).json(error.error);
        }
      })
      .catch((err) => {
        return res.status(500).json({
          code: 500,
          success: false,
          message: "Internal Server Error",
          error: err,
        });
      });
  };
  // for deleting Order Status
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(OrderStatusModel, {
            id: id,
          });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Order Status deleted successfully.`,
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
      if (req.query.keyword) {
        whereClause.name = { [Sequelize.Op.iLike]: req.query.keyword + "%" };
      }
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      response = await crudService.get(OrderStatusModel, {
        where: whereClause,
        attributes: ["id", "name", "description"],
        distinct: true,
      });
      // for pagination in Order Status
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
          message: `Order Status get successfully.`,
          data: paginatedData,
          pageInfo: paginationInfo,
        });
      } else {
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Order Status get successfully.`,
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
module.exports = OrderStatusApi;

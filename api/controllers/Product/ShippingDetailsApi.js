const ShippingDetailsModel = require("../../../api/models/Product/ShippingDetails");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { ShippingDetailsSchemas } = require("../../schemas/ProductSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const ShippingDetailsApi = () => {
  // For create and update Shipping Details
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, ShippingDetailsSchemas)
      .then(async (reqData) => {
        try {
          console.log("check");
          let response;
          if (reqData.id) {
            response = await crudService.update(
              ShippingDetailsModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(ShippingDetailsModel, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Shipping Details ${
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
  // for deleting Size
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(ShippingDetailsModel, {
            id: id,
          });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Shipping Details deleted successfully.`,
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
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      if (req.query.product_id) {
        whereClause.product_id = { [Op.eq]: req.query.product_id };
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
      response = await crudService.getAll(ShippingDetailsModel, {
        where: whereClause,
        attributes: [
          "id",
          "product_id",
          "product_variant_id",
          "length",
          "breadth",
          "height",
          "weight",
          "is_manual_shipping",
          "logistics_id",
          "delivery_date",
          "date_of_dispatch",
        ],
        distinct: true,
        limit: page_size,
        offset: offset,
        // order: [
        //     ['name', 'ASC'],
        // ],
      });
      // for pagination in Size
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Shipping Details get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
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
module.exports = ShippingDetailsApi;

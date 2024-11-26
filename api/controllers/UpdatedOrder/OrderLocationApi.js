const OrderLocation = require("../../models/UpdatedOrder/OrderLocation");
const { OrderLocationSchema } = require("../../schemas/UpdatedOrderSchema");

const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const Sequelize = require("sequelize");

const OrderLocationApi = () => {
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, OrderLocationSchema)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            response = await crudService.update(
              OrderLocation,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(OrderLocation, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Order Location record ${
              reqData.id ? "updated" : "created"
            } successfully`,
            data: response || {},
          });
        } catch (error) {
          console.log(error);
          return res.status(501).json(error);
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
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        await crudService.destroy(OrderLocation, { id: req.body.record_id });
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Order Location record deleted successfully.`,
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
      if (req.query.keyword)
        whereClause[Sequelize.Op.or] = [
          { first_name: { [Sequelize.Op.iLike]: req.query.keyword + "%" } },
          { last_name: { [Sequelize.Op.iLike]: req.query.keyword + "%" } },
          { email_id: { [Sequelize.Op.iLike]: req.query.keyword + "%" } },
        ];
      if (req.query.contact_number)
        whereClause.contact_number = {
          [Sequelize.Op.eq]: req.query.contact_number,
        };
      if (req.query.location_keyword)
        whereClause[Sequelize.Op.or] = [
          {
            city_name: {
              [Sequelize.Op.iLike]: req.query.location_keyword + "%",
            },
          },
          {
            province_name: {
              [Sequelize.Op.iLike]: req.query.location_keyword + "%",
            },
          },
          {
            country_name: {
              [Sequelize.Op.iLike]: req.query.location_keyword + "%",
            },
          },
        ];
      if (req.query.country_id)
        whereClause.country_id = {
          [Sequelize.Op.eq]: req.query.country_id,
        };
      if (req.query.province_id)
        whereClause.province_id = {
          [Sequelize.Op.eq]: req.query.province_id,
        };
      if (req.query.city_id)
        whereClause.city_id = { [Sequelize.Op.eq]: req.query.city_id };

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
      };

      let response = await crudService.get(OrderLocation, executing_parameters);

      let page_info = {};
      page_info.total_items = response.totalCount;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.totalCount / page_size);
      page_info.page_size = response.length;

      return res.status(200).json({
        code: 200,
        success: true,
        message: "Order Location record record found.",
        data: response,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json(error);
    }
  };

  return {
    save,
    destroy,
    get,
  };
};
module.exports = OrderLocationApi;

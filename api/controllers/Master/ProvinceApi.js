const ProvinceModel = require("../../../api/models/Master/Province");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { ProvinceSchemas } = require("../../schemas/MasterSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const ProvinceApi = () => {
  // for create and update province
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, ProvinceSchemas)
      .then(async (reqData) => {
        try {
          let response;
          let whereClause = {};
          whereClause.is_deleted = false;
          whereClause.name = { [Op.iLike]: reqData.name };
          if (reqData.id) {
            whereClause.id = { [Op.ne]: reqData.id };
          }
          let resCheck = await crudService.get(ProvinceModel, {
            where: whereClause,
            attributes: ["id", "name", "country_id", "latitude", "longitude"],
            distinct: true,
          });
          if (resCheck.length > 0) {
            return res.status(201).json({
              code: 204,
              success: false,
              message: "Province already exist.",
            });
          }
          if (reqData.id) {
            response = await crudService.update(
              ProvinceModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(ProvinceModel, reqData);
          }

          return res.status(201).json({
            code: 200,
            success: true,
            message: `Province ${
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

  // for deleting the province post
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(ProvinceModel, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Province deleted successfully.`,
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

  // calling the get method
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
      if (req.query.country_id) {
        whereClause.country_id = { [Op.eq]: req.query.country_id };
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
      response = await crudService.getAll(ProvinceModel, {
        where: whereClause,
        attributes: ["id", "name", "country_id", "latitude", "longitude"],
        distinct: true,
        limit: page_size,
        offset: offset,
        order: [["name", "ASC"]],
      });
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Province get successfully.`,
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
module.exports = ProvinceApi;

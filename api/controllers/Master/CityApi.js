const CityModel = require("../../../api/models/Master/City");
const ProvinceModel = require("../../../api/models/Master/Province");
const CountryModel = require("../../../api/models/Master/Country");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { CitySchemas } = require("../../schemas/MasterSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const CityApi = () => {
  // For create and update city
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, CitySchemas)
      .then(async (reqData) => {
        try {
          let response;
          let whereClause = {};
          whereClause.is_deleted = false;
          whereClause.name = { [Op.iLike]: reqData.name };
          if (reqData.id) {
            whereClause.id = { [Op.ne]: reqData.id };
          }
          let resCheck = await crudService.get(CityModel, {
            where: whereClause,
            attributes: [
              "id",
              "name",
              "province_id",
              "country_id",
              "latitude",
              "longitude",
            ],
            distinct: true,
          });
          if (resCheck.length > 0) {
            return res.status(201).json({
              code: 204,
              success: false,
              message: "City already exist.",
            });
          }
          if (reqData.id) {
            response = await crudService.update(
              CityModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(CityModel, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `City ${reqData.id ? "updated" : "created"} successfully`,
            data: response || {},
          });
        } catch (error) {
          return res.status(error.status).json(error);
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
  // for delete
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(CityModel, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `City deleted successfully.`,
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
      if (req.query.country_id && req.query.province_id) {
        whereClause.country_id = { [Op.eq]: req.query.country_id };
        whereClause.province_id = { [Op.eq]: req.query.province_id };
      }
      if (req.query.country_id) {
        whereClause.country_id = { [Op.eq]: req.query.country_id };
      }
      if (req.query.province_id) {
        whereClause.province_id = { [Op.eq]: req.query.province_id };
      }
      if (req.query.keyword) {
        whereClause.name = { [Sequelize.Op.iLike]: req.query.keyword + "%" };
      }
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
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
      response = await crudService.getAll(CityModel, {
        where: whereClause,
        attributes: [
          "id",
          "name",
          "province_id",
          "country_id",
          "latitude",
          "longitude",
        ],
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
        message: `City get successfully.`,
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
module.exports = CityApi;

const UserLocationDetailsModel = require("../../models/User/UserLocationDetails");
const crudService = require("../../services/crud.service");
const { UserLocationDetailsSchemas } = require("../../schemas/UserSchemas");
const Sequelize = require("sequelize");
const validationService = require("../../services/validation.service");
const { Op } = require("sequelize");

const UserLocationDetailsApi = () => {
  const save = (req, res) => {
    validationService
      .validate(req.body, UserLocationDetailsSchemas)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            response = await crudService.update(
              UserLocationDetailsModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(
              UserLocationDetailsModel,
              reqData
            );
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `User Location Details ${
              reqData.id ? "updated" : "created"
            } successfully`,
            data: response || {},
          });
        } catch (error) {
          console.log(error);
          return res.status(501).json({
            code: 501,
            success: false,
            message: "Internal Server Error.",
          });
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
        await crudService.destroy(UserLocationDetailsModel, {
          id: req.body.record_id,
        });
        return res.status(200).json({
          code: 200,
          success: true,
          message: `User Location Details deleted successfully.`,
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
      return res.status(501).json({
        code: 501,
        success: false,
        message: "Internal Server Error.",
      });
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
      if (req.query.user_id) {
        whereClause.user_id = { [Op.eq]: req.query.user_id };
      }

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
        distinct: true,
        skip,
        limit,
      };

      response = await crudService.get(
        UserLocationDetailsModel,
        executing_parameters
      );

      let page_info = {};
      page_info.total_items = response.totalCount;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.totalCount / page_size);
      page_info.page_size = response.length;

      return res.status(200).json({
        code: 200,
        success: true,
        message: `User location get successfully.`,
        data: response,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        message: "Internal Server Error.",
      });
    }
  };

  return {
    save,
    destroy,
    get,
  };
};

module.exports = UserLocationDetailsApi;

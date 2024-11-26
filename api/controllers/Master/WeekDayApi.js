const WeekDayModel = require("../../../api/models/Master/WeekDay");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { WeekDaySchemas } = require("../../schemas/MasterSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const WeekDayApi = () => {
  // For create and update WeekDay
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, WeekDaySchemas)
      .then(async (reqData) => {
        try {
          // let responseCheck = await crudService.get(WeekDayModel, {
          //     where: { is_deleted: false },
          // });
          // if (responseCheck.length > 8) {
          //     return res.status(201).json({
          //         code: 204,
          //         success: false,
          //         message: 'WeekDay not valid',
          //     });
          // }
          // let response;
          // let whereClause = {};
          // whereClause.is_deleted = false;
          // whereClause.name = { [Op.iLike]: reqData.name }
          // if (reqData.id) {
          //     whereClause.id = { [Op.ne]: reqData.id }
          // }
          // let resCheck = await crudService.get(WeekDayModel, {
          //     where: whereClause,
          //     attributes: ['id', 'name', 'description'],
          //     distinct: true,
          // });
          // if (resCheck.length > 0) {
          //     return res.status(201).json({
          //         code: 204,
          //         success: false,
          //         message: 'WeekDay already exist.',
          //     });
          // }
          if (reqData.id) {
            response = await crudService.update(
              WeekDayModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(WeekDayModel, reqData);
          }

          return res.status(201).json({
            code: 200,
            success: true,
            message: `WeekDay ${
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
  // for deleting WeekDay
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(WeekDayModel, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `WeekDay deleted successfully.`,
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
      // console.log("test")
      const {
        query: { current_page, page_size },
      } = req;
      let offset;
      if (current_page && page_size) {
        offset = (current_page - 1) * page_size;
      } else {
        offset = undefined;
      }
      response = await crudService.getAll(WeekDayModel, {
        where: whereClause,
        attributes: ["id", "name", "description"],
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
        message: `WeekDay get successfully.`,
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
module.exports = WeekDayApi;

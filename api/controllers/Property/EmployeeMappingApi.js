const EmployeeMappingModel = require("../../models/Property/EmployeeMapping");
const crudService = require("../../services/crud.service");
const { EmployeeMappingSchemas } = require("../../schemas/PropertySchemas");
const validationService = require("../../services/validation.service");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const Property = require("../../models/Property/Property");
const EmployeeMappingApi = () => {
  // For create and update EmployeeMapping
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, EmployeeMappingSchemas)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            for (let id of reqData.employee_id) {
              reqData.user_id = id;
              response = await crudService.insert(
                EmployeeMappingModel,
                { id: reqData.id },
                reqData
              );
            }
            response = reqData;
          } else {
            for (let id of reqData.employee_id) {
              reqData.user_id = id;
              response = await crudService.insert(
                EmployeeMappingModel,
                reqData
              );
            }
          }

          return res.status(201).json({
            code: 200,
            success: true,
            message: `Employee Mapping ${
              reqData.id ? "updated" : "created"
            } successfully`,
            data: reqData || {},
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
  // for deleting Employee Mapping
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(EmployeeMappingModel, {
            id: id,
          });
          // await crudService.destroy(Property, { property_category_id: id })
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Employee Mapping deleted successfully.`,
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

  // For get EmployeeMapping
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
      if (req.query.property_category_id) {
        whereClause.property_category_id = {
          [Op.eq]: req.query.property_category_id,
        };
      }
      if (req.query.property_id) {
        whereClause.property_id = { [Op.eq]: req.query.property_id };
      }
      if (req.query.user_id) {
        whereClause.user_id = { [Op.eq]: req.query.user_id };
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
      // console.log("test")

      response = await crudService.getAll(EmployeeMappingModel, {
        where: whereClause,
        // attributes: ['id', 'name', 'description'],
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
        message: `Employee Mapping get successfully.`,
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
module.exports = EmployeeMappingApi;

const HsnCodeModel = require("../../../api/models/Product/HsnCode");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { HsnCodeSchemas } = require("../../schemas/ProductSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const HsnCodeApi = () => {
  // For create and update Hsn Code
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);
    req.body.code = JSON.stringify(req.body.code)
    validationService
      .validate(req.body, HsnCodeSchemas)
      .then(async (reqData) => {
        try {
          // console.log("check")
          let response;
          if (reqData.id) {
            response = await crudService.update(
              HsnCodeModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(HsnCodeModel, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Hsn Code ${reqData.id ? "updated" : "created"
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
  // for deleting Hsn Code
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(HsnCodeModel, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Hsn Code deleted successfully.`,
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
        whereClause.code = { [Sequelize.Op.iLike]: req.query.keyword + "%" };
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
      response = await crudService.getAll(HsnCodeModel, {
        where: whereClause,
        attributes: [
          "id",
          "code",
          "description",
          "type",
          "cgst_percent",
          "sgst_percent",
          "igst_percent",
          "cess_percent",
        ],
        distinct: true,
        limit: page_size,
        offset: offset,
        order: [["code", "ASC"]],
      });
      // for pagination in HsnCode
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Hsn Code get successfully.`,
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
module.exports = HsnCodeApi;

const SubCategoryModel = require("../../../api/models/Product/SubCategory");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { SubCategorySchemas } = require("../../schemas/ProductSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const fireBase = require("../../helper/firebaseHelper");
const Category = require("../../models/Product/Category");

const SubCategoryApi = () => {
  // For create and update Sub Category
  const save = async (req, res) => {
    if (req.files != null) {
      if (req.files.thumbnail_image != undefined) {
        var url = await fireBase.uploadImageToStorage(
          req.files.thumbnail_image
        );
        req.body.thumbnail_image = url;
      }
    }
    if (req.body.category_id) {
      req.body.category_id = parseInt(req.body.category_id);
    }
    if (req.body.id) {
      req.body.id = parseInt(req.body.id);
    }
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, SubCategorySchemas)
      .then(async (reqData) => {
        try {
          // console.log("check")
          let response;
          if (reqData.id) {
            response = await crudService.update(
              SubCategoryModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(SubCategoryModel, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Sub Category ${
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
  // for deleting Category
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(SubCategoryModel, {
            id: id,
          });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Sub Category deleted successfully.`,
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
      if (req.query.category_id) {
        whereClause.category_id = { [Op.eq]: req.query.category_id };
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
      response = await crudService.getAll(SubCategoryModel, {
        where: whereClause,
        attributes: [
          "id",
          "name",
          "description",
          "category_id",
          "thumbnail_image",
        ],
        distinct: true,
        limit: page_size,
        offset: offset,
        order: [["name", "ASC"]],
        include: [
          {
            model: Category,
            attributes: ["id", "name"],
          },
        ],
      });
      // for pagination in sub category
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Product Sub Category get successfully.`,
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
module.exports = SubCategoryApi;

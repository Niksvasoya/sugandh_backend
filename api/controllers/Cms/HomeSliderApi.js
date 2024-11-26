const HomeSliderModel = require("../../models/Cms/HomeSlider");
const crudService = require("../../services/crud.service");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const fireBase = require("../../helper/firebaseHelper");
const { HomeSliderSchemas } = require("../../schemas/CmsSchemas");
const validationService = require("../../services/validation.service");

const HomeSliderApi = () => {
  // For create and update Home Slider
  const save = async (req, res) => {
    if (req.body.image == undefined) {
      req.body.image = [];
    } else if (req.body.image.length == 0) {
      req.body.image = [];
    } else if (typeof req.body.image == "string") {
      req.body.image = JSON.parse(req.body.image);
    }
    if (req.files != null) {
      if (req.files.image_file != undefined) {
        for (i = 0; i < req.files.image_file.length; i++) {
          console.log(req.body.image);
          var url = await fireBase.uploadImageToStorage(
            req.files.image_file[i]
          );
          req.body.image.push(url);
        }
        if (
          req.files.image_file.length == undefined &&
          req.files.image_file != undefined
        ) {
          var url = await fireBase.uploadImageToStorage(req.files.image_file);
          console.log(req.body.image.length);
          req.body.image.push(url);
        }
      }
    }

    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, HomeSliderSchemas)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            response = await crudService.update(
              HomeSliderModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(HomeSliderModel, reqData);
          }

          return res.status(201).json({
            code: 200,
            success: true,
            message: `Home Slider ${
              reqData.id ? "updated" : "created"
            } successfully`,
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
  // for deleting Home Slider
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(HomeSliderModel, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Home Slider deleted successfully.`,
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
        whereClause.title = { [Sequelize.Op.iLike]: req.query.keyword + "%" };
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
      response = await crudService.getAll(HomeSliderModel, {
        where: whereClause,
        attributes: ["id", "title", "image"],
        distinct: true,
        limit: page_size,
        offset: offset,
        order: [["title", "ASC"]],
      });
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Home Slider get successfully.`,
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
module.exports = HomeSliderApi;

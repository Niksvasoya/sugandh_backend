// const HomeSlider = require("../../models/Cms/HomeSlider");
const HomeSliderDesktopModel = require("../../models/Cms/HomeSliderDesktop");
const crudService = require("../../services/crud.service");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const fireBase = require("../../helper/firebaseHelper");
const { HomeSliderSchemasDesktop } = require("../../schemas/CmsSchemas");

const validationService = require("../../services/validation.service");
const Collection = require("../../models/Product/Collection");

const HomeSliderForDesktopApi = () => {
  // For create and update Home Slider
  const save = async (req, res) => {
    if (req.files != null) {
      if (req.files.image != undefined) {
        var url = await fireBase.uploadImageToStorage(req.files.image);
        req.body.image = url;
      }
    }

    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, HomeSliderSchemasDesktop)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            response = await crudService.update(
              HomeSliderDesktopModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(
              HomeSliderDesktopModel,
              reqData
            );
          }

          return res.status(201).json({
            code: 200,
            success: true,
            message: `Home Slider ${reqData.id ? "updated" : "created"
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
          let response = await crudService.destroy(HomeSliderDesktopModel, {
            id: id,
          });
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
      response = await crudService.getAll(HomeSliderDesktopModel, {
        where: whereClause,
        // attributes: ["id", "title", "image"],
        attributes: {
          exclude: ["createdAt", "is_deleted", "deleted_at", "updatedAt"],
        },
        distinct: true,
        limit: page_size,
        offset: offset,
        // order: [["title", "ASC"]],
        order: [['id', "DESC"]],
        include: [
          {
            model: Collection,
            where: { is_deleted: false },
            // attributes: ["id", "name"],
            attributes: {
              exclude: ["createdAt", "is_deleted", "deleted_at", "updatedAt"],
            },
            required: false,
          },
        ],
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
module.exports = HomeSliderForDesktopApi;

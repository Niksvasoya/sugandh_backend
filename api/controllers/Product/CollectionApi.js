const CollectionModel = require("../../../api/models/Product/Collection");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { CollectionSchemas } = require("../../schemas/ProductSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const fireBase = require("../../helper/firebaseHelper");
const Brand = require("../../models/Product/Brand");
const ProductModel = require("../../../api/models/Product/Product");
const StockModel = require("../../../api/models/Property/Stock");
let mongoose = require("mongoose");
const CollectioHeader = require("../../models/MongoDb/CollectionHeader");
const ShopHeader = require("../../models/MongoDb/ShopHeader");

const CollectionApi = () => {
  // For create and update Collection
  const save = async (req, res) => {
    if (req.files != null) {
      if (req.files.thumbnail_image != undefined) {
        var url = await fireBase.uploadImageToStorage(
          req.files.thumbnail_image
        );
        req.body.thumbnail_image = url;
      }
    }
    if (req.files != null) {
      if (req.files.look_book != undefined) {
        var url = await fireBase.uploadImageToStorage(req.files.look_book);
        req.body.look_book = url;
      }
    }
    if (req.files != null) {
      if (req.files.size_chart != undefined) {
        var url = await fireBase.uploadImageToStorage(req.files.size_chart);
        req.body.size_chart = url;
      }
    }
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, CollectionSchemas)
      .then(async (reqData) => {
        try {
          // console.log("check")
          let response;
          if (reqData.id) {
            response = await crudService.update(
              CollectionModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            let responseCollection = await crudService.get(CollectionModel, {
              where: { is_deleted: false, brand_id: reqData.brand_id },
              attributes: [
                Sequelize.fn("max", Sequelize.col("collection_number")),
              ],
              raw: true,
              distinct: true,
            });
            if (responseCollection.length > 0) {
              const total = await CollectionModel.count()
              reqData.sort_order = total + 1;
              reqData.collection_number = responseCollection[0].max + 1;
              response = await crudService.insert(CollectionModel, reqData);
            }
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Collection ${reqData.id ? "updated" : "created"
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
  // for deleting Collection
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(CollectionModel, { id: id });
          await crudService.update(ProductModel, { collection_id: id }, { is_deleted: true })
          // get product
          const product = await crudService.getAll(ProductModel, { collection_id: id })
          // console.log("product >>> ",product?.rows);
          product?.rows.map(async (e) => {
            await crudService.update(StockModel, { product_id: e.id }, { is_deleted: true })
          })
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Collection deleted successfully.`,
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
      if (req.query.brand_id) {
        whereClause.brand_id = { [Op.eq]: req.query.brand_id };
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
      response = await crudService.getAll(CollectionModel, {
        where: whereClause,
        attributes: [
          "id",
          "name",
          "description",
          "thumbnail_image",
          "brand_id",
          "tag_line",
          "look_book",
          "shipping_information",
          "size_chart",
        ],
        distinct: true,
        limit: page_size,
        offset: offset,
        order: [["sort_order", "ASC"]],
        // order: [["id", "ASC"]],

      });
      // for pagination in Collection
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Collection get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const saveHeaderImg = async (req, res) => {
    try {
      if (req.files != null) {
        if (req.files.image != undefined) {
          var url = await fireBase.uploadImageToStorage(
            req.files.image
          );

          const updatedDoc = await CollectioHeader.findOneAndUpdate(
            {}, // Filter to match any document
            { $set: { image: url } }, // Update operation
            { upsert: true, new: true } // Options: create if doesn't exist, return the updated document
          );
        }
      }
      return res.status(201).json({
        code: 200,
        success: true,
        message: `Image save successfully`,
        data: url,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  }

  const getCollectionHeaderImg = async (req, res) => {
    try {
      const data = await CollectioHeader.find()
      return res.status(201).json({
        code: 200,
        success: true,
        message: `Image get successfully`,
        data: data,
      });
    } catch (error) {
      return res.status(error.status).json(error.error);
    }
  }

  const saveShopHeaderImg = async (req, res) => {
    try {
      if (req.files != null) {
        if (req.files.image != undefined) {
          var url = await fireBase.uploadImageToStorage(
            req.files.image
          );

          const updatedDoc = await ShopHeader.findOneAndUpdate(
            {}, // Filter to match any document
            { $set: { image: url } }, // Update operation
            { upsert: true, new: true } // Options: create if doesn't exist, return the updated document
          );
        }
      }
      return res.status(201).json({
        code: 200,
        success: true,
        message: `Image save successfully`,
        data: url,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  }

  const getShopHeaderImg = async (req, res) => {
    try {
      const data = await ShopHeader.find()
      return res.status(201).json({
        code: 200,
        success: true,
        message: `Image get successfully`,
        data: data,
      });
    } catch (error) {
      return res.status(error.status).json(error.error);
    }
  }

  return {
    save,
    destroy,
    get,
    saveHeaderImg,
    getCollectionHeaderImg,
    saveShopHeaderImg,
    getShopHeaderImg
  };
};
module.exports = CollectionApi;

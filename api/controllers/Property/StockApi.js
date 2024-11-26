const StockModel = require("../../../api/models/Property/Stock");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { StockSchemas } = require("../../schemas/PropertySchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const Product = require("../../models/Product/Product");
const ProductVariants = require("../../models/Product/ProductVariants");
const Color = require("../../models/Product/Color");
const Size = require("../../models/Product/Size");
const HsnCode = require("../../models/Product/HsnCode");
const TaxType = require("../../models/Accounting/TaxType");
const StockApi = () => {
  // For create and update Stock
  const save = async (req, res) => {
    // await validationService.convertIntObj(req.body)
    // validationService.validate(req.body, StockSchemas).then(async (reqData) => {
    try {
      for (let reqData of req.body) {
        console.log(reqData, "redData");
        await validationService.convertIntObj(reqData);
        let response;
        let whereClause = {};
        whereClause.is_deleted = false;
        if (reqData.keyword) {
          whereClause.name = { [Sequelize.Op.iLike]: reqData.keyword + "%" };
        }
        if (reqData.property_id) {
          whereClause.property_id = { [Op.eq]: reqData.property_id };
        }
        if (reqData.property_category_id) {
          whereClause.property_category_id = {
            [Op.eq]: reqData.property_category_id,
          };
        }
        if (reqData.product_id) {
          whereClause.product_id = { [Op.eq]: reqData.product_id };
        }
        if (reqData.product_variants_id) {
          whereClause.product_variants_id = {
            [Op.eq]: reqData.product_variants_id,
          };
        }
        let responseStock = await crudService.get(StockModel, {
          where: whereClause,
          // attributes: ['id', 'name', 'description'],
          attributes: {
            exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
          },
          distinct: true,
        });
        console.log(responseStock);
        if (responseStock.length > 0) {
          if (reqData.quantity >= responseStock[0].barcode.length) {
            for (
              var i = responseStock[0].barcode.length + 1;
              responseStock[0].barcode.length < reqData.quantity;
              i++
            ) {
              let barcode = `${reqData.product_number}-${reqData.product_variants_number}-${i}`;
              responseStock[0].barcode.push(barcode);
            }
            console.log(responseStock[0].barcode);
            reqData.barcode = responseStock[0].barcode;
            response = await crudService.update(
              StockModel,
              { id: responseStock[0].id },
              reqData
            );
            response = reqData;
          } else if (reqData.quantity < responseStock[0].barcode.length + 1) {
            let newArray = [];
            newArray.push(
              ...responseStock[0].barcode.splice(-reqData.quantity)
            );
            console.log(responseStock[0].barcode);
            reqData.barcode = responseStock[0].barcode;
            await crudService.update(
              StockModel,
              { id: responseStock[0].id },
              reqData
            );
          }
        } else {
          if (!reqData.barcode) {
            reqData.barcode = [];
            console.log(reqData.quantity);
            for (var i = 1; i < reqData.quantity + 1; i++) {
              let barcode = `${reqData.product_number}-${reqData.product_variants_number}-${i}`;
              reqData.barcode.push(barcode);
            }
          }
          console.log(reqData.barcode);
          response = await crudService.insert(StockModel, reqData);
        }
        // }
      }
      return res.status(201).json({
        code: 200,
        success: true,
        message: `Stock updated successfully`,
        data: {},
      });
    } catch (error) {
      console.log(error);
      return res.status(201).json({
        code: 201,
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
    // }).catch(err => {
    //     console.log(err)
    //     return res.status(201).json({
    //         code: 201,
    //         success: false,
    //         message: 'Validation Failure',
    //         error: err,
    //     });
    // });
  };
  const transferStock = async (req, res) => {
    // await validationService.convertIntObj(req.body)
    // validationService.validate(req.body, StockSchemas).then(async (reqData) => {
    try {
      for (let reqData of req.body) {
        await validationService.convertIntObj(reqData);
        let whereClause = {};
        whereClause.is_deleted = false;
        if (reqData.keyword) {
          whereClause.name = { [Sequelize.Op.iLike]: reqData.keyword + "%" };
        }
        if (reqData.property_id) {
          whereClause.property_id = { [Op.eq]: reqData.property_id };
        }
        if (reqData.property_category_id) {
          whereClause.property_category_id = {
            [Op.eq]: reqData.property_category_id,
          };
        }
        if (reqData.product_id) {
          whereClause.product_id = { [Op.eq]: reqData.product_id };
        }
        if (reqData.product_variants_id) {
          whereClause.product_variants_id = {
            [Op.eq]: reqData.product_variants_id,
          };
        }
        // if (reqData.barcode) {
        //     whereClause.barcode = { [Op.contains]: [reqData.barcode] }
        // }
        let responseStock = await crudService.get(StockModel, {
          where: whereClause,
          // attributes: ['id', 'name', 'description'],
          attributes: {
            exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
          },
          distinct: true,
        });
        let responseStockOld = await crudService.get(StockModel, {
          where: { is_deleted: false, id: reqData.stock_id },
          // attributes: ['id', 'name', 'description'],
          attributes: {
            exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
          },
          distinct: true,
        });
        const newArray = [];
        if (responseStockOld.length > 0) {
          newArray.push(
            ...responseStockOld[0].barcode.splice(-reqData.quantity)
          );
          let data = {};
          data.quantity = responseStockOld[0].quantity - reqData.quantity;
          data.barcode = responseStockOld[0].barcode;
          await crudService.update(StockModel, { id: reqData.stock_id }, data);
        }
        let response;
        if (responseStock.length > 0) {
          let data = {};
          data.quantity = reqData.quantity + responseStock[0].quantity;
          data.barcode = responseStock[0].barcode.concat(newArray);
          response = await crudService.update(
            StockModel,
            { id: responseStock[0].id },
            data
          );
        } else {
          reqData.barcode = newArray;
          response = await crudService.insert(StockModel, reqData);
        }
      }
      return res.status(201).json({
        code: 200,
        success: true,
        message: `Stock transfer successfully`,
        data: response || {},
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        code: 500,
        success: false,
        message: "Internal Server Error",
        error: err,
      });
    }
    // }).catch(err => {
    //     console.log(err)
    //     return res.status(201).json({
    //         code: 201,
    //         success: false,
    //         message: 'Validation Failure',
    //         error: err,
    //     });
    // });
  };
  // for deleting Stock
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(StockModel, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Stock deleted successfully.`,
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
      if (req.query.property_id) {
        whereClause.property_id = { [Op.eq]: req.query.property_id };
      }
      if (req.query.property_category_id) {
        whereClause.property_category_id = {
          [Op.eq]: req.query.property_category_id,
        };
      }
      if (req.query.product_id) {
        whereClause.product_id = { [Op.eq]: req.query.product_id };
      }
      if (req.query.product_variants_id) {
        whereClause.product_variants_id = {
          [Op.eq]: req.query.product_variants_id,
        };
      }
      if (req.query.barcode) {
        whereClause.barcode = { [Op.contains]: [req.query.barcode] };
      }
      let whereClauseProduct = {};
      whereClauseProduct.is_deleted = false;
      if (req.query.product_name) {
        whereClause.quantity = { [Sequelize.Op.gte]: 0 };
        whereClauseProduct.name = {
          [Sequelize.Op.iLike]: req.query.product_name + "%",
        };
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
      response = await crudService.getAll(StockModel, {
        where: whereClause,
        // attributes: ['id', 'name', 'description'],
        attributes: {
          exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
        },
        distinct: true,
        limit: page_size,
        offset: offset,
        include: [
          {
            model: Product,
            where: whereClauseProduct,
            attributes: ["id", "name", "hsn_code_id", "sku", "product_number"],
            include: [
              {
                model: HsnCode,
                where: { is_deleted: false },
                attributes: ["id", "code"],
              },
              {
                model: TaxType,
                where: { is_deleted: false },
                attributes: {
                  exclude: [
                    "is_deleted",
                    "deleted_at",
                    "createdAt",
                    "updatedAt",
                  ],
                },
              },
            ],
            require: false,
          },
          {
            model: ProductVariants,
            where: { is_deleted: false },
            attributes: [
              "id",
              "color_id",
              "size_id",
              "mrp",
              "product_variants_number",
            ],
            include: [
              {
                model: Color,
                where: { is_deleted: false },
                attributes: ["id", "name"],
              },
              {
                model: Size,
                where: { is_deleted: false },
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });
      // for pagination in Stock
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Stock get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };
  const update_stock = async (req, res) => {
    try {
      let whereClause = {};
      whereClause.is_deleted = false;
      let executing_parameters = {
        where: whereClause,
        attributes: {
          exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
        },
      };
      const stocks = await crudService.get(StockModel, executing_parameters);
      console.log(stocks);
      let bulkUpdate = [];
      for (let stock of stocks) {
        bulkUpdate.push({
          id: stock.id,
          quantity: 100,
        });
      }
      await StockModel.update(
        { quantity: 100 },
        {
          where: { id: bulkUpdate.map((x) => x.id) },
        }
      );
      return res.status(200).json({
        code: 200,
        success: true,
        message: "ok",
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
        message: "Internal Server Error",
      });
    }
  };
  return {
    save,
    destroy,
    get,
    transferStock,
    update_stock,
  };
};
module.exports = StockApi;

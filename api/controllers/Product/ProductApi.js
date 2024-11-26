const ProductModel = require("../../../api/models/Product/Product");
const CollectionModel = require("../../../api/models/Product/Collection");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { ProductSchemas } = require("../../schemas/ProductSchemas");
const Sequelize = require("sequelize");
const fireBase = require("../../helper/firebaseHelper");
const { Op } = require("sequelize");
const { log } = require("console");
const ProductVariants = require("../../models/Product/ProductVariants");
const Color = require("../../models/Product/Color");
const Size = require("../../models/Product/Size");
const Category = require("../../models/Product/Category");
const Fabric = require("../../models/Product/Fabric");
const FabricCare = require("../../models/Product/FabricCare");
const Occasion = require("../../models/Product/Occasion");
const NeckType = require("../../models/Product/NeckType");
const SleeveType = require("../../models/Product/SleeveType");
const Stock = require("../../models/Property/Stock");
const TaxType = require("../../models/Accounting/TaxType");
const SubCategory = require("../../models/Product/SubCategory");
const Brand = require("../../models/Product/Brand");
const HsnCode = require("../../models/Product/HsnCode");
const ProductApi = () => {
  // For create and update Product
  const save = async (req, res) => {
    // console.log(req.files)
    // if (req.body.image == undefined) {
    //     req.body.image = []
    // }
    // else if (req.body.image.length == 0) {
    //     req.body.image = []
    // }
    // else if (typeof req.body.image == 'string') {
    //     req.body.image = JSON.parse(req.body.image)
    // }
    // if (req.files != null) {
    //     if (req.files.image_file != undefined) {
    //         for (i = 0; i < req.files.image_file.length; i++) {
    //             console.log(req.body.image)
    //             var url = await fireBase.uploadImageToStorage(req.files.image_file[i])
    //             req.body.image.push(url)
    //         }
    //         if (req.files.image_file.length == undefined && req.files.image_file != undefined) {
    //             var url = await fireBase.uploadImageToStorage(req.files.image_file)
    //             console.log(req.body.image.length)
    //             req.body.image.push(url)
    //         }
    //     }
    // }
    if (req.files != null) {
      if (req.files.thumbnail_image != undefined) {
        var url = await fireBase.uploadImageToStorage(
          req.files.thumbnail_image
        );
        req.body.thumbnail_image = url;
      }
    }
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, ProductSchemas)
      .then(async (reqData) => {
        try {
          let response;
          console.log(req.body);
          if (reqData.id) {
            response = await crudService.update(
              ProductModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            let responseProduct = await crudService.get(ProductModel, {
              where: {
                is_deleted: false,
                collection_id: reqData.collection_id,
              },
              attributes: [
                Sequelize.fn("max", Sequelize.col("product_number")),
              ],
              raw: true,
            });
            console.log(responseProduct);
            if (responseProduct.length > 0) {
              let responseCollection = await crudService.get(CollectionModel, {
                where: { is_deleted: false, id: reqData.collection_id },
                attributes: ["collection_number"],
                raw: true,
                distinct: true,
              });
              console.log(responseCollection);
              let collection_number =
                responseCollection.length > 0
                  ? responseCollection[0].collection_number
                  : undefined;
              let product_number = responseProduct[0].max + 1;
              // if (collection_number < 10 && product_number < 10) {
              //     reqData.sku = `wos0${collection_number}0${product_number}`

              // }
              // else if (collection_number < 10) {
              //     reqData.sku = `wos0${collection_number}${product_number}`
              // }
              // else if (product_number < 10) {
              //     reqData.sku = `wos${collection_number}0${product_number}`
              // }
              // else {
              //     reqData.sku = `wos${collection_number}${product_number}`
              // }
              // console.log(reqData.sku)
              reqData.product_number = product_number;
              response = await crudService.insert(ProductModel, reqData);
            }
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Product ${reqData.id ? "updated" : "created"
              } successfully`,
            data: response || {},
          });
        } catch (error) {
          console.log(error);
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
  // for deleting Category
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(ProductModel, { id: id });
          await crudService.destroy(ProductVariants, { product_id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Product deleted successfully.`,
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
    console.log("Nikul get >>",);
    try {
      let response;
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.query.keyword) {
        whereClause.name = { [Sequelize.Op.iLike]: req.query.keyword + "%" };
      }
      if (req.query.is_trending_product) {
        whereClause.is_trending_product = JSON.parse(
          req.query.is_trending_product
        );
      }
      if (req.query.is_show_on_website) {
        whereClause.is_show_on_website = JSON.parse(
          req.query.is_show_on_website
        );
      }
      let required = true;
      if (req.query.is_admin) {
        required = false;
      }
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      if (req.query.category_id) {
        if (JSON.parse(req.query.category_id).constructor === Array) {
          whereClause.category_id = {
            [Op.or]: JSON.parse(req.query.category_id),
          };
        } else {
          whereClause.category_id = { [Op.eq]: req.query.category_id };
        }
      }
      if (req.query.sub_category_id) {
        if (JSON.parse(req.query.sub_category_id).constructor === Array) {
          whereClause.sub_category_id = {
            [Op.or]: JSON.parse(req.query.sub_category_id),
          };
        } else {
          whereClause.sub_category_id = { [Op.eq]: req.query.sub_category_id };
        }
      }
      if (req.query.brand_id) {
        if (JSON.parse(req.query.brand_id).constructor === Array) {
          whereClause.brand_id = { [Op.or]: JSON.parse(req.query.brand_id) };
        } else {
          whereClause.brand_id = { [Op.eq]: req.query.brand_id };
        }
      }
      if (req.query.collection_id) {
        if (JSON.parse(req.query.collection_id).constructor === Array) {
          whereClause.collection_id = {
            [Op.or]: JSON.parse(req.query.collection_id),
          };
        } else {
          whereClause.collection_id = { [Op.eq]: req.query.collection_id };
        }
      }
      if (req.query.supplier_id) {
        whereClause.supplier_id = { [Op.eq]: req.query.supplier_id };
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
      whereClauseVariant = {};
      whereClauseVariant.is_deleted = false;
      if (req.query.product_variant_id) {
        whereClauseVariant.id = { [Op.eq]: req.query.product_variant_id };
      }
      if (req.query.size_id) {
        if (JSON.parse(req.query.size_id).constructor === Array) {
          whereClauseVariant.size_id = {
            [Op.or]: JSON.parse(req.query.size_id),
          };
        } else {
          whereClauseVariant.size_id = { [Op.eq]: req.query.size_id };
        }
      }
      if (req.query.color_id) {
        if (JSON.parse(req.query.color_id).constructor === Array) {
          whereClauseVariant.color_id = {
            [Op.or]: JSON.parse(req.query.color_id),
          };
        } else {
          whereClauseVariant.color_id = { [Op.eq]: req.query.color_id };
        }
      }
      // if (req.query.property_id) {
      //     whereClauseVariant.property_id = req.query.property_id
      // }
      if (req.query.mrp) {
        whereClauseVariant.mrp = {
          [Op.between]: [0, req.query.mrp],
        };
      }
      if (req.query.sell_rate) {
        whereClauseVariant.sell_rate = {
          [Op.between]: [0, req.query.sell_rate],
        };
      }

      let whereClauseStock = {};
      whereClauseStock.is_deleted = false;
      whereClauseStock.quantity = { [Sequelize.Op.gte]: 0 };
      if (req.query.property_category_id) {
        whereClauseStock.property_category_id = {
          [Op.eq]: req.query.property_category_id,
        };
      }
      if (req.query.property_id) {
        whereClauseStock.property_id = { [Op.eq]: req.query.property_id };
      }
      let product_order = [];

      product_order.push(["collection_id", "DESC"]);
      // if (req.query.sort_price_wise != undefined) {
      //   if (JSON.parse(req.query.sort_price_wise))
      //     product_order.push(["mrp", "ASC"]);
      //   else product_order.push(["mrp", "DESC"]);
      // }
      // if (req.query.sort_alphabet_wise != undefined) {
      //   if (JSON.parse(req.query.sort_alphabet_wise))
      //     product_order.push(["name", "ASC"]);
      //   else product_order.push(["name", "DESC"]);
      // }

      let product_variant_price_order = [];

      if (req.query.sort) {
        product_order.push(["id", "DESC"]);
      }else{
        if (req.query.sort_price_wise != undefined) {
          if (JSON.parse(req.query.sort_price_wise))
            product_variant_price_order.push(["mrp", "ASC"]);
          else product_variant_price_order.push(["mrp", "DESC"]);
        }
      }

      response = await crudService.getAll(ProductModel, {
        where: whereClause,
        // attributes: ['id', 'name', 'category_id', 'description', 'sub_category_id', 'brand_id',
        //     'unit_of_measurement_id', 'hsn_code_id', 'is_single_barcode', 'color', 'thumbnail_image'],
        attributes: {
          exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
        },
        limit: page_size,
        offset: offset,
        distinct: true,
        order: product_order,
        // order: [
        //     ['name', 'ASC'],
        // ],
        include: [
          // {
          //     model: Stock,
          //     // where: whereClauseVariant,
          //     // attributes: ['id', 'name', 'hex_code'],
          //     required: false

          // },
          {
            model: Category,
            attributes: ["id", "name"],
          },
          {
            model: SubCategory,
            attributes: ["id", "name"],
          },
          {
            model: Fabric,
            attributes: ["id", "name"],
          },
          {
            model: FabricCare,
            attributes: ["id", "name"],
          },
          {
            model: Occasion,
            attributes: ["id", "name"],
          },
          {
            model: NeckType,
            attributes: ["id", "name"],
          },
          {
            model: SleeveType,
            attributes: ["id", "name"],
          },
          {
            model: CollectionModel,
            attributes: ["id", "name", "shipping_information", "size_chart"],
            // order: [['id', 'DESC']]
          },
          {
            model: HsnCode,
            attributes: ["id", "code"],
          },
          {
            model: TaxType,
            where: { is_deleted: false },
            attributes: ["id", "name", "value"],
            required: false,
          },
          {
            model: ProductVariants,
            where: whereClauseVariant,
            order: product_variant_price_order,
            include: [
              {
                model: Color,
                // where: whereClauseVariant,
                attributes: ["id", "name", "hex_code"],
                required: false,
              },
              {
                model: Stock,
                where: whereClauseStock,
                attributes: {
                  exclude: [
                    "is_deleted",
                    "deleted_at",
                    "createdAt",
                    "updatedAt",
                  ],
                },

                // attributes: ['id', 'name', 'hex_code'],
                required: false,
              },
              {
                model: Size,
                // where: whereClauseVariant,
                attributes: ["id", "name"],
                required: false,
              },
            ],
            // attributes: ['id', 'name'],
            required: required,
          },
        ],
      });
      // log(response)
      // for pagination in ßroduct
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;

      if (req.query.sort_price_wise != undefined) {
        response.rows = response.rows.sort((a, b) => {
          const mrpA = a.ProductVariants[0].mrp;
          const mrpB = b.ProductVariants[0].mrp;
          return JSON.parse(req.query.sort_price_wise)
            ? mrpA - mrpB
            : mrpB - mrpA;
        });
      }

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Product get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      const status = error.status || 401
      return res.status(status).json(error.error);
    }
  };
  const getByKeyword = async (req, res) => {
    try {
      let response;
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.query.search) {
        // whereClause.name = { [Sequelize.Op.iLike]: "%" + req.query.search + "%" }
        whereClause[Sequelize.Op.or] = [
          { name: { [Sequelize.Op.iLike]: "%" + req.query.search + "%" } },
          {
            "$SubCategory.name$": {
              [Sequelize.Op.iLike]: "%" + req.query.search + "%",
            },
          },
          {
            "$Fabric.name$": {
              [Sequelize.Op.iLike]: "%" + req.query.search + "%",
            },
          },
          {
            "$Brand.name$": {
              [Sequelize.Op.iLike]: "%" + req.query.search + "%",
            },
          },
          {
            "$NeckType.name$": {
              [Sequelize.Op.iLike]: "%" + req.query.search + "%",
            },
          },
          {
            "$Occasion.name$": {
              [Sequelize.Op.iLike]: "%" + req.query.search + "%",
            },
          },
          {
            "$SleeveType.name$": {
              [Sequelize.Op.iLike]: "%" + req.query.search + "%",
            },
          },
          {
            "$ProductVariants.Color.name$": {
              [Sequelize.Op.iLike]: "%" + req.query.search + "%",
            },
          },
          {
            "$ProductVariants.Size.name$": {
              [Sequelize.Op.iLike]: "%" + req.query.search + "%",
            },
          },
          // Add more conditions for other searchable fields, if needed
        ];
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
      response = await crudService.getAll(ProductModel, {
        where: whereClause,
        // attributes: ['id', 'name', 'category_id', 'description', 'sub_category_id', 'brand_id',
        //     'unit_of_measurement_id', 'hsn_code_id', 'is_single_barcode', 'color', 'thumbnail_image'],
        attributes: {
          exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
        },
        limit: page_size,
        offset: offset,
        distinct: true,
        order: [["name", "ASC"]],
        required: false,

        include: [
          // {
          //     model: Stock,
          //     // where: whereClauseVariant,
          //     // attributes: ['id', 'name', 'hex_code'],
          //     required: false

          // },
          {
            model: Category,
            where: { is_deleted: false },
            // where: { name: { [Sequelize.Op.iLike]: '%' + req.query.search + '%' } },
            required: false,

            attributes: ["id", "name"],
          },
          {
            model: SubCategory,
            // where: whereClause,
            // where: { name: { [Sequelize.Op.iLike]: '%' + req.query.search + '%' } },
            required: false,
            where: { is_deleted: false },
            attributes: ["id", "name"],
          },
          {
            model: Fabric,
            required: false,
            where: { is_deleted: false },
            attributes: ["id", "name"],
          },
          {
            model: FabricCare,
            required: false,
            where: { is_deleted: false },
            attributes: ["id", "name"],
          },
          {
            model: Occasion,
            required: false,
            where: { is_deleted: false },
            attributes: ["id", "name"],
          },
          {
            model: Brand,
            required: false,
            where: { is_deleted: false },
            attributes: ["id", "name"],
          },
          {
            model: NeckType,
            required: false,
            where: { is_deleted: false },
            attributes: ["id", "name"],
          },
          {
            model: SleeveType,
            required: false,
            where: { is_deleted: false },
            attributes: ["id", "name"],
          },
          {
            model: TaxType,
            where: { is_deleted: false },
            attributes: ["id", "name", "value"],
            required: false,
          },
          {
            model: ProductVariants,
            required: false,
            where: { is_deleted: false },
            // where: whereClauseVariant,
            include: [
              {
                model: Color,
                // where: whereClauseVariant,
                attributes: ["id", "name", "hex_code"],
                required: false,
              },
              {
                model: Stock,
                // where: whereClauseStock,
                attributes: {
                  exclude: [
                    "is_deleted",
                    "deleted_at",
                    "createdAt",
                    "updatedAt",
                  ],
                },

                // attributes: ['id', 'name', 'hex_code'],
                required: false,
              },
              {
                model: Size,
                // where: whereClauseVariant,
                attributes: ["id", "name"],
                required: false,
              },
            ],
            // attributes: ['id', 'name'],
            required: false,
          },
        ],
      });
      // log(response)
      // for pagination in ßroduct
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Product get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const storeMultipleImage = async (req, res) => {
    try {
      console.log(req.files);
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
      if (req.body.image && req.body.product_id) {
        await crudService.update(
          ProductVariants,
          { product_id: req.body.product_id },
          { image: req.body.image }
        );
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Product image updated successfully.`,
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

  const getProduct = async (req, res) => {
    console.log("Nikul get >>",);
    try {
      let response;
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.query.keyword) {
        whereClause.name = { [Sequelize.Op.iLike]: req.query.keyword + "%" };
      }
      if (req.query.is_trending_product) {
        whereClause.is_trending_product = JSON.parse(
          req.query.is_trending_product
        );
      }
      if (req.query.is_show_on_website) {
        whereClause.is_show_on_website = JSON.parse(
          req.query.is_show_on_website
        );
      }
      let required = true;
      if (req.query.is_admin) {
        required = false;
      }
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      if (req.query.category_id) {
        if (JSON.parse(req.query.category_id).constructor === Array) {
          whereClause.category_id = {
            [Op.or]: JSON.parse(req.query.category_id),
          };
        } else {
          whereClause.category_id = { [Op.eq]: req.query.category_id };
        }
      }
      if (req.query.sub_category_id) {
        if (JSON.parse(req.query.sub_category_id).constructor === Array) {
          whereClause.sub_category_id = {
            [Op.or]: JSON.parse(req.query.sub_category_id),
          };
        } else {
          whereClause.sub_category_id = { [Op.eq]: req.query.sub_category_id };
        }
      }
      if (req.query.brand_id) {
        if (JSON.parse(req.query.brand_id).constructor === Array) {
          whereClause.brand_id = { [Op.or]: JSON.parse(req.query.brand_id) };
        } else {
          whereClause.brand_id = { [Op.eq]: req.query.brand_id };
        }
      }
      if (req.query.collection_id) {
        if (JSON.parse(req.query.collection_id).constructor === Array) {
          whereClause.collection_id = {
            [Op.or]: JSON.parse(req.query.collection_id),
          };
        } else {
          whereClause.collection_id = { [Op.eq]: req.query.collection_id };
        }
      }
      if (req.query.supplier_id) {
        whereClause.supplier_id = { [Op.eq]: req.query.supplier_id };
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
      whereClauseVariant = {};
      whereClauseVariant.is_deleted = false;
      if (req.query.product_variant_id) {
        whereClauseVariant.id = { [Op.eq]: req.query.product_variant_id };
      }
      if (req.query.size_id) {
        if (JSON.parse(req.query.size_id).constructor === Array) {
          whereClauseVariant.size_id = {
            [Op.or]: JSON.parse(req.query.size_id),
          };
        } else {
          whereClauseVariant.size_id = { [Op.eq]: req.query.size_id };
        }
      }
      if (req.query.color_id) {
        if (JSON.parse(req.query.color_id).constructor === Array) {
          whereClauseVariant.color_id = {
            [Op.or]: JSON.parse(req.query.color_id),
          };
        } else {
          whereClauseVariant.color_id = { [Op.eq]: req.query.color_id };
        }
      }
      // if (req.query.property_id) {
      //     whereClauseVariant.property_id = req.query.property_id
      // }
      if (req.query.mrp) {
        whereClauseVariant.mrp = {
          [Op.between]: [0, req.query.mrp],
        };
      }
      if (req.query.sell_rate) {
        whereClauseVariant.sell_rate = {
          [Op.between]: [0, req.query.sell_rate],
        };
      }

      let whereClauseStock = {};
      whereClauseStock.is_deleted = false;
      whereClauseStock.quantity = { [Sequelize.Op.gte]: 0 };
      if (req.query.property_category_id) {
        whereClauseStock.property_category_id = {
          [Op.eq]: req.query.property_category_id,
        };
      }
      if (req.query.property_id) {
        whereClauseStock.property_id = { [Op.eq]: req.query.property_id };
      }
      let product_order = [];

      product_order.push(["collection_id", "DESC"]);
      // if (req.query.sort_price_wise != undefined) {
      //   if (JSON.parse(req.query.sort_price_wise))
      //     product_order.push(["mrp", "ASC"]);
      //   else product_order.push(["mrp", "DESC"]);
      // }
      // if (req.query.sort_alphabet_wise != undefined) {
      //   if (JSON.parse(req.query.sort_alphabet_wise))
      //     product_order.push(["name", "ASC"]);
      //   else product_order.push(["name", "DESC"]);
      // }

      let product_variant_price_order = [];

      if (req.query.sort) {
        product_order.push(["id", "DESC"]);
      }else{
        if (req.query.sort_price_wise != undefined) {
          if (JSON.parse(req.query.sort_price_wise))
            product_variant_price_order.push(["mrp", "ASC"]);
          else product_variant_price_order.push(["mrp", "DESC"]);
        }
      }

      console.log("whereClause >>>",whereClause, current_page , page_size);

      response = await crudService.getAll(ProductModel, {
        where: whereClause,
        // attributes: ['id', 'name', 'category_id', 'description', 'sub_category_id', 'brand_id',
        //     'unit_of_measurement_id', 'hsn_code_id', 'is_single_barcode', 'color', 'thumbnail_image'],
        attributes: {
          exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
        },
        limit: page_size,
        offset: offset,
        distinct: true,
        order: product_order,
        // order: [
        //     ['name', 'ASC'],
        // ],
        include: [
          // {
          //     model: Stock,
          //     // where: whereClauseVariant,
          //     // attributes: ['id', 'name', 'hex_code'],
          //     required: false

          // },
          {
            model: Category,
            attributes: ["id", "name"],
          },
          {
            model: SubCategory,
            attributes: ["id", "name"],
          },
          {
            model: Fabric,
            attributes: ["id", "name"],
          },
          {
            model: FabricCare,
            attributes: ["id", "name"],
          },
          {
            model: Occasion,
            attributes: ["id", "name"],
          },
          {
            model: NeckType,
            attributes: ["id", "name"],
          },
          {
            model: SleeveType,
            attributes: ["id", "name"],
          },
          {
            model: CollectionModel,
            attributes: ["id", "name", "shipping_information", "size_chart"],
            // order: [['id', 'DESC']]
          },
          {
            model: HsnCode,
            attributes: ["id", "code"],
          },
          {
            model: TaxType,
            where: { is_deleted: false },
            attributes: ["id", "name", "value"],
            required: false,
          },
          {
            model: ProductVariants,
            where: whereClauseVariant,
            order: product_variant_price_order,
            include: [
              {
                model: Color,
                // where: whereClauseVariant,
                attributes: ["id", "name", "hex_code"],
                required: false,
              },
              {
                model: Stock,
                where: whereClauseStock,
                attributes: {
                  exclude: [
                    "is_deleted",
                    "deleted_at",
                    "createdAt",
                    "updatedAt",
                  ],
                },

                // attributes: ['id', 'name', 'hex_code'],
                required: false,
              },
              {
                model: Size,
                // where: whereClauseVariant,
                attributes: ["id", "name"],
                required: false,
              },
            ],
            // attributes: ['id', 'name'],
            required: required,
          },
        ],
      });
      // log(response)
      // for pagination in ßroduct
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;

      if (req.query.sort_price_wise != undefined) {
        response.rows = response.rows.sort((a, b) => {
          const mrpA = a.ProductVariants[0].mrp;
          const mrpB = b.ProductVariants[0].mrp;
          return JSON.parse(req.query.sort_price_wise)
            ? mrpA - mrpB
            : mrpB - mrpA;
        });
      }

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Product get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      const status = error.status || 401
      return res.status(status).json(error.error);
    }
  };

  return {
    save,
    destroy,
    get,
    storeMultipleImage,
    getByKeyword,
    getProduct,
    // destroyVariants
  };
};
module.exports = ProductApi;

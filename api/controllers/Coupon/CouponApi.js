const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const Sequelize = require("sequelize");

const { CouponSchema } = require("../../schemas/CouponSchema");
const Coupon = require("../../models/Coupon/Coupon");
const Product = require("../../models/Product/Product");
const ProductVariants = require("../../models/Product/ProductVariants");
const Category = require("../../models/Product/Category");
const SubCategory = require("../../models/Product/SubCategory");
const Collection = require("../../models/Product/Collection");

const CouponApi = () => {
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, CouponSchema)
      .then(async (reqData) => {
        try {
          let response;
          console.log(reqData);
          if (reqData.id) {
            response = await crudService.update(
              Coupon,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(Coupon, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Coupon ${
              reqData.id ? "updated" : "created"
            } successfully`,
            data: response || {},
          });
        } catch (error) {
          console.log(36, error);
          return res.status(501).json(error);
        }
      })
      .catch((err) => {
        console.log(41, err);
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
        await crudService.destroy(Coupon, { id: req.body.record_id });
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Coupon deleted successfully.`,
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
      return res.status(501).json(error);
    }
  };

  const get = async (req, res) => {
    try {
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.query.keyword)
        whereClause.name = { [Sequelize.Op.iLike]: req.query.keyword + "%" };

      if (req.query.id) whereClause.id = { [Sequelize.Op.eq]: req.query.id };

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
        projection: { _id: 0, id: `$_id`, name: 1 },
        skip,
        limit,
        sortField: "name",
      };

      let response = await crudService.get(Coupon, executing_parameters);

      let page_info = {};
      page_info.total_items = response.totalCount;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.totalCount / page_size);
      page_info.page_size = response.length;

      return res.status(200).json({
        code: 200,
        success: true,
        message: "coupon record found.",
        data: response,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json(error);
    }
  };

  const apply_coupon_to_product_variant = async (req, res) => {
    try {
      if (
        req.body.product_variant_id == undefined ||
        req.body.product_variant_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Product Variant ID and Coupon ID.",
        });

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.id = { [Sequelize.Op.in]: req.body.product_variant_id };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: Coupon,
            attributes: ["name"],
          },
        ],
      };

      const product_variants = await crudService.get(
        ProductVariants,
        executing_parameters
      );

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product_variant of product_variants) {
        if (product_variant.coupon_id != null) {
          let not_updated_custom_message = {};
          not_updated_custom_message.message = `Coupon '${product_variant.Coupon.name}' is already applied on this Product Variant. (Product Variant ID ${product_variant.id}).`;
          not_updated_custom_message.product_variant_id = product_variant.id;
          not_updated_custom_message.coupon_id = product_variant.coupon_id;
          not_updated_pvs.push(not_updated_custom_message);
        } else {
          bulkUpdates.push({
            id: product_variant.id,
            coupon_id: req.body.coupon_id,
          });
          let updated_custom_message = {};
          updated_custom_message.message = `Coupon '${coupon_data[0].name}' successfully Applied on this Product Variant. (Product Variant ID ${product_variant.id}).`;
          updated_custom_message.product_variant_id = product_variant.id;
          updated_custom_message.coupon_id = req.body.coupon_id;
          updated_pvs.push(updated_custom_message);
        }
      }

      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message: "Coupon Applied on Product Variant Successfully.",
        updated_data: updated_pvs,
        not_updated_data: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  const apply_coupon_to_product_variant_forced = async (req, res) => {
    try {
      if (
        req.body.product_variant_id == undefined ||
        req.body.product_variant_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Product Variant ID and Coupon ID.",
        });

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.id = { [Sequelize.Op.in]: req.body.product_variant_id };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
      };

      const product_variants = await crudService.get(
        ProductVariants,
        executing_parameters
      );

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product_variant of product_variants) {
        bulkUpdates.push({
          id: product_variant.id,
          coupon_id: req.body.coupon_id,
        });
        let updated_custom_message = {};
        updated_custom_message.message = `Coupon '${coupon_data[0].name}' successfully Applied on this Product Variant. (Product Variant ID ${product_variant.id}).`;
        updated_custom_message.product_variant_id = product_variant.id;
        updated_custom_message.coupon_id = req.body.coupon_id;
        updated_pvs.push(updated_custom_message);
      }

      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message: "Forced Coupon Applied on Product Variant Successfully.",
        updated_data: updated_pvs,
        not_updated_data: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  const apply_coupon_to_product = async (req, res) => {
    try {
      if (
        req.body.product_id == undefined ||
        req.body.product_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Product ID and Coupon ID.",
        });

      let whereClause_product = {};
      whereClause_product.is_deleted = false;
      whereClause_product.id = { [Sequelize.Op.in]: req.body.product_id };

      const executing_parameters_product = {
        where: whereClause_product,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductVariants,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
          },
        ],
      };

      const product = await crudService.get(
        Product,
        executing_parameters_product
      );
      // console.log(product);

      if (product[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Product Does not exists.",
        });
      }

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.product_id = { [Sequelize.Op.in]: req.body.product_id };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: Coupon,
            attributes: ["name"],
          },
          {
            model: Product,
            attributes: ["name"],
          },
        ],
      };

      const product_variants = await crudService.get(
        ProductVariants,
        executing_parameters
      );

      console.log(product_variants);

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product_variant of product_variants) {
        if (product_variant.coupon_id != null) {
          let not_updated_custom_message = {};
          not_updated_custom_message.message = `Coupon '${product_variant.Coupon.name}' is already applied on this Product Variant which lies under the Product ${product_variant.Product.name}.`;
          not_updated_custom_message.product_id = product_variant.product_id;
          not_updated_custom_message.product_variant_id = product_variant.id;
          not_updated_custom_message.coupon_id = product_variant.coupon_id;
          not_updated_pvs.push(not_updated_custom_message);
        } else {
          bulkUpdates.push({
            id: product_variant.id,
            coupon_id: req.body.coupon_id,
          });
          let updated_custom_message = {};
          updated_custom_message.message = `Coupon '${coupon_data[0].name}' successfully Applied on Product Variant which lies under the Product ${product_variant.Product.name}.`;
          updated_custom_message.product_id = product_variant.product_id;
          updated_custom_message.product_variant_id = product_variant.id;
          updated_custom_message.coupon_id = req.body.coupon_id;
          updated_pvs.push(updated_custom_message);
        }
      }

      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message: "Coupon Applying Proccess on Product Successfull.",
        updated_data: updated_pvs,
        not_updated_data: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  const apply_coupon_to_product_forced = async (req, res) => {
    try {
      if (
        req.body.product_id == undefined ||
        req.body.product_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Product ID and Coupon ID.",
        });

      let whereClause_product = {};
      whereClause_product.is_deleted = false;
      whereClause_product.id = { [Sequelize.Op.in]: req.body.product_id };

      const executing_parameters_product = {
        where: whereClause_product,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductVariants,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
          },
        ],
      };

      const product = await crudService.get(
        Product,
        executing_parameters_product
      );
      // console.log(product);

      if (product[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Product Does not exists.",
        });
      }

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.product_id = { [Sequelize.Op.in]: req.body.product_id };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: Coupon,
            attributes: ["name"],
          },
          {
            model: Product,
            attributes: ["name"],
          },
        ],
      };

      const product_variants = await crudService.get(
        ProductVariants,
        executing_parameters
      );

      console.log(product_variants);

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product_variant of product_variants) {
        bulkUpdates.push({
          id: product_variant.id,
          coupon_id: req.body.coupon_id,
        });
        let updated_custom_message = {};
        updated_custom_message.message = `Coupon '${coupon_data[0].name}' successfully Applied on Product Variant which lies under the Product ${product_variant.Product.name}.`;
        updated_custom_message.product_id = product_variant.product_id;
        updated_custom_message.product_variant_id = product_variant.id;
        updated_custom_message.coupon_id = req.body.coupon_id;
        updated_pvs.push(updated_custom_message);
      }

      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message: "Forced Coupon Applying Proccess on Product Successfull.",
        updated_data: updated_pvs,
        not_updated_data: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  const apply_coupon_to_category = async (req, res) => {
    try {
      if (
        req.body.category_id == undefined ||
        req.body.category_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Category ID and Coupon ID.",
        });

      let whereClause_category = {};
      whereClause_category.is_deleted = false;
      whereClause_category.id = { [Sequelize.Op.in]: req.body.category_id };

      const executing_parameters_category = {
        where: whereClause_category,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
      };

      const category = await crudService.get(
        Category,
        executing_parameters_category
      );
      // console.log(product);

      if (category[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Category Does not exists.",
        });
      }

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.category_id = { [Sequelize.Op.in]: req.body.category_id };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductVariants,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: Coupon,
                attributes: ["name"],
              },
            ],
          },
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      };

      const products = await crudService.get(Product, executing_parameters);
      console.log(products[0].Category);

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product of products) {
        let product_variants = product.ProductVariants;
        for (let product_variant of product_variants) {
          if (product_variant.coupon_id != null) {
            let not_updated_custom_message = {};
            not_updated_custom_message.message = `Coupon '${product_variant.Coupon.name}' is already applied on Product Variant which lies under Product ${product.name} and Category ${product.Category.name}.`;
            not_updated_custom_message.product_id = product.id;
            not_updated_custom_message.category = product.category_id;
            not_updated_custom_message.product_variant_id = product_variant.id;
            not_updated_custom_message.coupon_id = product_variant.coupon_id;
            not_updated_pvs.push(not_updated_custom_message);
          } else {
            bulkUpdates.push({
              id: product_variant.id,
              coupon_id: req.body.coupon_id,
            });
            let updated_custom_message = {};
            updated_custom_message.message = `Coupon '${coupon_data[0].name}' successfully Applied on Product Variant which lies under Product ${product.name} and Category ${product.Category.name}.`;
            updated_custom_message.product_id = product.id;
            updated_custom_message.category = product.category_id;
            updated_custom_message.product_variant_id = product_variant.id;
            updated_custom_message.coupon_id = req.body.coupon_id;
            updated_pvs.push(updated_custom_message);
          }
        }
      }
      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message: "Coupon Applying Proccess on Category of Product Successfull.",
        updated_data: updated_pvs,
        not_updated_data: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  const apply_coupon_to_category_forced = async (req, res) => {
    try {
      if (
        req.body.category_id == undefined ||
        req.body.category_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Category ID and Coupon ID.",
        });

      let whereClause_category = {};
      whereClause_category.is_deleted = false;
      whereClause_category.id = { [Sequelize.Op.in]: req.body.category_id };

      const executing_parameters_category = {
        where: whereClause_category,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
      };

      const category = await crudService.get(
        Category,
        executing_parameters_category
      );
      // console.log(product);

      if (category[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Category Does not exists.",
        });
      }

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.category_id = { [Sequelize.Op.in]: req.body.category_id };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductVariants,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: Coupon,
                attributes: ["name"],
              },
            ],
          },
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      };

      const products = await crudService.get(Product, executing_parameters);
      console.log(products[0].Category);

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product of products) {
        let product_variants = product.ProductVariants;
        for (let product_variant of product_variants) {
          bulkUpdates.push({
            id: product_variant.id,
            coupon_id: req.body.coupon_id,
          });
          let updated_custom_message = {};
          updated_custom_message.message = `Coupon '${coupon_data[0].name}' successfully Applied on Product Variant which lies under Product ${product.name} and Category ${product.Category.name}.`;
          updated_custom_message.product_id = product.id;
          updated_custom_message.category = product.category_id;
          updated_custom_message.product_variant_id = product_variant.id;
          updated_custom_message.coupon_id = req.body.coupon_id;
          updated_pvs.push(updated_custom_message);
        }
      }
      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message:
          "Forced Coupon Applying Proccess on Category of Product Successfull.",
        updated_data: updated_pvs,
        not_updated_data: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  const apply_coupon_to_subcategory = async (req, res) => {
    try {
      if (
        req.body.sub_category_id == undefined ||
        req.body.sub_category_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Sub Category ID and Coupon ID.",
        });

      let whereClause_subcategory = {};
      whereClause_subcategory.is_deleted = false;
      whereClause_subcategory.id = {
        [Sequelize.Op.in]: req.body.sub_category_id,
      };

      const executing_parameters_subcategory = {
        where: whereClause_subcategory,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
      };

      const subcategory = await crudService.get(
        SubCategory,
        executing_parameters_subcategory
      );
      // console.log(product);

      if (subcategory[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Sub Category Does not exists.",
        });
      }

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.sub_category_id = {
        [Sequelize.Op.in]: req.body.sub_category_id,
      };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductVariants,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: Coupon,
                attributes: ["name"],
              },
            ],
          },
          {
            model: SubCategory,
            attributes: ["name"],
          },
        ],
      };

      const products = await crudService.get(Product, executing_parameters);
      console.log(products);

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product of products) {
        let product_variants = product.ProductVariants;
        for (let product_variant of product_variants) {
          if (product_variant.coupon_id != null) {
            let not_updated_custom_message = {};
            not_updated_custom_message.message = `Coupon '${product_variant.Coupon.name}' is already applied on Product Variant which lies under Product ${product.name} and Sub Category ${product.SubCategory.name}.`;
            not_updated_custom_message.product_id = product.id;
            not_updated_custom_message.sub_category_id =
              product.sub_category_id;
            not_updated_custom_message.product_variant_id = product_variant.id;
            not_updated_custom_message.coupon_id = product_variant.coupon_id;
            not_updated_pvs.push(not_updated_custom_message);
          } else {
            bulkUpdates.push({
              id: product_variant.id,
              coupon_id: req.body.coupon_id,
            });
            let updated_custom_message = {};
            updated_custom_message.message = `Coupon '${coupon_data[0].name}' successfully Applied on Product Variant lies under Product ${product.name} and Sub Category ${product.SubCategory.name}.`;
            updated_custom_message.product_id = product.id;
            updated_custom_message.sub_category_id = product.sub_category_id;
            updated_custom_message.product_variant_id = product_variant.id;
            updated_custom_message.coupon_id = req.body.coupon_id;
            updated_pvs.push(updated_custom_message);
          }
        }
      }
      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message:
          "Coupon Applying Proccess on Sub Category of Product Successfull.",
        updated_data: updated_pvs,
        not_updated_data: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  const apply_coupon_to_subcategory_forced = async (req, res) => {
    try {
      if (
        req.body.sub_category_id == undefined ||
        req.body.sub_category_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Sub Category ID and Coupon ID.",
        });

      let whereClause_subcategory = {};
      whereClause_subcategory.is_deleted = false;
      whereClause_subcategory.id = {
        [Sequelize.Op.in]: req.body.sub_category_id,
      };

      const executing_parameters_subcategory = {
        where: whereClause_subcategory,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
      };

      const subcategory = await crudService.get(
        SubCategory,
        executing_parameters_subcategory
      );
      // console.log(product);

      if (subcategory[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Sub Category Does not exists.",
        });
      }

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.sub_category_id = {
        [Sequelize.Op.in]: req.body.sub_category_id,
      };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductVariants,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: Coupon,
                attributes: ["name"],
              },
            ],
          },
          {
            model: SubCategory,
            attributes: ["name"],
          },
        ],
      };

      const products = await crudService.get(Product, executing_parameters);
      console.log(products);

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product of products) {
        let product_variants = product.ProductVariants;
        for (let product_variant of product_variants) {
          bulkUpdates.push({
            id: product_variant.id,
            coupon_id: req.body.coupon_id,
          });
          let updated_custom_message = {};
          updated_custom_message.message = `Coupon '${coupon_data[0].name}' successfully Applied on Product Variant lies under Product ${product.name} and Sub Category ${product.SubCategory.name}.`;
          updated_custom_message.product_id = product.id;
          updated_custom_message.sub_category_id = product.sub_category_id;
          updated_custom_message.product_variant_id = product_variant.id;
          updated_custom_message.coupon_id = req.body.coupon_id;
          updated_pvs.push(updated_custom_message);
        }
      }
      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message:
          "Forced Coupon Applying Proccess on Sub Category of Product Successfull.",
        updated_data: updated_pvs,
        not_updated_data: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  const apply_coupon_to_collection = async (req, res) => {
    try {
      if (
        req.body.collection_id == undefined ||
        req.body.collection_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Collection ID and Coupon ID.",
        });

      let whereClause_collection = {};
      whereClause_collection.is_deleted = false;
      whereClause_collection.id = {
        [Sequelize.Op.in]: req.body.collection_id,
      };

      const executing_parameters_collection = {
        where: whereClause_collection,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
      };

      const collection = await crudService.get(
        Collection,
        executing_parameters_collection
      );
      // console.log(product);

      if (collection[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Collection Does not exists.",
        });
      }

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.collection_id = { [Sequelize.Op.in]: req.body.collection_id };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductVariants,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: Coupon,
                attributes: ["name"],
              },
            ],
          },
          {
            model: Collection,
            attributes: ["name"],
          },
        ],
      };

      const products = await crudService.get(Product, executing_parameters);

      console.log(products);

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product of products) {
        let product_variants = product.ProductVariants;
        for (let product_variant of product_variants) {
          if (product_variant.coupon_id != null) {
            let not_updated_custom_message = {};
            not_updated_custom_message.message = `Coupon '${product_variant.Coupon.name}' is already applied on Product Variant which lies under Product ${product.name} and Collection ${product.Collection.name}.`;
            not_updated_custom_message.product_id = product.id;
            not_updated_custom_message.collection_id = product.collection_id;
            not_updated_custom_message.product_variant_id = product_variant.id;
            not_updated_custom_message.coupon_id = product_variant.coupon_id;
            not_updated_pvs.push(not_updated_custom_message);
          } else {
            bulkUpdates.push({
              id: product_variant.id,
              coupon_id: req.body.coupon_id,
            });
            let updated_custom_message = {};
            updated_custom_message.message = `Coupon '${product_variant.Coupon.name}' successfully Applied on Product Variant which lies under Product ${product.name} and Collection ${product.Collection.name}.`;
            updated_custom_message.product_id = product.id;
            updated_custom_message.collection_id = product.collection_id;
            updated_custom_message.product_variant_id = product_variant.id;
            updated_custom_message.coupon_id = req.body.coupon_id;
            updated_pvs.push(updated_custom_message);
          }
        }
      }
      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message:
          "Coupon Applying Proccess on Collection of Product Successfull.",
        updated_pvs: updated_pvs,
        not_updated_pvs: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  const apply_coupon_to_collection_forced = async (req, res) => {
    try {
      if (
        req.body.collection_id == undefined ||
        req.body.collection_id == "" ||
        req.body.coupon_id == "" ||
        req.body.coupon_id == undefined
      )
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Please Provide Collection ID and Coupon ID.",
        });

      let whereClause_collection = {};
      whereClause_collection.is_deleted = false;
      whereClause_collection.id = {
        [Sequelize.Op.in]: req.body.collection_id,
      };

      const executing_parameters_collection = {
        where: whereClause_collection,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
      };

      const collection = await crudService.get(
        Collection,
        executing_parameters_collection
      );
      // console.log(product);

      if (collection[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Collection Does not exists.",
        });
      }

      let whereClause = {};
      whereClause.is_deleted = false;
      whereClause.collection_id = { [Sequelize.Op.in]: req.body.collection_id };

      const executing_parameters = {
        where: whereClause,
        projection: { _id: 0, id: `$_id`, name: 1 },
        sortField: "id",
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductVariants,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: Coupon,
                attributes: ["name"],
              },
            ],
          },
          {
            model: Collection,
            attributes: ["name"],
          },
        ],
      };

      const products = await crudService.get(Product, executing_parameters);

      console.log(products);

      let updated_pvs = [];
      let not_updated_pvs = [];
      let bulkUpdates = [];

      let whereClause_coupon = {};
      whereClause_coupon.is_deleted = false;
      whereClause_coupon.id = { [Sequelize.Op.eq]: req.body.coupon_id };
      let executing_parameters_coupon = {
        where: whereClause_coupon,
      };

      let coupon_data = await crudService.get(
        Coupon,
        executing_parameters_coupon
      );

      if (coupon_data[0] == undefined) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Coupon Does not exists.",
        });
      }

      for (let product of products) {
        let product_variants = product.ProductVariants;
        for (let product_variant of product_variants) {
          bulkUpdates.push({
            id: product_variant.id,
            coupon_id: req.body.coupon_id,
          });
          let updated_custom_message = {};
          updated_custom_message.message = `Coupon '${product_variant.Coupon.name}' successfully Applied on Product Variant which lies under Product ${product.name} and Collection ${product.Collection.name}.`;
          updated_custom_message.product_id = product.id;
          updated_custom_message.collection_id = product.collection_id;
          updated_custom_message.product_variant_id = product_variant.id;
          updated_custom_message.coupon_id = req.body.coupon_id;
          updated_pvs.push(updated_custom_message);
        }
      }
      console.log(Date.now());
      await ProductVariants.update(
        { coupon_id: req.body.coupon_id },
        {
          where: {
            id: bulkUpdates.map((update) => update.id),
          },
        }
      );
      console.log(Date.now());

      return res.status(200).json({
        code: 200,
        success: true,
        message:
          "Forced Coupon Applying Proccess on Collection of Product Successfull.",
        updated_pvs: updated_pvs,
        not_updated_pvs: not_updated_pvs,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        code: 501,
        success: false,
        error: error,
      });
    }
  };

  return {
    save,
    destroy,
    get,
    apply_coupon_to_product_variant_forced,
    apply_coupon_to_product_variant,
    apply_coupon_to_product,
    apply_coupon_to_product_forced,
    apply_coupon_to_category,
    apply_coupon_to_category_forced,
    apply_coupon_to_subcategory,
    apply_coupon_to_subcategory_forced,
    apply_coupon_to_collection,
    apply_coupon_to_collection_forced,
  };
};
module.exports = CouponApi;

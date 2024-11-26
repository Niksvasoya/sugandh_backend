const ProductModel = require("../../../api/models/Product/Product");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { ProductVariantsSchemas } = require("../../schemas/ProductSchemas");
const Sequelize = require("sequelize");
const fireBase = require("../../helper/firebaseHelper");
const ProductVariants = require("../../models/Product/ProductVariants");

const ProductVariantsApi = () => {
  // For create and update Product
  const save = async (req, res) => {
    // console.log(req.files)
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
      .validate(req.body, ProductVariantsSchemas)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            await crudService.update(
              ProductVariants,
              { id: reqData.id },
              reqData
            );
          } else {
            let responseProductVariants = await crudService.get(
              ProductVariants,
              {
                where: { is_deleted: false, product_id: reqData.product_id },
                attributes: [
                  Sequelize.fn("max", Sequelize.col("product_variants_number")),
                ],
                raw: true,
                distinct: true,
              }
            );
            if (responseProductVariants.length > 0) {
              reqData.product_variants_number =
                responseProductVariants[0].max + 1;
              // data.product_id = response.id
              response = await crudService.insert(ProductVariants, reqData);
            }
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Product ${
              reqData.id ? "updated" : "created"
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
  // for deleting variants
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(ProductModel, { id: id });
          await crudService.destroy(ProductVariants, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Product Variants deleted successfully.`,
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

  return {
    save,
    destroy,
  };
};
module.exports = ProductVariantsApi;

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
const Brand = require("../../models/Product/Brand");
const SubCategory = require("../../models/Product/SubCategory");
const HsnCode = require("../../models/Product/HsnCode");
const fetch = require("node-fetch");
const ImportApi = () => {
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
              if (collection_number < 10 && product_number < 10) {
                reqData.sku = `wos0${collection_number}0${product_number}`;
              } else if (collection_number < 10) {
                reqData.sku = `wos0${collection_number}${product_number}`;
              } else if (product_number < 10) {
                reqData.sku = `wos${collection_number}0${product_number}`;
              } else {
                reqData.sku = `wos${collection_number}${product_number}`;
              }
              console.log(reqData.sku);
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
  const convertID = async (req, res) => {
    try {
      const xlsx = require("xlsx");
      async function trimObj(obj) {
        if (
          (!Array.isArray(obj) &&
            typeof obj != "object" &&
            obj != "null" &&
            obj != null &&
            obj != "undefined",
            obj != undefined)
        )
          return obj;
        return Object.keys(obj).reduce(
          function (acc, key) {
            acc[key.trim()] =
              typeof obj[key] == "string" ? obj[key].trim() : trimObj(obj[key]);
            return acc;
          },
          Array.isArray(obj) ? [] : {}
        );
      }
      function readExcelFile(req, res) {
        // Get the file buffer from the request body
        // const fileBuffer = Buffer.from(req.body);

        // Parse the Excel file using xlsx
        if (req.files != null) {
          console.log(req.files.data);
          const workbook = xlsx.read(req.files.data.data);

          // // Get the worksheet name
          const sheetName = workbook.SheetNames[0];

          // Get the worksheet data as an array of objects
          const worksheet = workbook.Sheets[sheetName];
          const data = xlsx.utils.sheet_to_json(worksheet);

          // Send the data as the response
          // res.json(data);

          // const result = data.reduce((acc, curr) => {
          //     const commonData = {
          //         name: curr.name,
          //         description: curr.description,
          //         brand_id: curr.brand_id,
          //         category_id: curr.category_id,
          //         sub_category_id: curr.sub_category_id,
          //         fabric_id: curr.fabric_id,
          //         fabric_care_id: curr.fabric_care_id,
          //         occasion_id: curr.occasion_id,
          //         neck_type_id: curr.neck_type_id,
          //         sleeve_type_id: curr.sleeve_type_id,
          //         hsn_code_id: curr.hsn_code_id,
          //         tax_type_id: curr.tax_type_id,
          //         collection_id: curr.collection_id,
          //         unit_of_measurement_id: 1
          //     };

          //     const existingObj = acc.find(obj => {
          //         for (const key in obj) {
          //             if (key !== 'data' && obj[key] !== commonData[key]) {
          //                 return false;
          //             }
          //         }
          //         return true;
          //     });

          //     if (existingObj) {
          //         existingObj.data.push({
          //             size_id: curr.size_id,
          //             color_id: curr.color_id,
          //             mrp: curr.mrp,
          //             discount: curr.discount
          //         });
          //     } else {
          //         acc.push({
          //             ...commonData,
          //             data: [{
          //                 size_id: curr.size_id,
          //                 color_id: curr.color_id,
          //                 mrp: curr.mrp,
          //                 discount: curr.discount
          //             }]
          //         });
          //     }

          //     return acc;
          // }, []);

          // console.log(result);
          return data;
        }
      }
      let finalData = readExcelFile(req, res)
      console.log(finalData);
      let finalResponse = []
      // console.log(finalData);
      for (let data of finalData) {
        // console.log(data.brand_id);
        // let data = await trimObj(data_obj)
        let fData = {}
        fData.name = data.name
        // fData.sell_price = data.sell_price
        // fData.mrp = data.mrp
        // fData.discount = data.discount
        // let responseProduct = await crudService.get(ProductModel, {
        //     where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.name.trim() } },
        //     attributes: ['id', 'name'],
        //     distinct: true,
        // });
        // if (responseProduct.length > 0) {
        //     fData.product_id = responseProduct[0].id
        // }
        // else {
        //     fData.product_id = data.name.trim()

        // }
        fData.description = data.description
        fData.category_id = data.category_id
        if (data.brand_id) {
          let responseBrand = await crudService.get(Brand, {
            where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.brand_id.trim() } },
            attributes: ['id', 'name'],
            distinct: true,
          });
          if (responseBrand.length > 0) {
            fData.brand_id = responseBrand[0].id
          }
          else {
            fData.brand_id = data.brand_id.trim()

          }
        }
        if (data.collection_id) {
          let responseCollection = await crudService.get(CollectionModel, {
            where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.collection_id.trim() } },
            attributes: ['id', 'name'],
            distinct: true,
          });
          if (responseCollection.length > 0) {
            fData.collection_id = responseCollection[0].id
          }
          else {
            fData.collection_id = data.collection_id.trim()

          }
        }
        // if (data.category_id) {
        //     let responseCategory = await crudService.get(Category, {
        //         where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.category_id.trim() } },
        //         attributes: ['id', 'name'],
        //         distinct: true,
        //     });
        //     if (responseCategory.length > 0) {
        //         fData.category_id = responseCategory[0].id
        //     }
        // }
        fData.category_id = 1
        if (data.sub_category_id) {
          let responseSubCategory = await crudService.get(SubCategory, {
            where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.sub_category_id.trim() } },
            attributes: ['id', 'name'],
            distinct: true,
          });
          if (responseSubCategory.length > 0) {
            fData.sub_category_id = responseSubCategory[0].id
          }
          else {
            fData.sub_category_id = data.sub_category_id.trim()
          }
        }
        if (data.fabric_id) {
          let responseFabric = await crudService.get(Fabric, {
            where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.fabric_id.trim() } },
            attributes: ['id', 'name'],
            distinct: true,
          });
          if (responseFabric.length > 0) {
            fData.fabric_id = responseFabric[0].id
          }
          else {
            fData.fabric_id = data.fabric_id.trim()

          }
        }
        // if (data.fabric_care_id) {
        //     let responseFabricCare = await crudService.get(FabricCare, {
        //         where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.fabric_care_id.trim() } },
        //         attributes: ['id', 'name'],
        //         distinct: true,
        //     });
        //     if (responseFabricCare.length > 0) {
        //         fData.fabric_care_id = responseFabricCare[0].id
        //     }
        //     else {
        //         fData.fabric_care_id = data.fabric_care_id.trim()

        //     }
        // }
        if (data.occasion_id) {
          let responseOccasion = await crudService.get(Occasion, {
            where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.occasion_id.trim() } },
            attributes: ['id', 'name'],
            distinct: true,
          });
          if (responseOccasion.length > 0) {
            fData.occasion_id = responseOccasion[0].id
          }
          else {
            fData.occasion_id = data.occasion_id.trim()
          }
        }
        if (data.neck_type_id) {
          let responseNeckType = await crudService.get(NeckType, {
            where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.neck_type_id.trim() } },
            attributes: ['id', 'name'],
            distinct: true,
          });
          if (responseNeckType.length > 0) {
            fData.neck_type_id = responseNeckType[0].id
          }
          else {
            fData.neck_type_id = data.neck_type_id.trim()

          }
        }
        if (data.sleeve_type_id) {
          console.log(data.sleeve_type_id, "heer");
          if (isNaN(data.sleeve_type_id)) {
            let responseSleeveType = await crudService.get(SleeveType, {
              where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.sleeve_type_id.trim() } },
              attributes: ['id', 'name'],
              distinct: true,
            });
            if (responseSleeveType.length > 0) {
              fData.sleeve_type_id = responseSleeveType[0].id
            }
            else {
              fData.sleeve_type_id = data.sleeve_type_id.trim()

            }
          }
          else {
            fData.sleeve_type_id = 10
          }

        }
        // if (data.hsn_code_id) {
        //     let responseHsnCode = await crudService.get(HsnCode, {
        //         where: { is_deleted: false, code: JSON.stringify(data.hsn_code_id) },
        //         attributes: ['id', 'code'],
        //         distinct: true,
        //     });
        //     if (responseHsnCode.length > 0) {
        //         fData.hsn_code_id = responseHsnCode[0].id
        //     }
        // }
        // if (data.tax_type_id) {
        //     let responseTaxType = await crudService.get(TaxType, {
        //         where: { is_deleted: false, name: data.tax_type_id },
        //         attributes: ['id', 'value'],
        //         distinct: true,
        //     });
        //     if (responseTaxType.length > 0) {
        //         fData.tax_type_id = responseTaxType[0].id
        //     }
        // }
        // console.log(subData);
        // if (data.size_id) {
        //     let responseSize = await crudService.get(Size, {
        //         where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.size_id.trim() } },
        //         attributes: ['id', 'name'],
        //         distinct: true,
        //     });
        //     if (responseSize.length > 0) {
        //         fData.size_id = responseSize[0].id
        //     }
        //     else {
        //         fData.size_id = data.size_id
        //     }
        // }
        // if (data.color_id) {
        //     let responseColor = await crudService.get(Color, {
        //         where: { is_deleted: false, name: { [Sequelize.Op.iLike]: data.color_id.trim() } },
        //         attributes: ['id', 'name'],
        //         distinct: true,
        //     });
        //     if (responseColor.length > 0) {
        //         fData.color_id = responseColor[0].id
        //     }
        //     else {
        //         fData.color_id = data.color_id
        //     }
        // }
        fData.tax_type_id = 1;
        fData.fabric_care_id = 1;
        fData.hsn_code_id = 1;
        finalResponse.push(fData)
      }
      // console.log(finalResponse);
      for (let reqData of finalResponse) {
        // console.log(reqData);
        // reqData = await trimObj(reqData)
        // reqData.category_id = 1
        // const color = require('color');
        // try {
        //     if (!reqData.hex_code) {
        //         reqData.hex_code = color(reqData.Hi.trim()).hex();
        //         console.log(reqData);
        //     }
        // } catch {
        //     reqData.hex_code = "#FFFF"
        // }
        console.log(reqData);
        // reqData.occasion_id = 7;
        const payload = reqData;
        const options = {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(
          "https://api.sugandh.co/public/api/product/save",
          options
        );
        const data = await response.json();
        console.log(data);
        // console.log(data.error.errors);
        // break;
        // if (data.data) {
        //     // console.log("yesss");
        //     for (let subData of reqData.data) {
        //         subData.product_id = data.data.id
        //         const payload = subData;
        //         const options = {
        //             method: 'POST',
        //             body: JSON.stringify(payload),
        //             headers: { 'Content-Type': 'application/json' }
        //         };
        //         const response = await fetch('https://api.sugandh.co/public/api/product/variant/save', options);
        //         const dataFinal = await response.json();
        //         console.log(dataFinal);
        //     }
        // }
      }

      return res.status(200).json(finalResponse);
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };
  const importVariants = async (req, res) => {
    try {
      const xlsx = require("xlsx");
      async function trimObj(obj) {
        if (
          (!Array.isArray(obj) &&
            typeof obj != "object" &&
            obj != "null" &&
            obj != null &&
            obj != "undefined",
            obj != undefined)
        )
          return obj;
        return Object.keys(obj).reduce(
          function (acc, key) {
            acc[key.trim()] =
              typeof obj[key] == "string" ? obj[key].trim() : trimObj(obj[key]);
            return acc;
          },
          Array.isArray(obj) ? [] : {}
        );
      }
      function readExcelFile(req, res) {
        // Get the file buffer from the request body
        // const fileBuffer = Buffer.from(req.body);

        // Parse the Excel file using xlsx
        if (req.files != null) {
          console.log(req.files.data);
          const workbook = xlsx.read(req.files.data.data);

          // // Get the worksheet name
          const sheetName = workbook.SheetNames[0];

          // Get the worksheet data as an array of objects
          const worksheet = workbook.Sheets[sheetName];
          const data = xlsx.utils.sheet_to_json(worksheet);

          // Send the data as the response
          // res.json(data);

          // const result = data.reduce((acc, curr) => {
          //     const commonData = {
          //         name: curr.name,
          //         description: curr.description,
          //         brand_id: curr.brand_id,
          //         category_id: curr.category_id,
          //         sub_category_id: curr.sub_category_id,
          //         fabric_id: curr.fabric_id,
          //         fabric_care_id: curr.fabric_care_id,
          //         occasion_id: curr.occasion_id,
          //         neck_type_id: curr.neck_type_id,
          //         sleeve_type_id: curr.sleeve_type_id,
          //         hsn_code_id: curr.hsn_code_id,
          //         tax_type_id: curr.tax_type_id,
          //         collection_id: curr.collection_id,
          //         unit_of_measurement_id: 1
          //     };

          //     const existingObj = acc.find(obj => {
          //         for (const key in obj) {
          //             if (key !== 'data' && obj[key] !== commonData[key]) {
          //                 return false;
          //             }
          //         }
          //         return true;
          //     });

          //     if (existingObj) {
          //         existingObj.data.push({
          //             size_id: curr.size_id,
          //             color_id: curr.color_id,
          //             mrp: curr.mrp,
          //             discount: curr.discount
          //         });
          //     } else {
          //         acc.push({
          //             ...commonData,
          //             data: [{
          //                 size_id: curr.size_id,
          //                 color_id: curr.color_id,
          //                 mrp: curr.mrp,
          //                 discount: curr.discount
          //             }]
          //         });
          //     }

          //     return acc;
          // }, []);

          // console.log(result);
          return data;
        }
      }
      let finalData = readExcelFile(req, res);
      console.log(finalData);
      let finalResponse = [];
      console.log(finalData);
      for (let data of finalData) {
        // console.log(data.brand_id);
        // let data = await trimObj(data_obj)
        let fData = {};
        fData.name = data.name;
        fData.sell_price = data.sell_price;
        fData.mrp = data.mrp;
        fData.discount = data.discount;
        let responseProduct = await crudService.get(ProductModel, {
          where: {
            is_deleted: false,
            name: { [Sequelize.Op.iLike]: data.name.trim() },
          },
          attributes: ["id", "name"],
          distinct: true,
        });
        if (responseProduct.length > 0) {
          fData.product_id = responseProduct[0].id;
        } else {
          fData.product_id = data.name.trim();
        }
        if (data.size_id) {
          let responseSize = await crudService.get(Size, {
            where: {
              is_deleted: false,
              name: { [Sequelize.Op.iLike]: data.size_id.trim() },
            },
            attributes: ["id", "name"],
            distinct: true,
          });
          if (responseSize.length > 0) {
            fData.size_id = responseSize[0].id;
          } else {
            fData.size_id = data.size_id;
          }
        }
        if (data.color_id) {
          let responseColor = await crudService.get(Color, {
            where: {
              is_deleted: false,
              name: { [Sequelize.Op.iLike]: data.color_id.trim() },
            },
            attributes: ["id", "name"],
            distinct: true,
          });
          if (responseColor.length > 0) {
            fData.color_id = responseColor[0].id;
          } else {
            fData.color_id = data.color_id;
          }
        }

        finalResponse.push(fData);
      }
      console.log(finalResponse);
      for (let reqData of finalResponse) {
        // console.log(reqData);
        // reqData = await trimObj(reqData)
        // reqData.category_id = 1
        // const color = require('color');
        // try {
        //     if (!reqData.hex_code) {
        //         reqData.hex_code = color(reqData.Hi.trim()).hex();
        //         console.log(reqData);
        //     }
        // } catch {
        //     reqData.hex_code = "#FFFF"
        // }
        console.log(reqData);

        const payload = reqData;
        const options = {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(
          "https://api.sugandh.co/public/api/product/variant/save",
          options
        );
        const data = await response.json();
        console.log(data);
        // console.log(data.error.errors);
        // break;
        // if (data.data) {
        //     // console.log("yesss");
        //     for (let subData of reqData.data) {
        //         subData.product_id = data.data.id
        //         const payload = subData;
        //         const options = {
        //             method: 'POST',
        //             body: JSON.stringify(payload),
        //             headers: { 'Content-Type': 'application/json' }
        //         };
        //         const response = await fetch('https://api.sugandh.co/public/api/product/variant/save', options);
        //         const dataFinal = await response.json();
        //         console.log(dataFinal);
        //     }
        // }
      }

      return res.status(200).json(finalResponse);
    } catch (error) {
      console.log(error);
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
      response = await crudService.getAll(ProductModel, {
        where: whereClause,
        // attributes: ['id', 'name', 'category_id', 'description', 'sub_category_id', 'brand_id',
        //     'unit_of_measurement_id', 'hsn_code_id', 'is_single_barcode', 'color', 'thumbnail_image'],
        attributes: {
          exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
        },

        distinct: true,
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
            model: TaxType,
            where: { is_deleted: false },
            attributes: ["id", "name", "value"],
            required: false,
          },
          {
            model: ProductVariants,
            where: whereClauseVariant,
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
            // required: false
          },
        ],
      });
      // log(response)
      // for pagination in Product
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

  return {
    save,
    convertID,
    get,
    importVariants,
    // destroyVariants
  };
};
module.exports = ImportApi;

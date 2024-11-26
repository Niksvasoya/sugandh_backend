const ZipCodeModel = require("../../../api/models/Master/ZipCode");
const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { ZipCodeSchemas } = require("../../schemas/MasterSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const CityModel = require("../../models/Master/City");
const Province = require("../../models/Master/Province");
const Country = require("../../models/Master/Country");
const axios = require("axios");
const ZipCodeApi = () => {
  // For create and update ZipCode
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);
    req.body.name = JSON.stringify(req.body.name)
    validationService
      .validate(req.body, ZipCodeSchemas)
      .then(async (reqData) => {
        try {
          let response;
          let whereClause = {};
          whereClause.is_deleted = false;
          whereClause.name = { [Op.iLike]: reqData.name };
          if (reqData.id) {
            whereClause.id = { [Op.ne]: reqData.id };
          }
          let resCheck = await crudService.get(ZipCodeModel, {
            where: whereClause,
            attributes: ["id", "name", "city_id"],
            distinct: true,
          });
          if (resCheck.length > 0) {
            return res.status(201).json({
              code: 204,
              success: false,
              message: "ZipCode already exist.",
            });
          }
          if (reqData.id) {
            response = await crudService.update(
              ZipCodeModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(ZipCodeModel, reqData);
            console.log(response, "jjj");
          }

          return res.status(201).json({
            code: 200,
            success: true,
            message: `ZipCode ${reqData.id ? "updated" : "created"
              } successfully`,
            data: response || {},
          });
        } catch (error) {
          console.log(error);
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
  // for deleting ZipCode
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(ZipCodeModel, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `ZipCode deleted successfully.`,
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
      if (req.query.city_id) {
        whereClause.city_id = { [Op.eq]: req.query.city_id };
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
      response = await crudService.getAll(ZipCodeModel, {
        where: whereClause,
        attributes: ["id", "name", "city_id", "province_id", "country_id"],
        distinct: true,
        limit: page_size,
        offset: offset,
      });
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      for (let detail of response.rows) {
        console.log(detail);
        let responseCity = await crudService.get(CityModel, {
          where: { is_deleted: false, id: detail.city_id },
          attributes: [
            "id",
            "name",
            "province_id",
            "country_id",
            "latitude",
            "longitude",
          ],
          distinct: true,
        });
        detail.city_name = responseCity ? responseCity[0].name : undefined;
        let responseProvince = await crudService.get(Province, {
          where: { is_deleted: false, id: detail.province_id },
          attributes: ["id", "name", "country_id", "latitude", "longitude"],
          distinct: true,
        });
        detail.province_name = responseProvince
          ? responseProvince[0].name
          : undefined;
        let responseCountry = await crudService.get(Country, {
          where: { is_deleted: false, id: detail.country_id },
          attributes: ["id", "name"],
          distinct: true,
        });
        detail.country_name = responseCountry
          ? responseCountry[0].name
          : undefined;
      }

      return res.status(200).json({
        code: 200,
        success: true,
        message: `ZipCode get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };
  const getZipCodeData = async (req, res) => {
    try {
      await axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.zipcode}&sensor=true&key=AIzaSyBsqJFvJbRA0kP8tCezzr47UwkNWFWi6zM`
        )
        .then(async (resp) => {
          console.log(resp.data.results.length);
          if (resp.data.results.length <= 0) {
            return res.status(200).json({
              code: 200,
              success: true,
              message: `Please enter valid Zipcode`,
            });
          } else if (resp.data.results[0] != undefined) {
            let len = resp.data.results[0].address_components.length;
            let responseCountry = await crudService.get(Country, {
              where: {
                is_deleted: false,
                name: {
                  [Sequelize.Op.iLike]:
                    resp.data.results[0].address_components[len - 1].long_name,
                },
              },
              attributes: ["id", "name", "iso2"],
              distinct: true,
            });
            console.log(responseCountry);
            if (responseCountry.length > 0) {
              let responseProvince = await crudService.get(Province, {
                where: {
                  is_deleted: false,
                  name: {
                    [Sequelize.Op.iLike]:
                      resp.data.results[0].address_components[len - 2]
                        .long_name,
                  },
                  country_id: responseCountry[0].id,
                },
                attributes: [
                  "id",
                  "name",
                  "country_id",
                  "latitude",
                  "longitude",
                ],
                distinct: true,
              });
              console.log(responseProvince);
              if (responseProvince.length > 0) {
                let responseCity = await crudService.get(CityModel, {
                  where: {
                    is_deleted: false,
                    name: {
                      [Sequelize.Op.iLike]:
                        resp.data.results[0].address_components[len - 3]
                          .long_name,
                    },
                    country_id: responseProvince[0].country_id,
                    province_id: responseProvince[0].id,
                  },
                  attributes: [
                    "id",
                    "name",
                    "province_id",
                    "country_id",
                    "latitude",
                    "longitude",
                  ],
                  distinct: true,
                });
                if (responseCity.length > 0) {
                  return res.status(200).json({
                    code: 200,
                    success: true,
                    message: `ZipCode get successfully.`,
                    city_data: responseCity,
                    province_data: responseProvince,
                    country_data: responseCountry,
                    // data:
                  });
                } else {
                  let data = {};
                  data.country_id = responseProvince[0].country_id;
                  data.province_id = responseProvince[0].id;
                  data.name =
                    resp.data.results[0].address_components[len - 3].long_name;
                  console.log(data);
                  let city_response = await crudService.insert(CityModel, data);
                }
              } else {
              }
            }
          }
        });
      // return res.status(200).json({
      //   code: 200,
      //   success: true,
      //   message: `ZipCode get successfully.`,
      // });

      // console.log(json_data[3])
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  return {
    save,
    destroy,
    get,
    getZipCodeData,
  };
};
module.exports = ZipCodeApi;

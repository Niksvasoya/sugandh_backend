const CountryModel = require("../../../api/models/Master/Country");
const ProvinceModel = require("../../../api/models/Master/Province");
const CityModel = require("../../../api/models/Master/City");
const TimezoneModel = require("../../../api/models/Master/Timezone");
const validationService = require("../../services/validation.service");
const crudService = require("../../services/crud.service");
const { CountrySchemas } = require("../../schemas/MasterSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
// const regexService = require('../services/regex.service');

const CountryApi = () => {
  // for create and update city
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, CountrySchemas)
      .then(async (reqData) => {
        try {
          let response;
          let whereClause = {};
          whereClause.is_deleted = false;
          whereClause.name = { [Op.iLike]: reqData.name };
          if (reqData.id) {
            whereClause.id = { [Op.ne]: reqData.id };
          }
          let resCheck = await crudService.get(CountryModel, {
            where: whereClause,
            attributes: ["id", "name"],
            distinct: true,
          });
          if (resCheck.length > 0) {
            return res.status(201).json({
              code: 204,
              success: false,
              message: "Country already exist.",
            });
          }
          if (reqData.id) {
            response = await crudService.update(
              CountryModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response_country = await crudService.insert(CountryModel, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Country ${reqData.id ? "updated" : "created"
              } successfully`,
            data: response || {},
          });
        } catch (error) {
          return res.status(error.status).json(error.error);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          code: 500,
          success: false,
          message: "Internal Server Error",
          error: err,
        });
      });
  };

  // for deleting the country post
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(CountryModel, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Country deleted successfully.`,
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
      const {
        query: { current_page, page_size },
      } = req;
      let offset;
      if (current_page && page_size) {
        offset = (current_page - 1) * page_size;
      } else {
        offset = undefined;
      }
      response = await crudService.getAll(CountryModel, {
        where: whereClause,
        // attributes: ['id', 'name', 'iso3', 'iso2', 'numeric_code', 'phone_code', 'capital', 'currency', 'currency_name', 'currency_symbol', 'tld', 'native', 'region', 'subregion',
        //     "translations"],
        distinct: true,
        limit: page_size,
        offset: offset,
        order: [["name", "ASC"]],
      });
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Country get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const data = async (req, res) => {
    try {
      const json_data = require("../../../data.json");
      // console.log(json_data)
      for (let data of json_data) {
        data.id = null;
        data.numeric_code = parseInt(data.numeric_code);
        data.phone_code = parseInt(data.phone_code);
        data.latitude = parseFloat(data.latitude);
        data.longitude = parseFloat(data.longitude);
        let response_country = await crudService.insert(CountryModel, data);
        for (let timezone_data of data.timezones) {
          timezone_data.id = null;
          timezone_data.gmtOffset = parseInt(timezone_data.gmtOffset);
          timezone_data.country_id = response_country.id;
          let response_timezone = await crudService.insert(
            TimezoneModel,
            timezone_data
          );
        }
        for (let state_data of data.states) {
          state_data.id = null;
          state_data.latitude = parseFloat(state_data.latitude);
          state_data.longitude = parseFloat(state_data.longitude);
          state_data.country_id = response_country.id;
          let response_state = await crudService.insert(
            ProvinceModel,
            state_data
          );
          for (let city_data of state_data.cities) {
            city_data.id = null;
            city_data.latitude = parseFloat(city_data.latitude);
            city_data.longitude = parseFloat(city_data.longitude);
            city_data.province_id = response_state.id;
            city_data.country_id = response_country.id;
            let response_city = await crudService.insert(CityModel, city_data);
          }
        }
      }
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Country get successfully.`,
        // data: response,
      });
    } catch (err) {
      console.log(err.error);
    }
  };

  return {
    save,
    data,
    destroy,
    get,
  };
};

module.exports = CountryApi;

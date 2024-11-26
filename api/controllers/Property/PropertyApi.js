const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { PropertySchemas } = require("../../schemas/PropertySchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const Property = require("../../models/Property/Property");
const User = require("../../models/User/User");
const EmployeeMapping = require("../../models/Property/EmployeeMapping");
const PropertyApi = () => {
  // For create and update Property
  const save = async (req, res) => {
    // if (req.body.city_id) {
    //     req.body.city_id = parseInt(req.body.city_id)
    // }
    // if (req.body.country_id) {
    //     req.body.country_id = parseInt(req.body.country_id)
    // }
    // if (req.body.province_id) {
    //     req.body.province_id = parseInt(req.body.province_id)
    // }
    // if (req.body.primary_contact_number) {
    //     req.body.primary_contact_number = parseInt(req.body.primary_contact_number)
    // }
    // if (req.body.alternate_contact_number) {
    //     if (req.body.alternate_contact_number == 'null' || req.body.alternate_contact_number == "undefined") {
    //         req.body.alternate_contact_number = null
    //     }
    //     else {
    //         req.body.alternate_contact_number = parseInt(req.body.alternate_contact_number)
    //     }
    // }
    // if (req.body.alternate_contact_id) {
    //     if (req.body.alternate_contact_id == 'null' || req.body.alternate_contact_id == "undefined") {
    //         req.body.alternate_contact_id = null
    //     }
    //     else {
    //         req.body.alternate_contact_id = parseInt(req.body.alternate_contact_id)
    //     }
    // }
    // if (req.body.primary_contact_id) {
    //     req.body.primary_contact_id = parseInt(req.body.primary_contact_id)
    // }
    // if (req.body.is_primary_number_whatsapp) {
    //     req.body.is_primary_number_whatsapp = JSON.parse(req.body.is_primary_number_whatsapp)
    // }
    // if (req.body.is_alternate_number_whatsapp) {
    //     req.body.is_alternate_number_whatsapp = JSON.parse(req.body.is_alternate_number_whatsapp)
    // }
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, PropertySchemas)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            response = await crudService.update(
              Property,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(Property, reqData);
            reqData.property_id = response.id;
            let responseEmployeeMapping = await crudService.insert(
              EmployeeMapping,
              reqData
            );
            console.log(responseEmployeeMapping);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Property ${
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
        console.log(err);
        return res.status(500).json({
          code: 500,
          success: false,
          message: "Internal Server Error",
          error: err,
        });
      });
  };
  // for deleting Property
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(Property, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Property deleted successfully.`,
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
      if (req.query.property_category_id) {
        whereClause.property_category_id = {
          [Op.eq]: req.query.property_category_id,
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
      response = await crudService.getAll(Property, {
        where: whereClause,
        // attributes: ['id', 'name', 'property_category_id', 'contact_person_name', 'primary_contact_number', 'primary_contact_id', 'alternate_contact_id', 'alternate_contact_number', 'is_primary_number_whatsapp', 'is_alternate_number_whatsapp', 'email_id', 'address_line_1', 'address_line_2', 'zipcode_id', 'country_id', 'province_id', 'city_id'],
        attributes: {
          exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: EmployeeMapping,
            where: { is_deleted: false },
            required: false,
            attributes: {
              exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: User,
                where: { is_deleted: false },
                attributes: {
                  exclude: [
                    "is_deleted",
                    "deleted_at",
                    "createdAt",
                    "updatedAt",
                  ],
                },
                required: false,
              },
            ],
          },
        ],
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
        message: `Property get successfully.`,
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
module.exports = PropertyApi;

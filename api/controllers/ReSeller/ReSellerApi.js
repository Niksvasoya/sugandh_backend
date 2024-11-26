const crudService = require("../../services/crud.service");
const validationService = require("../../services/validation.service");
const { ReSellerSchemas } = require("../../schemas/ReSellerSchemas");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const ReSeller = require("../../models/ReSeller/ReSeller");
const ReSellerApi = () => {
  // For create and update Re Seller
  const save = async (req, res) => {
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, ReSellerSchemas)
      .then(async (reqData) => {
        try {
          let response;
          if (reqData.id) {
            response = await crudService.update(
              ReSeller,
              { id: reqData.id },
              reqData
            );
            response = reqData;
          } else {
            response = await crudService.insert(ReSeller, reqData);
          }
          return res.status(201).json({
            code: 200,
            success: true,
            message: `Re Seller ${
              reqData.id ? "updated" : "created"
            } successfully`,
            data: response || {},
          });
        } catch (error) {
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
  // for deleting Re Seller
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(ReSeller, { id: id });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Re Seller deleted successfully.`,
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
      response = await crudService.getAll(ReSeller, {
        where: whereClause,
        attributes: [
          "id",
          "name",
          "gst_number",
          "pan_number",
          "contact_person_name",
          "primary_contact_number",
          "alternate_contact_number",
          "primary_contact_id",
          "alternate_contact_id",
          "is_primary_number_whatsapp",
          "is_alternate_number_whatsapp",
          "email_id",
          "address_line_1",
          "address_line_2",
          "zipcode_id",
          "country_id",
          "province_id",
          "city_id",
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
        message: `Re Seller get successfully.`,
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
module.exports = ReSellerApi;

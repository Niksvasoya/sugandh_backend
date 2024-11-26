const crudService = require("../../services/crud.service");
const { Op } = require("sequelize");
require("dotenv").config();
const UserWallet = require("../../models/User/Wallet");
const UserStripeDetails = require("../../models/User/StripeDetails");
const UserWalletApi = () => {
  const updateWallet = async (req, res) => {
    try {
      console.log(req.body);
      let response = await crudService.update(
        UserWallet,
        { user_id: req.body.user_id },
        req.body
      );
      return res.status(200).json({
        code: 2000,
        success: true,
        message: `Wallet updated successfully.`,
        data: req.body || {},
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };
  const saveStripeData = async (req, res) => {
    try {
      let response = await crudService.insert(UserStripeDetails, req.body);
      return res.status(200).json({
        code: 2000,
        success: true,
        message: `Data created successfully.`,
        data: response || {},
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const getWallet = async (req, res) => {
    try {
      let response;
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      if (req.query.user_id) {
        whereClause.user_id = { [Op.eq]: req.query.user_id };
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
      // console.log("test")
      response = await crudService.getAll(UserWallet, {
        where: whereClause,
        distinct: true,
        limit: page_size,
        offset: offset,
      });
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;

      return res.status(200).json({
        code: 200,
        success: true,
        message: `User Wallet get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };
  const getStripeData = async (req, res) => {
    try {
      let response;
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      if (req.query.user_id) {
        whereClause.user_id = { [Op.eq]: req.query.user_id };
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
      // console.log("test")
      response = await crudService.getAll(UserStripeDetails, {
        where: whereClause,
        distinct: true,
        limit: page_size,
        offset: offset,
      });
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;

      return res.status(200).json({
        code: 200,
        success: true,
        message: `User Wallet get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  return {
    updateWallet,
    getWallet,
    saveStripeData,
    getStripeData,
  };
};
module.exports = UserWalletApi;

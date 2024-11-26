let mongoose = require("mongoose");
const WishListModel = require("../../models/MongoDb/Wishlist/Wishlist");
const { WishListSchemas } = require("../../schemas/ProductSchemas");
const validationService = require("../../services/validation.service");
const { ObjectId } = require("mongodb");
const WishListApi = () => {
  // For create and update Category
  const save = async (req, res) => {
    validationService
      .validate(req.body, WishListSchemas)
      .then(async (reqData) => {
        try {
          console.log("check");
          let response;
          if (reqData.id) {
            if (reqData.deleted_items) {
              for (let id of reqData.deleted_items) {
                await WishListModel.findOneAndUpdate(
                  { _id: ObjectId(reqData.id) },
                  { $pull: { items: id } }
                );
              }
            }
            for (let data of reqData.items) {
              if (data._id) {
                // console.log(data)
                let id = data._id;
                delete data._id;
                await WishListModel.findOneAndUpdate(
                  { "items._id": ObjectId(id) },
                  { $set: { "items.$": data } }
                );
              } else {
                await WishListModel.findOneAndUpdate(
                  { _id: ObjectId(reqData.id) },
                  { $push: { items: data } }
                );
              }
            }
            return res.status(201).json({
              code: 200,
              success: true,
              message: `WishList ${
                reqData.id ? "updated" : "created"
              } successfully`,
              data: response || {},
            });
            // }
            // response = reqData;
          } else {
            console.log("hello");
            let data = req.body;
            console.log("hello1");

            response = await WishListModel.create(data, (err) => {
              if (err) {
                return res.status(err.status).json(err);
              }
              return res.status(201).json({
                code: 200,
                success: true,
                message: `WishList ${
                  reqData.id ? "updated" : "created"
                } successfully`,
                data: response || {},
              });
            });
          }
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

  const get = async (req, res) => {
    try {
      let response = await WishListModel.findOne({
        user_id: req.query.user_id,
      });
      console.log(response);
      return res.status(200).json({
        code: 200,
        success: true,
        message: `WishList get successfully.`,
        data: response,
      });
    } catch (error) {
      console.log(error);
      const statusCode = error.status || 500;
      return res.status(statusCode).json(error.error);
    }
  };

  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        await WishListModel.deleteOne({ _id: ObjectId(req.body.record_id) });
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Wishlist deleted successfully.`,
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
    get,
    destroy,
  };
};
module.exports = WishListApi;

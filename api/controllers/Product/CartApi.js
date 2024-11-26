let mongoose = require("mongoose");
const CartModel = require("../../models/MongoDb/Cart/Cart");
const { CartSchemas } = require("../../schemas/ProductSchemas");
const validationService = require("../../services/validation.service");
const UserModel = require("../../models/User/User");
const crudService = require("../../services/crud.service");
const { ObjectId } = require("mongodb");
const CartApi = () => {
  // For create and update Category
  const save = async (req, res) => {

    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      req.body.items = req.body.items.map(item => ({
        ...item,
        main_mrp: item.main_mrp ?? item.mrp
      }));
      // req.body.items[0].main_mrp = req.body.items[0]?.main_mrp ?? req.body.items[0]?.mrp;
    } else if (typeof req.body.items === 'object' && req.body.items !== null) {
      req.body.items.main_mrp = req.body.items?.main_mrp ?? req.body.items?.mrp;
    }
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, CartSchemas)
      .then(async (reqData) => {
        try {
          let response;
          let usedPoint = 0
          if (reqData.id) {
            // console.log(reqData)
            // const objectId = ObjectId(reqData.id)
            // console.log(objectId)
            if (reqData.deleted_items) {
              for (let id of reqData.deleted_items) {
                await CartModel.findOneAndUpdate(
                  { _id: ObjectId(reqData.id) },
                  { $pull: { items: id } }
                );
              }
            }
            if (reqData.invoice_id) {
              await CartModel.findOneAndUpdate(
                { _id: ObjectId(reqData.id) },
                { $set: { invoice_id: reqData.invoice_id } }
              );
            }
            for (let data of reqData.items) {
              if (data._id) {
                // console.log(data)
                let id = data._id;
                delete data._id;
                await CartModel.findOneAndUpdate(
                  { "items._id": ObjectId(id) },
                  { $set: { "items.$": data } }
                );
              } else {
                await CartModel.findOneAndUpdate(
                  { _id: ObjectId(reqData.id) },
                  { $push: { items: data } }
                );
              }

              if (data?.used_points) {
                usedPoint += data?.used_points
              }
            }

            if (usedPoint > 0) {
              console.log("reqData?.user_id", reqData?.user_id);
              const userData = await crudService.getOne(UserModel, { where: { id: reqData?.user_id } })
              console.log("userData >>", userData?.credit_point, usedPoint);
              const point = userData?.credit_point - usedPoint
              console.log("point >>", point);

              await crudService.update(UserModel, { id: reqData?.user_id }, { credit_point: point })
            }

            // ,(err) => {
            //     if (err) {
            //         console.log(err)
            //         return res.status(err.status).json(err);
            //     }
            // console.log("check")
            const data = await CartModel.findOne({ _id: ObjectId(reqData.id) })

            return res.status(201).json({
              code: 200,
              success: true,
              message: `Cart ${data.id ? "updated" : "created"
                } successfully`,
              data: data || {},
            });
            // }
            // response = reqData;
          } else {
            // console.log("hello")
            let data = req.body;
            // console.log("hello1")
            // console.log(data);

            response = await CartModel.create(data)
            if (response) {
              return res.status(201).json({
                code: 200,
                success: true,
                message: `Cart ${response.id ? "updated" : "created"
                  } successfully`,
                data: response || {},
              });
            }
          }
        } catch (error) {
          console.log(error);
          const status = error.status || 403
          return res.status(status).json(error);
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
        await CartModel.deleteOne({ _id: ObjectId(req.body.record_id) });
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Cart deleted successfully.`,
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
      console.log("user_id >>> ", req?.query?.user_id);
      let response = await CartModel.findOne({
        user_id: req?.query?.user_id,
      });
      console.log("response >>>");
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Cart get successfully.`,
        data: response,
      });
    } catch (error) {
      console.log(error);
      const status = error.status || 500
      return res.status(status).json(error.error);
    }
  };

  return {
    save,
    destroy,
    get,
  };
};
module.exports = CartApi;

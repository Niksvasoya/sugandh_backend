const crudService = require("../../services/crud.service");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const fireBase = require("../../helper/firebaseHelper");
const ImageApi = () => {
  // For create Image
  const save = async (req, res) => {
    try {
      let image = [];
      if (req.files != null) {
        if (req.files.image_file != undefined) {
          for (i = 0; i < req.files.image_file.length; i++) {
            console.log(image);
            var url = await fireBase.uploadImageToStorage(
              req.files.image_file[i]
            );
            image.push(url);
          }
          if (
            req.files.image_file.length == undefined &&
            req.files.image_file != undefined
          ) {
            var url = await fireBase.uploadImageToStorage(req.files.image_file);
            console.log(image.length);
            image.push(url);
          }
        }
      }
      return res.status(201).json({
        code: 204,
        success: true,
        data: image,
        message: "Image store successfully.",
      });
    } catch (error) {
      return res.status(error.status).json(error);
    }
  };
  // for deleting Image
  const destroy = async (req, res) => {
    try {
      for (let i of req.body.image) {
        console.log(i);
        await fireBase.DeleteImage(i);
      }
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Image deleted successfully.`,
        data: {},
      });
    } catch (error) {
      return res.status(error.status).json(error);
    }
  };

  return {
    save,
    destroy,
  };
};
module.exports = ImageApi;

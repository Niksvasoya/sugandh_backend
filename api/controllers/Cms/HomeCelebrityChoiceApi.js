const crudService = require("../../services/crud.service");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const fireBase = require("../../helper/firebaseHelper");
const validationService = require("../../services/validation.service");
const HomeCelebrityChoice = require("../../models/Cms/HomeCelebrityChoice");
const { HomeSectionFiveSliderSchemas, HomeCelebrityChoiceSchemas } = require("../../schemas/CmsSchemas");

const HomeSectionFiveApi = () => {
    const get = async (req, res) => {
        try {
            let response;
            let whereClause = {};
            whereClause.is_deleted = false;

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
            response = await crudService.getAll(HomeCelebrityChoice, {
                where: whereClause,
                // attributes: ["id", "image"],
                attributes: {
                    exclude: ["createdAt", "is_deleted", "deleted_at", "updatedAt"],
                },
                distinct: true,
                limit: page_size,
                offset: offset,
                order: [['id', "ASC"]],
            });
            let page_info = {};
            page_info.total_items = response.count;
            page_info.current_page = parseInt(current_page);
            page_info.total_pages = Math.ceil(response.count / page_size);
            page_info.page_size = response.rows.length;
            return res.status(200).json({
                code: 200,
                success: true,
                message: `Home Celebrity Choice get successfully.`,
                data: response.rows,
                page_info: page_info,
            });
        } catch (error) {
            console.log(error);
            return res.status(error.status).json(error.error);
        }
    };

    // For create and update Home Celebrity Choice
    const save = async (req, res) => {
        // For Single image Upload
        if (req.files != null) {
            if (req.files.image != undefined) {
                var url = await fireBase.uploadImageToStorage(req.files.image);
                req.body.image = url;
            }
        }

        await validationService.convertIntObj(req.body);
        validationService
            .validate(req.body, HomeCelebrityChoiceSchemas)
            .then(async (reqData) => {
                try {
                    let response;
                    if (reqData.id) {
                        response = await crudService.update(
                            HomeCelebrityChoice,
                            { id: reqData.id },
                            reqData
                        );
                        response = reqData;
                    } else {
                        response = await crudService.insert(HomeCelebrityChoice, reqData);
                    }

                    return res.status(201).json({
                        code: 200,
                        success: true,
                        message: `Home Celebrity Choice ${reqData.id ? "updated" : "created"
                            } successfully`,
                        data: response || {},
                    });
                } catch (error) {
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

    // for deleting Home Celebrity Choice
    const destroy = async (req, res) => {
        try {
            if (req.body.record_id) {
                for (let id of req.body.record_id) {
                    let response = await crudService.destroy(HomeCelebrityChoice, {
                        id: id,
                    });
                }
                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: `Home Celebrity Choice deleted successfully.`,
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
        get,
    };
};
module.exports = HomeSectionFiveApi;
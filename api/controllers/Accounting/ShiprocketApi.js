const AccountTypeModel = require('../../models/Accounting/AccountType');
const crudService = require('../../services/crud.service');
const validationService = require('../../services/validation.service');
const { AccountTypeSchemas } = require('../../schemas/AccountingSchemas');
const Sequelize = require('sequelize');
const axios = require('axios');
const { Op } = require("sequelize");
const ShiprocketApi = () => {

    // For create and update Account Type
    const save = async (req, res) => {
        await validationService.convertIntObj(req.body)

        // validationService.validate(req.body, AccountTypeSchemas).then(async (reqData) => {
        try {
            let response;
            const apiUrlAuth = 'https://apiv2.shiprocket.in/v1/external/auth/login';
            const requestBody = {
                "email": "malhar@bintech.services",
                "password": "User$hared2022"
            };

            axios.post(apiUrlAuth, requestBody)
                .then(response => {
                    console.log('Authentication successful');
                    console.log('Response:', response.data);
                    // Store the authentication token for subsequent API calls
                    const authToken = response.data.token;
                    // Use the authToken for further API requests
                    // Example: axios.get('API_ENDPOINT', { headers: { 'Authorization': `Bearer ${authToken}` } });
                    const headers = {
                        'Authorization': `Bearer ${authToken}`
                    };
                    let apiUrl = 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc'
                    axios.post(apiUrl, req.body, { headers })
                        .then(response => {
                            return res.status(201).json({
                                code: 200,
                                success: true,
                                message: `Order Created in shiprocket successfully`,
                                data: response.data || {}
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            return res.status(500).json({
                                code: 500,
                                success: false,
                                message: 'Internal Server Error',
                                error: error,
                            });
                        });
                })
                .catch(error => {
                    console.error('Authentication error:', error.response.data);
                    return res.status(500).json({
                        code: 500,
                        success: false,
                        message: 'Authentication error',
                        error: error.response.data,
                    });
                });

        } catch (error) {
            return res.status(error.status).json(error.error);
        }
        // }).catch(err => {
        //     return res.status(500).json({
        //         code: 500,
        //         success: false,
        //         message: 'Internal Server Error',
        //         error: err,
        //     });
        // });
    };
    const cancel = async (req, res) => {
        console.log("Nikul cancel >> ");
        await validationService.convertIntObj(req.body)

        // validationService.validate(req.body, AccountTypeSchemas).then(async (reqData) => {
        try {
            let response;
            const apiUrlAuth = 'https://apiv2.shiprocket.in/v1/external/orders/cancel';
            const requestBody = {
                "email": "malhar@bintech.services",
                "password": "User$hared2022"
            };

            axios.post(apiUrlAuth, requestBody)
                .then(response => {
                    console.log('Authentication successful');
                    console.log('Response:', response.data);
                    // Store the authentication token for subsequent API calls
                    const authToken = response.data.token;
                    // Use the authToken for further API requests
                    // Example: axios.get('API_ENDPOINT', { headers: { 'Authorization': `Bearer ${authToken}` } });
                    const headers = {
                        'Authorization': `Bearer ${authToken}`
                    };
                    let apiUrl = 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc'
                    axios.post(apiUrl, req.body, { headers })
                        .then(response => {
                            return res.status(201).json({
                                code: 200,
                                success: true,
                                message: `Order cancel in shiprocket successfully`,
                                data: response.data || {}
                            });
                        })
                        .catch(error => {
                            return res.status(500).json({
                                code: 500,
                                success: false,
                                message: 'Internal Server Error',
                                error: error,
                            });
                        });
                })
                .catch(error => {
                    console.error('Authentication error:', error.response.data);
                    return res.status(500).json({
                        code: 500,
                        success: false,
                        message: 'Authentication error',
                        error: error.response.data,
                    });
                });

        } catch (error) {
            return res.status(error.status).json(error.error);
        }
        // }).catch(err => {
        //     return res.status(500).json({
        //         code: 500,
        //         success: false,
        //         message: 'Internal Server Error',
        //         error: err,
        //     });
        // });
    };
    // for deleting Account Type
    const destroy = async (req, res) => {
        try {
            if (req.body.record_id) {
                for (let id of req.body.record_id) {
                    let response = await crudService.destroy(AccountTypeModel, { id: id });
                }
                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: `Account Type deleted successfully.`,
                    data: {}
                });
            } else {
                return res.status(207).json({
                    code: 207,
                    success: false,
                    message: `Invalid Url Parameters`,
                    data: {}
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
                whereClause.name = { [Sequelize.Op.iLike]: req.query.keyword + "%" }
            }
            if (req.query.id) {
                whereClause.id = { [Op.eq]: req.query.id }
            }

            // for pagination in Account Type
            const { query: { current_page, page_size } } = req;
            let offset;
            if (current_page && page_size) {
                offset = ((current_page - 1) * page_size)
            }
            else {
                offset = undefined
            }
            response = await crudService.getAll(AccountTypeModel, {
                where: whereClause,
                attributes: ['id', 'name', 'description'],
                distinct: true,
                limit: page_size,
                offset: offset,
                order: [
                    ['name', 'ASC'],
                ],
            });
            let page_info = {}
            page_info.total_items = response.count
            page_info.current_page = parseInt(current_page)
            page_info.total_pages = Math.ceil(response.count / page_size);
            page_info.page_size = response.rows.length
            return res.status(200).json({
                code: 200,
                success: true,
                message: `Account Type get successfully.`,
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
        cancel
    };
};
module.exports = ShiprocketApi;
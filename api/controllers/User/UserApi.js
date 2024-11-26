const UserModel = require("../../models/User/User");
const UserDeviceDetailsModel = require("../../models/User/UserDeviceDetails");
const UserLocationDetailsModel = require("../../models/User/UserLocationDetails");
const crudService = require("../../services/crud.service");
const { UserSchemas } = require("../../schemas/UserSchemas");
const Sequelize = require("sequelize");
const validationService = require("../../services/validation.service");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const fireBase = require("../../helper/firebaseHelper");
require("dotenv").config();

const twilioconfig = require("../../../config/twilio");

const UserWallet = require("../../models/User/Wallet");
const Property = require("../../models/Property/Property");
const EmployeeMapping = require("../../models/Property/EmployeeMapping");
const User = require("../../models/User/User");
const Country = require("../../models/Master/Country");
const Province = require("../../models/Master/Province");
const City = require("../../models/Master/City");
const client = require("twilio")(
  twilioconfig.accountSID,
  twilioconfig.authToken
);

const crypto = require("crypto");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
const { emailSend } = require("../../helper/mail");
sgMail.setApiKey('SG.wRvReO_3Ro6pUSALrue-YQ._i3Qp--HiSKG5YJM9o4MHyA9EsTrD6svC>');

const UserApi = () => {
  const signup = async (req, res) => {
    if (req.files != null) {
      if (req.files.user_profile_image != undefined) {
        var url = await fireBase.uploadImageToStorage(
          req.files.user_profile_image
        );
        req.body.user_profile_image = url;
      }
    }
    req.body.is_trial = true;
    console.log(req.body);
    await validationService.convertIntObj(req.body);
    validationService
      .validate(req.body, UserSchemas)
      .then(async (reqData) => {
        try {
          // console.log(reqData, "kkk")
          // if (req.body.alternate_contact_number) {
          //     if (reqData.alternate_contact_number == 'null') {
          //         reqData.alternate_contact_number = null
          //     } else {
          //         reqData.alternate_contact_number = parseInt(reqData.alternate_contact_number)
          //     }
          // }
          let response;
          if (reqData.id) {
            if (reqData.deleted_location) {
              for (let id of reqData.deleted_location) {
                await crudService.destroy(UserLocationDetailsModel, { id: id });
              }
            }
            // if (reqData.deleted_location) {
            //     for (let id of reqData.deleted_location) {
            //         await crudService.destroy(UserLocationDetailsModel, { id: id });
            //     }
            // }

            if (reqData.is_location_detail && reqData.location_details) {
              for (let detail of reqData.location_details) {
                if (detail.id) {
                  detail.user_id = reqData.id;
                  let resLocationDetail = await crudService.update(
                    UserLocationDetailsModel,
                    { id: detail.id },
                    detail
                  );
                } else {
                  detail.user_id = reqData.id;
                  let resLocationDetail = await crudService.insert(
                    UserLocationDetailsModel,
                    detail
                  );
                }
              }
            }
            if (reqData.is_device_detail && reqData.device_details) {
              for (let detail of reqData.device_details) {
                if (detail.id) {
                  detail.user_id = reqData.id;
                  let resDeviceDetail = await crudService.update(
                    UserDeviceDetailsModel,
                    { id: detail.id },
                    detail
                  );
                } else {
                  detail.user_id = reqData.id;
                  let resLocationDetail = await crudService.insert(
                    UserDeviceDetailsModel,
                    detail
                  );
                }
              }
            }
            response = await crudService.update(
              UserModel,
              { id: reqData.id },
              reqData
            );
            response = reqData;
            jwt.sign(
              { id: response.id },
              "livebhagwan.com",
              async (err, Authorization) => {
                console.log(Authorization, "too");
                let data = [];
                let token_data = {};
                token_data.token = Authorization;
                console.log(data);
                data.push(token_data);

                await crudService.update(
                  UserModel,
                  { id: reqData.id },
                  { jwt_token: data }
                );
                return res
                  .cookie("Authorization", Authorization, {
                    maxAge: 90000,
                    httpOnly: false,
                  })
                  .json({
                    code: 200,
                    success: true,
                    message: `User update successfully`,
                    Authorization: Authorization,
                    data: response,
                  });
              }
            );
          } else {
            response = await crudService.insert(UserModel, reqData);
            let wallet_data = {};
            wallet_data.user_id = response.id;
            wallet_data.amount = 0;
            await crudService.insert(UserWallet, wallet_data);
            if (reqData.is_location_detail && reqData.location_details) {
              response.location_details = [];
              // console.log(reqData.location_details);
              for (let i = 0; i < reqData.location_details.length; ++i) {
                console.log(reqData.location_details[i]);
                reqData.location_details[i].user_id = response.id;
                let resLocationDetail = await crudService.insert(
                  UserLocationDetailsModel,
                  reqData.location_details[i]
                );
                response.location_details.push(resLocationDetail);
              }
              // for (let detail of reqData.location_details) {
              //   console.log(detail);
              // detail.user_id = response.id;
              // let resLocationDetail = await crudService.insert(
              //   UserLocationDetailsModel,
              //   detail
              // );
              // response.location_details.push(resLocationDetail);
              // }
            }
            if (reqData.is_device_detail && reqData.device_details) {
              response.device_details = [];
              // for (let detail of reqData.device_details) {
              //   detail.user_id = response.id;
              //   let resLocationDetail = await crudService.insert(
              //     UserDeviceDetailsModel,
              //     detail
              //   );
              //   response.device_details.push(resLocationDetail);
              // }
              for (let i = 0; i < reqData.device_details.length; ++i) {
                console.log(reqData.locatiodevice_detailsn_details[i]);
                reqData.device_details[i].user_id = response.id;
                let resLocationDetail = await crudService.insert(
                  UserDeviceDetailsModel,
                  reqData.device_details[i]
                );
                response.device_details.push(resLocationDetail);
              }
            }

            // send email regarding : welcome to sugandh

            let on_signup_email = {
              from: process.env.SENDGRID_SENDER_EMAIL,
              to: reqData.email_id,
              subject: `Welcome to the world of Sugandh ${reqData.first_name}!!`,
              text: `You Registered your self with Sugandh ${reqData.first_name} ${reqData.last_name}. Here are your details, Email Address: ${reqData.email_id}, Primary Contact Number: ${reqData.primary_contact_number}.`,
            };

            // const email_response = await sgMail.send(on_signup_email);
            // console.log(180, email_response);

            jwt.sign(
              { id: response.id },
              "livebhagwan.com",
              async (err, Authorization) => {
                let data = [];
                let token_data = {};
                token_data.token = Authorization;
                data.push(token_data);
                await crudService.update(
                  UserModel,
                  { id: response.id },
                  { jwt_token: data }
                );
                return res
                  .cookie("Authorization", Authorization, {
                    maxAge: 90000,
                    httpOnly: false,
                  })
                  .json({
                    code: 200,
                    success: true,
                    message: `Account created successfully`,
                    Authorization: Authorization,
                    data: response,
                  });
              }
            );
          }
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
  // for deleting User
  const destroy = async (req, res) => {
    try {
      if (req.body.record_id) {
        for (let id of req.body.record_id) {
          let response = await crudService.destroy(UserModel, { id: id });
          let response1 = await crudService.destroy(UserDeviceDetailsModel, {
            user_id: id,
          });
          let response2 = await crudService.destroy(UserDeviceDetailsModel, {
            user_id: id,
          });
        }
        return res.status(200).json({
          code: 200,
          success: true,
          message: `User deleted successfully.`,
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
        const keywordAsInt = parseInt(req.query.keyword);
        if (!isNaN(keywordAsInt)) {
          whereClause[Sequelize.Op.or] = [(
            Sequelize.where(Sequelize.col('User.primary_contact_number'), '=', keywordAsInt)
          )];
        }
        else {
          whereClause[Op.or] = [
            { first_name: { [Op.iLike]: req.query.keyword + "%" } },
            { last_name: { [Op.iLike]: req.query.keyword + "%" } },
            { company_name: { [Op.iLike]: req.query.keyword + "%" } },
            // { primary_contact_number: req.query.keyword },
          ];
        }
      }
      if (req.query.first_name) {
        whereClause.first_name = {
          [Sequelize.Op.iLike]: req.query.first_name + "%",
        };
      }
      if (req.query.company_name) {
        whereClause.company_name = {
          [Sequelize.Op.iLike]: req.query.company_name + "%",
        };
      }
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      if (req.query.is_customer) {
        whereClause.is_customer = { [Op.eq]: req.query.is_customer };
      }
      if (req.query.user_role_id) {
        whereClause.user_role_id = { [Op.eq]: req.query.user_role_id };
      }
      if (req.query.primary_contact_number) {
        whereClause.primary_contact_number = {
          [Op.eq]: req.query.primary_contact_number,
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
      // console.log("test")
      response = await crudService.getAll(UserModel, {
        where: whereClause,
        // attributes: ['id', 'user_role_id', 'user_profile_image', 'first_name', 'last_name', 'gender', 'dob', 'birth_time', 'primary_contact_number', 'alternate_contact_number', 'is_primary_number_whatsapp', 'email_id', 'address_line_1', 'address_line_2', 'zipcode_id', 'city_id', 'province_id', 'country_id', 'instagram_id', 'facebook_id', 'twitter_id', 'password', 'account_status', 'jwt_token', 'is_trial'],
        distinct: true,
        limit: page_size,
        offset: offset,
        include: [
          {
            model: UserWallet,
            //as: 'god',
            //attributes: ['id', 'name'],
            where: { is_deleted: false },
            required: false,
          },
          {
            model: Country,
            attributes: ["id", "name"],
            where: { is_deleted: false },
            required: false,
          },
          {
            model: Province,
            attributes: ["id", "name"],
            where: { is_deleted: false },
            required: false,
          },
          {
            model: City,
            attributes: ["id", "name"],
            where: { is_deleted: false },
            required: false,
          },
          {
            model: UserWallet,
            //as: 'god',
            //attributes: ['id', 'name'],
            where: { is_deleted: false },
            required: false,
          },
          {
            model: UserLocationDetailsModel,
            //as: 'god',
            //attributes: ['id', 'name'],
            where: { is_deleted: false },
            required: false,
          },
          {
            model: EmployeeMapping,
            //as: 'god',
            //attributes: ['id', 'name'],
            where: { is_deleted: false },
            required: false,
            // include: [{
            //     model: Property,
            //     //as: 'god',
            //     //attributes: ['id', 'name'],
            //     where: { is_deleted: false },
            //     required: false,
            // }
            // ]
          },
        ],
      });
      let page_info = {};
      page_info.total_items = response.count;
      page_info.current_page = parseInt(current_page);
      page_info.total_pages = Math.ceil(response.count / page_size);
      page_info.page_size = response.rows.length;
      let responseUserLocationDetails = await crudService.get(
        UserLocationDetailsModel,
        {
          where: { is_deleted: false },
          distinct: true,
        }
      );
      let responseUserDeviceDetails = await crudService.get(
        UserDeviceDetailsModel,
        {
          where: { is_deleted: false },
          distinct: true,
        }
      );

      // for (let user of response) {
      //     user.location_details = responseUserLocationDetails.filter(t => parseInt(t.user_id) === parseInt(user.id));
      //     user.device_details = responseUserDeviceDetails.filter(t => parseInt(t.user_id) === parseInt(user.id));
      //     // console.log(locationObj)
      // }

      return res.status(200).json({
        code: 200,
        success: true,
        message: `User get successfully.`,
        data: response.rows,
        page_info: page_info,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const getNotAssignUser = async (req, res) => {
    try {
      let response;
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.query.keyword) {
        whereClause.first_name = {
          [Sequelize.Op.iLike]: req.query.keyword + "%",
        };
      }
      if (req.query.id) {
        whereClause.id = { [Op.eq]: req.query.id };
      }
      if (req.query.user_role_id) {
        whereClause.user_role_id = { [Op.eq]: req.query.user_role_id };
      }
      response = await crudService.getAll(UserModel, {
        where: whereClause,
        attributes: ["id"],
        distinct: true,
        include: [
          {
            model: EmployeeMapping,
            attributes: ["id"],
            where: { is_deleted: false },
            required: true,
            include: [
              {
                model: User,
                attributes: ["id"],
                where: { is_deleted: false },
                required: true,
              },
            ],
          },
        ],
      });
      let responseAll = await crudService.getAll(UserModel, {
        where: whereClause,
        attributes: {
          exclude: ["is_deleted", "deleted_at", "createdAt", "updatedAt"],
        },
        distinct: true,
        include: [
          {
            model: EmployeeMapping,
            attributes: ["id"],
            where: { is_deleted: false },
            required: false,
            include: [
              {
                model: User,
                attributes: ["id"],
                where: { is_deleted: false },
                required: false,
              },
            ],
          },
        ],
      });
      let finalData = responseAll.rows.filter(
        (obj2) => !response.rows.some((obj1) => obj1.id === obj2.id)
      );
      return res.status(200).json({
        code: 200,
        success: true,
        message: `User get successfully.`,
        data: finalData,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const login = async (req, res) => {
    try {
      console.log(req, "req");
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.body.email_id) {
        whereClause.email_id = req.body.email_id;
      }
      if (req.body.primary_contact_number) {
        whereClause.primary_contact_number = req.body.primary_contact_number;
      }
      whereClause.password = req.body.password;

      if (req.body.password) {
        console.log(req.body.password);
      }
      let response = await crudService.get(UserModel, {
        where: whereClause,
        attributes: [
          "id",
          "user_role_id",
          "user_profile_image",
          "first_name",
          "last_name",
          "gender",
          "dob",
          "birth_time",
          "primary_contact_number",
          "primary_contact_id",
          "alternate_contact_number",
          "alternate_contact_id",
          "is_primary_number_whatsapp",
          "is_alternate_number_whatsapp",
          "email_id",
          "address_line_1",
          "address_line_2",
          "zipcode_id",
          "city_id",
          "province_id",
          "country_id",
          "instagram_id",
          "facebook_id",
          "twitter_id",
          "password",
          "account_status",
          "jwt_token",
          "is_trial",
          "is_customer",
          "company_name",
          "gst_number",
        ],
        distinct: true,
        include: [
          {
            model: EmployeeMapping,
            //as: 'god',
            //attributes: ['id', 'name'],
            where: { is_deleted: false },
            required: false,
          },
        ],
      });
      console.log(response.length > 0);
      if (response.length == 0) {
        return res.status(200).json({
          code: 2000,
          success: false,
          message: `Invalid email id or password`,
          // data: response || []
        });
      } else {
        jwt.sign(
          { id: response[0].id },
          "livebhagwan.com",
          async (err, Authorization) => {
            console.log(Authorization);
            let data = [];
            let token_data = {};
            token_data.token = Authorization;
            data.push(token_data);
            await crudService.update(
              UserModel,
              { id: response[0].id },
              { jwt_token: data }
            );
            // if (req.cookies.token === undefined) {
            //     console.log("test")
            return res
              .cookie("Authorization", Authorization, {
                maxAge: 900000,
                httpOnly: true,
              })
              .json({
                code: 2000,
                success: true,
                message: `Logged in successfully`,
                Authorization: Authorization,
                data: response[0],
              });
          }
        );
      }
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error);
    }
  };
  const loginIsAvailable = async (req, res) => {
    try {
      let whereClause = {};
      whereClause.is_deleted = false;
      if (req.body.email_id) {
        whereClause.email_id = req.body.email_id;
      }
      if (req.body.primary_contact_number) {
        whereClause.primary_contact_number = req.body.primary_contact_number;
      }
      console.log(whereClause);
      let response = await crudService.get(UserModel, {
        where: whereClause,
        // attributes: ['id', 'user_role_id', 'user_profile_image', 'first_name', 'last_name', 'gender', 'dob', 'birth_time', 'primary_contact_number', 'primary_contact_id', 'alternate_contact_number', 'alternate_contact_id', 'is_primary_number_whatsapp', 'is_alternate_number_whatsapp', 'email_id', 'address_line_1', 'address_line_2', 'zipcode_id', 'city_id', 'province_id', 'country_id', 'instagram_id', 'facebook_id', 'twitter_id', 'password', 'account_status', 'is_trial', , 'is_customer', 'company_name', 'gst_number'],
        distinct: true,
      });
      console;
      console.log(response.length > 0);
      if (response.length <= 0) {
        return res.status(200).json({
          code: 2000,
          success: false,
          message: `Invalid email id or phone number`,
          // data: response || []
        });
      } else {
        return res.status(200).json({
          code: 2000,
          success: true,
          message: `User Can Login`,
          data: response || [],
        });
      }
    } catch (error) {
      return res.status(error.status).json(error.error);
    }
  };

  const sendSmsOtp = async (req, res) => {
    try {
      console.log("test", req.query.contact_num, req.query.channel);

      if (req.query.contact_num) {
        console.log("check");
        client.verify
          .services(twilioconfig.serviceID)
          .verifications.create({
            to: `+${req.query.contact_num}`,
            channel: req.query.channel === "call" ? "call" : "sms",
          })
          .then((data) => {
            console.log(data);
            return res.status(200).json({
              code: 2000,
              success: true,
              message: "Verification is sent!!",
              contact_num: req.query.contact_num,
              data,
            });
          });
      } else {
        return res.status(200).json({
          code: 2000,
          success: true,
          message: "Wrong phone number :(",
          contact_num: req.query.contact_num,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const verifySmsOtp = async (req, res) => {
    try {
      console.log("test", req.query.contact_num, req.query.code);
      if (req.query.contact_num && req.query.code.length === 6) {
        client.verify
          .services(twilioconfig.serviceID)
          .verificationChecks.create({
            to: `+${req.query.contact_num}`,
            code: req.query.code,
          })
          .then((data) => {
            if (data.status === "approved") {
              res.status(200).send({
                message: "User is Verified!!",
                data,
              });
            } else {
              res.status(400).send({
                message: "Wrong  code :(",
                contact_num: req.query.contact_num,
                data,
              });
            }
          });
      } else {
        res.status(400).send({
          message: "Wrong phone number :(",
          contact_num: req.query.contact_num,
          data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };
  const sendEmailOtp = async (req, res) => {
    try {
      console.log("test");
      client.verify.v2
        .services(twilioconfig.serviceID)
        .verifications.create({ to: req.query.email_id, channel: "email" })
        .then((data) => {
          console.log(data);
          return res.status(200).json({
            code: 2000,
            success: true,
            message: "Verification is sent!!",
            data,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(error.status).json(error);
        });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const verifyEmailOtp = async (req, res) => {
    try {
      console.log("test", req.query.email_id, req.query.code);
      if (req.query.email_id && req.query.code.length === 6) {
        client.verify.v2
          .services(twilioconfig.serviceID)
          .verificationChecks.create({
            to: req.query.email_id,
            code: req.query.code,
          })
          .then((data) => {
            if (data.status === "approved") {
              res.status(200).send({
                message: "User is Verified!!",
                data,
              });
            } else {
              res.status(400).send({
                message: "Wrong  code :(",
                // contact_num: req.query.contact_num,
                data,
              });
            }
          });
      } else {
        res.status(400).send({
          message: "Wrong phone number :(",
          // contact_num: req.query.contact_num,
          // data
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  const resetPassword = async (req, res) => {
    try {
      // let whereClause = {};
      // whereClause.is_deleted = false;

      // if (!req.body.old_password) {
      //     return res.status(200).json({
      //         code: 201,
      //         success: false,
      //         message: `Old password is required`,
      //     });
      // }
      // if (req.body.new_password != req.body.confirm_new_password) {
      //     return res.status(200).json({
      //         code: 2000,
      //         success: false,
      //         message: `New password doesn't match`,
      //         data: response || {}
      //     });
      // }
      // whereClause.password = req.body.old_password
      // whereClause.id = req.body.user_id

      // let responseUser = await crudService.get(UserModel, {
      //     attributes: ['id'],
      //     where: whereClause,
      // });
      // console.log(responseUser)
      // if (responseUser.length == 0) {
      //     return res.status(200).json({
      //         code: 2000,
      //         success: false,
      //         message: `Please enter correct old password`,
      //         data: response || {}
      //     });
      // }

      let data = {};
      data.password = req.body.password;
      let response = await crudService.update(
        UserModel,
        { id: req.body.id },
        data
      );
      return res.status(200).json({
        code: 2000,
        success: true,
        message: `Password reset successfully.`,
        data: response || {},
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json(error.error);
    }
  };

  //nikul

  const sendEmail = async (req, res) => {
    const { email_id } = req.body
    let options = {}
    options.where = {
      email_id: email_id
    }
    const response = await crudService.getOne(UserModel, options);

    if (!response) {
      return res.status(201).json({
        code: 201,
        success: true,
        message: `Email not found.`,
        data: response,
      });
    }
    // const on_order_placed_email_to_user = {
    //   from: process.env.SENDGRID_SENDER_EMAIL,
    //   to: "nikul@yopmail.com",
    //   subject: "Your order has been placed.",
    //   text: "Your Order has been placed.",
    // };

    // client.verify.v2
    // .services(twilioconfig.serviceID)
    // .verifications.create({ to: "priyanka@yopmail.com", channel: "email" })

    var current_date = new Date().valueOf().toString();
    var random = Math.random().toString();
    let reset_password_token = crypto
      .createHash("sha1")
      .update(current_date + random)
      .digest("hex");
    const reset_token_expiry = moment().add(1440, "minutes");
    let link
    User.update(
      {
        reset_password_token: reset_password_token,
        reset_token_expiry: reset_token_expiry,
      },
      {
        where: { email_id: email_id },
      }
    )
      .then(async (result) => {
        console.log("User updated successfully:", result);
        // Handle success
        link =
          "<a href=" +
          `${process.env.DOMAIN_HTTP_URL}reset-password?token=${reset_password_token}` +
          `> Reset your password</a>`;

        await emailSend(email_id, link, "Reset Password")

        return res.status(200).json({
          code: 200,
          success: true,
          message: `Success.`,
          data: link,
        });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        // Handle error
      });

    // await crudService.update(UserModel,options, {reset_password_token, reset_token_expiry})

  }

  const resetPasswordV2 = async (req, res) => {
    try {
      const { id, password } = req.body
      let options = {}
      options.where = {
        reset_password_token: id
      }
      const response = await crudService.getOne(UserModel, options);
      if (!response) {
        return res.status(201).json({
          code: 201,
          success: true,
          message: `Email not found.`,
          data: [],
        });
      }

      if (password) {
        await crudService.update(
          UserModel,
          { id: response.id },
          { password: password }
        );
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Success.`,
          data: response,
        });
      }else{
        return res.status(201).json({
          code: 201,
          success: true,
          message: `Please enter new password.`,
          data: [],
        });
      }
    } catch (error) {
      return res.status(error.status).json(error.error);
    }
  }

  return {
    signup,
    login,
    destroy,
    get,
    sendSmsOtp,
    verifySmsOtp,
    sendEmailOtp,
    verifyEmailOtp,
    resetPassword,
    loginIsAvailable,
    getNotAssignUser,
    sendEmail,
    resetPasswordV2
  };
};
module.exports = UserApi;

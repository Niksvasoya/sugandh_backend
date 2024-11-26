const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Country = require("../Master/Country");
const Province = require("../Master/Province");
const City = require("../Master/City");
// const ZipCode = require('../Master/ZipCode')

const hooks = {};

const tableName = "logistics";

const Logistics = sequelize.define(
  "Logistics",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
        },
        async isUnique(value) {
          let whereClause = {};
          whereClause.is_deleted = false;
          if (value) {
            whereClause.name = { [Sequelize.Op.iLike]: value };
          }
          if (this.id) {
            whereClause.id = { [Sequelize.Op.ne]: this.id };
          }
          const existingUser = await Logistics.findOne({
            where: whereClause,
          });
          if (existingUser) {
            throw new Error("Name is already exist");
          }
        },
        // is: {
        //     args: /^[0-9A-Za-z'-]+(?:\s[0-9A-Za-z'-]+)*$/i,
        //     msg: 'Please enter valid Organization name',
        // },
        len: {
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters long",
        },
      },
    },
    gst_number: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isGSTNumber: function (value) {
          if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(value)) {
            throw new Error("Invalid GST number");
          }
        },
      },
    },
    // pan_number: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    //     validate: {
    //         isPAN: function (value) {
    //             if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) {
    //                 throw new Error('Invalid PAN number');
    //             }
    //         },
    //     },
    // },
    contact_person_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    primary_contact_number: {
      type: Sequelize.BIGINT,
      allowNull: false,
      validate: {
        isPhoneNumber: function (value) {
          if (!/^\d{10}$/.test(value)) {
            throw new Error("Invalid primary contact number");
          }
        },
      },
    },
    primary_contact_id: {
      type: Sequelize.BIGINT,
      references: {
        model: Country,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid primary contact code",
        },
        async checkCountryId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid primary contact code");
          }
          const CountryData = await Country.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!CountryData) {
            throw new Error("Please enter valid primary contact code");
          }
        },
      },
    },
    alternate_contact_number: {
      type: Sequelize.BIGINT,
      validate: {
        isPhoneNumber: function (value) {
          if (!/^\d{10}$/.test(value)) {
            throw new Error("Invalid alternate contact number");
          }
        },
      },
    },
    alternate_contact_id: {
      type: Sequelize.BIGINT,
      references: {
        model: Country,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid alternate contact code",
        },
        async checkCountryId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid alternate contact code");
          }
          const CountryData = await Country.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!CountryData) {
            throw new Error("Please enter valid alternate contact code");
          }
        },
      },
    },
    is_primary_number_whatsapp: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid is primary number whatsapp");
          }
        },
      },
    },
    is_alternate_number_whatsapp: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid is alternate number whatsapp");
          }
        },
      },
    },
    email_id: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Invalid email format",
        },
        async isUnique(value) {
          let whereClause = {};
          whereClause.is_deleted = false;
          if (value) {
            whereClause.email_id = { [Sequelize.Op.iLike]: value };
          }
          if (this.id) {
            whereClause.id = { [Sequelize.Op.ne]: this.id };
          }
          const existingUser = await Logistics.findOne({
            where: whereClause,
          });
          if (existingUser) {
            throw new Error("Email is already exist");
          }
        },
      },
    },
    address_line_1: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address line 1 is required",
        },
        len: {
          args: [5, 100],
          msg: "Address line 1 must be between 5 and 100 characters",
        },
      },
    },
    address_line_2: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: "Address line 2 must be less than or equal to 100 characters",
        },
      },
    },
    zipcode_id: {
      type: Sequelize.STRING,
      // allowNull: true,
      // references: {
      //     model: ZipCode,
      //     key: 'id',
      // }
    },
    country_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Country,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Country",
        },
        async checkCountryId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Country");
          }
          const CountryData = await Country.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!CountryData) {
            throw new Error("Please enter valid Country");
          }
        },
      },
    },
    province_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Province,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Province",
        },
        async checkProvinceId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Province");
          }
          const ProvinceData = await Province.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!ProvinceData) {
            throw new Error("Please enter valid Province");
          }
        },
      },
    },
    city_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: City,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid City",
        },
        async checkCityId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid City");
          }
          const CityData = await City.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!CityData) {
            throw new Error("Please enter valid City");
          }
        },
      },
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  },
  { hooks, tableName }
);

module.exports = Logistics;

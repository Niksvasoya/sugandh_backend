const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Country = require("../Master/Country");
const Province = require("../Master/Province");
const City = require("../Master/City");
//const ZipCode = require('../Master/ZipCode')

const hooks = {};

/**
 Model Company in file Company.js represents attributes and methods for the class Company. Upon execution of code, this file will create table named company which will contain fields as specified in attributed of class Company. 
 */
const tableName = "company";

const Company = sequelize.define(
  "Company",
  {
    // This field will be the primary key to maintain uniqueness of each record inserted in the database.
    // Sample Input: 1
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    // This field will store the name of the organization who is using the software. It will also be utilized for the generation of invoice
    // Sample Input: India Private Limited
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
          const existingUser = await Company.findOne({
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
          args: [2, 50],
          msg: "Name must be between 2 and 50 characters long",
        },
      },
    },

    // This field will store the logo of the image.
    // Sample Input: Image File
    logo: {
      type: Sequelize.STRING,
      // allowNull: true,
      validate: {
        isUrl: {
          msg: "Logo must be a valid URL",
        },
        // notNull: {
        //     msg: 'logo is required'
        // }
      },
    },

    // This field will store the GST number of the company.
    // Sample Input: 24AAAAA00001Z5
    gst_number: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isGSTNumber: function (value) {
          if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(value)) {
            throw new Error("Invalid GST number");
          }
        },
      },
    },

    // This field will store the name of the contact person at the company.
    // Sample Input: Rajesh Arora
    contact_person_name: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[a-zA-Z\s-]+$/i,
          msg: "Name must contain only alphabets, spaces, and hyphens",
        },
        len: {
          args: [2, 10],
          msg: "Name must be between 2 and 10 characters long",
        },
      },
    },
    // This field will store the contact number registered as official.
    // Sample Input: +91 9876543210
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
          const existingUser = await Company.findOne({
            where: whereClause,
          });
          if (existingUser) {
            throw new Error("Email is already exist");
          }
        },
      },
    },

    // This field will store the registered address of the company.
    // Sample Input: 101 Professional Chambers
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

    // This field will store the registered address of the company.
    // Sample Input: Besides Crown Plaza, S G Highway
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

    // This field is used to define relationship between company table and master_zipcode table. This field will store the pincode of address.
    // Sample Input: 1
    zipcode_id: {
      type: Sequelize.STRING,
      // allowNull: true,
      // references: {
      //     model: ZipCode,
      //     key: 'id',
      // }
    },
    // This field is used to define relationship between company table and master_country table.This field will store where the Country here office is located.
    // Sample Input: 1
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

    // This field is used to define relationship between company table and master_province table. This field will store the state where the office is located.
    // Sample Input: 1
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

    // This field is used to define relationship between company table and master_city table. This field will store the city where office is located
    // Sample Input: 1
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

module.exports = Company;

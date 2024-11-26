const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Country = require("../Master/Country");
const Province = require("../Master/Province");
const City = require("../Master/City");
// const ZipCode = require('../Master/ZipCode')

const hooks = {};

const tableName = "re-seller";

const ReSeller = sequelize.define(
  "ReSeller",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gst_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    pan_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    contact_person_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    primary_contact_number: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    primary_contact_id: {
      type: Sequelize.BIGINT,
      references: {
        model: Country,
        key: "id",
      },
    },
    alternate_contact_number: {
      type: Sequelize.BIGINT,
    },
    alternate_contact_id: {
      type: Sequelize.BIGINT,
      references: {
        model: Country,
        key: "id",
      },
    },
    is_primary_number_whatsapp: {
      type: Sequelize.BOOLEAN,
    },
    is_alternate_number_whatsapp: {
      type: Sequelize.BOOLEAN,
    },
    email_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address_line_1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address_line_2: {
      type: Sequelize.STRING,
      allowNull: true,
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
    },
    province_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Province,
        key: "id",
      },
    },
    city_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: City,
        key: "id",
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

module.exports = ReSeller;

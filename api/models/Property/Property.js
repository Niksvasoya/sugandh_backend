const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Country = require("../Master/Country");
const Province = require("../Master/Province");
const City = require("../Master/City");
const PropertyCategory = require("./PropertyCategory");
const User = require("../User/User");
// const ZipCode = require('../Master/ZipCode')

const hooks = {};

const tableName = "property";

const Property = sequelize.define(
  "Property",
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
    property_category_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: PropertyCategory,
        key: "id",
      },
    },
    // user_id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: true,
    //     references: {
    //         model: User,
    //         key: 'id',
    //     }
    // },
    property_size: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    property_code: {
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
      allowNull: true,
    },
    is_alternate_number_whatsapp: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
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
    is_direct_sell: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  },
  { hooks, tableName }
);

// User.hasMany(Property, {
//     foreignKey: "user_id",
// })
// Property.belongsTo(User, {
//     foreignKey: "user_id",
// });
module.exports = Property;

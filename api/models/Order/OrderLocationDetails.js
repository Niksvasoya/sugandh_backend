const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");

// const UserModel = require('./User');
const CityModel = require("../Master/City");
const CountryModel = require("../Master/Country");
const ProvinceModel = require("../Master/Province");
const ZipCodeModel = require("../Master/ZipCode");
const Order = require("./Order");

const hooks = {};

const tableName = "order_location_details";

const OrderLocationDetails = sequelize.define(
  "OrderLocationDetails",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    email_id: {
      type: Sequelize.STRING,
    },
    primary_contact_number: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    primary_contact_id: {
      allowNull: true,
      type: Sequelize.BIGINT,
      references: {
        model: CountryModel,
        key: "id",
      },
    },
    address_line_1: {
      type: Sequelize.STRING,
    },
    address_line_2: {
      type: Sequelize.STRING,
    },
    city_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: CityModel,
        key: "id",
      },
    },

    country_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: CountryModel,
        key: "id",
      },
    },

    province_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: ProvinceModel,
        key: "id",
      },
    },
    zipcode_id: {
      type: Sequelize.BIGINT,
      // allowNull: false,
      // references: {
      //     model: ZipCodeModel,
      //     key: 'id',
      // },
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
Order.hasMany(OrderLocationDetails, {
  foreignKey: "order_id",
});
OrderLocationDetails.belongsTo(Order, {
  foreignKey: "order_id",
});
module.exports = OrderLocationDetails;

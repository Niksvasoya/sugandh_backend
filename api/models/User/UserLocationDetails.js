const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");

const UserModel = require("./User");
const CityModel = require("../Master/City");
const CountryModel = require("../Master/Country");
const ProvinceModel = require("../Master/Province");
const User = require("./User");

const hooks = {};

const tableName = "user_location_details";

const UserLocationDetails = sequelize.define(
  "UserLocationDetails",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: UserModel,
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
    zipcode: {
      type: Sequelize.STRING,
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
User.hasMany(UserLocationDetails, {
  foreignKey: "user_id",
});
UserLocationDetails.belongsTo(User, {
  foreignKey: "user_id",
});
module.exports = UserLocationDetails;

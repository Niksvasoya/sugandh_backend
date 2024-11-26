const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");

const UserRole = require("./UserRole");
const CityModel = require("../Master/City");
const CountryModel = require("../Master/Country");
const ProvinceModel = require("../Master/Province");
// const ZipCodeModel = require('../Master/ZipCode');
const UserAccountStatusModel = require("./UserAccountStatus");

const hooks = {};

const tableName = "user";

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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
    user_role_id: {
      allowNull: true,
      type: Sequelize.BIGINT,
      references: {
        model: UserRole,
        key: "id",
      },
    },
    address_line_1: {
      type: Sequelize.STRING,
    },
    address_line_2: {
      type: Sequelize.STRING,
    },
    user_profile_image: {
      type: Sequelize.STRING,
    },
    city_id: {
      allowNull: true,
      type: Sequelize.BIGINT,
      references: {
        model: CityModel,
        key: "id",
      },
    },

    country_id: {
      allowNull: true,
      type: Sequelize.BIGINT,
      references: {
        model: CountryModel,
        key: "id",
      },
    },

    province_id: {
      allowNull: true,
      type: Sequelize.BIGINT,
      references: {
        model: ProvinceModel,
        key: "id",
      },
    },
    zipcode_id: {
      type: Sequelize.STRING,
    },
    // zipcode_id: {
    //     type: Sequelize.BIGINT,
    //     references: {
    //         model: ZipCodeModel,
    //         key: 'id',
    //     },
    // },
    account_status: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: UserAccountStatusModel,
        key: "id",
      },
    },
    password: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.BOOLEAN,
    },
    dob: {
      type: Sequelize.DATEONLY,
    },
    birth_time: {
      type: Sequelize.TIME,
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
    alternate_contact_number: {
      type: Sequelize.BIGINT,
    },
    alternate_contact_id: {
      allowNull: true,
      type: Sequelize.BIGINT,
      references: {
        model: CountryModel,
        key: "id",
      },
    },
    is_primary_number_whatsapp: {
      type: Sequelize.BOOLEAN,
    },
    is_alternate_number_whatsapp: {
      type: Sequelize.BOOLEAN,
    },
    instagram_id: {
      type: Sequelize.STRING,
    },
    facebook_id: {
      type: Sequelize.STRING,
    },
    twitter_id: {
      type: Sequelize.STRING,
    },
    jwt_token: {
      type: Sequelize.ARRAY(Sequelize.JSON),
    },
    is_trial: {
      type: Sequelize.BOOLEAN,
    },
    is_customer: {
      type: Sequelize.BOOLEAN,
    },
    company_name: {
      type: Sequelize.STRING,
    },
    gst_number: {
      type: Sequelize.STRING,
    },
    is_customer: {
      type: Sequelize.BOOLEAN,
    },

    is_deleted: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
    reset_password_token: {
      type: Sequelize.STRING,
    },
    reset_token_expiry: {
      type: Sequelize.DATE,
    },
    credit_point: {
      type: Sequelize.BIGINT,
    },
  },
  { hooks, tableName }
);

CountryModel.hasMany(User, {
  foreignKey: "country_id",
});
User.belongsTo(CountryModel, {
  foreignKey: "country_id",
});
ProvinceModel.hasMany(User, {
  foreignKey: "province_id",
});
User.belongsTo(ProvinceModel, {
  foreignKey: "province_id",
});
CityModel.hasMany(User, {
  foreignKey: "city_id",
});
User.belongsTo(CityModel, {
  foreignKey: "city_id",
});
module.exports = User;

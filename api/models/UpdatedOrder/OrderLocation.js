const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const City = require("../Master/City");
const Country = require("../Master/Country");
const Province = require("../Master/Province");

const crudService = require("../../services/crud.service");

const hooks = {};

const tableName = "Order_Location";

const OrderLocation = sequelize.define(
  "OrderLocation",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    email_id: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Email Id.",
        },
        isEmail: {
          args: true,
          msg: "Please enter a valid Email Address.",
        },
      },
    },
    contact_number: {
      type: Sequelize.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Contact Number.",
        },
        isPhoneNumber: function (value) {
          if (!/^\d{10}$/.test(value)) {
            throw new Error("Invalid contact number");
          }
        },
      },
    },
    contact_number_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: Country,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Please Provide Contact Number code ID.",
        },
        isInt: {
          args: true,
          msg: "Please Provide valid Contact Number code ID.",
        },
        async CheckPhoneCode(value) {
          if (typeof value === "string")
            throw new Error("Contact Number Code can not be non Numeric");
          const phoneCodeData = await crudService.get(Country, {
            where: { id: value, is_deleted: false },
          });
          if (!phoneCodeData)
            throw new Error(
              "Please Provide Contact Number of existing record."
            );
        },
      },
    },
    address_line_1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address_line_2: {
      type: Sequelize.STRING,
    },
    city_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: City,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "City Id can not be empty.",
        },
        isInt: {
          args: true,
          msg: "City Id can not be non Numeric.",
        },
        async CheckCityId(value) {
          if (typeof value === "string")
            throw new Error("City Id is in invalid format.");
          const CityData = await crudService.get(City, {
            where: { id: value, is_deleted: false },
          });
          if (!CityData)
            throw new Error("Please Provide City Id of existing record.");
        },
      },
    },
    city_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    province_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: Province,
        key: "id",
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Province Id can not be empty.",
        },
        isInt: {
          args: true,
          msg: "Province Id can not be non Numeric.",
        },
        async CheckProvinceId(value) {
          if (typeof value === "string")
            throw new Error("Province Id is in invalid format.");
          const ProvinceData = await crudService.get(Province, {
            where: { id: value, is_deleted: false },
          });
          if (!ProvinceData)
            throw new Error("Please Provide Province Id of existing record.");
        },
      },
    },
    province_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country_id: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: Country,
        key: "id",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Country Id can not be empty.",
        },
        isInt: {
          args: true,
          msg: "Country Id can not be non Numeric.",
        },
        async CheckCountryId(value) {
          if (typeof value === "string")
            throw new Error("Country Id is in invalid format.");
          const CountryData = await crudService.get(Country, {
            where: { id: value, is_deleted: false },
          });
          if (CountryData[0] == undefined)
            throw new Error("Please Provide Country Id of existing record.");
        },
      },
    },
    country_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    zipcode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  },
  { hooks, tableName }
);

City.hasMany(OrderLocation, { foreignKey: "city_id" });
OrderLocation.belongsTo(City, { foreignKey: "city_id" });

Province.hasMany(OrderLocation, { foreignKey: "province_id" });
OrderLocation.belongsTo(Province, { foreignKey: "province_id" });

Country.hasMany(OrderLocation, { foreignKey: "country_id" });
OrderLocation.belongsTo(Country, { foreignKey: "country_id" });

Country.hasMany(OrderLocation, { foreignKey: "contact_number_id" });
OrderLocation.belongsTo(Country, { foreignKey: "contact_number_id" });

module.exports = OrderLocation;

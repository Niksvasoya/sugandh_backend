const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Country = require("../Master/Country");
const Province = require("../Master/Province");
const City = require("../Master/City");
const PropertyCategory = require("./PropertyCategory");
const User = require("../User/User");
const Property = require("./Property");
// const ZipCode = require('../Master/ZipCode')

const hooks = {};

const tableName = "employee_mapping";

const EmployeeMapping = sequelize.define(
  "EmployeeMapping",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    property_category_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: PropertyCategory,
        key: "id",
      },
    },
    property_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Property,
        key: "id",
      },
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: User,
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

User.hasMany(EmployeeMapping, {
  foreignKey: "user_id",
});
EmployeeMapping.belongsTo(User, {
  foreignKey: "user_id",
});
Property.hasMany(EmployeeMapping, {
  foreignKey: "property_id",
});
EmployeeMapping.belongsTo(Property, {
  foreignKey: "property_id",
});
module.exports = EmployeeMapping;

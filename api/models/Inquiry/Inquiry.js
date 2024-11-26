const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const hooks = {};

const tableName = "inquiry";

const Inquiry = sequelize.define(
  "Inquiry",
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
      validate: {
        isEmail: {
          msg: "Invalid email address", // custom error message
        },
      },
    },
    message: {
      type: Sequelize.STRING,
    },
    primary_contact_number: {
      type: Sequelize.BIGINT,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: "Invalid phone number", // custom error message
        },
        len: {
          args: [10, 10], // validate if it has 10 digits
          msg: "Primary contact number must be 10 digits", // custom error message
        },
      },
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    is_connect_on_call: {
      type: Sequelize.BOOLEAN,
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

module.exports = Inquiry;

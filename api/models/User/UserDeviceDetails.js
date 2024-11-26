const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");

const UserModel = require("./User");

const hooks = {};

const tableName = "user_device_details";

const UserDeviceDetails = sequelize.define(
  "UserDeviceDetails",
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
    device_type: {
      type: Sequelize.STRING,
    },
    device_name: {
      type: Sequelize.STRING,
    },
    ip_address: {
      type: Sequelize.STRING,
    },
    device_sn: {
      type: Sequelize.STRING,
    },
    mac_address: {
      type: Sequelize.STRING,
    },
    model_number: {
      type: Sequelize.STRING,
    },
    model_name: {
      type: Sequelize.STRING,
    },
    operating_system: {
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

module.exports = UserDeviceDetails;

const Sequelize = require("sequelize");
const Country = require("./Country");
const sequelize = require("../../../config/database");
const hooks = {};

const tableName = "master_timezone";

const Timezone = sequelize.define(
  "Timezone",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    zoneName: {
      type: Sequelize.STRING,
    },
    gmtOffset: {
      type: Sequelize.BIGINT,
    },
    gmtOffsetName: {
      type: Sequelize.STRING,
    },
    abbreviation: {
      type: Sequelize.STRING,
    },
    tzName: {
      type: Sequelize.STRING,
    },
    country_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Country,
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

module.exports = Timezone;

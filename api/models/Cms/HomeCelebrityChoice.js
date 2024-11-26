const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const hooks = {};

const tableName = "home_celebrity_choice";

const HomeCelebrityChoice = sequelize.define(
    "HomeCelebrityChoice",
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        image: {
            type: Sequelize.STRING,
            allowNull: false,
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


module.exports = HomeCelebrityChoice;



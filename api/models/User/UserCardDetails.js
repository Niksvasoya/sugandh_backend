const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const User = require("./User");

const UserModel = require("./User");

const hooks = {};

const tableName = "user_card_details";

const UserCardDetails = sequelize.define(
  "UserCardDetails",
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
    card_number: {
      type: Sequelize.BIGINT,
    },
    exp_month: {
      type: Sequelize.INTEGER,
    },
    exp_year: {
      type: Sequelize.INTEGER,
    },
    cvv: {
      type: Sequelize.INTEGER,
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

User.hasMany(UserCardDetails, {
  foreignKey: "user_id",
});
UserCardDetails.belongsTo(User, {
  foreignKey: "user_id",
});
module.exports = UserCardDetails;

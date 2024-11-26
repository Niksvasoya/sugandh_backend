const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const User = require("./User");

const UserModel = require("./User");
const hooks = {};

const tableName = "user_stripe_details";

const UserStripeDetails = sequelize.define(
  "UserStripeDetails",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    charge_id: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    card_id: {
      type: Sequelize.STRING,
    },
    customer_id: {
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

User.hasMany(UserStripeDetails, {
  foreignKey: "user_id",
});
UserStripeDetails.belongsTo(User, {
  foreignKey: "user_id",
});
module.exports = UserStripeDetails;

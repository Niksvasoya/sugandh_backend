const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const User = require("./User");

const UserModel = require("./User");

const hooks = {};

const tableName = "user_wallet";

const UserWallet = sequelize.define(
  "UserWallet",
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
    amount: {
      type: Sequelize.DECIMAL,
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

User.hasMany(UserWallet, {
  foreignKey: "user_id",
});
UserWallet.belongsTo(User, {
  foreignKey: "user_id",
});
module.exports = UserWallet;

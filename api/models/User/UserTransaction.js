const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const User = require("./User");

const UserModel = require("./User");
const PaymentStatus = require("../Accounting/PaymentStatus");

const hooks = {};

const tableName = "user_transaction";

const UserTransaction = sequelize.define(
  "UserTransaction",
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

    amount: {
      type: Sequelize.DECIMAL,
    },
    date: {
      type: Sequelize.DATE,
    },
    payment_type: {
      type: Sequelize.BOOLEAN,
    },
    payment_status_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: PaymentStatus,
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

User.hasMany(UserTransaction, {
  foreignKey: "user_id",
});
UserTransaction.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = UserTransaction;

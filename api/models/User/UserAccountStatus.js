const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const hooks = {};

const tableName = "user_account_status";

const UserAccountStatus = sequelize.define(
  "UserAccountStatus",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
        },
        is: {
          args: /^[a-zA-Z\s-]+$/i,
          msg: "Name must contain only alphabets, spaces, and hyphens",
        },
        async isUnique(value) {
          let whereClause = {};
          whereClause.is_deleted = false;
          if (value) {
            whereClause.name = { [Sequelize.Op.iLike]: value };
          }
          if (this.id) {
            whereClause.id = { [Sequelize.Op.ne]: this.id };
          }
          const existingUser = await UserAccountStatus.findOne({
            where: whereClause,
          });
          if (existingUser) {
            throw new Error("Name is already exist");
          }
        },
        len: {
          args: [2, 50],
          msg: "Name must be between 2 and 50 characters long",
        },
      },
    },
    description: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [0, 4000],
          msg: "Description must be at most 4000 characters long",
        },
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

module.exports = UserAccountStatus;

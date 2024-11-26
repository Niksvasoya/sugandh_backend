const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const hooks = {};

const tableName = "cms_logo";

const Logo = sequelize.define(
  "Logo",
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
        async isUnique(value) {
          let whereClause = {};
          whereClause.is_deleted = false;
          if (value) {
            whereClause.name = { [Sequelize.Op.iLike]: value };
          }
          if (this.id) {
            whereClause.id = { [Sequelize.Op.ne]: this.id };
          }
          const existingUser = await Logo.findOne({
            where: whereClause,
          });
          if (existingUser) {
            throw new Error("Name is already exist");
          }
        },
        is: {
          args: /^[a-zA-Z\s-]+$/i,
          msg: "Name must contain only alphabets, spaces, and hyphens",
        },
        len: {
          args: [2, 10],
          msg: "Name must be between 2 and 10 characters long",
        },
      },
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Image must be a valid URL",
        },
        notNull: {
          msg: "Image is required",
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

module.exports = Logo;

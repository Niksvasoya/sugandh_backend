const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");

const hooks = {};

const tableName = "tax_type";

const TaxType = sequelize.define(
  "TaxType",
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
          const existingUser = await TaxType.findOne({
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
          args: [2, 50],
          msg: "Name must be between 2 and 50 characters long",
        },
      },
    },
    value: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "GST value is required",
        },
        isNumeric: {
          msg: "GST value should be a number",
        },
        min: {
          args: [0],
          msg: "GST value should be greater than or equal to 0",
        },
        max: {
          args: [100],
          msg: "GST value should be less than or equal to 100",
        },
      },
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "Description must be at most 255 characters long",
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

module.exports = TaxType;

const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");

const hooks = {};

const tableName = "hsn_code";

const HsnCode = sequelize.define(
  "HsnCode",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Code cannot be empty",
        },
        async isUnique(value) {
          let whereClause = {};
          whereClause.is_deleted = false;
          if (value) {
            whereClause.code = { [Sequelize.Op.iLike]: value };
          }
          if (this.id) {
            whereClause.id = { [Sequelize.Op.ne]: this.id };
          }
          const existingUser = await HsnCode.findOne({
            where: whereClause,
          });
          if (existingUser) {
            throw new Error("Code is already exist");
          }
        },
        len: {
          args: [2, 50],
          msg: "Code must be between 2 and 50 characters long",
        },
      },
    },
    description: {
      type: Sequelize.STRING(2048),
      allowNull: true,
      validate: {
        len: {
          args: [0, 4000],
          msg: "Description must be at most 4000 characters long",
        },
      },
    },

    type: {
      type: Sequelize.STRING,
      allowNull: false,
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Type is required.",
        },
      },
    },

    cgst_percent: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "CGST percent is required.",
        },
        min: {
          args: [0],
          msg: "CGST percent must be a positive number.",
        },
      },
    },

    sgst_percent: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "SGST percent is required.",
        },
        min: {
          args: [0],
          msg: "SGST percent must be a positive number.",
        },
      },
    },

    igst_percent: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "IGST percent is required.",
        },
        min: {
          args: [0],
          msg: "IGST percent must be a positive number.",
        },
      },
    },

    cess_percent: {
      type: Sequelize.DECIMAL,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: "Cess percent must be a positive number.",
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

module.exports = HsnCode;

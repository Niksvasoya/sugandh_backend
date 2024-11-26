const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Supplier = require("./Supplier");
const hooks = {};

const tableName = "supplier_bank_details";

const SupplierBankDetails = sequelize.define(
  "SupplierBankDetails",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    supplier_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: Supplier,
        key: "id",
      },
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    ifsc_code: {
      type: Sequelize.STRING,
    },

    branch_name: {
      type: Sequelize.STRING,
    },

    account_number: {
      type: Sequelize.STRING,
    },

    account_type: {
      type: Sequelize.STRING,
    },

    remark: {
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

module.exports = SupplierBankDetails;

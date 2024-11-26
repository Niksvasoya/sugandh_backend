const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");

const hooks = {};

/**
 Model ModeOfPayment in file ModeOfPayment.js represents attributes and methods for the class ModeOfPayment.  Upon execution of code, this file will create table named master_mode_of_payment which will contain fields as specified in attributed of class ModeOfPayment. 
 */
const tableName = "payment_status";

const PaymentStatus = sequelize.define(
  "PaymentStatus",
  {
    // This field id is used to represent primary key in the table master_mode_of_payment.
    // Sample Input: 1
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    // name field is used to store Name of the master_mode_of_payment.
    // Sample Input: Card
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
          const existingUser = await PaymentStatus.findOne({
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

    // description field is used to store Description of the master_mode_of_payment.
    // Sample Input: Payment using card.
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

module.exports = PaymentStatus;

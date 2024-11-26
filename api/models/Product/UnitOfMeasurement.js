const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");

const hooks = {};

/**
 Model UnitOfMeasurement in file UnitOfMeasurement.js represents attributes and methods for the class UnitOfMeasurement.  Upon execution of code, this file will create table named master_unit_of_measurement which will contain fields as specified in attributed of class UnitOfMeasurement. 
 */
const tableName = "product_unit_of_measurement";

const UnitOfMeasurement = sequelize.define(
  "UnitOfMeasurement",
  {
    // This field id is used to represent primary key in the table master_unit_of_measurement.
    // Sample Input: 1
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    // name field is used to store Name of the master_unit_of_measurement.
    // Sample Input: Kg
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
          const existingUser = await UnitOfMeasurement.findOne({
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

    // description field is used to store Description of the master_unit_of_measurement.
    // Sample Input: A unit of mass in the metric system.
    description: {
      type: Sequelize.STRING,
      // allowNull: false,
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

module.exports = UnitOfMeasurement;

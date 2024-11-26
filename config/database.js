require("pg").defaults.parseInt8 = true;
const Sequelize = require("sequelize");
const path = require("path");

const connection = require("./connection");

let database;

console.log("call sb.service file ...", process.env.NODE_ENV);

switch ("production" || process.env.NODE_ENV) {
  case "production":
    console.log("calll production database ...");
    database = new Sequelize(
      connection.production.database,
      connection.production.username,
      connection.production.password,
      {
        host: connection.production.host,
        dialect: connection.production.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      }
    );
    break;
  case "testing":
    database = new Sequelize(
      connection.testing.database,
      connection.testing.username,
      connection.testing.password,
      {
        host: connection.testing.host,
        dialect: connection.testing.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        dialectOptions: {
          ssl: true,
        },
      }
    );
    break;
  default:
    console.log("calll dev database ...");
    database = new Sequelize(
      connection.development.database,
      connection.development.username,
      connection.development.password,
      {
        host: connection.development.host,
        dialect: connection.development.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        storage: path.join(process.cwd(), "db", "database.sqlite"),
        logging: true,
      }
    );
}

module.exports = database;

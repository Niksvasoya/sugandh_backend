const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const hooks = {};

const tableName = "home_slider";

const HomeSlider = sequelize.define(
  "HomeSlider",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title cannot be empty",
        },
        async isUnique(value) {
          let whereClause = {};
          whereClause.is_deleted = false;
          if (value) {
            // whereClause.name = { [Sequelize.Op.iLike]: value };
            whereClause.title = { [Sequelize.Op.iLike]: value };
          }
          if (this.id) {
            whereClause.id = { [Sequelize.Op.ne]: this.id };
          }
          const existingUser = await HomeSlider.findOne({
            where: whereClause,
          });
          if (existingUser) {
            throw new Error("Title is already exist");
          }
        },
        is: {
          args: /^[a-zA-Z\s-]+$/i,
          msg: "Title must contain only alphabets, spaces, and hyphens",
        },
        len: {
          args: [2, 10],
          msg: "Title must be between 2 and 10 characters long",
        },
      },
    },
    image: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      validate: {
        isArrayOfValidUrls(value) {
          if (!Array.isArray(value)) {
            throw new Error("Image must be in valid formate");
          }

          const isValidUrl = (url) => {
            try {
              new URL(url);
              return true;
            } catch {
              return false;
            }
          };

          if (!value.every(isValidUrl)) {
            throw new Error("Image must be valid URLs");
          }
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

module.exports = HomeSlider;

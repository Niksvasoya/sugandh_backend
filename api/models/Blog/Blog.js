const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const hooks = {};

const tableName = "blog";

const Blog = sequelize.define(
  "Blog",
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
          const existingUser = await Blog.findOne({
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
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters long",
        },
      },
    },
    description: {
      type: Sequelize.STRING(4000),
      allowNull: true,
      validate: {
        len: {
          args: [0, 4000],
          msg: "Description must be at most 4000 characters long",
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
    thumbnail_image: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Thumbnail Image must be a valid URL",
        },
        notEmpty: {
          msg: "Thumbnail Image is required",
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

module.exports = Blog;
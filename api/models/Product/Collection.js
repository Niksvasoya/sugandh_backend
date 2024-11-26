const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Brand = require("./Brand");

const hooks = {};

const tableName = "product_collection";

const Collection = sequelize.define(
  "Collection",
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
        // is: {
        //     args: /^[a-zA-Z\s-]+$/i,
        //     msg: 'Name must contain only alphabets, spaces, and hyphens',
        // },
        async isUnique(value) {
          let whereClause = {};
          whereClause.is_deleted = false;
          if (value) {
            whereClause.name = { [Sequelize.Op.iLike]: value };
          }
          if (this.id) {
            whereClause.id = { [Sequelize.Op.ne]: this.id };
          }
          const existingUser = await Collection.findOne({
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
    collection_number: {
      type: Sequelize.BIGINT,
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
    tag_line: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    shipping_information: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    size_chart: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    brand_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: Brand,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Brand",
        },
        async checkBrandId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Brand");
          }
          const BrandData = await Brand.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!BrandData) {
            throw new Error("Please enter valid Brand");
          }
        },
      },
    },
    look_book: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Look Book must be a valid URL",
        },
      },
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
    sort_order:{
      type: Sequelize.BIGINT,
      allowNull: true,
    }
  },
  { hooks, tableName }
);

module.exports = Collection;

const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const Collection = require("../Product/Collection");
const hooks = {};

const tableName = "home_slider_desktop";

const HomeSliderDesktop = sequelize.define(
  "HomeSliderDesktop",
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
            whereClause.title = { [Sequelize.Op.iLike]: value };
          }
          if (this.id) {
            whereClause.id = { [Sequelize.Op.ne]: this.id };
          }
          const existingUser = await HomeSliderDesktop.findOne({
            where: whereClause,
          });
          if (existingUser) {
            throw new Error("Title is already exist");
          }
        },
        // is: {
        //   args: /^[a-zA-Z\s-]+$/i,
        //   msg: "Title must contain only alphabets, spaces, and hyphens",
        // },
        len: {
          args: [2, 50],
          msg: "Title must be between 2 and 50 characters long",
        },
      },
    },
    image: {
      type: Sequelize.STRING,
    },

    is_deleted: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
    collection_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: Collection,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Collection",
        },
        async checkCollectionId(value) {
          if (value) {
            if (typeof value == "string") {
              throw new Error("Please enter valid Collection");
            }
            const CollectionData = await Collection.findByPk(value);
            if (!CollectionData) {
              throw new Error("Please enter valid Collection");
            }
          }
        },
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  { hooks, tableName }
);

HomeSliderDesktop.belongsTo(Collection, { foreignKey: "collection_id" });
Collection.hasMany(HomeSliderDesktop, { foreignKey: "collection_id" });


module.exports = HomeSliderDesktop;



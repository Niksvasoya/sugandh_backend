const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Category = require("./Category");

const hooks = {};

const tableName = "product_sub_category";

const SubCategory = sequelize.define(
  "SubCategory",
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
          const existingUser = await SubCategory.findOne({
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
      },
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Category",
        },
        async checkCategoryId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Category");
          }
          // const CategoryData = await Category.findByPk(value);
          // if (!CategoryData) {
          //     throw new Error('Please enter valid Category');
          // }
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
    is_deleted: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  },
  { hooks, tableName }
);
Category.hasMany(SubCategory, {
  foreignKey: "category_id",
});
SubCategory.belongsTo(Category, {
  foreignKey: "category_id",
});
module.exports = SubCategory;

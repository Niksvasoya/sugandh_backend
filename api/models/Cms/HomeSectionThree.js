const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const Product = require("../Product/Product");
const hooks = {};

const tableName = "cms_section_three_product";

const HomeSectionThree = sequelize.define(
    "HomeSectionThree",
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
                    const existingProduct = await HomeSectionThree.findOne({
                        where: whereClause,
                    });
                    if (existingProduct) {
                        throw new Error("Name is already exist");
                    }
                },
                // is: {
                //     args: /^[a-zA-Z\s-]+$/i,
                //     msg: "Name must contain only alphabets, spaces, and hyphens",
                // },
                len: {
                    args: [2, 50],
                    msg: "Name must be between 2 and 50 characters long",
                },
            },
        },
        description: {
            type: Sequelize.STRING(40000),
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        product_id: {
            type: Sequelize.INTEGER,
            // allowNull: false,
            allowNull: true,
            references: {
                model: Product,
                key: "id",
            },
            validate: {
                isInt: {
                    args: true,
                    msg: "Please enter valid Product",
                },

                async checkProductId(value) {
                    if (value) {
                        if (typeof value == "string") {
                            throw new Error("Please enter valid Product");
                        }
                        const ProductData = await Product.findOne({
                            where: {
                                is_deleted: false,
                                id: value,
                            },
                        });
                        if (!ProductData) {
                            throw new Error("Please enter valid Product");
                        }
                    }
                },
            },
        },
    },
    { hooks, tableName }
);

HomeSectionThree.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(HomeSectionThree, { foreignKey: "product_id" });

module.exports = HomeSectionThree;

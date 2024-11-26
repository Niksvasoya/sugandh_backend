const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const Product = require("../Product/Product");
const Collection = require("../Product/Collection");
const hooks = {};

const tableName = "cms_culture_section_product";

const HomeCultureSection = sequelize.define(
    "HomeCultureSection",
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
                    const existingProduct = await HomeCultureSection.findOne({
                        where: whereClause,
                    });
                    if (existingProduct) {
                        throw new Error("Name is already exist");
                    }
                },
                len: {
                    args: [2, 50],
                    msg: "Name must be between 2 and 50 characters long",
                },
            },
        },
        description: {
            type: Sequelize.STRING(255),
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
    },
    { hooks, tableName }
);

HomeCultureSection.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(HomeCultureSection, { foreignKey: "product_id" });

HomeCultureSection.belongsTo(Collection, { foreignKey: "collection_id" });
Collection.hasMany(HomeCultureSection, { foreignKey: "collection_id" });

module.exports = HomeCultureSection;

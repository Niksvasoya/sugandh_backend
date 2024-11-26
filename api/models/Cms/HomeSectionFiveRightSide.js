const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const Product = require("../Product/Product");

const hooks = {};

const tableName = "home_section_five_right";

const HomeSectionFiveRightSide = sequelize.define(
    "HomeSectionFiveRightSide",
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        image: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
        },
        product_id: {
            type: Sequelize.INTEGER,
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
        is_deleted: {
            type: Sequelize.BOOLEAN,
        },
        deleted_at: {
            type: Sequelize.DATE,
        },
    },
    { hooks, tableName }
);


module.exports = HomeSectionFiveRightSide;


// HomeLookBookSection.belongsTo(Collection, { foreignKey: "collection_id" });
// Collection.hasMany(HomeLookBookSection, { foreignKey: "collection_id" });
HomeSectionFiveRightSide.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(HomeSectionFiveRightSide, { foreignKey: "product_id" });

const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Collection = require("../Product/Collection");

const hooks = {};

const tableName = "cms_look_book_product";

const HomeLookBookSection = sequelize.define(
    "HomeLookBookSection",
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
                        // whereClause.title = { [Sequelize.Op.iLike]: value };
                        whereClause.name = { [Sequelize.Op.iLike]: value };
                    }
                    if (this.id) {
                        whereClause.id = { [Sequelize.Op.ne]: this.id };
                    }
                    const existingProduct = await HomeLookBookSection.findOne({
                        where: whereClause,
                    });
                    if (existingProduct) {
                        throw new Error("Name is already exist");
                    }
                },
                len: {
                    args: [2, 10],
                    msg: "Name must be between 2 and 10 characters long",
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

// CouponType.hasMany(Coupon, { foreignKey: "coupon_type_id" });
// Coupon.belongsTo(CouponType, { foreignKey: "coupon_type_id" });
HomeLookBookSection.belongsTo(Collection, { foreignKey: "collection_id" });
Collection.hasMany(HomeLookBookSection, { foreignKey: "collection_id" });

module.exports = HomeLookBookSection;

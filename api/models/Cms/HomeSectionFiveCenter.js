const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");
const Collection = require("../Product/Collection");
const hooks = {};

const tableName = "home_section_five_center";

const HomeSectionFiveCenter = sequelize.define(
    "HomeSectionFiveCenter",
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
        is_deleted: {
            type: Sequelize.BOOLEAN,
        },
        deleted_at: {
            type: Sequelize.DATE,
        },
    },
    { hooks, tableName }
);


module.exports = HomeSectionFiveCenter;


HomeSectionFiveCenter.belongsTo(Collection, { foreignKey: "collection_id" });
Collection.hasMany(HomeSectionFiveCenter, { foreignKey: "collection_id" });




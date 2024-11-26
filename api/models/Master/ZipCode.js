const Sequelize = require('sequelize');

const sequelize = require('../../../config/database');

const City = require('./City');
const Country = require('./Country');
const Province = require('./Province');

const hooks = {};

const tableName = 'master_zipcode';

const ZipCode = sequelize.define('ZipCode', {
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
                msg: "Name cannot be empty"
            },
            async isUnique(value) {
                let whereClause = {};
                whereClause.is_deleted = false;
                if (value) {
                    whereClause.name = { [Sequelize.Op.iLike]: value }
                }
                if (this.id) {
                    whereClause.id = { [Sequelize.Op.ne]: this.id }
                }
                const existingUser = await ZipCode.findOne({
                    where: whereClause
                });
                if (existingUser) {
                    throw new Error('Name is already exist');
                }
            },
            // is: {
            //     args: /^[a-zA-Z\s-]+$/i,
            //     msg: 'Name must contain only alphabets, spaces, and hyphens',
            // },
            len: {
                args: [2, 10],
                msg: 'Name must be between 2 and 10 characters long',
            },
        },
    },

    city_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: City,
            key: 'id',
        },
        validate: {
            isInt: {
                args: true,
                msg: "Please enter valid city"
            },
            async checkCityId(value) {
                if (typeof value == "string") {
                    throw new Error('Please enter valid city');
                }
                const city = await City.findByPk(value);
                if (!city) {
                    throw new Error('Please enter valid city');
                }
            },
        },
    },
    province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Province,
            key: 'id',
        },
        validate: {
            isInt: {
                args: true,
                msg: "Please enter valid province"
            },
            async checkProvinceId(value) {
                if (typeof value == "string") {
                    throw new Error('Please enter valid province');
                }
                const province = await Province.findByPk(value);
                if (!province) {
                    throw new Error('Please enter valid province');
                }
            },
        },
    },
    country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Country,
            key: 'id',
        },
        validate: {
            isInt: {
                args: true,
                msg: "Please enter valid country"
            },
            async checkCountryId(value) {
                if (typeof value == "string") {
                    throw new Error('Please enter valid country');
                }
                const country = await Country.findByPk(value);
                if (!country) {
                    throw new Error('Please enter valid country');
                }
            },
        },
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
    },
    deleted_at: {
        type: Sequelize.DATE,
    }
}, { hooks, tableName });

module.exports = ZipCode;

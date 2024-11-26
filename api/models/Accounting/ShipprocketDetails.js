const Sequelize = require('sequelize');
const sequelize = require('../../../config/database');
const Logistics = require('../Logistics/Logistics');
const Invoice = require('./Invoice');
const hooks = {};

const tableName = 'product_ship_rocket_details';

const ShipRocketDetails = sequelize.define('ShipRocketDetails', {

    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Invoice,
            key: 'id',
        },
        validate: {
            isInt: {
                args: true,
                msg: "Please enter valid Invoice"
            },
            async checkInvoiceId(value) {
                if (typeof value == "string") {
                    throw new Error('Please enter valid Invoice');
                }
                const InvoiceData = await Invoice.findOne({
                    where: {
                        is_deleted: false,
                        id: value
                    }
                });
                if (!InvoiceData) {
                    throw new Error('Please enter valid Invoice');
                }
            },
        },
    },
    ewaybill_no: {
        type: Sequelize.STRING
    },
    order_id: {
        type: Sequelize.STRING
    },
    shipping_id: {
        type: Sequelize.STRING
    },
    channel_id: {
        type: Sequelize.STRING
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
    },
    deleted_at: {
        type: Sequelize.DATE,
    }
}, { hooks, tableName });
Invoice.hasMany(ShipRocketDetails, {
    foreignKey: "invoice_id",
})
ShipRocketDetails.belongsTo(Invoice, {
    foreignKey: "invoice_id",
});
module.exports = ShipRocketDetails;

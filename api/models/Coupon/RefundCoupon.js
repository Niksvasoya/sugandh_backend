const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const User = require("../User/User");
const Invoice = require("../Accounting/Invoice");

const hooks = {};

const tableName = "refund_coupon";

const RefuncCoupon = sequelize.define(
    "CouponType",
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        coupon_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        amount: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Amount is required",
                },
                isDecimal: {
                    msg: "Amount should be a decimal number",
                },
                min: {
                    args: [0],
                    msg: "Amount should be greater than or equal to 0",
                },
                max: {
                    args: [9999999.99],
                    msg: "Amount should be less than or equal to 9999999.99",
                },
            },
        },
        invoice_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Invoice,
                key: "id",
            },
        },
        isused: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        expire_date: {
            type: Sequelize.DATE,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
    },
    { hooks, tableName }
);

User.hasMany(RefuncCoupon, {
    foreignKey: "user_id",
});
RefuncCoupon.belongsTo(User, {
    foreignKey: "user_id",
});
Invoice.hasMany(RefuncCoupon, {
    foreignKey: "invoice_id",
});
RefuncCoupon.belongsTo(Invoice, {
    foreignKey: "invoice_id",
});

module.exports = RefuncCoupon;

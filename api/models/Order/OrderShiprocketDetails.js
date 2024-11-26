const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Product = require("../Product/Product");
const ProductVariants = require("../Product/ProductVariants");
const User = require("../User/User");

const hooks = {};

const tableName = "order_shiprocket_details";

const OrderShiprocketDetails = sequelize.define(
  "OrderShiprocketDetails",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    product_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    product_variant_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: ProductVariants,
        key: "id",
      },
    },
    order_id: {
      type: Sequelize.STRING,
    },
    order_date: {
      type: Sequelize.STRING,
    },
    pickup_location: {
      type: Sequelize.STRING,
    },
    channel_id: {
      type: Sequelize.INTEGER,
    },
    comment: {
      type: Sequelize.STRING,
    },
    reseller_name: {
      type: Sequelize.STRING,
    },
    company_name: {
      type: Sequelize.STRING,
    },
    billing_customer_name: {
      type: Sequelize.STRING,
    },
    billing_last_name: {
      type: Sequelize.STRING,
    },
    billing_address: {
      type: Sequelize.STRING,
    },
    billing_address_2: {
      type: Sequelize.STRING,
    },
    billing_city: {
      type: Sequelize.STRING,
    },
    billing_pincode: {
      type: Sequelize.INTEGER,
    },
    billing_state: {
      type: Sequelize.STRING,
    },
    billing_country: {
      type: Sequelize.STRING,
    },
    billing_email: {
      type: Sequelize.STRING,
    },
    billing_phone: {
      type: Sequelize.INTEGER,
    },
    billing_alternate_phone: {
      type: Sequelize.INTEGER,
    },
    shipping_is_billing: {
      type: Sequelize.BOOLEAN,
    },
    shipping_customer_name: {
      type: Sequelize.STRING,
    },
    shipping_last_name: {
      type: Sequelize.STRING,
    },
    shipping_address: {
      type: Sequelize.STRING,
    },
    shipping_address_2: {
      type: Sequelize.STRING,
    },
    billing_isd_code: {
      type: Sequelize.STRING,
    },
    shipping_city: {
      type: Sequelize.STRING,
    },
    shipping_pincode: {
      type: Sequelize.INTEGER,
    },
    shipping_country: {
      type: Sequelize.STRING,
    },
    shipping_state: {
      type: Sequelize.STRING,
    },
    shipping_email: {
      type: Sequelize.STRING,
    },
    shipping_phone: {
      type: Sequelize.INTEGER,
    },
    longitude: {
      type: Sequelize.DECIMAL,
    },
    latitude: {
      type: Sequelize.DECIMAL,
    },
    order_items: {
      type: Sequelize.ARRAY(Sequelize.JSON),
    },
    payment_method: {
      type: Sequelize.STRING,
    },
    shipping_charges: {
      type: Sequelize.INTEGER,
    },
    giftwrap_charges: {
      type: Sequelize.INTEGER,
    },
    transaction_charges: {
      type: Sequelize.INTEGER,
    },
    total_discount: {
      type: Sequelize.INTEGER,
    },
    sub_total: {
      type: Sequelize.INTEGER,
    },
    length: {
      type: Sequelize.FLOAT,
    },
    breadth: {
      type: Sequelize.FLOAT,
    },
    height: {
      type: Sequelize.FLOAT,
    },
    weight: {
      type: Sequelize.FLOAT,
    },
    ewaybill_no: {
      type: Sequelize.STRING,
    },
    customer_gstin: {
      type: Sequelize.STRING,
    },
    invoice_number: {
      type: Sequelize.STRING,
    },
    order_type: {
      type: Sequelize.STRING,
    },
    checkout_shipping_method: {
      type: Sequelize.STRING,
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

module.exports = OrderShiprocketDetails;

const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Product = require("../Product/Product");
const ProductVariants = require("../Product/ProductVariants");
const TaxType = require("../Accounting/TaxType");
const Invoice = require("./Invoice");
const hooks = {};

const tableName = "invoice_details";

const InvoiceDetails = sequelize.define(
  "InvoiceDetails",
  {
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
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Invoice",
        },
        async checkInvoiceId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Invoice");
          }
          const InvoiceData = await Invoice.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!InvoiceData) {
            throw new Error("Please enter valid Invoice");
          }
        },
      },
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
        },
      },
    },
    product_variants_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: ProductVariants,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Product Variants",
        },
        async checkProductVariantsId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Product Variants");
          }
          const ProductVariantsData = await ProductVariants.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!ProductVariantsData) {
            throw new Error("Please enter valid Product Variants");
          }
        },
      },
    },
    tax_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: TaxType,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Tax Type",
        },
        async checkTaxTypeId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Tax Type");
          }
          const TaxTypeData = await TaxType.findOne({
            where: {
              is_deleted: false,
              id: value,
            },
          });
          if (!TaxTypeData) {
            throw new Error("Please enter valid Tax Type");
          }
        },
      },
    },
    gst_value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "GST value is required",
        },
        isNumeric: {
          msg: "GST value should be a number",
        },
        min: {
          args: [0],
          msg: "GST value should be greater than or equal to 0",
        },
        max: {
          args: [100],
          msg: "GST value should be less than or equal to 100",
        },
      },
    },
    product_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Product name is required",
        },
        is: {
          args: /^[a-zA-Z\s-]+$/,
          msg: "Product name should only contain alphabets, spaces and hyphens",
        },
        len: {
          args: [2, 50],
          msg: "Product name should be between 2 to 50 characters long",
        },
      },
    },
    color: {
      type: Sequelize.STRING,
    },
    size: {
      type: Sequelize.STRING,
    },
    mrp: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "MRP is required",
        },
        isDecimal: {
          msg: "MRP should be a decimal number",
        },
        min: {
          args: [0],
          msg: "MRP should be greater than or equal to 0",
        },
        max: {
          args: [9999999.99],
          msg: "MRP should be less than or equal to 9999999.99",
        },
      },
    },
    main_mrp: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "MRP is required",
        },
        isDecimal: {
          msg: "MRP should be a decimal number",
        },
        min: {
          args: [0],
          msg: "MRP should be greater than or equal to 0",
        },
        max: {
          args: [9999999.99],
          msg: "MRP should be less than or equal to 9999999.99",
        },
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Quantity is required",
        },
        isInt: {
          msg: "Quantity must be an integer",
        },
        min: {
          args: [1],
          msg: "Quantity should be greater than or equal to 1",
        },
        max: {
          args: [99999],
          msg: "Quantity should be less than or equal to 99999",
        },
      },
    },
    hsn_code: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "HSN code is required",
        },
        isNumeric: {
          msg: "HSN code should be a number",
        },
        len: {
          args: [6],
          msg: "HSN code should be exactly 6 digits long",
        },
      },
    },
    // final_total_amount: {
    //     type: Sequelize.DOUBLE,
    // },
    total_amount: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        notNull: { msg: "Total amount cannot be null" },
        min: {
          args: [0],
          msg: "Total amount must be greater than or equal to 0",
        },
      },
    },
    cgst_amount: {
      type: Sequelize.DOUBLE,
      validate: {
        min: {
          args: [0],
          msg: "CGST amount must be greater than or equal to 0",
        },
      },
    },
    sgst_amount: {
      type: Sequelize.DOUBLE,
      validate: {
        min: {
          args: [0],
          msg: "SGST amount must be greater than or equal to 0",
        },
      },
    },
    igst_amount: {
      type: Sequelize.DOUBLE,
      validate: {
        min: {
          args: [0],
          msg: "IGST amount must be greater than or equal to 0",
        },
      },
    },
    cgst_value: {
      type: Sequelize.INTEGER,
      validate: {
        min: {
          args: [0],
          msg: "CGST value must be greater than or equal to 0",
        },
      },
    },
    sgst_value: {
      type: Sequelize.INTEGER,
      validate: {
        min: {
          args: [0],
          msg: "SGST value must be greater than or equal to 0",
        },
      },
    },
    igst_value: {
      type: Sequelize.INTEGER,
      validate: {
        min: {
          args: [0],
          msg: "IGST value must be greater than or equal to 0",
        },
      },
    },
    // gst_percent: {
    //     type: Sequelize.DECIMAL
    // },
    is_deleted: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
    image:{
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
  { hooks, tableName }
);
Invoice.hasMany(InvoiceDetails, {
  foreignKey: "invoice_id",
});
InvoiceDetails.belongsTo(Invoice, {
  foreignKey: "invoice_id",
});
Product.hasMany(InvoiceDetails, {
  foreignKey: "product_id",
});
InvoiceDetails.belongsTo(Product, {
  foreignKey: "product_id",
});
module.exports = InvoiceDetails;

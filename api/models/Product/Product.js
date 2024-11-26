const Sequelize = require("sequelize");
const sequelize = require("../../../config/database");
const Category = require("./Category");
const HsnCode = require("./HsnCode");
const SubCategory = require("./SubCategory");
const Brand = require("./Brand");
const Collection = require("./Collection");
// const Supplier = require('../Supplier/Supplier');
const SleeveType = require("./SleeveType");
const NeckType = require("./NeckType");
const Occasion = require("./Occasion");
const FabricCare = require("./FabricCare");
const Fabric = require("./Fabric");
const TaxType = require("../Accounting/TaxType");
const hooks = {};

const tableName = "product";

const Product = sequelize.define(
  "Product",
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
        is: {
          args: /^[a-zA-Z\s-]+$/i,
          msg: "Name must contain only alphabets, spaces, and hyphens",
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
          const existingUser = await Product.findOne({
            where: whereClause,
          });
          if (existingUser) {
            throw new Error("Name is already exist");
          }
        },
        len: {
          args: [2, 50],
          msg: "Name must be between 2 and 50 characters long",
        },
      },
    },
    category_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: Category,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Category",
        },
        async checkCategoryId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Category");
          }
          const CategoryData = await Category.findByPk(value);
          if (!CategoryData) {
            throw new Error("Please enter valid Category");
          }
        },
      },
    },
    description: {
      type: Sequelize.STRING(4000),
      allowNull: true,
      validate: {
        len: {
          args: [0, 4000],
          msg: "Description must be at most 4000 characters long",
        },
      },
    },
    sub_category_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: SubCategory,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Sub Category",
        },
        async checkSubCategoryId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Sub Category");
          }
          const SubCategoryData = await SubCategory.findByPk(value);
          if (!SubCategoryData) {
            throw new Error("Please enter valid Sub Category");
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
          if (typeof value == "string") {
            throw new Error("Please enter valid Collection");
          }
          const CollectionData = await Collection.findByPk(value);
          if (!CollectionData) {
            throw new Error("Please enter valid Collection");
          }
        },
      },
    },
    brand_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: Brand,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Brand",
        },
        async checkBrandId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Brand");
          }
          const BrandData = await Brand.findByPk(value);
          if (!BrandData) {
            throw new Error("Please enter valid Brand");
          }
        },
      },
    },
    // unit_of_measurement_id: {
    //     type: Sequelize.BIGINT,
    //     allowNull: false,
    //     references: {
    //         model: UnitOfMeasurement,
    //         key: 'id'
    //     }
    // },
    product_number: {
      type: Sequelize.BIGINT,
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Product number",
        },
      },
    },
    sku: {
      type: Sequelize.STRING,
    },
    hsn_code_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: HsnCode,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Hsn Code",
        },
        async checkHsnCodeId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Hsn Code");
          }
          const HsnCodeData = await HsnCode.findByPk(value);
          if (!HsnCodeData) {
            throw new Error("Please enter valid Hsn Code");
          }
        },
      },
    },
    // supplier_id: {
    //     type: Sequelize.BIGINT,
    //     allowNull: true,
    //     references: {
    //         model: Supplier,
    //         key: 'id'
    //     }
    // },
    thumbnail_image: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Thumbnail Image must be a valid URL",
        },
      },
    },
    // image: {
    //     type: Sequelize.ARRAY(Sequelize.STRING)
    // },
    fabric_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: Fabric,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Fabric",
        },
        async checkFabricId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Fabric");
          }
          const FabricData = await Fabric.findByPk(value);
          if (!FabricData) {
            throw new Error("Please enter valid Fabric");
          }
        },
      },
    },
    fabric_care_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: FabricCare,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid FabricCare",
        },
        async checkFabricCareId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid FabricCare");
          }
          const FabricCareData = await FabricCare.findByPk(value);
          if (!FabricCareData) {
            throw new Error("Please enter valid FabricCare");
          }
        },
      },
    },
    occasion_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: Occasion,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Occasion",
        },
        async checkOccasionId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Occasion");
          }
          const OccasionData = await Occasion.findByPk(value);
          if (!OccasionData) {
            throw new Error("Please enter valid Occasion");
          }
        },
      },
    },
    neck_type_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: NeckType,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid Neck Type",
        },
        async checkNeckTypeId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid Neck Type");
          }
          const NeckTypeData = await NeckType.findByPk(value);
          if (!NeckTypeData) {
            throw new Error("Please enter valid Neck Type");
          }
        },
      },
    },
    sleeve_type_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: SleeveType,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "Please enter valid SleeveType",
        },
        async checkSleeveTypeId(value) {
          if (typeof value == "string") {
            throw new Error("Please enter valid SleeveType");
          }
          const SleeveTypeData = await SleeveType.findByPk(value);
          if (!SleeveTypeData) {
            throw new Error("Please enter valid SleeveType");
          }
        },
      },
    },
    tax_type_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
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
          const TaxTypeData = await TaxType.findByPk(value);
          if (!TaxTypeData) {
            throw new Error("Please enter valid Tax Type");
          }
        },
      },
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_show_on_website: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid value show on website");
          }
        },
      },
    },
    is_trending_product: {
      type: Sequelize.BOOLEAN,
      validate: {
        isValidBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Please enter valid value trending product");
          }
        },
      },
    },
    included_items: {
      type: Sequelize.STRING,
    },
    garment_length: {
      type: Sequelize.STRING,
    },
    garment_fit: {
      type: Sequelize.STRING,
    },
    no_of_components: {
      type: Sequelize.INTEGER,
    },
    seo_title: {
      type: Sequelize.STRING,
    },
    seo_keywords: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      validate: {
        isArrayOfStrings(value) {
          if (!Array.isArray(value)) {
            throw new Error("seo keywords must be an array");
          }
          for (const item of value) {
            if (typeof item !== "string") {
              throw new Error("seo keywords array must contain only strings");
            }
          }
        },
      },
    },
    seo_description: {
      type: Sequelize.STRING,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  },
  { hooks, tableName },
);
Category.hasMany(Product, {
  foreignKey: "category_id",
});
Product.belongsTo(Category, {
  foreignKey: "category_id",
});
SubCategory.hasMany(Product, {
  foreignKey: "sub_category_id",
});
Product.belongsTo(SubCategory, {
  foreignKey: "sub_category_id",
});
Fabric.hasMany(Product, {
  foreignKey: "fabric_id",
});
Product.belongsTo(Fabric, {
  foreignKey: "fabric_id",
});
Collection.hasMany(Product, {
  foreignKey: "collection_id",
});
Product.belongsTo(Collection, {
  foreignKey: "collection_id",
});
FabricCare.hasMany(Product, {
  foreignKey: "fabric_care_id",
});
Product.belongsTo(FabricCare, {
  foreignKey: "fabric_care_id",
});
Occasion.hasMany(Product, {
  foreignKey: "occasion_id",
});
Product.belongsTo(Occasion, {
  foreignKey: "occasion_id",
});
NeckType.hasMany(Product, {
  foreignKey: "neck_type_id",
});
Product.belongsTo(NeckType, {
  foreignKey: "neck_type_id",
});
SleeveType.hasMany(Product, {
  foreignKey: "sleeve_type_id",
});
Product.belongsTo(SleeveType, {
  foreignKey: "sleeve_type_id",
});
HsnCode.hasMany(Product, {
  foreignKey: "hsn_code_id",
});
Product.belongsTo(HsnCode, {
  foreignKey: "hsn_code_id",
});
TaxType.hasMany(Product, {
  foreignKey: "tax_type_id",
});
Product.belongsTo(TaxType, {
  foreignKey: "tax_type_id",
});
Brand.hasMany(Product, {
  foreignKey: "brand_id",
})
Product.belongsTo(Brand, {
  foreignKey: "brand_id",
});
module.exports = Product;

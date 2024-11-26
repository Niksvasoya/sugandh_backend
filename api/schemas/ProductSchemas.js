const HsnCodeSchemas = {
  validator: {
    code: "required|minLength:2|maxLength:100|isUnique:Product/HsnCode,code",
    description: `string|maxLength:2048`,
    type: "string",
    cgst_percent: "decimal",
    sgst_percent: "decimal",
    igst_percent: "decimal",
    cess_percent: "decimal",
  },
  niceNames: {
    name: `Name`,
  },
};
const CategorySchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/Category,name|alphaspace",
    description: `string|maxLength:4000`,
    thumbnail_image: "string",
    // 'hsn_code_id': 'required|integer|isExists:Product/HsnCode',
    // 'profit_margin': 'decimal'
  },
  niceNames: {
    name: `Name`,
    hsn_code_id: "hsn_code",
  },
};
const SubCategorySchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/SubCategory,name|string",
    description: `string|maxLength:4000`,
    category_id: "required|integer|isExists:Product/Category",
    thumbnail_image: "string",
  },
  niceNames: {
    name: `Name`,
    category_id: "category",
  },
};
const CartSchemas = {
  validator: {
    // 'name': 'required|minLength:2|maxLength:100|isUnique:Product/SubCategory,name|alphaspace',
    // 'description': `string|maxLength:4000`,
    // 'category_id': 'required|integer|isExists:Product/Category',
    // 'thumbnail_image': 'string'
  },
  niceNames: {
    name: `Name`,
    category_id: "category",
  },
};
const WishListSchemas = {
  validator: {
    // 'name': 'required|minLength:2|maxLength:100|isUnique:Product/SubCategory,name|alphaspace',
    // 'description': `string|maxLength:4000`,
    // 'category_id': 'required|integer|isExists:Product/Category',
    // 'thumbnail_image': 'string'
  },
  niceNames: {
    name: `Name`,
    category_id: "category",
  },
};
const BrandSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/Brand,name|alphaspace",
    description: `string|maxLength:4000`,
    thumbnail_image: "string",
  },
  niceNames: {
    name: `Name`,
  },
};

const FabricSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/Fabric,name|alphaspace",
    description: `string|maxLength:4000`,
    thumbnail_image: "string",
  },
  niceNames: {
    name: `Name`,
  },
};
const FabricCareSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/FabricCare,name|alphaspace",
    description: `string|maxLength:4000`,
    thumbnail_image: "string",
  },
  niceNames: {
    name: `Name`,
  },
};
const OccasionSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/Occasion,name|alphaspace",
    description: `string|maxLength:4000`,
    thumbnail_image: "string",
  },
  niceNames: {
    name: `Name`,
  },
};
const SleeveTypeSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/SleeveType,name|string",
    description: `string|maxLength:4000`,
    thumbnail_image: "string",
  },
  niceNames: {
    name: `Name`,
  },
};
const NeckTypeSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/NeckType,name|alphaspace",
    description: `string|maxLength:4000`,
    thumbnail_image: "string",
  },
  niceNames: {
    name: `Name`,
  },
};

const CollectionSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/Collection,name|string",
    description: `string|maxLength:4000`,
    thumbnail_image: "string",
    brand_id: "required|integer|isExists:Product/Brand",
  },
  niceNames: {
    name: `Name`,
    brand_id: "Brand",
  },
};
const UnitOfMeasurementSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/UnitOfMeasurement,name|alphaspace",
    description: `string|maxLength:4000`,
  },
  niceNames: {
    name: `Name`,
  },
};
const SizeSchemas = {
  validator: {
    name: "required|maxLength:100|isUnique:Product/Size,name|alphaspace",
    description: `string|maxLength:4000`,
  },
  niceNames: {
    name: `Name`,
  },
};
const ColorSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/Color,name|alphaspace",
    description: `string|maxLength:4000`,
  },
  niceNames: {
    name: `Name`,
  },
};
const ShippingDetailsSchemas = {
  validator: {
    length: "decimal",
    breadth: "decimal",
    height: "decimal",
    weight: "decimal",
    product_id: "required|integer",
    // 'description': `string|maxLength:4000`
  },
  niceNames: {
    name: `Name`,
  },
};

const ProductSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Product/Product,name|alphaspace",
    description: `string|maxLength:4000`,
    category_id: "required|integer|isExists:Product/Category",
    sub_category_id: "required|integer|isExists:Product/SubCategory",
    brand_id: "required|integer|isExists:Product/Brand",
    collection_id: "required|integer|isExists:Product/Collection",
    // 'supplier_id': 'required|integer|isExists:Supplier/Supplier',
    // 'unit_of_measurement_id': 'integer|isExists:Product/UnitOfMeasurement',
    // 'is_single_barcode': 'boolean',
    // 'is_add_stock': 'boolean',
    // 'is_generate_barcode': 'boolean',
    // 'inclusive_tax': 'boolean',
    // 'exclusive_tax': 'boolean',
    hsn_code_id: "required|integer|isExists:Product/HsnCode",
    fabric_id: "required|integer|isExists:Product/Fabric",
    fabric_care_id: "required|integer|isExists:Product/FabricCare",
    occasion_id: "required|integer|isExists:Product/Occasion",
    neck_type_id: "required|integer|isExists:Product/NeckType",
    sleeve_type_id: "required|integer|isExists:Product/SleeveType",
    // 'image': 'array',
    thumbnail_image: "string",
    is_show_on_website: "boolean",
    tax_type_id: "integer|required|isExists:Accounting/TaxType",
  },
  niceNames: {
    name: `Name`,
    category_id: "Category",
    sub_category_id: "SubCategory",
    brand_id: "Brand",
    unit_of_measurement_id: "UnitOfMeasurement",
    hsn_code_id: "HsnCode",
    fabric_id: ":Fabric",
    fabric_care_id: ":FabricCare",
    occasion_id: ":Occasion",
    neck_type_id: ":NeckType",
    sleeve_type_id: ":SleeveType",
    is_show_on_website: "show on website",
    tax_type_id: "TaxType",
  },
};

const ProductVariantsSchemas = {
  validator: {
    product_id: "integer|required|isExists:Product/Product",
    mrp: "decimal",
    purchase_rate: "decimal",
    image: "array",
    sell_rate: "decimal",
    discount: "decimal",
    color_id: "integer|required|isExists:Product/Color",
    size_id: "integer|required|isExists:Product/Size",
  },
  niceNames: {
    product_id: `product`,
    color_id: "Color",
    size_id: "Size",
  },
};

module.exports = {
  HsnCodeSchemas,
  CategorySchemas,
  SubCategorySchemas,
  BrandSchemas,
  UnitOfMeasurementSchemas,
  ProductSchemas,
  SizeSchemas,
  ColorSchemas,
  CollectionSchemas,
  FabricSchemas,
  OccasionSchemas,
  SleeveTypeSchemas,
  NeckTypeSchemas,
  FabricCareSchemas,
  CartSchemas,
  ShippingDetailsSchemas,
  ProductVariantsSchemas,
  WishListSchemas,
};

const PropertyCategorySchemas = {
  validator: {
    name: "required|alphaspace|minLength:2|maxLength:50|isUnique:Property/PropertyCategory,name",
    description: "string|maxLength:255",
  },
  niceNames: {
    name: "Name",
  },
};

const PropertySchemas = {
  validator: {
    name: "required|alphaspace|minLength:2|maxLength:50|isUnique:Property/Property,name",
    property_category_id: "integer|isExists:Property/PropertyCategory",
    contact_person_name: "alphaspace",
    email_id: "required|email|isUnique:Property/Property,email_id",
    address_line_1: "required|string",
    address_line_2: "string",
    city_id: "required|integer|isExists:Master/City",
    country_id: "required|integer|isExists:Master/Country",
    province_id: "required|integer|isExists:Master/Province",
    zipcode_id: "required|integer",
    //'zipcode_id': 'required|integer|isExists:Master/ZipCode',
    primary_contact_number:
      "required|integer|isUnique:Property/Property,primary_contact_number",
    primary_contact_id: "integer|isExists:Master/Country",
    alternate_contact_number:
      "integer|isUnique:Property/Property,alternate_contact_number",
    alternate_contact_id: "integer|isExists:Master/Country",
    is_primary_number_whatsapp: "boolean",
    is_alternate_number_whatsapp: "boolean",
  },
  niceNames: {
    name: "Name",
    city_id: "city",
    country_id: "country",
    province_id: "province",
    zipcode_id: "zipcode",
  },
};

const StockSchemas = {
  validator: {
    // 'name': 'required|alphaspace|minLength:2|maxLength:50|isUnique:Property/PropertyCategory,name',
    // 'description': 'string|maxLength:255'
    name: "string",
  },
  niceNames: {
    name: "Name",
  },
};
const EmployeeMappingSchemas = {
  validator: {
    // 'name': 'required|alphaspace|minLength:2|maxLength:50|isUnique:Property/PropertyCategory,name',
    // 'description': 'string|maxLength:255'
    name: "string",
  },
  niceNames: {
    name: "Name",
  },
};

module.exports = {
  PropertyCategorySchemas,
  PropertySchemas,
  StockSchemas,
  EmployeeMappingSchemas,
};

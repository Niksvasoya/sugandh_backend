const SupplierSchemas = {
  validator: {
    name: "required|alphaspace|minLength:2|maxLength:50|isUnique:Supplier/Supplier,name",
    gst_number: "string",
    contact_person_name: "alphaspace",
    email_id: "required|email|isUnique:Supplier/Supplier,email_id",
    address_line_1: "required|string",
    address_line_2: "string",
    city_id: "required|integer|isExists:Master/City",
    country_id: "required|integer|isExists:Master/Country",
    province_id: "required|integer|isExists:Master/Province",
    zipcode_id: "required|string",
    //'zipcode_id': 'required|integer|isExists:Master/ZipCode',
    primary_contact_number:
      "required|integer|isUnique:Supplier/Supplier,primary_contact_number",
    primary_contact_id: "integer|isExists:Master/Country",
    alternate_contact_number:
      "integer|isUnique:Supplier/Supplier,alternate_contact_number",
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
const SupplierBankDetailsSchemas = {
  validator: {
    name: "required|alphaspace|minLength:2|maxLength:50|isUnique:Supplier/Supplier,name",
    supplier_id: "required|integer|isExists:Supplier/Supplier",
    ifsc_code: "required|string",
    branch_name: "required|string",
    account_number: "required|string",
    account_type: "required|string",
    remark: "string",
  },
  niceNames: {
    name: "Name",
    supplier_id: "Supplier",
  },
};

module.exports = {
  SupplierSchemas,
  SupplierBankDetailsSchemas,
};

const UserRoleSchemas = {
  validator: {
    name: "required|alphaspace|minLength:2|maxLength:50|isUnique:User/UserRole,name",
    description: "string|maxLength:255",
  },
  niceNames: {
    name: "Name",
  },
};

const UserAccountStatusSchemas = {
  validator: {
    name: "required|alphaspace|minLength:2|maxLength:50|isUnique:User/UserAccountStatus,name",
    description: "string|maxLength:255",
  },
  niceNames: {
    name: "Name",
  },
};
const UserCardDetailsSchemas = {
  validator: {
    user_id: "required|integer|isExists:User/User",
    card_number: "required|integer",
    exp_month: "required|integer",
    exp_year: "required|integer",
    cvv: "required|integer",
  },
  niceNames: {
    user_id: "user",
  },
};
const UserTransactionSchemas = {
  validator: {
    user_id: "required|integer|isExists:User/User",
    amount: "",
    exp_year: "required|integer",
    cvv: "required|integer",
  },
  niceNames: {
    user_id: "user",
  },
};
const UserSchemas = {
  validator: {
    user_role_id: "required|integer|isExists:User/UserRole",
    user_profile_image: "url",
    first_name: "required|alphaspace|minLength:2|maxLength:50",
    last_name: "required|alphaspace|minLength:2|maxLength:50",
    is_web_signin: "boolean",
    gender: "boolean",
    birth_time: "string",
    primary_contact_number:
      "required|integer|isUnique:User/User,primary_contact_number",
    secondary_contact_number: "integer",
    primary_number_whatsapp: "boolean",
    email_id: "required|email|isUnique:User/User,email_id",
    address_line_1: "string",
    address_line_2: "string",
    city_id: "integer|isExists:Master/City",
    country_id: "integer|isExists:Master/Country",
    province_id: "integer|isExists:Master/Province",
    zipcode_id: "integer",
    // 'zipcode_id': 'integer|isExists:Master/ZipCode',
    instagram_id: "string",
    facebook_id: "string",
    twitter_id: "string",
    password: "string",
    is_location_detail: "boolean",
    location_details: "requiredIf:is_location_detail,true|array",
    "location_details.*.address_line_1": "required|string",
    "location_details.*.address_line_2": "string",
    "location_details.*.city_id": "required|integer|isExists:Master/City",
    "location_details.*.country_id": "required|integer|isExists:Master/Country",
    "location_details.*.province_id":
      "required|integer|isExists:Master/Province",
    "location_details.*.zipcode_id": "required|integer|isExists:Master/ZipCode",
    is_device_detail: "boolean",
    device_details: "requiredIf:is_device_detail,true|array",
    "device_details.*.device_type": "string",
    "device_details.*.device_name": "string",
    "device_details.*.ip_address": "string",
    "device_details.*.device_sn": "string",
    "device_details.*.mac_address": "string",
    "device_details.*.model_number": "string",
    "device_details.*.model_name": "string",
    "device_details.*.operating_system": "string",
  },
  niceNames: {
    first_name: "First Name",
    city_id: "city",
    country_id: "country",
    province_id: "province",
    zipcode_id: "zipcode",
    user_role_id: "user role",
    account_status: "account status",
    "location_details.*.address_line_1": "secondary address_line_1",
    "location_details.*.address_line_2": "secondary address_line_2",
    "location_details.*.city_id": "secondary city",
    "location_details.*.country_id": "secondary country",
    "location_details.*.province_id": "secondary province",
    "location_details.*.zipcode_id": "secondary zipcode",
  },
};
const UserLocationDetailsSchemas = {
  validator: {
    user_id: "required|integer|isExists:User/User",
    first_name: "required|alphaspace|minLength:2|maxLength:50",
    last_name: "required|alphaspace|minLength:2|maxLength:50",
    primary_contact_number: "required|integer",
    email_id: "required|email|isUnique:User/User,email_id",
    address_line_1: "string",
    address_line_2: "string",
    city_id: "integer|isExists:Master/City",
    country_id: "integer|isExists:Master/Country",
    province_id: "integer|isExists:Master/Province",
    zipcode: "string",
  },
  niceNames: {
    first_name: "First Name",
    city_id: "city",
    country_id: "country",
    province_id: "province",
    zipcode_id: "zipcode",
    user_id: "user",
  },
};

module.exports = {
  UserSchemas,
  UserRoleSchemas,
  UserAccountStatusSchemas,
  UserCardDetailsSchemas,
  UserTransactionSchemas,
  UserLocationDetailsSchemas,
};

const AccountTypeSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Accounting/AccountType,name|alphaspace",
    description: `string|maxLength:4000`,
  },
  niceNames: {
    name: `Name`,
  },
};
const PaymentStatusSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Accounting/PaymentStatus,name|alphaspace",
    description: `string|maxLength:4000`,
  },
  niceNames: {
    name: `Name`,
  },
};
const PaymentTypeSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Accounting/PaymentType,name|alphaspace",
    description: `string|maxLength:4000`,
  },
  niceNames: {
    name: `Name`,
  },
};
const PaymentSchemas = {
  validator: {
    name: "required",
    // 'name': 'required|minLength:2|maxLength:100|isUnique:Accounting/PaymentType,name|alphaspace',
    // 'description': `string|maxLength:4000`
  },
  niceNames: {
    name: `Name`,
  },
};
const TaxTypeSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Accounting/TaxType,name|alphaspace",
    description: `string|maxLength:4000`,
    value: "required|decimal",
  },
  niceNames: {
    name: `Name`,
  },
};
const ModeOfPaymentSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Accounting/ModeOfPayment,name|alphaspace",
    description: `string|maxLength:4000`,
  },
  niceNames: {
    name: `Name`,
  },
};
const InvoiceSchemas = {
  validator: {
    invoice_date: "string",
    payment_status: "required|boolean",
    is_transporter: "boolean",
    logistics_id: "integer|isExists:Logistics/Logistics",
    user_id: "required|integer|isExists:User/User",
    is_different_state: "boolean",
    invoice_details: "required|array",
    "invoice_details.*.product_id": "required|integer",
    "invoice_details.*.product_variants_id": "required|integer",
    "invoice_details.*.product_name": "required|string",
    "invoice_details.*.mrp": "required|numeric",
    "invoice_details.*.tax_type_id": "required|integer",
    "invoice_details.*.gst_value": "required|integer",
    "invoice_details.*.quantity": "required|integer|min:1",
    "invoice_details.*.hsn_code": "required|integer",
  },
  niceNames: {
    logistics_id: `logistics`,
    user_id: `user`,
    "invoice_details.*.product_id": "product",
    "invoice_details.*.product_variants_id": "product variants",
    "invoice_details.*.product_name": "product name",
    "invoice_details.*.mrp": "mrp",
    "invoice_details.*.tax_type_id": "tax type",
    "invoice_details.*.gst_value": "gst value",
    "invoice_details.*.quantity": "quantity",
    "invoice_details.*.hsn_code": "hsn code",
  },
};

const ShippingSchemas = {
  validator: {
    // invoice_date: 'string',
    // payment_status: 'required|boolean',
    // is_transporter: 'boolean',
    // logistics_id: 'integer|isExists:Logistics/Logistics',
    // user_id: 'required|integer|isExists:User/User',
    // is_different_state: 'boolean',
    // invoice_details: 'required|array',
    // 'invoice_details.*.product_id': 'required|integer',
    // 'invoice_details.*.product_variants_id': 'required|integer',
    // 'invoice_details.*.product_name': 'required|string',
    // 'invoice_details.*.mrp': 'required|numeric',
    // 'invoice_details.*.tax_type_id': 'required|integer',
    // 'invoice_details.*.gst_value': 'required|integer',
    // 'invoice_details.*.quantity': 'required|integer|min:1',
    // 'invoice_details.*.hsn_code': 'required|integer',
  },
  niceNames: {
    logistics_id: `logistics`,
    user_id: `user`,
    "invoice_details.*.product_id": "product",
    "invoice_details.*.product_variants_id": "product variants",
    "invoice_details.*.product_name": "product name",
    "invoice_details.*.mrp": "mrp",
    "invoice_details.*.tax_type_id": "tax type",
    "invoice_details.*.gst_value": "gst value",
    "invoice_details.*.quantity": "quantity",
    "invoice_details.*.hsn_code": "hsn code",
  },
};

module.exports = {
  AccountTypeSchemas,
  PaymentStatusSchemas,
  PaymentTypeSchemas,
  TaxTypeSchemas,
  ModeOfPaymentSchemas,
  PaymentSchemas,
  InvoiceSchemas,
  ShippingSchemas,
};

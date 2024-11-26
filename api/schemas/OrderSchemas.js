const OrderStatusSchemas = {
  validator: {
    name: "required|minLength:2|maxLength:100|isUnique:Order/OrderStatus,name|alphaspace",
    description: `string|maxLength:4000`,
  },
  niceNames: {
    name: `Name`,
  },
};
const OrderHistorySchemas = {
  validator: {
    // 'title': 'required|minLength:2|maxLength:100|isUnique:Order/OrderStatus,name|alphaspace',
    // 'description': `string|maxLength:4000`
    user_id: "integer|isExists:User/User",
    supplier_id: "integer|isExists:Supplier/Supplier",
    order_status_id: "integer|isExists:Order/OrderStatus",
    // 'product_variant_id': 'integer|isExists:Product/ProductVariants',
    date: "string",
    // 'razorpay_order_id': 'string',
    // 'razorpay_payment_id': 'string',
    // 'razorpay_signature': 'string',
    order_type: "boolean",
  },
  niceNames: {
    name: `Name`,
  },
};
const OrderSchemas = {
  validator: {
    user_id: "required|integer",
    supplier_id: "required|integer",
    date: "required|date",
    order_status_id: "required|integer",
    order_type: "required|boolean",
    "payment_details.razorpay_order_id": "required|string",
    "payment_details.razorpay_payment_id": "required|string",
    "payment_details.razorpay_signature": "required|string",
    is_shipping_address: "required|boolean",
    is_online_payment: "required|boolean",
    "billing_address.first_name": "required|string",
    "billing_address.last_name": "required|string",
    "billing_address.contact_number": "required|string",
    "billing_address.address_line_1": "required|string",
    "billing_address.address_line_2": "required|string",
    "billing_address.zipcode": "required|string",
    "billing_address.country": "required|integer",
    "billing_address.province": "required|integer",
    "billing_address.city": "required|integer",
    "shipping_address.first_name": "required|string",
    "shipping_address.last_name": "required|string",
    "shipping_address.contact_number": "required|string",
    "shipping_address.address_line_1": "required|string",
    "shipping_address.address_line_2": "required|string",
    "shipping_address.zipcode": "required|string",
    "shipping_address.country": "required|integer",
    "shipping_address.province": "required|integer",
    "shipping_address.city": "required|integer",
    "details.*.product_id": "required|integer",
    "details.*.product_variant_id": "required|integer",
  },
  niceNames: {
    name: `Name`,
    "billing_address.contact_number": "last_name",
    "details.*.product_id": "hello ",
  },
};
const OrderShiprocketDetailsSchemas = {
  validator: {
    user_id: "integer|isExists:User/User",
    product_id: "integer|isExists:Product/Product",
    product_variant_id: "integer|isExists:Product/ProductVariants",
  },
  niceNames: {
    name: `Name`,
  },
};

module.exports = {
  OrderStatusSchemas,
  OrderHistorySchemas,
  OrderShiprocketDetailsSchemas,
  OrderSchemas,
};

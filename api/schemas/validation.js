const { Validator } = require("node-input-validator");

const data = {
  // Your input data
};

const validator = new Validator(data, {
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
});

// Add dynamic message for all fields
for (const field in validator.fields) {
  if (validator.fields.hasOwnProperty(field)) {
    validator.addDynamicMessage(field, (attribute, rule, data) => {
      // Customize message here based on the field, rule and data
      return `${attribute} field validation failed for rule ${rule} with data ${data}`;
    });
  }
}

const validated = validator.check();

if (!validated) {
  console.log(validator.errors);
} else {
  console.log("hello");
}

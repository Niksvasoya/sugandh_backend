const InquirySchemas = {
  validator: {
    first_name: "required|alphaspace|minLength:2|maxLength:50",
    last_name: "required|alphaspace|minLength:2|maxLength:50",
    primary_contact_number: "required|integer",
    email_id: "email",
    message: "string",
  },
  niceNames: {
    first_name: "First Name",
  },
};

module.exports = {
  InquirySchemas,
};

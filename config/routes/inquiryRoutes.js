const inquiryRoutes = {
  // creating routes for Inquiry
  "GET /inquiry/get": "InquiryApi.get",
  "POST /inquiry/save": "InquiryApi.save",
  "POST /inquiry/delete": "InquiryApi.destroy",
};

module.exports = inquiryRoutes;

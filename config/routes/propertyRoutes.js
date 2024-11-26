const propertyRoutes = {
  // creating routes for Property Category
  "GET /property-category/get": "PropertyCategoryApi.get",
  "POST /property-category/save": "PropertyCategoryApi.save",
  "POST /property-category/delete": "PropertyCategoryApi.destroy",

  // creating routes for Property
  "GET /property/get": "PropertyApi.get",
  "POST /property/save": "PropertyApi.save",
  "POST /property/delete": "PropertyApi.destroy",

  // creating routes for Stock
  "GET /stock/get": "StockApi.get",
  "POST /stock/save": "StockApi.save",
  "POST /stock/transfer/save": "StockApi.transferStock",
  "POST /stock/delete": "StockApi.destroy",
  "GET /stock/update/100": "StockApi.update_stock",

  // creating routes for Stock
  "GET /employee-mapping/get": "EmployeeMappingApi.get",
  "POST /employee-mapping/save": "EmployeeMappingApi.save",
  "POST /employee-mapping/delete": "EmployeeMappingApi.destroy",
};

module.exports = propertyRoutes;

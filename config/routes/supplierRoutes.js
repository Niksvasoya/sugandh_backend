const supplierRoutes = {
  // creating routes for supplier
  "GET /supplier/get": "SupplierApi.get",
  "POST /supplier/save": "SupplierApi.save",
  "POST /supplier/delete": "SupplierApi.destroy",

  // creating routes for supplier bank details
  "GET /supplier/bank/get": "SupplierBankDetailsApi.get",
  "POST /supplier/bank/save": "SupplierBankDetailsApi.save",
  "POST /supplier/bank/delete": "SupplierBankDetailsApi.destroy",
};

module.exports = supplierRoutes;

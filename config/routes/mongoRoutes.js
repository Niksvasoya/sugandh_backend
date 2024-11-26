const mongoRoutes = {
  // block chain routes
  "POST /mine-block": "BlockChainApi.addBlock",
  "GET /get-block": "BlockChainApi.get",
  // 'GET /get-block/:id': 'BlockChainApi.getById',
  // 'PUT /mine-block/:id': 'BlockChainApi.updateBlock',

  // 'POST /payment/customer/create': 'PaymentApi.createCustomer',
  // 'POST /payment/account/create': 'PaymentApi.createAccount',
};

module.exports = mongoRoutes;

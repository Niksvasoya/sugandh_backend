const Routes = {
  "POST /user/wallet/update": "User/UserWalletApi.updateWallet",
  "POST /user/stripe/details/save": "User/UserWalletApi.saveStripeData",
  "GET /user/stripe/details/get": "User/UserWalletApi.getStripeData",
  "GET /user/wallet/get": "User/UserWalletApi.getWallet",

  "POST /user/transaction/save": "User/UserTransactionApi.save",
  "GET /user/transaction/get": "User/UserTransactionApi.get",
  "POST /user/transaction/delete": "User/UserTransactionApi.destroy",
};

module.exports = Routes;

const accountingRoutes = {
  // creating routes for account-type
  "GET /account-type/get": "AccountTypeApi.get",
  "POST /account-type/save": "AccountTypeApi.save",
  "POST /account-type/delete": "AccountTypeApi.destroy",

  // creating routes for Payment Status
  "GET /payment-status/get": "PaymentStatusApi.get",
  "POST /payment-status/save": "PaymentStatusApi.save",
  "POST /payment-status/delete": "PaymentStatusApi.destroy",

  // creating routes for Payment Type
  "GET /payment-type/get": "PaymentTypeApi.get",
  "POST /payment-type/save": "PaymentTypeApi.save",
  "POST /payment-type/delete": "PaymentTypeApi.destroy",

  // creating routes for Tax Type
  "GET /tax-type/get": "TaxTypeApi.get",
  "POST /tax-type/save": "TaxTypeApi.save",
  "POST /tax-type/delete": "TaxTypeApi.destroy",

  // creating routes for Tax Type
  "GET /mode-of-payment/get": "ModeOfPaymentApi.get",
  "POST /mode-of-payment/save": "ModeOfPaymentApi.save",
  "POST /mode-of-payment/delete": "ModeOfPaymentApi.destroy",

  // creating routes for Tax Type
  "GET /mode-of-payment/get": "ModeOfPaymentApi.get",
  "POST /mode-of-payment/save": "ModeOfPaymentApi.save",
  "POST /mode-of-payment/delete": "ModeOfPaymentApi.destroy",

  // creating routes for Tax Type
  "GET /invoice/get": "InvoiceApi.get",
  "POST /invoice/save": "InvoiceApi.save",
  "POST /invoice/delete": "InvoiceApi.destroy",
  "POST /invoice/getDataByUserId": "InvoiceApi.getDataByUserId",
  // "POST /invoice/status/update": "InvoiceApi.updateOrderStatus",
  // "POST /invoice/delivery/update": "InvoiceApi.updateDeliveryDate",
  "POST /invoice/shipping/details/update": "InvoiceApi.updateInvoice",
  "POST /invoice/shipping/details/delivered": "InvoiceApi.delivered",
  "POST /invoice/shipping/details/refund": "InvoiceApi.refund",
  "POST /invoice/shipping/details/cancel": "InvoiceApi.cancel",
  "POST /invoice/shipping/details/genrateCoupon": "InvoiceApi.genrateCoupon",
  "POST /invoice/shipping/details/genrateCreditPoint": "InvoiceApi.genrateCreditPoint",
  "POST /invoice/shipping/details/getCredit": "InvoiceApi.getCredit",
  "POST /invoice/shipping/details/getCoupon": "InvoiceApi.getCoupon",
  //
  // creating routes for Payment
  "POST /payment/save": "PaymentApi.save",
  "POST /payment/refund": "PaymentApi.refundAmount",

  "POST /payment/order/create": "PaymentApi.paymentRazorPay",
  "POST /payment/verification": "PaymentApi.paymentVerification",
  "POST /payment/refund": "PaymentApi.refundRazorPay",
  "GET /payment/order/get": "PaymentApi.getOrderByIdRazorPay",
  "GET /payment/order/payment/get": "PaymentApi.getPaymentByOrderIdRazorPay",
  "GET /payment/order/payment/details/get":
    "PaymentApi.getPaymentByPaymentIdRazorPay",

  // creating routes for Payment
  "POST /payment/save": "PaymentApi.save",
  "POST /payment/refund": "PaymentApi.refundAmount",

  "POST /shiprocket/order/save": "ShiprocketApi.save",
  "POST /shiprocket/order/cancel": "ShiprocketApi.cancel",
};

module.exports = accountingRoutes;

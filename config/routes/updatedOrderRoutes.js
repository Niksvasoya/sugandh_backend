const updatedOrderRoutes = {
  "GET /order/get/v2": "OrderApi.get",
  "POST /order/save/v2": "OrderApi.save",
  "POST /order/delete/v2": "OrderApi.destroy",
  "POST /order/save/razorpay/v2": "OrderApi.master_save",
  "GET /order/razorpay/validation/v2": "OrderApi.validate_order",

  "GET /order-item/get/v2": "OrderItemApi.get",
  "POST /order-item/save/v2": "OrderItemApi.save",
  "POST /order-item/delete/v2": "OrderItemApi.destroy",

  "GET /order-location/get/v2": "OrderLocationApi.get",
  "POST /order-location/save/v2": "OrderLocationApi.save",
  "POST /order-location/delete/v2": "OrderLocationApi.destroy",

  "GET /order-razorpay/get/v2": "OrderRazorPayApi.get",
  "POST /order-razorpay/save/v2": "OrderRazorPayApi.save",
  "POST /order-razorpay/delete/v2": "OrderRazorPayApi.destroy",

  "GET /order/status/get": "OrderStatusApi.get",
  "POST /order/status/save": "OrderStatusApi.save",
  "POST /order/status/delete": "OrderStatusApi.destroy",
};

module.exports = updatedOrderRoutes;

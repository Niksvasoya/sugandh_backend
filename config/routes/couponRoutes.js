const couponRoutes = {
  "GET /coupon/get": "CouponApi.get",
  "POST /coupon/save": "CouponApi.save",
  "POST /coupon/delete": "CouponApi.destroy",

  "POST /coupon/apply/product-variant":
    "CouponApi.apply_coupon_to_product_variant",
  "POST /coupon/apply/product-variant/forced":
    "CouponApi.apply_coupon_to_product_variant_forced",
  "POST /coupon/apply/product": "CouponApi.apply_coupon_to_product",
  "POST /coupon/apply/product/forced":
    "CouponApi.apply_coupon_to_product_forced",
  "POST /coupon/apply/category": "CouponApi.apply_coupon_to_category",
  "POST /coupon/apply/category/forced":
    "CouponApi.apply_coupon_to_category_forced",
  "POST /coupon/apply/subcategory": "CouponApi.apply_coupon_to_subcategory",
  "POST /coupon/apply/subcategory/forced":
    "CouponApi.apply_coupon_to_subcategory_forced",
  "POST /coupon/apply/collection": "CouponApi.apply_coupon_to_collection",
  "POST /coupon/apply/collection/forced":
    "CouponApi.apply_coupon_to_collection_forced",

  "GET /coupon-type/get": "CouponTypeApi.get",
  "POST /coupon-type/save": "CouponTypeApi.save",
  "POST /coupon-type/delete": "CouponTypeApi.destroy",

  "GET /discount-type/get": "DiscountTypeApi.get",
  "POST /discount-type/save": "DiscountTypeApi.save",
  "POST /discount-type/delete": "DiscountTypeApi.destroy",
  "POST /send-message": "DiscountTypeApi.sendMessage",
};

module.exports = couponRoutes;

const productRoutes = {
  // creating routes for Hsn Code
  "GET /hsn-code/get": "HsnCodeApi.get",
  "POST /hsn-code/save": "HsnCodeApi.save",
  "POST /hsn-code/delete": "HsnCodeApi.destroy",

  // creating routes for Category
  "GET /product/category/get": "CategoryApi.get",
  "POST /product/category/save": "CategoryApi.save",
  "POST /product/category/delete": "CategoryApi.destroy",

  // creating routes for Sub Category
  "GET /product/sub-category/get": "SubCategoryApi.get",
  "POST /product/sub-category/save": "SubCategoryApi.save",
  "POST /product/sub-category/delete": "SubCategoryApi.destroy",

  // creating routes for Brand
  "GET /product/brand/get": "BrandApi.get",
  "POST /product/brand/save": "BrandApi.save",
  "POST /product/brand/delete": "BrandApi.destroy",

  // creating routes for Collection
  "GET /product/collection/get": "CollectionApi.get",
  "POST /product/collection/save": "CollectionApi.save",
  "POST /product/collection/delete": "CollectionApi.destroy",
  "POST /product/collection/saveHeaderImg": "CollectionApi.saveHeaderImg",
  "POST /product/collection/saveShopHeaderImg": "CollectionApi.saveShopHeaderImg",
  "GET /product/collection/getCollectionHeaderImg": "CollectionApi.getCollectionHeaderImg",
  "GET /product/collection/getShopHeaderImg": "CollectionApi.getShopHeaderImg",

  // creating routes for UnitOfMeasurement
  "GET /unit-of-measurement/get": "UnitOfMeasurementApi.get",
  "POST /unit-of-measurement/save": "UnitOfMeasurementApi.save",
  "POST /unit-of-measurement/delete": "UnitOfMeasurementApi.destroy",

  // creating routes for size
  "GET /product/size/get": "SizeApi.get",
  "POST /product/size/save": "SizeApi.save",
  "POST /product/size/delete": "SizeApi.destroy",

  // creating routes for size
  "GET /product/color/get": "ColorApi.get",
  "POST /product/color/save": "ColorApi.save",
  "POST /product/color/delete": "ColorApi.destroy",

  // creating routes for Fabric
  "GET /product/fabric/get": "FabricApi.get",
  "POST /product/fabric/save": "FabricApi.save",
  "POST /product/fabric/delete": "FabricApi.destroy",

  // creating routes for Fabric Care
  "GET /product/fabric-care/get": "FabricCareApi.get",
  "POST /product/fabric-care/save": "FabricCareApi.save",
  "POST /product/fabric-care/delete": "FabricCareApi.destroy",

  // creating routes for Occasion
  "GET /product/occasion/get": "OccasionApi.get",
  "POST /product/occasion/save": "OccasionApi.save",
  "POST /product/occasion/delete": "OccasionApi.destroy",

  // creating routes for NeckType
  "GET /product/neck-type/get": "NeckTypeApi.get",
  "POST /product/neck-type/save": "NeckTypeApi.save",
  "POST /product/neck-type/delete": "NeckTypeApi.destroy",

  // creating routes for NeckType
  "GET /product/sleeve-type/get": "SleeveTypeApi.get",
  "POST /product/sleeve-type/save": "SleeveTypeApi.save",
  "POST /product/sleeve-type/delete": "SleeveTypeApi.destroy",

  // creating routes for Product
  "GET /product/get": "ProductApi.get",
  "POST /product/save": "ProductApi.save",
  "POST /product/delete": "ProductApi.destroy",
  "POST /product/multiple/image/save": "ProductApi.storeMultipleImage",
  "GET /product/search/get": "ProductApi.getByKeyword",
  "GET /product/get-product-stock-by-category": "ProductApi.getProduct",

  // creating routes for Product
  // 'GET /product/variant/get': 'ProductVariantsApi.get',
  "POST /product/variant/save": "ProductVariantsApi.save",
  "POST /product/variant/delete": "ProductVariantsApi.destroy",

  // creating routes for Product
  "GET /cart/get": "CartApi.get",
  "POST /cart/save": "CartApi.save",
  "POST /cart/delete": "CartApi.destroy",
  // 'POST /product/variant/delete': 'ProductApi.destroyVariants',

  // creating routes for shipping-details
  "GET /product/shipping-details/get": "ShippingDetailsApi.get",
  "POST /product/shipping-details/save": "ShippingDetailsApi.save",
  "POST /product/shipping-details/delete": "ShippingDetailsApi.destroy",

  // 'POST /product/bulk-import/save': 'BulkImportApi.save',

  "GET /wishlist/get": "WishListApi.get",
  "POST /wishlist/save": "WishListApi.save",
  "POST /wishlist/delete": "WishListApi.destroy",
};

module.exports = productRoutes;

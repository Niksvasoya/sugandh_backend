const mapRoutes = require("express-routes-mapper");
const privateRoutes = require("./routes/privateRoutes");
const masterRoutes = require("./routes/masterRoutes");
const usersRoutes = require("./routes/usersRoutes");
const productRoutes = require("./routes/productRoutes");
const accountingRoutes = require("./routes/accountingRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const companyRoutes = require("./routes/companyRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const blogRoutes = require("./routes/blogRoutes");
const logisticsRoutes = require("./routes/logisticsRoutes");
const reSellerRoutes = require("./routes/resellerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const mongoRoutes = require("./routes/mongoRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cmsRoutes = require("./routes/cmsRoutes");
const updatedOrderRoutes = require("./routes/updatedOrderRoutes");
const couponRoutes = require("./routes/couponRoutes");

const config = {
  migrate: true,
  mappedAuthRoutes: mapRoutes(privateRoutes, "api/controllers/"),
  mappedMasterRoutes: mapRoutes(masterRoutes, "api/controllers/Master/"),
  mappedUserRoutes: mapRoutes(usersRoutes, "api/controllers/User/"),
  mappedProductRoutes: mapRoutes(productRoutes, "api/controllers/Product/"),
  mappedAccountingRoutes: mapRoutes(
    accountingRoutes,
    "api/controllers/Accounting/"
  ),
  mappedSupplierRoutes: mapRoutes(supplierRoutes, "api/controllers/Supplier/"),
  mappedCompanyRoutes: mapRoutes(companyRoutes, "api/controllers/Company/"),
  mappedPropertyRoutes: mapRoutes(propertyRoutes, "api/controllers/Property/"),
  mappedBlogRoutes: mapRoutes(blogRoutes, "api/controllers/Blog/"),
  mappedLogisticsRoutes: mapRoutes(
    logisticsRoutes,
    "api/controllers/Logistics/"
  ),
  mappedReSellerRoutes: mapRoutes(reSellerRoutes, "api/controllers/ReSeller/"),
  mappedInquiryRoutes: mapRoutes(inquiryRoutes, "api/controllers/Inquiry/"),
  mappedOrderRoutes: mapRoutes(orderRoutes, "api/controllers/Order/"),
  mappedMongoRoutes: mapRoutes(mongoRoutes, "api/controllers/"),
  mappedCmsRoutes: mapRoutes(cmsRoutes, "api/controllers/Cms/"),
  mappedUpdatedOrderRoutes: mapRoutes(
    updatedOrderRoutes,
    "api/controllers/UpdatedOrder/"
  ),
  mappedCouponRoutes: mapRoutes(couponRoutes, "api/controllers/Coupon/"),
  port: process.env.PORT || "5021",
};

module.exports = config;

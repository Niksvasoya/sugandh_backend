/**
 * third party libraries
 */
const bodyParser = require("body-parser");
const express = require("express");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
require("dotenv").config({ path: `config.env` });
// const session = require('express-session')
const si = require("systeminformation");

// promises style - new since version 3
si.cpu()
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
//
/**
 * server configuration
 */
//const cron = require('./services/cron.service')
const config = require("../config/");
const dbService = require("./services/db.service");
const mongodbService = require("../api/models/MongoDb/Index");
// const auth = require('./policies/auth.policy');
const { verifyToken, bundleToken } = require("../middleware/VerifyToken");

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;
console.log(environment);
/**
 * express application
 */
const app = express();
app.use(fileUpload());
const index = require("../api/models/MongoDb/Index");
const server = http.Server(app);
const DB = dbService(environment, config.migrate).start();

// allow cross origin requests
// configure to only allow requests from certain origins
const corsOpts = {
  origin: ["https://admin.sugandh.co","https://sugandh.co","http://localhost:3000","http://localhost:8080", "http://43.204.112.218:5022"],

  methods: ["GET", "POST", "PUT", "DELETE"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

//

app.use(cors(corsOpts));

// secure express app
app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

// parsing the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// fill routes for express application
// app.use('/private/api',verifyToken,  mappedAuthRoutes);
// app.use('/private/api', verifyToken, config.mappedAuthRoutes);
// app.use('/private/api', bundleToken, config.mappedAuthRoutes);
// app.use('/private/api', livebhagwanToken, config.mappedAuthRoutes);
// app.use('/private/api', pujaToken, config.mappedAuthRoutes);
// app.use('/public/api/v1', mappedPublicRoutes);
app.use("/public/api/", config.mappedUserRoutes);
app.use("/public/api/", config.mappedProductRoutes);
app.use("/public/api/", config.mappedAccountingRoutes);
app.use("/public/api/", config.mappedMasterRoutes);
app.use("/public/api/", config.mappedSupplierRoutes);
app.use("/public/api/", config.mappedCompanyRoutes);
app.use("/public/api/", config.mappedPropertyRoutes);
app.use("/public/api/", config.mappedBlogRoutes);
app.use("/public/api/", config.mappedLogisticsRoutes);
app.use("/public/api/", config.mappedReSellerRoutes);
app.use("/public/api/", config.mappedOrderRoutes);
app.use("/public/api/", config.mappedInquiryRoutes);
// app.use('/public/api/', verifyToken,config.mappedMasterRoutes);
app.use("/private/api", config.mappedAuthRoutes);
app.use("/public/api", config.mappedMongoRoutes);
app.use("/public/api", config.mappedCmsRoutes);
app.use("/public/api", config.mappedUpdatedOrderRoutes);
app.use("/public/api", config.mappedCouponRoutes);
// app.use('/private/api', verifyToken, config.mappedAuthRoutes);

server.listen(config.port, () => {
  console.log("run", environment);
  if (
    environment !== "production" &&
    environment !== "development" &&
    environment !== "testing"
  ) {
    console.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`
    );
    process.exit(1);
  }
  return DB;
});

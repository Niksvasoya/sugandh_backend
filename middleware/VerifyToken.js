var jwt = require("jsonwebtoken");
const User = require("../api/models/User/User");
const crudService = require("../api/services/crud.service");
module.exports = {
  verifyToken: (req, res, next) => {
    console.log(req.headers.authorization, "1st");
    console.log(req.headers["authorization"], "2nd");
    var Authorization = req.headers["authorization"];
    var Authorization1 = req.headers["authorization1"];
    if (!Authorization) {
      return res.status(200).json({
        message: "Please provide a Authorization",
      });
    }
    // else
    //need to check in database for authorization token in user table
    //token = [{toke1 : 'ejsdhdsds', deviceId:'1', deviceNumber : 'realme'}]
    jwt.verify(Authorization, "livebhagwan.com", async function (err, decoded) {
      if (err) {
        console.log("error");
        return res.status(200).json({
          message: "Failed to authenticate",
        });
      }
      // if everything good, save to request for use in other routes
      // return false
      req.id = decoded.id;
      //database query for checking token in use table
      //let Auth = JSON.parse(Authorization1)
      console.log(Authorization1, "heer");
      let response = await crudService.get(User, {
        where: { is_deleted: false, id: req.id },
      });
      if (response.length <= 0) {
        return res.status(200).json({
          message: "Failed to authenticate",
        });
      } else {
        if (response[0].jwt_token) {
          let arr = response[0].jwt_token;
          let obj = arr.find((o) => o.token === Authorization);
          if (obj == undefined) {
            return res.status(200).json({
              message: "Failed to authenticate",
            });
          }
        }
      }
      next();
    });
  },

  bundleToken: (req, res, next) => {
    console.log(req.headers.authorization, "1st");
    console.log(req.headers["authorization"], "2nd");
    var Authorization = req.headers["authorization"];
    if (!Authorization) {
      return res.status(200).json({
        message: "Please provide a Authorization",
      });
    }

    jwt.verify(Authorization, "livebhagwan.com", function (err, decoded) {
      if (err) {
        console.log("error");
        return res.status(200).json({
          message: "Failed to authenticate",
        });
      }
      // if everything good, save to request for use in other routes
      console.log(decoded, "decoded");
      // return false
      req.id = decoded.id;

      if (jwttokens.length < 4) {
        return {
          multiDevice: false,
          message: "logged in",
        };
      } else {
        return {
          multiDevice: true,
          message: "3 device already logged in",
        };
      }

      next();
    });
  },
};

const { Validator } = require("node-input-validator");
const niv = require("node-input-validator");
const { Op } = require("sequelize");

const validate = (reqBody, schemas) => {
  niv.extend("isUnique", async ({ value, args }) => {
    const model = require(`../models/${args[0]}`);
    let where = {};
    where.is_deleted = false;
    if (reqBody.id) {
      where.id = { [Op.ne]: reqBody.id };
    }
    if (args[1] == "name") {
      where.name = { [Op.iLike]: value };
    }
    if (args[1] == "email_id") {
      where.email_id = { [Op.iLike]: value };
    }
    if (args[1] == "title") {
      where.title = { [Op.iLike]: value };
    }
    if (args[1] == "office_contact") {
      where.office_contact = value;
    }
    if (args[1] == "office_mobile") {
      where.office_contact = value;
    }
    if (args[1] == "primary_contact_number") {
      where.primary_contact_number = value;
    }
    if (args[1] == "alternate_contact_number") {
      where.alternate_contact_number = value;
    }
    if (args[1] == "code") {
      where.code = value;
    }
    let res = await model.findAll({ where: where });
    let data = JSON.parse(JSON.stringify(res));
    if (data.length > 0) {
      return false;
    }
    return true;
  });
  niv.extend("alphaspace", async ({ value }) => {
    if (/^[A-Za-z\s-]*$/.test(value)) {
      return true;
    }
    return false;
  });
  niv.extend("isExists", async ({ value, args }) => {
    const model = require(`../models/${args[0]}`);
    let where = {};
    where.is_deleted = false;
    let res;
    if (isNaN(value)) {
      res = await model.findAll({
        where: { is_deleted: false, id: { [Op.in]: value } },
      });
      if (res.length != value.length) {
        res = [];
      }
    } else {
      res = await model.findAll({ where: { is_deleted: false, id: value } });
    }
    if (res.length > 0) {
      return true;
    }
    return false;
  });
  return new Promise((resolve, reject) => {
    function trimObj(obj) {
      if (
        (!Array.isArray(obj) &&
          typeof obj != "object" &&
          obj != "null" &&
          obj != null &&
          obj != "undefined",
        obj != undefined)
      )
        return obj;
      return Object.keys(obj).reduce(
        function (acc, key) {
          acc[key.trim()] =
            typeof obj[key] == "string" ? obj[key].trim() : trimObj(obj[key]);
          return acc;
        },
        Array.isArray(obj) ? [] : {}
      );
    }
    reqBody = trimObj(reqBody);
    niv.niceNames(schemas.niceNames || {});
    const v = new Validator(reqBody, schemas.validator);
    niv.extendMessages({
      // required: ':attribute is required',
      isExists: "Please enter valid :attribute",
      // regex: ':attribute is invalid.',
      isUnique: `:attribute already exists.`,
      url: `:attribute is not valid formate`,
      alphaspace: ":attribute contains only alphabets and spaces",
    });
    v.check().then((matched) => {
      if (!matched) {
        reject(v.errors);
      } else {
        resolve(reqBody);
      }
    });
  });
};

function convertIntObj(obj) {
  let i = 0;
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      console.log(obj[key]);
      if (obj[key].match(/\{(.)+\}/g)) {
        obj[key] = convertIntObj(JSON.parse(obj[key]));
      } else if (obj[key].match(/\[(.)+\]/g)) {
        obj[key] = JSON.parse(obj[key]);
      } else if (obj[key] == "null") {
        obj[key] = null;
      } else if (obj[key] == "undefined") {
        obj[key] = null;
      } else if (obj[key] == null) {
        obj[key] = null;
      } else if (obj[key] == undefined) {
        obj[key] = null;
      } else if (obj[key].match(/^\d+$/)) {
        obj[key] = parseInt(obj[key]);
      } else if (obj[key] == "true") {
        obj[key] = JSON.parse(obj[key]);
      } else if (obj[key] == "false") {
        obj[key] = JSON.parse(obj[key]);
      } else if (obj[key] == "") {
        obj[key] = null;
      } else {
        obj[key] = obj[key];
      }
    } else if (typeof obj[key] === "object") {
      obj[key] = convertIntObj(obj[key]);
    }
  }
  console.log(">>>>",obj);
  return obj;
}
module.exports = {
  validate,
  convertIntObj,
};

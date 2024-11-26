const insert = (model, dataToInsert) => {
  // console.log(dataToInsert, "check");
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
  // console.log(data);
  dataToInsert = trimObj(dataToInsert);
  return new Promise((resolve, reject) => {
    dataToInsert.is_deleted = false;
    dataToInsert.deleted_at = null;
    model
      .create(dataToInsert)
      .then((res) => {
        resolve(JSON.parse(JSON.stringify(res)));
      })
      .catch((err) => {
        reject(handleErrorResponse(err));
      });
  });
};

const update = async (
  model,
  objectToFind,
  attributesToUpdate,
  checkNonDeletedDataOnly = true
) => {
  function trimObj(obj) {
    // console.log(obj)
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
  // console.log(data);
  attributesToUpdate = trimObj(attributesToUpdate);
  return new Promise((resolve, reject) => {
    if (checkNonDeletedDataOnly) {
      objectToFind.is_deleted = false;
    }
    attributesToUpdate.is_deleted = false;
    attributesToUpdate.deleted_at = null;
    model
      .update(attributesToUpdate, { where: objectToFind })
      .then((res) => {
        resolve(JSON.parse(JSON.stringify(res)));
      })
      .catch((err) => {
        reject(handleErrorResponse(err));
      });
  });
};

const destroy = async (model, objectToFind) => {
  return new Promise((resolve, reject) => {
    model
      .update(
        { is_deleted: true, deleted_at: new Date() },
        { where: objectToFind }
      )
      .then((res) => {
        resolve(JSON.parse(JSON.stringify(res)));
      })
      .catch((err) => {
        reject(handleErrorResponse(err));
      });
  });
};

const destroyHard = async (model, objectToFind) => {
  return new Promise((resolve, reject) => {
    model
      .destroy({ where: objectToFind })
      .then((res) => {
        resolve(JSON.parse(JSON.stringify(res)));
      })
      .catch((err) => {
        reject(handleErrorResponse(err));
      });
  });
};

const get = async (model, options) => {
  return new Promise((resolve, reject) => {
    model
      .findAll(options)
      .then((res) => {
        resolve(JSON.parse(JSON.stringify(res)));
      })
      .catch((err) => {
        reject(handleErrorResponse(err));
      });
  });
};

const getAll = async (model, options) => {
  return new Promise((resolve, reject) => {
    model
      .findAndCountAll(options)
      .then((res) => {
        resolve(JSON.parse(JSON.stringify(res)));
      })
      .catch((err) => {
        reject(handleErrorResponse(err));
      });
  });
};

const getOne = async (model, options) => {
  return new Promise((resolve, reject) => {
    model
      .findOne(options)
      .then((res) => {
        resolve(JSON.parse(JSON.stringify(res)));
      })
      .catch((err) => {
        reject(handleErrorResponse(err));
      });
  });
};

const handleErrorResponse = (errObj) => {
  switch (errObj.name) {
    case "SequelizeUniqueConstraintError":
      return {
        status: 504,
        error: {
          code: 4002,
          sucess: false,
          message: "Validation Failed",
          errors: errObj.errors.map((t) => {
            return {
              message: t.message,
              type: t.type,
              path: t.path,
              value: t.value,
            };
          }),
        },
      };
    case "SequelizeValidationError":
      return {
        status: 500,
        error: {
          code: 4002,
          sucess: false,
          message: "Validation Failed",
          errors: errObj.errors.map((t) => {
            return {
              message: t.message,
              type: t.type,
              path: t.path,
              value: t.value,
            };
          }),
        },
      };
    default:
      return {
        status: 500,
        message: "Internal Server Error",
        error: errObj,
      };
  }
};

module.exports = {
  insert,
  update,
  destroy,
  destroyHard,
  get,
  getOne,
  getAll,
};

const cron = require("node-cron");
const crudService = require("./crud.service");
const UserModel = require("../models/User/User");
const { Op } = require("sequelize");

// Schedule tasks to be run on the server.
cron.schedule("* * * * *", async function () {
  var before = new Date(Date.now() - 12096e5);
  var today = new Date(Date.now());
  try {
    let data = await crudService.update(
      UserModel,
      { is_trial: true, createdAt: { [Op.notBetween]: [before, today] } },
      { is_trial: false }
    );
  } catch (error) {
    console.log(error);
  }
});

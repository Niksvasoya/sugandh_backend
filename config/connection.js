const development = {
  // database: "sugandh",
  // username: "sugandh",
  // password: "Sugandh@2022",
  // host: "194.163.139.89",
  // dialect: "postgres",
  database: "sugandh",
  username: "postgres",
  password: "postgres",
  host: "localhost",
  dialect: "postgres",
};

// const development = {
//   database: "Sugandh_backup",
//   username: "postgres",
//   password: "Bintech",
//   host: "localhost",
//   dialect: "postgres",
// };

const testing = {
  database: "demo",
  username: "postgres",
  password: "inportant",
  host: "localhost",
  dialect: "postgres",
};

const production = {
  database: "dbsugandhco",
  username: "dbsugandhco",
  password: "DBSugandhCo@2025",
  host: "46.250.232.91",
  dialect: "postgres",
};

module.exports = {
  development,
  testing,
  production,
};

const fs = require("fs");

require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "survey_demo",
    host: process.env.DB_HOST,
    dialect: "mysql"
  },
  test: {
    username: "database_test",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql"
    // dialectOptions: {
    //   ssl: {
    //     ca: fs.readFileSync(__dirname + "/mysql-ca-master.crt")
    //   }
    // }
  }
};

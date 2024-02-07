const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "Kotoamatsukami1@", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

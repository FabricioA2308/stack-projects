const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

module.exports = User;

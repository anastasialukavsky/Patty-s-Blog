const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost:5432/pblogs', {
  // logging: console.log,
});

module.exports = db;

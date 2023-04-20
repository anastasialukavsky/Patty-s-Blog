const Sequelize = require('sequelize');
const db = require('../db');

const Tag = db.define(
  'Tag',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
  },
  { paranoid: true }
);

module.exports = Tag;

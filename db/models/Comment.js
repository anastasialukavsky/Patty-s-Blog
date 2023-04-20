const Sequelize = require('sequelize');
const db = require('../db');

const Comment = db.define(
  'Comment',
  {
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
      defaultValue: Sequelize.NOW,
    },
  },
  { paranoid: true }
);

module.exports = Comment;

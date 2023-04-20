const Sequelize = require('sequelize');
const db = require('../db');

const Post = db.define(
  'Post',
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    date: {
      type: Sequelize.DATEONLY,
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

module.exports = Post;

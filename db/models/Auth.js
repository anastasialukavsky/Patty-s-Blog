const Sequelize = require('sequelize');
const db = require('../db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 20;

const Auth = db.define(
  'Auth',
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
  },

  { paranoid: true }
);

Auth.beforeCreate(async (auth) => {
  const hashedPassword = await bcrypt.hash(auth.password, SALT_ROUNDS);
  auth.password = hashedPassword;
});

// Auth.beforeValidate((auth) => {
//   const password = auth.password;

//   if (password.length < MIN_PASSWORD_LENGTH)
//     throw new Error('Minimum password requirements not met :(');
//   if (password.length > MAX_PASSWORD_LENGTH)
//     throw new Error('Maximum password requirements are not met');
// });

Auth.beforeUpdate(async (auth) => {
  const password = auth.password;
  if (auth.changed('password')) {
    if (password.length < MIN_PASSWORD_LENGTH)
      throw new Error('Minimum password requirements not met :(');
    if (password.length > MAX_PASSWORD_LENGTH)
      throw new Error('Maximum password requirements are not met');
    const hashedPassword = await bcrypt.hash(auth.password, SALT_ROUNDS);
    auth.password = hashedPassword;
  }
});

module.exports = Auth;

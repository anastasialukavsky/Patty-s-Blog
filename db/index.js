const User = require('./models/User');
const Auth = require('./models/Auth');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Tag = require('./models/Tag');
const db = require('./db.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const SECRET = process.env.JWT;
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

User.hasOne(Auth);
Auth.belongsTo(User);

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

Comment.belongsTo(Post);
Post.hasMany(Comment);

Post.belongsToMany(Tag, { through: 'post_tags' });
Tag.belongsToMany(Post, { through: 'post_tags' });

User.belongsToMany(User, {
  as: 'Follower',
  through: { model: 'FollowersFollowing', paranoid: true },
  foreignKey: 'FollowingId',
});

User.belongsToMany(User, {
  as: 'Following',
  through: { model: 'FollowersFollowing', paranoid: true },
  foreignKey: 'FollowerId',
});

Auth.authenticate = async ({ email, password }) => {
  try {
    const auth = await Auth.findOne({
      where: { email },
      include: { model: User },
    });
    if (!auth) throw new Error('Email does not match database records');

    const isAuthenticatedPass = await bcrypt.compare(password, auth.password);
    if (!isAuthenticatedPass) throw new Error('Password authentication failed');
    else return jwt.sign({ id: auth.User.id }, SECRET);
  } catch (err) {
    console.log('Authentication error', err);
  }
};

Auth.verifyToken = async (token) => {
  try {
    const { id } = jwt.verify(token, SECRET);
    if (!id) throw new Error(`No user with this id exists`);
    const user = User.findByPk(id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    if (!user) throw new Error('User does not exists');
    else return user;
  } catch (err) {
    console.log('Token verification failed', err);
  }
};

module.exports = { User, Auth, Post, Comment, Tag, db };

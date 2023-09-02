const router = require('express').Router();
const { User, Post, Comment, Auth, Tag } = require('../db/index');
const { requireToken, isAdmin } = require('./authMiddleware');
const bcrypt = require('bcrypt');

router.get('/:userId', requireToken, async (req, res, next) => {
  try {
    const id = +req.params.userId;

    if (!id) return res.status(404).send(`User with id ${id} does not exists`);
    const user = await User.findByPk(id, {
      include: [
        { model: Post, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        {
          model: Comment,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: Auth,
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    if (!user)
      return res.status(404).send(`User with id ${id} does not exists`);
    else res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const checkDupEmail = await Auth.findAll({ where: { email } });
    if (checkDupEmail.length >= 1)
      return res.status(400).send('This email already exists in the database');
    const newUser = await User.create({ firstName, lastName });
    const newAuth = await newUser.createAuth({ email, password });
    const user = await User.findByPk(newUser.id, {
      include: {
        model: Auth,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
    });
    if (!user) return res.status(400).send('Troubles creating new user');
    else return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/:userId', async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const { firstName, lastName, email, password } = req.body;
    const userData = { firstName, lastName, email, password };
    const authToUpdate = await Auth.findOne({ where: userId });
    const userToCompare = await User.findByPk(userId);
    const changeDetected = false;
    const isAuthenticatedPass = await bcrypt.compare(
      password,
      authToUpdate.password
    );

    if (
      isAuthenticatedPass &&
      authToUpdate.email === email &&
      userToCompare.firstName === firstName &&
      userToCompare.lastName === lastName
    )
      return res
        .status(409)
        .send('Cannot update user: no fields has been changed');

    const newAuth = await authToUpdate.update({ email, password });
    const newUser = await User.update(
      { firstName, lastName },
      { where: { id: userId } }
    );

    res.status(200).send('Ayyoo');
  } catch (err) {
    next(err);
  }
});

router.delete('/:userId', requireToken, async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const auth = await Auth.findOne({ where: { UserId: userId } });
    const posts = await Post.findAll({ where: { UserId: userId } });
    for (let post of posts) await post.removeTags();
    const deletePost = await Post.destroy({ where: { UserId: userId } });
    const deleteComment = await Comment.destroy({ where: { UserId: userId } });
    const deleteUser = await User.destroy({
      where: { id: userId },
      cascade: true,
      truncate: true,
    });
    const deleteAuth = await Auth.destroy({ where: { UserId: userId } });
    const tags = await Tag.findAll({
      include: { model: Post, where: { UserId: userId }, paranoid: false },
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

/**
 * FOLLOWERS
 */

router.get('/:userId/followers', requireToken, async (req, res, next) => {
  try {
    const userId = +req.params.userId;

    if (!userId) return res.status(404).send('User does not exist');

    const followers = await User.findOne({
      include: 'Follower',
      where: { id: userId },
    });

    if (!followers) return res.status(404).send('User does not exist');

    if (followers.Follower === undefined || followers.Follower.length === 0)
      return res.status(404).send('User has no followers');

    res.status(200).json(followers);
  } catch (err) {
    next(err);
  }
});

router.get('/:userId/following', requireToken, async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    if (!userId) return res.status(404).send('User does not exist');

    const user = await User.findByPk(userId, { include: 'Following' });
    if (!user || user === undefined)
      return res.status(404).send('User with given id does not exist');

    if (!user.Following || user.Following.length === 0)
      return res.status(404).send('User does not follow anyone');

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/:userId/followers', requireToken, async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    if (!userId) return res.status(404).send('User does not exist');

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).send('User does not exist');

    const { newFollowerId } = req.body;
    if (!newFollowerId)
      return res
        .status(400)
        .send('User does not have any new follower requests');

    const addFollower = await user.addFollower(newFollowerId);
    if (!addFollower)
      return res.status(400).send('Follower has been added already');

    res.status(200).json(addFollower);
  } catch (err) {
    next(err);
  }
});

router.delete('/:userId/followers', requireToken, async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    if (!userId) return res.status(404).send('User does not exist');

    const userFromWhomToDelete = await User.findByPk(userId, {
      include: 'Follower',
    });

    if (!userFromWhomToDelete || userFromWhomToDelete === undefined)
      return res.status(400).send('User with given id does not exist');
    const { followerToDelete } = req.body;

    const deleteFollower = await userFromWhomToDelete.removeFollower(
      followerToDelete
    );

    if (!deleteFollower)
      return res.status(400).send('Follower already  has been deleted');

    const updatedUser = await User.findByPk(userId, { include: 'Follower' });

    res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
});

/**
 * ADMIN
 */

router.get('/', requireToken, isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({ paranoid: false });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

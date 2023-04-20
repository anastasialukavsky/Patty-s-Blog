const router = require('express').Router();
const { Post, Comment, Tag, User, Auth } = require('../db/index');
const { requireToken, isAdmin } = require('./authMiddleware');

router.get('/user/:userId', async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const user = await User.findByPk(userId, { include: { model: Post } });

    if (!user) return res.status(404).send('User does not exists');
    if (!user.posts.length === 0)
      return res
        .status(404)
        .send(`User with id ${userId} does not have any posts`);
    res.status(200).json(user.posts);
  } catch (err) {
    next(err);
  }
});

router.post('/user/:userId', requireToken, async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).send(`User with id ${userId} does not exists`);
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).send('Fields shold not be empty');
    const newPost = await Post.create({ title, content, UserId: userId });
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
});

router.put('/user/:userId/:postId', requireToken, async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const postId = +req.params.postId;
    const postToUpdate = await Post.findByPk(postId);
    const { title, content } = req.body;
    if (userId !== postToUpdate.UserId)
      return res.status(403).send('User id does not match request');

    if (title === undefined || content === undefined)
      return res.status(400).send('Fields should not be empty');
    if (title.length === 0 || content.length === 0)
      return res.status(400).send('Fields should not be empty');
    const newPost = await Post.update(
      { title, content },
      { where: { id: postToUpdate.id } }
    );

    res.status(200).send(newPost);
  } catch (err) {
    next(err);
  }
});

router.delete('/user/:userId/:postId', requireToken, async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const postId = +req.params.postId;
    const postToDelete = await Post.destroy({
      where: { id: postId, UserId: userId },
    });

    if (postToDelete === 0)
      return res.status(404).send('Post has already been deleted');
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

/**
 * COMMENT
 */

router.get('/:postId/comment/', async (req, res, next) => {
  try {
    const postId = +req.params.postId;
    const post = await Post.findByPk(postId);
    if (!post) res.status(404).send('Post does not exist');

    const comment = await Comment.findAll({
      where: { PostId: postId },
      include: { model: Post },
    });

    if (comment.length === 0)
      return res.status(404).send('Comment is not found');
    res.status(200).send(comment);
  } catch (err) {
    next(err);
  }
});

router.post('/:postId/comment', requireToken, async (req, res, next) => {
  try {
    const postId = +req.params.postId;
    const post = await Post.findByPk(postId);
    const user = req.user;

    if (!post) return res.status(404).send('Post does not exist');

    const { content } = req.body;

    if (content === undefined || content.length === 0)
      return res.status(400).send('Should provide comment content');

    const newComment = await Comment.create({
      PostId: postId,
      content,
      UserId: user.id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    next(err);
  }
});

router.put(
  '/:postId/comment/:commentId',
  requireToken,
  async (req, res, next) => {
    try {
      const postId = +req.params.postId;
      const commentId = +req.params.commentId;
      const commentToUpdate = await Comment.findByPk(commentId);
      const { content } = req.body;

      if (commentToUpdate.PostId !== postId)
        return res.status(400).send('Comment id does not match post id');
      if (!content || content === undefined)
        return res.status(404).send('Content does not exist');

      if (!commentToUpdate || commentToUpdate === undefined)
        return res.status(404).send('Comment does not exist');

      const updatedComment = await Comment.update(
        { content },
        { where: { id: commentId }, returning: true }
      );

      res.status(200).json(updatedComment[1][0]);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:postId/comment/:commentId',
  requireToken,
  async (req, res, next) => {
    try {
      const postId = +req.params.postId;
      const commentId = +req.params.commentId;

      const commentToDelete = await Comment.findByPk(commentId);

      if (!commentToDelete || commentToDelete === undefined)
        return res.status(404).send('Comment does not exist');
      if (commentToDelete.PostId !== postId)
        return res.status(400).send('Comment id does not match post id');

      const deletedComment = await commentToDelete.destroy();
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);
module.exports = router;

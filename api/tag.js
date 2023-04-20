const router = require('express').Router();
const { User, Post, Tag } = require('../db/index');

router.get('/', async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    if (!tags || tags.length === 0)
      return res.status(404).send('Tags do not exist');

    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

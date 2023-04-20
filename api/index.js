const router = require('express').Router();
const user = require('./user');
const auth = require('./auth');
const post = require('./post');
const tag = require('./tag');

router.use('/user', user);
router.use('/auth', auth);
router.use('/post', post);
router.use('/tag', tag);

module.exports = router;

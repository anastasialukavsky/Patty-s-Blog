const router = require('express').Router();
const { Auth } = require('../db/index');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('req.body', req.body);
    const token = await Auth.authenticate({ email, password });

    if (token) return res.status(200).json(token);
    else return res.status(401).send('Invalid credentials');
  } catch (err) {
    next(err);
  }
});

module.exports = router;

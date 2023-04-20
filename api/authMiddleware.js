const { Auth } = require('../db/index');

async function requireToken(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(403).send('Forbidden request');
    const user = await Auth.verifyToken(token);
    if (!user) return res.status(403).send('Invalid credentials');
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

async function isAdmin(req, res, next) {
  try {
    // console.log('req.body===========>', req.user);
    const role = req.user.role;

    if (role !== 'admin') return res.status(403).send('Access restricted');
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireToken, isAdmin };

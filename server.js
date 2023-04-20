const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const app = express();
const apiRouter = require('./api/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res, next) => {
  try {
    res.send('Server is indeed running');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

async function init() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();

module.exports = app;

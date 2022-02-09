const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/not-found-error');

router.use('/', usersRouter);
router.use('/', cardsRouter);

router.use((req, res, next) => {
  next(new NotFoundError());
});

module.exports = router;

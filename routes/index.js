const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/', usersRouter);
router.use('/', cardsRouter);

router.use((request, response) => {
  response.status(404).send({ message: `Ресурс по адресу "${request.path}" не найден` });
});

module.exports = router;

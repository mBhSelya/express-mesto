const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/for-bidden-error');

function getCards(req, res, next) {
  return Card
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;

  return Card
    .findById(cardId)
    .orFail(new NotFoundError(`Карточка с id ${cardId} не найдена`))
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        next(new ForbiddenError('Недостаточно прав для удаления этой карточки'));
      }
      return card.prototype.remove();
    })
    .then(() => {
      res.status(200).send({ message: 'Карточка успешна удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные при удалении карточки'));
      } else {
        next(err);
      }
    });
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
  const { cardId } = req.params;

  return Card
    .findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError(`Карточка с id ${cardId} не найдена`))
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные при добавлении лайка карточке'));
      } else {
        next(err);
      }
    });
}

function dislikeCard(req, res, next) {
  const { cardId } = req.params;

  return Card
    .findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError(`Карточка с id ${cardId} не найдена`))
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные при удалении лайка у карточки'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

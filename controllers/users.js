const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

function getUsers(req, res, next) {
  return User
    .find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
}

function getUser(req, res, next) {
  const { userId } = req.params;

  return User
    .findById(userId)
    .orFail(new NotFoundError(`Пользователь с id ${userId} не найден`))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные при получении пользователя'));
      } else {
        next(err);
      }
    });
}

function createUser(req, res, next) {
  const { name, about, avatar } = req.body;

  return User
    .create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  const { _id } = req.user;

  return User
    .findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с id ${_id} не найден`))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные при обновлении данных пользователя'));
      } else {
        next(err);
      }
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const { _id } = req.user;

  return User
    .findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с id ${_id} не найден`))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};

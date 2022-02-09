const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const { JWT_SECRET } = require('../config');

function getUsers(req, res, next) {
  return User
    .find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
}

function getMe(req, res, next) {
  return User
    .find(req.user)
    .then((user) => res.status(200).send({ data: user }))
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
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
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

function login(req, res, next) {
  const { email, password } = req.body;

  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ data: user.toJSON() });
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getMe,
};

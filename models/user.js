const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

// eslint-disable-next-line prefer-regex-literals
const urlPattern = new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (value) => urlPattern.test(value),
      message: 'Поле "link" должно быть валидным url-адресом.',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Некоректное значение поля email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.set('toJSON', {
  transform(doc, ret) {
    const result = { ...ret };
    delete result.password;
    return result;
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильный email или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

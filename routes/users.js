const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');
// eslint-disable-next-line prefer-regex-literals
const urlPattern = new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$');

router.get('/users', getUsers);
router.get('/users/me', getMe);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}), getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }),
  query: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
  query: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = router;

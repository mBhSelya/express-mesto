const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const errorHandler = require('./middleware/error-handler');
const auth = require('./middleware/auth');
const { PORT, DB_ADDRESS } = require('./config');
const {
  createUser,
  login,
} = require('./controllers/users');

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(cookieParser());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Application is running on port ${PORT}`);
});

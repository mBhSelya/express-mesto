const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const errorHandler = require('./middleware/error-handler');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '61e1d3c66acbbb71b8ed0422',
  };
  next();
});

app.use(routes);
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Application is running on port ${PORT}`);
});

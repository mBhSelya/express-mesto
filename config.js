const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://localhost:27017/mestodb',
  JWT_SECRET = 'some-some-secret-key',
} = process.env;

module.exports = {
  PORT,
  DB_ADDRESS,
  JWT_SECRET,
};

const morgan = require('morgan');
const { colorizeStatus } = require('../utils/colorUtils');
const registerMorganTokens = () => {

  morgan.token('colored-status', (req, res) => {
    return colorizeStatus(res.statusCode);
  });
};
const customMorganFormat =
  ':method :url :colored-status :response-time ms - :res[content-length]';

module.exports = { registerMorganTokens, customMorganFormat };

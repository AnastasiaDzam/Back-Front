
const path = require('path');

const getLogFilePath = () => {

  return path.join(__dirname, '..', 'public', 'logs', 'access.log');
};

module.exports = { getLogFilePath };

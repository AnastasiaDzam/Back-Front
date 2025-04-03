const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const removeHTTPHeader = require('../middleware/removeHeader');
const { writeLogsToFile } = require('../utils/fileLogger');
const { registerMorganTokens, customMorganFormat } = require('./morganConfig');
const { addLogToBuffer, startTask } = require('../utils/logBufferUtils');
const requestLimiter = require('../utils/requestLimiter');
const { CLIENT_URL } = process.env;
const corsConfig = {
  origin: [CLIENT_URL],
  credentials: true,
};

const serverConfig = (app) => {

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(corsConfig));
  app.use(removeHTTPHeader);
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use('/api/', requestLimiter);
  registerMorganTokens();
  app.use(
    morgan(customMorganFormat, {
      stream: {
        write: (log) => {
          console.log(log.trim());
          addLogToBuffer(log.trim());
        },
      },
    })
  );
  startTask('*/10 * * * * *', writeLogsToFile);
};
module.exports = serverConfig;

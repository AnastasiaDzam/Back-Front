const rateLimit = require("express-rate-limit");

const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 1000,

  message: "Слишком много запросов с этого IP, попробуйте позже.",
});

module.exports = requestLimiter;

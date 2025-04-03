const router = require('express').Router();
const UserController = require('../controllers/User.controller');
const upload = require('../middleware/upload');
const verifyRefreshToken = require('../middleware/verifyRefreshToken');

router
  .post('/check-email', UserController.checkEmailExistence)
  .get('/users', UserController.getAll)
  .get('/refreshTokens', verifyRefreshToken, UserController.refreshTokens)
  .post('/signUp', upload.single('image'), UserController.signUp)
  .post('/signIn', UserController.signIn)
  .get('/signOut', UserController.signOut);

module.exports = router;
